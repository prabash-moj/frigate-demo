# Frigate NVR with Facial Recognition

This setup provides a complete NVR (Network Video Recorder) solution with facial recognition using Frigate, Double Take, and CompreFace.

## Prerequisites

- Docker and Docker Compose installed
- (Optional) Coral USB Accelerator for better performance
- RTSP/RTMP compatible IP camera(s)

## Directory Structure

```
frigate-demo/
├── config/
│   └── config.yml          # Frigate configuration
│   └── double-take/        # Double Take configuration (auto-created)
├── storage/                # Frigate recordings and snapshots
├── media/
│   └── known_faces/       # Store known face images here
└── compreface-data/        # CompreFace data and models
```

## Setup Instructions

1. **Configure Your Camera**
   - Update `config/config.yml` with your camera's RTSP URL and credentials
   - Test your camera feed with VLC or similar player

2. **Start the Services**
   ```bash
   docker-compose up -d
   ```

3. **Access the Web UIs**
   - Frigate: http://localhost:5001 (changed from 5000)
   - Double Take: http://localhost:3000
   - CompreFace: http://localhost:8000

4. **Configure CompreFace**
   - Open CompreFace UI
   - Create a new application (e.g., "Home Security")
   - Create a new face collection (e.g., "Family")
   - Note the API key for Double Take configuration

5. **Configure Double Take**
   - Open Double Take UI
   - Go to Settings → Faces
   - Add CompreFace as a face recognition service
   - Enter your CompreFace API key and collection name

6. **Add Known Faces**
   - Place face images in `media/known_faces`
   - Use the CompreFace UI to train the model with these images

## Updating Configuration

After making changes to `config.yml`, restart Frigate:
```bash
docker-compose restart frigate
```

## Troubleshooting

Check container logs:
```bash
docker-compose logs -f frigate
docker-compose logs -f double-take
docker-compose logs -f compreface
```

## Performance Tips

1. For better performance, uncomment the Coral TPU section in both `docker-compose.yml` and `config.yml`
2. Adjust detection FPS and resolution based on your hardware
3. Use motion masks to reduce false detections
4. Set up zones to focus on important areas

## Security Note

- Change all default passwords
- Don't expose the web interfaces to the internet without proper authentication
- Keep your system updated
