import base64
import cv2
import numpy as np
from PIL import Image
from io import BytesIO

def load_image(path_or_bytes):
    """Load an image from path or bytes."""
    if isinstance(path_or_bytes, BytesIO):
        image = Image.open(path_or_bytes)
        return np.array(image)
    return np.array(Image.open(path_or_bytes))

def save_image(image, path):
    """Save the image to the specified path."""
    Image.fromarray(image).save(path)

def base64_to_cv2(base64_string):
    """Convert base64 image to cv2 format"""
    # Remove data:image/jpeg;base64, prefix if present
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    # Decode base64
    img_data = base64.b64decode(base64_string)
    
    # Convert to numpy array
    nparr = np.frombuffer(img_data, np.uint8)
    
    # Decode image
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

def cv2_to_base64(cv2_image):
    """Convert cv2 image to base64 string"""
    # Convert to jpg format
    _, buffer = cv2.imencode('.jpg', cv2_image)
    
    # Convert to base64
    return base64.b64encode(buffer).decode('utf-8')