## Helsinki-project
A tinder clone with genAI
## Description
Live demo: [App](https://helsinki-project-4693902e7d95.herokuapp.com/)

## Technologies 
Front End:
- React
- Tailwind
Back End:
- Express
- MongoDB
- Nodejs
CICD:
- Docker
- Github Action
Test:
- Jest
## Run Locally

- Clone the repository
- Set up `.env` file in `server` directory with the following content:
```bash
# Application Configuration
PORT=8080
NODE_ENV=development # Or 'production' when deploying

# MongoDB Configuration
# Connection string for your primary MongoDB database
MONGO_URI=mongodb+srv://<your_mongodb_username>:<your_mongodb_password>@<your_cluster_address>/<your_database_name>?retryWrites=true&w=majority
# Connection string for your MongoDB test database (if applicable)
TEST_MONGODB_URI=mongodb+srv://<your_mongodb_username>:<your_mongodb_password>@<your_cluster_address>/<your_test_database_name>?retryWrites=true&w=majority

# JSON Web Token (JWT) Configuration
JWT_SECRET=your_very_strong_and_secret_jwt_key # Replace with a strong, unique secret

# Cloudinary Configuration (for image and video management)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Client URL Configuration
# URL where the client/frontend application is running during production/deployment
CLIENT_URL=http://localhost:8080 # Or your deployed frontend URL
# URL where the client/frontend application is running during development
CLIENT_URL_DEV=http://localhost:5173 # Or your local development frontend URL

# OpenAI API Configuration
OPENAI_API_KEY=sk-your_openai_api_key # Replace with your actual OpenAI API key

# Docker Configuration (Optional - set to true if running in Docker)
DOCKER=true

```


