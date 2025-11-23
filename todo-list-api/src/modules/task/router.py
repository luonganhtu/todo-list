from fastapi import APIRouter, Depends, status, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from src.db.session import get_db
from src.modules.task.schema import (
    TaskCreate, 
    TaskUpdate, 
    TaskResponse,
    TaskBulkUpdate,
    TaskBulkDelete
)
from src.modules.task.service import TaskService
from src.core.security import get_current_user
from src.db.models.user import User
router = APIRouter(prefix="", tags=["Tasks"])

@router.post("/create", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Tạo task mới"""
    # Lấy user_id từ username
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    task = TaskService.create_task(db, task_data, user)
    return task

@router.get("/list", response_model=List[TaskResponse])
def list_tasks(
    completed: Optional[bool] = Query(None, description="Filter by completed status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy danh sách tasks với filter"""
    
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    tasks = TaskService.list_tasks(db, user, completed, priority, skip, limit)
    return tasks

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy task theo ID"""
    
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    task = TaskService.get_task(db, task_id, user)
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cập nhật task (single)"""
    
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    task = TaskService.update_task(db, task_id, task_data, user)
    return task

@router.delete("/{task_id}", response_model=TaskResponse)
def remove_task(
    task_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Xóa task (single)"""
    
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    task = TaskService.remove_task(db, task_id, user)
    return task

@router.delete("/bulk/delete", response_model=List[TaskResponse])
def remove_tasks(
    bulk_delete: TaskBulkDelete,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Xóa nhiều tasks"""
    
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    tasks = TaskService.remove_tasks(db, bulk_delete.task_ids, user)
    return tasks

