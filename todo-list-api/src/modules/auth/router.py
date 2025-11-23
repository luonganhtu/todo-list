from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from src.db.session import get_db
from src.modules.auth.schema import UserCreate, UserLogin, UserResponse, TokenResponse
from src.modules.auth.service import AuthService
from src.core.security import get_current_user
router = APIRouter(prefix="", tags=["Auth"])
db = get_db()

@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Đăng nhập và lấy access token.
    """
    token = AuthService.login_user(db, login_data)
    return token

@router.get("/profile")
def get_profile(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    response = AuthService.get_user_profile(db, current_user=current_user)
    return response

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    user = AuthService.register_user(db, user_data)
    return user

# @router.get("/{user_id}")
# def get_user_route(user_id: str, current_user = Depends(get_current_user)):
#     user = AuthService.get_user(user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user
