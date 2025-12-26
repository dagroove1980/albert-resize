# Testing Models Locally

This directory contains a Python script to test Replicate models directly without deploying to Google Apps Script.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Usage

Test all 5 models with an image:

```bash
python test_models.py <path_to_image> [target_size]
```

### Examples

```bash
# Test with default size (1792x1024 landscape)
python test_models.py my_image.jpg

# Test with square format
python test_models.py my_image.jpg 1024x1024

# Test with portrait format
python test_models.py my_image.jpg 1024x1792
```

### Available Target Sizes

- `1024x1024` - Square (1:1 aspect ratio)
- `1024x1792` - Portrait (9:16 aspect ratio)
- `1792x1024` - Landscape (16:9 aspect ratio) - **Default**

## Top 5 Models Selected

Based on the Replicate search results, these are the best models for background extension (keeping original image):

1. **Bria Expand** (`bria/expand-image`)
   - Expands images beyond their borders in high quality
   - Uses aspect_ratio parameter

2. **FLUX Fill Pro** (`black-forest-lab/flux-fill-pro`)
   - Professional inpainting and outpainting with seamless results
   - Uses width/height parameters

3. **Google Nano-Banana** (`google/nano-banana`)
   - Google's latest image editing model
   - Uses width/height with strength and guidance_scale

4. **FLUX Fill Dev** (`black-forest-lab/flux-fill-dev`)
   - Open-weight inpainting model for extending images
   - Uses width/height parameters

5. **Outpainter** (`z_xkib/outpainter`)
   - Outpaint in each direction (top, bottom, left, right)
   - Uses width/height parameters

## Output

The script will:
- Test each model sequentially
- Display progress and results in the console
- Save results to a JSON file: `test_results_<timestamp>.json`

Each result includes:
- Success status
- Model name and ID
- Output URL (if successful) or error message (if failed)
- Target dimensions

## Notes

- The API key is hardcoded in the script (for testing purposes)
- Each model test may take 30 seconds to 2 minutes depending on the model
- Results are saved as JSON for easy inspection

