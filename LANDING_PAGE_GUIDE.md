# Landing Page Guide

## File Created
- `landing.html` - Marketing landing page with screenshot placeholders

## How to Use

### 1. Replace Screenshot Placeholders

The landing page has placeholder areas marked with "📸 Add your screenshot here". Replace these with actual screenshots:

**Screenshots Needed:**

1. **Upload Interface** (Step 1)
   - Screenshot of the main upload button
   - Location: "How It Works" section, Step 1

2. **Size Selection Modal** (Step 2)
   - Screenshot of the size selection popup
   - Location: "How It Works" section, Step 2

3. **Result Modal** (Step 3)
   - Screenshot of the result modal with before/after
   - Location: "How It Works" section, Step 3

4. **Before/After Examples** (2 needed)
   - Portrait extension example
   - Landscape extension example
   - Location: "See It In Action" section

5. **UI Showcase**
   - Full UI screenshot showing the interface
   - Location: "Beautiful, Simple Interface" section

### 2. Update App URL

Replace `YOUR_APP_URL_HERE` in the CTA section with your actual Google Apps Script web app URL.

### 3. Taking Screenshots

**Recommended Tools:**
- **Mac:** Cmd + Shift + 4 (select area)
- **Windows:** Snipping Tool or Win + Shift + S
- **Browser Extensions:** Full Page Screen Capture

**Screenshot Tips:**
- Use high resolution (at least 1920px wide)
- Remove browser UI (use browser dev tools or extensions)
- Show actual examples with real images
- Ensure text is readable
- Use consistent styling

### 4. Optimizing Images

Before adding screenshots:
1. **Compress images** - Use tools like TinyPNG or Squoosh
2. **Format** - Use WebP or optimized JPG
3. **Size** - Keep under 500KB per image
4. **Dimensions** - Match the placeholder dimensions

### 5. Adding Screenshots

Replace the placeholder divs with actual `<img>` tags:

```html
<!-- Replace this: -->
<div class="screenshot-container bg-gray-100 rounded-xl p-4 min-h-[200px] flex items-center justify-center">
    <div class="text-center text-gray-400">
        <p class="text-sm">📸 Add your screenshot here</p>
    </div>
</div>

<!-- With this: -->
<div class="screenshot-container rounded-xl overflow-hidden">
    <img src="path/to/your/screenshot.png" alt="Upload Interface" class="w-full h-auto">
</div>
```

### 6. Hosting Options

**Option 1: GitHub Pages**
- Create a `gh-pages` branch
- Push the landing page
- Free hosting

**Option 2: Netlify**
- Drag and drop the folder
- Instant deployment
- Free SSL

**Option 3: Google Sites**
- Upload as HTML
- Simple hosting

**Option 4: Include in Apps Script**
- Add as a separate HTML file
- Serve from same domain

## Sections Overview

1. **Hero** - Eye-catching title and CTA
2. **Features** - 3 key benefits
3. **How It Works** - 3-step process with screenshots
4. **Before/After** - Visual examples
5. **UI Showcase** - Interface highlights
6. **CTA** - Final call to action
7. **Footer** - Simple footer

## Customization

### Colors
The page uses your app's gradient background. To change:
- Edit the `background` property in the `<style>` section
- Update gradient colors in Tailwind classes

### Text
- All headings and descriptions can be edited directly in HTML
- Keep it concise and benefit-focused

### Layout
- Fully responsive (mobile-friendly)
- Uses Tailwind CSS for easy customization

## SEO Tips

1. **Add Meta Tags:**
```html
<meta name="description" content="AI-powered image extension tool that preserves your original content">
<meta property="og:title" content="AlbertResize - AI Image Extension">
<meta property="og:description" content="Extend images to any aspect ratio with AI">
<meta property="og:image" content="url-to-your-screenshot">
```

2. **Add Analytics:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

3. **Add Favicon:**
```html
<link rel="icon" href="path/to/favicon.ico">
```

## Testing Checklist

- [ ] All screenshots added and visible
- [ ] App URL updated
- [ ] Links work correctly
- [ ] Mobile responsive
- [ ] Images optimized
- [ ] Loading speed acceptable
- [ ] CTA buttons functional

## Next Steps

1. Take screenshots of your app
2. Optimize images
3. Replace placeholders
4. Update app URL
5. Test on mobile/desktop
6. Deploy to hosting
7. Share on Reddit!

Good luck! 🚀

