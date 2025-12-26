# Test Results - Output Links

**Test Date:** December 23, 2025  
**Test Image:** WhatsApp Image 2025-12-23 at 17.08.29.jpeg  
**Target Size:** 1792x1024 (16:9 Landscape)  
**Current Prompt:** "Keep the image exactly as it is. Identify the background of the original image and expand only the background to 1792x1024 pixels. Do not add any new objects, items, or subjects. Only extend the background surface."

## ✅ Successful Results (3/5)

### 1. Bria Expand
**Model:** `bria/expand-image`  
**Output URL:** https://replicate.delivery/xezq/oC1ppe7Fk6RJdScktsfen2wjOa0e6J3nS3dl0PcZ3BBkKgYXB/tmpgfncrqkk.png

**Parameters Used:**
- `aspect_ratio`: "16:9"
- `prompt`: [current prompt]
- `negative_prompt`: "new objects, new items, new subjects, additional content, extra objects, changed content"

---

### 2. Google Nano-Banana
**Model:** `google/nano-banana`  
**Output URL:** https://replicate.delivery/xezq/pkS5sxBNNXpfZiAhfdYITJHi9qiJflUYCgs8YoD0YJ3BGQsrA/tmp5utm76f8.jpeg

**Parameters Used:**
- `width`: 1792
- `height`: 1024
- `strength`: 0.1
- `guidance_scale`: 1.0
- `prompt`: [current prompt]
- `negative_prompt`: [current negative prompt]

---

### 3. Google Gemini Flash
**Model:** `google/gemini-2.5-flash-image`  
**Output URL:** https://replicate.delivery/xezq/U74jcMenHiT9Fi8Hg5G6e85Ss8uSCaLpSwh6o79wjfGnGQsrA/tmpduodi7z2.jpeg

**Parameters Used:**
- `width`: 1792
- `height`: 1024
- `prompt`: [current prompt]
- `negative_prompt`: [current negative prompt]

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

## Current Prompt

**Positive Prompt:**
```
Keep the image exactly as it is. Identify the background of the original image and expand only the background to 1792x1024 pixels. Do not add any new objects, items, or subjects. Only extend the background surface.
```

**Negative Prompt:**
```
new objects, new items, new subjects, additional content, extra objects, changed content
```

---

## Next Steps

1. Review the 3 output images using the links above
2. Identify what works well and what needs improvement
3. Refine the prompt based on the results
4. Fix Qwen Image Edit model (needs array format for image)
5. Replace FLUX Kontext Pro with a working alternative

---

## Quick Access Links

- [Bria Expand Result](https://replicate.delivery/xezq/oC1ppe7Fk6RJdScktsfen2wjOa0e6J3nS3dl0PcZ3BBkKgYXB/tmpgfncrqkk.png)
- [Google Nano-Banana Result](https://replicate.delivery/xezq/pkS5sxBNNXpfZiAhfdYITJHi9qiJflUYCgs8YoD0YJ3BGQsrA/tmp5utm76f8.jpeg)
- [Google Gemini Flash Result](https://replicate.delivery/xezq/U74jcMenHiT9Fi8Hg5G6e85Ss8uSCaLpSwh6o79wjfGnGQsrA/tmpduodi7z2.jpeg)

