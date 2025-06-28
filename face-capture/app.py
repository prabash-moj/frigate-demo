from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime
import base64

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'storage'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/capture', methods=['POST'])
def capture():
    try:
        # Get the base64 image data
        image_data = request.json.get('image')
        person_name = request.json.get('name', 'unknown').lower().replace(' ', '_')
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Remove the header from the base64 string
        header, encoded = image_data.split(',', 1)
        image_binary = base64.b64decode(encoded)
        
        # Create directory for person if it doesn't exist
        person_dir = os.path.join(app.config['UPLOAD_FOLDER'], person_name)
        os.makedirs(person_dir, exist_ok=True)
        
        # Save the image with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')[:-3]
        filename = f"{person_name}_{timestamp}.jpg"
        filepath = os.path.join(person_dir, filename)
        
        with open(filepath, 'wb') as f:
            f.write(image_binary)
        
        return jsonify({
            'message': 'Image saved successfully',
            'filename': filename,
            'path': filepath
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
