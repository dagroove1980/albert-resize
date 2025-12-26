import fetch from 'node-fetch';
import { getUserFromRequest } from '../lib/auth.js';
import { hasCredits, deductCredits } from '../lib/credits.js';

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
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // 1. Authenticate user
  const user = await getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required. Please log in to use this service.',
      code: 'AUTH_REQUIRED'
    });
  }

  // 2. Check if user has sufficient credits
  const hasEnoughCredits = await hasCredits(user.userId, 1);
  if (!hasEnoughCredits) {
    return res.status(402).json({ 
      success: false, 
      error: 'Insufficient credits. Please subscribe to continue.',
      code: 'INSUFFICIENT_CREDITS',
      credits: user.credits || 0
    });
  }

  const { imageData, mimeType, targetSizeKey } = req.body;
  const targetSize = CONFIG.TARGET_SIZES[targetSizeKey];

  if (!targetSize) {
    return res.status(400).json({ success: false, error: 'Invalid target size selected.' });
  }

  // 3. Deduct credit before processing (optimistic deduction)
  let remainingCredits;
  try {
    remainingCredits = await deductCredits(user.userId, 1, 'image_processing');
  } catch (error) {
    return res.status(402).json({ 
      success: false, 
      error: 'Failed to deduct credits. Please try again.',
      code: 'CREDIT_DEDUCTION_FAILED'
    });
  }

  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    return res.status(500).json({ success: false, error: 'REPLICATE_API_TOKEN not configured on server.' });
  }

  const modelConfig = CONFIG.REPLICATE_MODELS[0];
  const headers = {
    'Authorization': `Token ${apiToken}`,
    'Content-Type': 'application/json',
    'User-Agent': 'AlbertResize/1.0'
  };

  try {
    // 1. Fetch Latest Model Version (or use model string directly if API supports it, 
    // but Code.gs was fetching version first)
    const versionUrl = `${CONFIG.REPLICATE_API_BASE}/models/${modelConfig.model}`;
    const versionResponse = await fetch(versionUrl, { headers });
    
    if (!versionResponse.ok) {
      const errorText = await versionResponse.text();
      throw new Error(`Failed to fetch model version: ${errorText}`);
    }
    
    const versionData = await versionResponse.json();
    const versionId = versionData.latest_version.id;

    // 2. Prepare Input
    const prompt = `Using the provided image as reference, extend only the background areas to create a ${targetSize.width}x${targetSize.height} pixel image. Preserve all original content exactly as shown. Do not modify, add, or remove any elements from the original image. Only expand the background.`;
    const negativePrompt = "new objects, new items, new subjects, additional content, extra objects, changed content, modified content, altered image, different image";

    const inputParams = {
      image: imageData,
      prompt: prompt,
      negative_prompt: negativePrompt,
      aspect_ratio: targetSize.aspectRatio
    };

    // 3. Create Prediction
    const predictionsUrl = `${CONFIG.REPLICATE_API_BASE}/predictions`;
    const predictionResponse = await fetch(predictionsUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        version: versionId,
        input: inputParams
      })
    });

    if (!predictionResponse.ok) {
      const errorText = await predictionResponse.text();
      throw new Error(`Failed to create prediction: ${errorText}`);
    }

    const predictionData = await predictionResponse.json();
    const predictionId = predictionData.id;
    let status = predictionData.status;

    // 4. Poll for Results
    let attempts = 0;
    const maxAttempts = 40; // ~2 minutes
    let resultData = null;

    while (status !== 'succeeded' && status !== 'failed' && status !== 'canceled' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusUrl = `${CONFIG.REPLICATE_API_BASE}/predictions/${predictionId}`;
      const statusResponse = await fetch(statusUrl, { headers });
      
      if (!statusResponse.ok) {
        attempts++;
        continue;
      }
      
      const statusResult = await statusResponse.json();
      status = statusResult.status;
      
      if (status === 'succeeded') {
        const output = statusResult.output;
        const outputUrl = Array.isArray(output) ? output[0] : output;
        
        if (!outputUrl) {
          throw new Error('Prediction succeeded but no output URL found.');
        }
        
        // 5. Download and convert to base64
        const imgResponse = await fetch(outputUrl);
        const buffer = await imgResponse.arrayBuffer();
        const contentType = imgResponse.headers.get('content-type');
        const base64 = Buffer.from(buffer).toString('base64');
        
        resultData = {
          success: true,
          modelName: modelConfig.name,
          modelId: modelConfig.model,
          imageData: `data:${contentType};base64,${base64}`,
          width: targetSize.width,
          height: targetSize.height,
          creditsRemaining: remainingCredits
        };
        break;
      } else if (status === 'failed' || status === 'canceled') {
        throw new Error(`Prediction failed: ${statusResult.error || 'Unknown error'}`);
      }
      
      attempts++;
    }

    if (!resultData) {
      throw new Error('Prediction timed out.');
    }

    res.status(200).json(resultData);

  } catch (error) {
    console.error(`Error processing image: ${error.message}`);
    
    // If processing failed after credit deduction, we could refund the credit
    // For now, we'll just log it. In production, you might want to implement refund logic.
    console.error(`Credit was deducted but processing failed for user ${user.userId}`);
    
    res.status(500).json({
      success: false,
      error: error.message,
      creditsRemaining: remainingCredits
    });
  }
}
