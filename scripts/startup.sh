# Navigate to your project directory if you're not already there
cd /Users/prabash.balasuriya/IdeaProjects/frigate-demo

# Stop and remove any existing containers
docker-compose down

# Remove any existing volumes to ensure a clean start
docker volume prune -f

# Rebuild and start the containers
docker-compose up --build