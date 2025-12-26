# New Test Results - 1080x1920 Vertical Output

**Test Date:** December 23, 2025  
**Test Image:** WhatsApp Image 2025-12-23 at 17.08.29.jpeg  
**Target Size:** 1080x1920 (9:16 Vertical Portrait) ✅ CORRECT SIZE  
**Prompt:** Improved prompts for better image preservation

## ✅ Successful Results (3/5)

### 1. Bria Expand
**Model:** `bria/expand-image`  
**Output URL:** https://replicate.delivery/xezq/Ipl5viTCfSSwVCuFBI6tdoYE8lf6iPj1E7KfMt7DUSqbVQsrA/tmpncv59o3t.png

**Parameters:**
- `aspect_ratio`: "9:16"
- `prompt`: "Using the provided image as reference, extend only the background areas to create a 1080x1920 pixel image. Preserve all original content exactly as shown. Do not modify, add, or remove any elements from the original image. Only expand the background."

---

### 2. Google Nano-Banana
**Model:** `google/nano-banana`  
**Output URL:** https://replicate.delivery/xezq/LKrIWvxAriKhJ9TWQhr8yasQ6AnbuvT2aD783cFUViKwCidF/tmpzw1bbky8.jpeg

**Parameters:**
- `width`: 1080
- `height`: 1920
- `strength`: 0.05 (reduced from 0.1 to preserve original better)
- `prompt`: "Extend the background of this image to 1080x1920 pixels. Keep all original content exactly as it appears. Only expand the background areas, do not modify or add anything to the existing image."

---

### 3. Google Gemini Flash
**Model:** `google/gemini-2.5-flash-image`  
**Output URL:** https://replicate.delivery/xezq/JXiAALVkSn60IZAgvLLAYQOTZLP9s7y1H9zdOYHGu8A1CidF/tmpqpzi91tn.jpeg

**Parameters:**
- `width`: 1080
- `height`: 1920
- `prompt`: "Extend the background of this image to 1080x1920 pixels. Keep all original content exactly as it appears. Only expand the background areas, do not modify or add anything to the existing image."

---

## ❌ Failed Models (2/5)

### 4. Qwen Image Edit
**Model:** `qwen/qwen-image-edit-plus`  
**Error:** Invalid type. Expected: array, given: string  
**Issue:** This model expects `image` as an array, not a string. Needs code fix.

### 5. FLUX Kontext Pro
**Model:** `black-forest-lab/flux-kontext-pro`  
**Error:** Model not found  
**Issue:** Model doesn't exist on Replicate. Needs replacement.

---

## Changes Made

1. ✅ **Fixed Target Size:** Changed from 1792x1024 to 1080x1920 (vertical portrait)
2. ✅ **Improved Prompts:** 
   - Google models: Simpler, more direct prompts
   - Other models: More detailed preservation instructions
3. ✅ **Reduced Strength:** Nano-Banana strength reduced from 0.1 to 0.05 for better preservation
4. ✅ **Fixed Bria Parameters:** Removed width/height, using only aspect_ratio

---

## Quick Access Links

- [Bria Expand Result](https://replicate.delivery/xezq/Ipl5viTCfSSwVCuFBI6tdoYE8lf6iPj1E7KfMt7DUSqbVQsrA/tmpncv59o3t.png)
- [Google Nano-Banana Result](https://replicate.delivery/xezq/LKrIWvxAriKhJ9TWQhr8yasQ6AnbuvT2aD783cFUViKwCidF/tmpzw1bbky8.jpeg)
- [Google Gemini Flash Result](https://replicate.delivery/xezq/JXiAALVkSn60IZAgvLLAYQOTZLP9s7y1H9zdOYHGu8A1CidF/tmpqpzi91tn.jpeg)

---

## Next Steps

1. Review the 3 output images - check if they preserve your original image correctly
2. If results are still not good, we can:
   - Further refine the prompts
   - Try different model parameters
   - Replace the 2 failed models with alternatives
3. Fix Qwen Image Edit (needs array format)
4. Replace FLUX Kontext Pro with a working alternative

