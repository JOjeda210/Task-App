from app.models.task_enums import TaskStatus
from app.models.task_model import TaskModel
from app.repositories.task_repository import TaskRepository
from app.schemas.task_schema import (TaskCreateSchema, TaskStatusUpdateSchema,TaskUpdateSchema)


class TaskNotFoundError(Exception):
    def __init__(self, task_id: int):
        self.task_id = task_id
        super().__init__(f"Task {task_id} not found")


class TaskService:
    def __init__(self, repository: TaskRepository):
        self.repository = repository

    def list_tasks(self, status: TaskStatus | None = None) -> list[TaskModel]:
        return self.repository.get_all(status)

    def get_task(self, task_id: int) -> TaskModel:
        task = self.repository.get_by_id(task_id)

        if task is None:
            raise TaskNotFoundError(task_id)

        return task

    def create_task(self, data: TaskCreateSchema) -> TaskModel:
        task = TaskModel(**data.model_dump(), status=TaskStatus.PENDING)
        return self.repository.create(task)

    def update_task(self, task_id: int, data: TaskUpdateSchema) -> TaskModel:
        task = self.get_task(task_id)

        for field, value in data.model_dump().items():
            setattr(task, field, value)

        return self.repository.update(task)

    def update_status(self, task_id: int, data: TaskStatusUpdateSchema) -> TaskModel:
        task = self.get_task(task_id)
        task.status = data.status
        return self.repository.update(task)

    def delete_task(self, task_id: int) -> None:
        task = self.get_task(task_id)
        self.repository.delete(task)