/**
 * Config.gs - Configuration and API setup
 */

function getReplicateConfig() {
  const props = PropertiesService.getScriptProperties();
  const apiToken = props.getProperty('REPLICATE_API_TOKEN');
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN not set in Script Properties. Please deploy and set it.');
  }
  return { apiToken: apiToken };
}

const CONFIG = {
  REPLICATE_API_BASE: 'https://api.replicate.com/v1',
  REPLICATE_MODELS: [
    { name: 'Bria Expand', model: 'bria/expand-image' }
  ],
  TARGET_SIZES: {
    '1024x1024': { width: 1024, height: 1024, aspectRatio: '1:1' },
    '1080x1920': { width: 1080, height: 1920, aspectRatio: '9:16' },
    '1024x1792': { width: 1024, height: 1792, aspectRatio: '9:16' },
    '1792x1024': { width: 1792, height: 1024, aspectRatio: '16:9' }
  },
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20 MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};
