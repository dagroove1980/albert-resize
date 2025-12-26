#!/usr/bin/env python3
"""
Test script for Replicate models - Test background extension models directly
without needing to deploy to Google Apps Script.
"""

import requests
import base64
import json
import time
import sys
from pathlib import Path

import os
# Your Replicate API key (set via environment variable)
REPLICATE_API_KEY = os.getenv('REPLICATE_API_TOKEN', '')
REPLICATE_API_BASE = "https://api.replicate.com/v1"

# Top 5 models for background extension (keeping original image)
MODELS = [
    {
        "name": "Bria Expand",
        "model": "bria/expand-image",
        "description": "Expands images beyond their borders in high quality"
    },
    {
        "name": "Google Nano-Banana",
        "model": "google/nano-banana",
        "description": "Google's latest image editing model"
    },
    {
        "name": "Google Gemini Flash",
        "model": "google/gemini-2.5-flash-image",
        "description": "Google's latest image generation model"
    },
    {
        "name": "Qwen Image Edit",
        "model": "qwen/qwen-image-edit-plus",
        "description": "Latest Qwen-Image with improved editing"
    },
    {
        "name": "FLUX Kontext Pro",
        "model": "black-forest-lab/flux-kontext-pro",
        "description": "State-of-the-art text-based image editing"
    }
]

TARGET_SIZES = {
    '1024x1024': {'width': 1024, 'height': 1024, 'aspectRatio': '1:1'},
    '1080x1920': {'width': 1080, 'height': 1920, 'aspectRatio': '9:16'},
    '1024x1792': {'width': 1024, 'height': 1792, 'aspectRatio': '9:16'},
    '1792x1024': {'width': 1792, 'height': 1024, 'aspectRatio': '16:9'}
}


