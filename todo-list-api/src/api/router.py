from fastapi import APIRouter
from src.modules.auth import router as auth_router
from src.modules.task import router as task_router

api_router = APIRouter(prefix="/backend")
api_router.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
api_router.include_router(task_router.router, prefix="/tasks", tags=["Tasks"])