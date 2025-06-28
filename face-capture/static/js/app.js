document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const startBtn = document.getElementById('startBtn');
    const statusDiv = document.getElementById('status');
    const personNameInput = document.getElementById('personName');
    const savedImagesDiv = document.getElementById('savedImages');
    
    let stream = null;
    
    // Start camera when page loads
    startCamera();
    
    // Handle start button click (in case camera access is blocked)
    startBtn.addEventListener('click', startCamera);
    
    // Handle capture button click
    captureBtn.addEventListener('click', captureImage);
    
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user' 
                },
                audio: false 
            });
            
            video.srcObject = stream;
            startBtn.style.display = 'none';
            captureBtn.style.display = 'inline-block';
            statusDiv.textContent = 'Camera is ready';
            statusDiv.className = 'status text-success';
            
        } catch (err) {
            console.error('Error accessing camera:', err);
            statusDiv.textContent = 'Error accessing camera: ' + err.message;
            statusDiv.className = 'status text-danger';
            startBtn.style.display = 'inline-block';
            captureBtn.style.display = 'none';
        }
    }
    
    function captureImage() {
        if (!stream) {
            statusDiv.textContent = 'Camera is not ready';
            statusDiv.className = 'status text-danger';
            return;
        }
        
        const personName = personNameInput.value.trim();
        if (!personName) {
            statusDiv.textContent = 'Please enter a name';
            statusDiv.className = 'status text-danger';
            personNameInput.focus();
            return;
        }
        
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to base64 image
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        
        // Send to server
        saveImage(imageData, personName);
    }
    
    async function saveImage(imageData, personName) {
        try {
            statusDiv.textContent = 'Saving image...';
            statusDiv.className = 'status text-info';
            
            const response = await fetch('/capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageData,
                    name: personName
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                statusDiv.textContent = 'Image saved successfully!';
                statusDiv.className = 'status text-success';
                addImageToGallery(imageData, result.filename);
            } else {
                throw new Error(result.error || 'Failed to save image');
            }
            
        } catch (error) {
            console.error('Error saving image:', error);
            statusDiv.textContent = 'Error: ' + error.message;
            statusDiv.className = 'status text-danger';
        }
    }
    
    function addImageToGallery(imageData, filename) {
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = filename;
        img.title = filename;
        savedImagesDiv.insertBefore(img, savedImagesDiv.firstChild);
    }
    
    // Clean up camera stream when page is unloaded
    window.addEventListener('beforeunload', () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });
});
