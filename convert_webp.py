import os
import subprocess
import sys

def ensure_pillow():
    try:
        import PIL
    except ImportError:
        print("Pillow not found, installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        print("Pillow installed successfully.")

ensure_pillow()

from PIL import Image

def convert_to_webp(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".jpg"):
            filepath = os.path.join(directory, filename)
            webp_filepath = os.path.join(directory, filename.rsplit('.', 1)[0] + '.webp')
            
            try:
                with Image.open(filepath) as img:
                    img.save(webp_filepath, 'webp', quality=85)
                print(f"Converted {filename} to {os.path.basename(webp_filepath)}")
            except Exception as e:
                print(f"Failed to convert {filename}: {e}")

if __name__ == "__main__":
    convert_to_webp(r"c:\Users\SILVANA\Desktop\JAJJSSHHS")
