const PHONE_PATTERN = /\+?\d[\d \t().-]{7,18}\d/g;

function readUint16(view, offset) {
  return view.getUint16(offset, true);
}

function readUint32(view, offset) {
  return view.getUint32(offset, true);
}

function normalizePhone(candidate, defaultCountryCode = '91') {
  const trimmed = String(candidate || '').trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  if (!trimmed.startsWith('+') && digits.length === 11 && digits.startsWith('0')) {
    digits = `${defaultCountryCode}${digits.slice(1)}`;
  }

  if (!trimmed.startsWith('+') && digits.length === 10) {
    digits = `${defaultCountryCode}${digits}`;
  }

  if (digits.length < 10 || digits.length > 15) {
    return null;
  }

  return `+${digits}`;
}

export function parseContactsFromText(text) {
  const matches = String(text || '').match(PHONE_PATTERN) || [];
  const seen = new Set();
  const valid = [];
  let invalid = 0;
  let duplicates = 0;

  matches.forEach((match) => {
    const normalized = normalizePhone(match);
    if (!normalized) {
      invalid += 1;
      return;
    }

    if (seen.has(normalized)) {
      duplicates += 1;
      return;
    }

    seen.add(normalized);
    valid.push(normalized);
  });

  const noisyRows = String(text || '')
    .split(/[\n,;]+/)
    .filter((part) => /\d/.test(part) && !normalizePhone(part)).length;

  return {
    valid,
    invalid: invalid + noisyRows,
    duplicates,
    displayText: valid.join('\n'),
  };
}

async function inflateRaw(bytes) {
  if (!('DecompressionStream' in globalThis)) {
    throw new Error('This browser cannot unpack .xlsx files locally.');
  }

  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function readZipEntry(entry, bytes) {
  const view = new DataView(bytes.buffer);
  const localOffset = entry.localOffset;
  const fileNameLength = readUint16(view, localOffset + 26);
  const extraLength = readUint16(view, localOffset + 28);
  const dataOffset = localOffset + 30 + fileNameLength + extraLength;
  const compressed = bytes.slice(dataOffset, dataOffset + entry.compressedSize);

  if (entry.method === 0) return compressed;
  if (entry.method === 8) return inflateRaw(compressed);

  throw new Error(`Unsupported .xlsx compression method: ${entry.method}`);
}

async function extractTextFromXlsx(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  let endOffset = -1;

  for (let index = bytes.length - 22; index >= 0; index -= 1) {
    if (readUint32(view, index) === 0x06054b50) {
      endOffset = index;
      break;
    }
  }

  if (endOffset < 0) {
    throw new Error('Could not read this .xlsx file.');
  }

  const entryCount = readUint16(view, endOffset + 10);
  let centralOffset = readUint32(view, endOffset + 16);
  const textDecoder = new TextDecoder('utf-8');
  const entries = [];

  for (let index = 0; index < entryCount; index += 1) {
    if (readUint32(view, centralOffset) !== 0x02014b50) break;

    const method = readUint16(view, centralOffset + 10);
    const compressedSize = readUint32(view, centralOffset + 20);
    const fileNameLength = readUint16(view, centralOffset + 28);
    const extraLength = readUint16(view, centralOffset + 30);
    const commentLength = readUint16(view, centralOffset + 32);
    const localOffset = readUint32(view, centralOffset + 42);
    const nameBytes = bytes.slice(centralOffset + 46, centralOffset + 46 + fileNameLength);
    const name = textDecoder.decode(nameBytes);

    entries.push({ name, method, compressedSize, localOffset });
    centralOffset += 46 + fileNameLength + extraLength + commentLength;
  }

  const usefulEntries = entries.filter((entry) => (
    entry.name === 'xl/sharedStrings.xml' ||
    /^xl\/worksheets\/sheet\d+\.xml$/.test(entry.name)
  ));

  const chunks = await Promise.all(
    usefulEntries.map(async (entry) => {
      const entryBytes = await readZipEntry(entry, bytes);
      return textDecoder.decode(entryBytes).replace(/<[^>]+>/g, ' ');
    }),
  );

  return chunks.join('\n');
}

export async function extractContactTextFromFile(file) {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.xlsx')) {
    return extractTextFromXlsx(await file.arrayBuffer());
  }

  if (lowerName.endsWith('.xls')) {
    const buffer = await file.arrayBuffer();
    return new TextDecoder('latin1').decode(buffer);
  }

  return file.text();
}
