#!/usr/bin/env python3
"""Create a simple test image for testing"""

from PIL import Image, ImageDraw
import os

# Create a 800x600 test image with a centered subject and background
width, height = 800, 600
img = Image.new('RGB', (width, height), color='lightblue')

draw = ImageDraw.Draw(img)

# Draw a background gradient
for y in range(height):
    color_value = int(200 - (y / height) * 50)
    draw.line([(0, y), (width, y)], fill=(color_value, color_value, 255))

# Draw a centered rectangle (the "subject")
subject_width, subject_height = 200, 300
x1 = (width - subject_width) // 2
y1 = (height - subject_height) // 2
x2 = x1 + subject_width
y2 = y1 + subject_height

draw.rectangle([x1, y1, x2, y2], fill='coral', outline='darkred', width=3)

# Add some text-like pattern
for i in range(5):
    draw.ellipse([x1 + 20 + i*40, y1 + 50, x1 + 40 + i*40, y1 + 70], fill='white')

# Save the image
output_path = 'test_image.jpg'
img.save(output_path, 'JPEG', quality=95)
print(f"Created test image: {output_path} ({width}x{height})")
print("This image has a centered subject (coral rectangle) on a light blue background.")

