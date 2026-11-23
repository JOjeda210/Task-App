from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task_model import TaskModel, TaskStatus

class TaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, status: TaskStatus | None = None) -> list[TaskModel]:
        query = select(TaskModel).order_by(TaskModel.created_at.desc())

        if status is not None:
            query = query.where(TaskModel.status == status)

        return list(self.db.scalars(query).all())

    def get_by_id(self, task_id: int) -> TaskModel | None:
        return self.db.get(TaskModel, task_id)

    def create(self, task: TaskModel) -> TaskModel:
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update(self, task: TaskModel) -> TaskModel:
        self.db.commit()
        self.db.refresh(task)
        return task
    

    def delete(self, task: TaskModel) -> None:
        self.db.delete(task)
        self.db.commit()