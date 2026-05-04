export const WHATSAPP_PROVIDERS = {
  meta: {
    id: 'meta',
    name: 'Meta Cloud API',
    badge: 'Direct',
    docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api/',
    fields: [
      { key: 'accessToken', label: 'Access token', type: 'password', placeholder: 'EAAJ...' },
      { key: 'phoneNumberId', label: 'Phone number ID', placeholder: '123456789012345' },
      { key: 'templateName', label: 'Approved template name', placeholder: 'summer_offer_v1' },
    ],
    summary: 'Best for testing and technical businesses that already use Meta Business Manager.',
  },
  wati: {
    id: 'wati',
    name: 'WATI',
    badge: 'BSP',
    docsUrl: 'https://docs.wati.io/docs',
    fields: [
      { key: 'apiEndpoint', label: 'API endpoint URL', placeholder: 'https://live-server.wati.io/...' },
      { key: 'bearerToken', label: 'Bearer token', type: 'password', placeholder: 'eyJhbGci...' },
      { key: 'templateName', label: 'Approved template name', placeholder: 'salon_offer' },
      { key: 'channelNumber', label: 'Channel number', placeholder: '919876543210' },
    ],
    summary: 'Good for SMBs that want a dashboard plus API token access.',
  },
  aisensy: {
    id: 'aisensy',
    name: 'AiSensy',
    badge: 'India BSP',
    docsUrl: 'https://faq.aisensy.com/api-reference-docs/',
    fields: [
      { key: 'apiKey', label: 'API key', type: 'password', placeholder: 'Copied from AiSensy Manage page' },
      { key: 'campaignName', label: 'Live API campaign name', placeholder: 'summer_offer_campaign' },
      { key: 'source', label: 'Lead source', placeholder: 'BroadcastWA Pro' },
    ],
    summary: 'Good for India-first businesses that already run AiSensy API campaigns.',
  },
  interakt: {
    id: 'interakt',
    name: 'Interakt / Other BSP',
    badge: 'Custom',
    docsUrl: 'https://www.interakt.shop/',
    fields: [
      { key: 'apiEndpoint', label: 'Provider endpoint URL', placeholder: 'https://api.provider.com/...' },
      { key: 'apiToken', label: 'API token', type: 'password', placeholder: 'Provider token' },
      { key: 'templateName', label: 'Approved template name', placeholder: 'offer_template' },
    ],
    summary: 'Use this adapter for Interakt or any BSP with a server-to-server messaging API.',
  },
};

export function getProviderRequirements(providerId) {
  return WHATSAPP_PROVIDERS[providerId]?.fields || WHATSAPP_PROVIDERS.meta.fields;
}

export function isProviderConfigured(providerId, config) {
  return getProviderRequirements(providerId).every((field) => String(config[field.key] || '').trim());
}

export function buildProviderPayload(providerId, config, campaign) {
  const shared = {
    to: campaign.to,
    templateName: config.templateName || config.campaignName,
    mediaUrl: campaign.mediaUrl,
    variables: campaign.variables,
  };

  if (providerId === 'meta') {
    return {
      method: 'POST',
      url: `https://graph.facebook.com/v23.0/${config.phoneNumberId}/messages`,
      headers: { Authorization: 'Bearer <access-token>' },
      body: {
        messaging_product: 'whatsapp',
        to: campaign.to,
        type: 'template',
        template: {
          name: config.templateName,
          language: { code: campaign.languageCode },
          components: campaign.components,
        },
      },
    };
  }

  if (providerId === 'wati') {
    return {
      method: 'POST',
      url: `${config.apiEndpoint}/api/v1/sendTemplateMessage?whatsappNumber=${campaign.to}`,
      headers: { Authorization: 'Bearer <token>' },
      body: {
        template_name: config.templateName,
        broadcast_name: campaign.broadcastName,
        channel_number: config.channelNumber,
        parameters: campaign.parameters,
      },
    };
  }

  if (providerId === 'aisensy') {
    return {
      method: 'POST',
      url: 'https://backend.aisensy.com/campaign/t1/api/v2',
      body: {
        apiKey: '<api-key>',
        campaignName: config.campaignName,
        destination: campaign.to,
        userName: campaign.userName,
        source: config.source || 'BroadcastWA Pro',
        media: campaign.mediaUrl ? { url: campaign.mediaUrl, filename: campaign.mediaName } : undefined,
        templateParams: campaign.templateParams,
      },
    };
  }

  return {
    method: 'POST',
    url: config.apiEndpoint,
    headers: { Authorization: 'Bearer <token>' },
    body: shared,
  };
}
