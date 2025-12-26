/**
 * Code.gs - Main Backend Logic
 */

function doGet(e) {
  try {
    // Get the current deployment URL
    var scriptUrl = ScriptApp.getService().getUrl();
    
    // Check if landing page is requested
    var page = '';
    
    // Get parameter - handle both e.parameter.page and e.parameter['page']
    if (e && e.parameter) {
      page = e.parameter.page || e.parameter['page'] || '';
    }
    
    // Log for debugging
    Logger.log('doGet called with page parameter: ' + page);
    
    var template;
    var title;
    
    // Check if landing page is requested
    if (page === 'landing') {
      Logger.log('Loading landing page');
      template = HtmlService.createTemplateFromFile('landing');
      title = 'AlbertResize - AI-Powered Image Extension';
    } else {
      Logger.log('Loading index page (default)');
      // Default to index (main app)
      template = HtmlService.createTemplateFromFile('index');
      title = 'AlbertResize';
    }
    
    // Pass scriptUrl to template
    template.scriptUrl = scriptUrl;
    
    return template.evaluate()
      .setTitle(title)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    // Return error page
    return HtmlService.createHtmlOutput('<h1>Error loading page</h1><p>' + error.toString() + '</p>')
      .setTitle('Error');
  }
}

/**
 * Main function called from frontend to process an image with Bria Expand
 */
function processImage(imageData, mimeType, targetSizeKey) {
  const targetSize = CONFIG.TARGET_SIZES[targetSizeKey];

  if (!targetSize) {
    throw new Error('Invalid target size selected.');
  }

  // Process with Bria Expand (only model)
  const modelConfig = CONFIG.REPLICATE_MODELS[0];
  
  try {
    const result = resizeWithReplicate(imageData, mimeType, targetSize, modelConfig);
    
    if (result && result.imageData) {
      return {
        success: true,
        modelName: modelConfig.name,
        modelId: modelConfig.model,
        imageData: result.imageData,
        width: targetSize.width,
        height: targetSize.height
      };
    } else {
      throw new Error('No image data returned from model.');
    }
  } catch (error) {
    console.error(`Error processing image: ${error.message}`);
    return {
      success: false,
      modelName: modelConfig.name,
      modelId: modelConfig.model,
      error: error.message
    };
  }
}

/**
 * Processes a single image with a specific Replicate model
 */
function resizeWithReplicate(imageData, mimeType, targetSize, modelConfig) {
  const { apiToken } = getReplicateConfig();
  const headers = {
    'Authorization': `Token ${apiToken}`,
    'Content-Type': 'application/json',
    'User-Agent': 'AlbertResize/1.0'
  };

  // 1. Fetch Latest Model Version
  const versionUrl = `${CONFIG.REPLICATE_API_BASE}/models/${modelConfig.model}`;
  const versionResponse = UrlFetchApp.fetch(versionUrl, { headers: headers, muteHttpExceptions: true });
  
  if (versionResponse.getResponseCode() !== 200) {
      throw new Error(`Failed to fetch model version for ${modelConfig.name}: ${versionResponse.getContentText()}`);
  }
  
  const versionData = JSON.parse(versionResponse.getContentText());
  const versionId = versionData.latest_version.id;

  // 2. Prepare Input
  // Replicate expects data URI for image inputs
  // imageData comes in as base64 string without prefix from frontend usually, or with prefix?
  // Let's assume frontend sends full data URI: "data:image/png;base64,..."
  // If not, we might need to prepend. But let's assume standard `FileReader.readAsDataURL` format.
  
  // Bria Expand prompt - optimized for background extension
  const prompt = `Using the provided image as reference, extend only the background areas to create a ${targetSize.width}x${targetSize.height} pixel image. Preserve all original content exactly as shown. Do not modify, add, or remove any elements from the original image. Only expand the background.`;
  const negativePrompt = "new objects, new items, new subjects, additional content, extra objects, changed content, modified content, altered image, different image";

  let inputParams = {
    image: imageData,
    prompt: prompt,
    negative_prompt: negativePrompt
  };

  // Bria Expand uses aspect_ratio parameter
  inputParams.aspect_ratio = targetSize.aspectRatio;

  // 3. Create Prediction
  const predictionsUrl = `${CONFIG.REPLICATE_API_BASE}/predictions`;
  const predictionPayload = {
    version: versionId,
    input: inputParams
  };

  const predictionResponse = UrlFetchApp.fetch(predictionsUrl, {
    method: 'post',
    headers: headers,
    payload: JSON.stringify(predictionPayload),
    muteHttpExceptions: true
  });

  if (predictionResponse.getResponseCode() !== 201) {
    throw new Error(`Failed to create prediction: ${predictionResponse.getContentText()}`);
  }

  const predictionData = JSON.parse(predictionResponse.getContentText());
  const predictionId = predictionData.id;
  let status = predictionData.status;

  // 4. Poll for Results
  let attempts = 0;
  const maxAttempts = 40; // ~2 minutes (3s * 40)
  
  while (status !== 'succeeded' && status !== 'failed' && status !== 'canceled' && attempts < maxAttempts) {
    Utilities.sleep(3000); // Wait 3 seconds
    
    const statusUrl = `${CONFIG.REPLICATE_API_BASE}/predictions/${predictionId}`;
    const statusResponse = UrlFetchApp.fetch(statusUrl, { headers: headers, muteHttpExceptions: true });
    
    if (statusResponse.getResponseCode() !== 200) {
       // Temporary network glitch?
       console.warn(`Polling failed for ${predictionId}: ${statusResponse.getContentText()}`);
       attempts++;
       continue;
    }
    
    const statusResult = JSON.parse(statusResponse.getContentText());
    status = statusResult.status;
    
    if (status === 'succeeded') {
      // 5. Get Output Image
      // Output is usually an array of URLs or a single string URL
      const output = statusResult.output;
      let outputUrl = null;
      
      if (Array.isArray(output)) {
        outputUrl = output[0];
      } else {
        outputUrl = output;
      }
      
      if (!outputUrl) {
         throw new Error('Prediction succeeded but no output URL found.');
      }
      
      return {
        imageData: downloadImageAsBase64(outputUrl),
        width: targetSize.width,
        height: targetSize.height
      };
    } else if (status === 'failed' || status === 'canceled') {
       throw new Error(`Prediction failed: ${statusResult.error || 'Unknown error'}`);
    }
    
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    throw new Error('Prediction timed out.');
  }
}

/**
 * Helper to download image from URL and convert to Base64
 */
function downloadImageAsBase64(url) {
  try {
    const response = UrlFetchApp.fetch(url);
    const blob = response.getBlob();
    const contentType = blob.getContentType();
    const base64Data = Utilities.base64Encode(blob.getBytes());
    return `data:${contentType};base64,${base64Data}`;
  } catch (e) {
    throw new Error(`Failed to download result image: ${e.message}`);
  }
}
