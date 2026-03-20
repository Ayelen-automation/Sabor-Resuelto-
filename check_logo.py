from PIL import Image
import sys

try:
    img = Image.open('logo-nuevo.png')
    print(f"Format: {img.format}")
    print(f"Mode: {img.mode}")
    print(f"Size: {img.size}")
    
    # Check corners for transparency
    corners = [
        (0, 0),
        (img.width - 1, 0),
        (0, img.height - 1),
        (img.width - 1, img.height - 1)
    ]
    
    print("Corner pixels:")
    for x, y in corners:
        pixel = img.getpixel((x, y))
        print(f"Pixel at ({x}, {y}): {pixel}")
        
    # Check if there are any transparent pixels
    if img.mode == 'RGBA':
        alpha = img.split()[3]
        print(f"Min alpha: {alpha.getextrema()[0]}")
        print(f"Max alpha: {alpha.getextrema()[1]}")
    else:
        print("Image is not RGBA")

except Exception as e:
    print(f"Error: {e}")
