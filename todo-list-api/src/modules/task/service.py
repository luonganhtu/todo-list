from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from src.modules.task.schema import TaskCreate, TaskUpdate
from src.db.models.task import Task
from src.db.models.user import User

class TaskService:
    @staticmethod
    def create_task(db: Session, task_data: TaskCreate, user: User) -> Task:    
        new_task = Task(
            title=task_data.title,
            description=task_data.description,
            due_date=task_data.due_date,
            priority=task_data.priority,
            completed=task_data.completed,
            user_id=user.id
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task

    @staticmethod
    def list_tasks(
        db: Session, 
        user: User,
        completed: Optional[bool] = None,
        priority: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Task]:
        query = db.query(Task).filter(Task.user_id == user.id)
        
        if completed is not None:
            query = query.filter(Task.completed == completed)
        
        if priority:
            query = query.filter(Task.priority == priority)
        
        tasks = query.order_by(Task.id.desc()).offset(skip).limit(limit).all()
        return tasks

    @staticmethod
    def get_task(db: Session, task_id: int, user: User) -> Task:
        task = db.query(Task).filter(
            Task.id == task_id,
            Task.user_id == user.id
        ).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return task

    @staticmethod
    def update_task(
        db: Session, 
        task_id: int, 
        task_data: TaskUpdate, 
        user: User
    ) -> Task:
        task = db.query(Task).filter(
            Task.id == task_id,
            Task.user_id == user.id
        ).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        # Cập nhật các field có giá trị
        update_data = task_data.model_dump(exclude_unset=True)
        
        # Kiểm tra title unique nếu có thay đổi
        if "title" in update_data and update_data["title"] != task.title:
            existing = db.query(Task).filter(
                Task.title == update_data["title"],
                Task.id != task_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Task title already exists"
                )
        
        for field, value in update_data.items():
            setattr(task, field, value)
        
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def remove_task(db: Session, task_id: int, user: User) -> Task:
        task = db.query(Task).filter(
            Task.id == task_id,
            Task.user_id == user.id
        ).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        db.delete(task)
        db.commit()
        return task

    @staticmethod
    def remove_tasks(
        db: Session, 
        task_ids: List[int], 
        user: User
    ) -> List[Task]:
        tasks = db.query(Task).filter(
            Task.id.in_(task_ids),
            Task.user_id == user.id
        ).all()
        
        if len(tasks) != len(task_ids):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Some tasks not found or not owned by user"
            )
        
        for task in tasks:
            db.delete(task)
        
        db.commit()
        return tasks

