from flask import Blueprint, request, jsonify, Response
from app.services.egg_detector import EggDetector
import json
import numpy as np
import cv2

api = Blueprint('api', __name__)

@api.route('/detect-eggs', methods=['POST'])
def detect_eggs():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
        
    try:
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        # Read image file
        img_bytes = image_file.read()
        nparr = np.frombuffer(img_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Initialize detector and process image
        detector = EggDetector()
        annotated_image, result = detector.detect_and_annotate(image)
        
        # Prepare multipart response
        boundary = 'boundary'
        
        # Prepare parts
        parts = []
        
        # Add image part
        image_bytes = cv2.imencode('.jpg', annotated_image)[1].tobytes()
        parts.append(
            f'--{boundary}\r\n'
            f'Content-Type: image/jpeg\r\n'
            f'Content-Disposition: form-data; name="image"; filename="annotated.jpg"\r\n\r\n'
            .encode('utf-8')
        )
        parts.append(image_bytes)
        parts.append(b'\r\n')
        
        # Add JSON part
        json_data = {
            'inference_id': result['inference_id'],
            'inference_time': result['time'],
            'image_dimensions': result['image'],
            'predictions': result['predictions']
        }
        json_bytes = json.dumps(json_data).encode('utf-8')
        parts.append(
            f'--{boundary}\r\n'
            f'Content-Type: application/json\r\n'
            f'Content-Disposition: form-data; name="result"\r\n\r\n'
            .encode('utf-8')
        )
        parts.append(json_bytes)
        parts.append(f'\r\n--{boundary}--\r\n'.encode('utf-8'))
        
        # Combine all parts
        response_data = b''.join(parts)
        
        return Response(
            response_data,
            mimetype=f'multipart/form-data; boundary={boundary}'
        )
        
    except Exception as e:
        return jsonify({'error': f'Error processing request: {str(e)}'}), 500