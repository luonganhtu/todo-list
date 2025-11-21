import sys
import os
import uvicorn
from fastapi import FastAPI
from src.api.router import api_router
from src.core.cors import setup_cors

# Add project root to pathVPBank Hackathon
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Initialize FastAPI app
app = FastAPI(
    title="Todo List API",
    description="API for Todo List Project",
    version="1.0.0"
)

# Setup CORS
setup_cors(app)

# Include API routes
app.include_router(api_router)

# Local development server
if __name__ == "__main__":
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)