def get_latest_version(model_name):
    """Fetch the latest version ID for a model"""
    url = f"{REPLICATE_API_BASE}/models/{model_name}"
    headers = {
        'Authorization': f'Token {REPLICATE_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch model version: {response.text}")
    
    data = response.json()
    return data['latest_version']['id']


def create_prediction(version_id, input_params):
    """Create a prediction with Replicate"""
    url = f"{REPLICATE_API_BASE}/predictions"
    headers = {
        'Authorization': f'Token {REPLICATE_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'version': version_id,
        'input': input_params
    }
    
    max_retries = 3
    for attempt in range(max_retries):
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 201:
            return response.json()
        elif response.status_code == 429:
            # Rate limited - wait and retry
            try:
                error_data = response.json()
                retry_after = error_data.get('retry_after', 10)
                print(f"Rate limited. Waiting {retry_after} seconds...")
                time.sleep(retry_after + 1)
                continue
            except:
                time.sleep(10)
                continue
        else:
            raise Exception(f"Failed to create prediction: {response.text}")
    
    raise Exception(f"Failed to create prediction after {max_retries} attempts: {response.text}")


def poll_prediction(prediction_id):
    """Poll for prediction results"""
    url = f"{REPLICATE_API_BASE}/predictions/{prediction_id}"
    headers = {
        'Authorization': f'Token {REPLICATE_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    max_attempts = 40  # ~2 minutes
    attempts = 0
    
    while attempts < max_attempts:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Warning: Polling failed: {response.text}")
            attempts += 1
            time.sleep(3)
            continue
        
        data = response.json()
        status = data['status']
        
        if status == 'succeeded':
            return data
        elif status in ['failed', 'canceled']:
            raise Exception(f"Prediction {status}: {data.get('error', 'Unknown error')}")
        
        attempts += 1
        time.sleep(3)
    
    raise Exception("Prediction timed out")


def load_image_as_base64(image_path):
    """Load an image file and convert to base64 data URI"""
    with open(image_path, 'rb') as f:
        image_data = f.read()
        base64_data = base64.b64encode(image_data).decode('utf-8')
        
        # Determine MIME type from extension
        ext = Path(image_path).suffix.lower()
        mime_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp'
        }
        mime_type = mime_types.get(ext, 'image/jpeg')
        
        return f"data:{mime_type};base64,{base64_data}"


def test_model(model_config, image_data_uri, target_size_key):
    """Test a single model with an image"""
    print(f"\n{'='*60}")
    print(f"Testing: {model_config['name']} ({model_config['model']})")
    print(f"Target Size: {target_size_key}")
    print(f"{'='*60}")
    
    target_size = TARGET_SIZES[target_size_key]
    
    try:
        # Get latest version
        print("Fetching latest model version...")
        version_id = get_latest_version(model_config['model'])
        print(f"Version ID: {version_id}")
        
        # Prepare input parameters - improved prompts
        if model_config['model'] in ['google/nano-banana', 'google/gemini-2.5-flash-image']:
            # Google models work better with simpler prompts
            prompt = f"Extend the background of this image to {target_size['width']}x{target_size['height']} pixels. Keep all original content exactly as it appears. Only expand the background areas, do not modify or add anything to the existing image."
            negative_prompt = "new objects, new items, new subjects, additional content, extra objects, changed content, modified content, altered image"
        else:
            # For other models, use more detailed prompt
            prompt = f"Using the provided image as reference, extend only the background areas to create a {target_size['width']}x{target_size['height']} pixel image. Preserve all original content exactly as shown. Do not modify, add, or remove any elements from the original image. Only expand the background."
            negative_prompt = "new objects, new items, new subjects, additional content, extra objects, changed content, modified content, altered image, different image"
        
        input_params = {
            'image': image_data_uri,
            'prompt': prompt,
            'negative_prompt': negative_prompt
        }
        
        # Model-specific parameter adjustments
        if model_config['model'] == 'google/nano-banana':
            input_params['width'] = target_size['width']
            input_params['height'] = target_size['height']
            input_params['strength'] = 0.05  # Very low to preserve original
            input_params['guidance_scale'] = 1.0
        elif model_config['model'] == 'bria/expand-image':
            # Bria expand-image uses aspect_ratio - remove width/height
            input_params['aspect_ratio'] = target_size['aspectRatio']
            if 'width' in input_params:
                del input_params['width']
            if 'height' in input_params:
                del input_params['height']
        elif model_config['model'] == 'google/gemini-2.5-flash-image':
            input_params['width'] = target_size['width']
            input_params['height'] = target_size['height']
        elif model_config['model'] == 'qwen/qwen-image-edit-plus':
            input_params['width'] = target_size['width']
            input_params['height'] = target_size['height']
        elif model_config['model'] == 'black-forest-lab/flux-kontext-pro':
            input_params['width'] = target_size['width']
            input_params['height'] = target_size['height']
        else:
            # Default: use width/height for outpainting models
            input_params['width'] = target_size['width']
            input_params['height'] = target_size['height']
        
        print(f"Input parameters: {json.dumps({k: v if k != 'image' else '[image data]' for k, v in input_params.items()}, indent=2)}")
        
        # Create prediction
        print("\nCreating prediction...")
        prediction = create_prediction(version_id, input_params)
        prediction_id = prediction['id']
        print(f"Prediction ID: {prediction_id}")
        print(f"Status: {prediction['status']}")
        
        # Poll for results
        print("\nPolling for results (this may take a while)...")
        result = poll_prediction(prediction_id)
        
        # Get output URL
        output = result['output']
        if isinstance(output, list):
            output_url = output[0]
        else:
            output_url = output
        
        print(f"\n✅ Success! Output URL: {output_url}")
        
        return {
            'success': True,
            'model_name': model_config['name'],
            'model_id': model_config['model'],
            'output_url': output_url,
            'width': target_size['width'],
            'height': target_size['height']
        }
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return {
            'success': False,
            'model_name': model_config['name'],
            'model_id': model_config['model'],
            'error': str(e)
        }


def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python test_models.py <image_path> [target_size]")
        print("\nTarget sizes:")
        for size_key in TARGET_SIZES.keys():
            size = TARGET_SIZES[size_key]
            print(f"  {size_key}: {size['width']}x{size['height']} ({size['aspectRatio']})")
        sys.exit(1)
    
    image_path = sys.argv[1]
    target_size_key = sys.argv[2] if len(sys.argv) > 2 else '1792x1024'
    
    if target_size_key not in TARGET_SIZES:
        print(f"Error: Invalid target size '{target_size_key}'")
        print("Valid sizes:", list(TARGET_SIZES.keys()))
        sys.exit(1)
    
    if not Path(image_path).exists():
        print(f"Error: Image file not found: {image_path}")
        sys.exit(1)
    
    print(f"Loading image: {image_path}")
    image_data_uri = load_image_as_base64(image_path)
    print(f"Image loaded (size: {len(image_data_uri)} bytes)")
    
    print(f"\nTesting {len(MODELS)} models with target size: {target_size_key}")
    print(f"Target dimensions: {TARGET_SIZES[target_size_key]['width']}x{TARGET_SIZES[target_size_key]['height']}")
    
    results = []
    
    for i, model_config in enumerate(MODELS):
        result = test_model(model_config, image_data_uri, target_size_key)
        results.append(result)
        # Add delay between tests to avoid rate limiting (except for last one)
        if i < len(MODELS) - 1:
            print(f"\nWaiting 10 seconds before next test to avoid rate limits...\n")
            time.sleep(10)
    
    # Print summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    
    successful = [r for r in results if r['success']]
    failed = [r for r in results if not r['success']]
    
    print(f"\n✅ Successful: {len(successful)}/{len(results)}")
    for r in successful:
        print(f"  - {r['model_name']}: {r['output_url']}")
    
    if failed:
        print(f"\n❌ Failed: {len(failed)}/{len(results)}")
        for r in failed:
            print(f"  - {r['model_name']}: {r['error']}")
    
    # Save results to JSON
    output_file = f"test_results_{int(time.time())}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to: {output_file}")


if __name__ == "__main__":
    main()

