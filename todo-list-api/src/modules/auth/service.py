from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.modules.auth.schema import UserCreate, UserLogin
from src.db.models.user import User
from src.core.security import get_password_hash, verify_password, create_access_token

class AuthService:
    @staticmethod
    def register_user(db: Session, user_data: UserCreate) -> User:
        # Kiểm tra email đã tồn tại
        existing = db.query(User).filter(User.email == user_data.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        hashed_pw = get_password_hash(user_data.password)
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            password=hashed_pw
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def login_user(db: Session, login_data: UserLogin):
        user = db.query(User).filter(User.username == login_data.username).first()
        if not user or not verify_password(login_data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return user

    @staticmethod
    def get_user_profile(db: Session, current_user: str):
        user = db.query(User).filter(User.username == current_user).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
