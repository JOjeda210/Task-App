from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.task_enums import TaskStatus
from app.repositories.task_repository import TaskRepository
from app.schemas.task_schema import (TaskCreateSchema,TaskResponseSchema,TaskStatusUpdateSchema,TaskUpdateSchema)
from app.services.task_service import TaskService

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


def get_task_service(db: Session = Depends(get_db)) -> TaskService:
    return TaskService(TaskRepository(db))


@router.get("/", response_model=list[TaskResponseSchema])
def list_tasks(status: TaskStatus | None = None,service: TaskService = Depends(get_task_service)):
    return service.list_tasks(status)


@router.get("/{task_id}", response_model=TaskResponseSchema)
def get_task(task_id: int, service: TaskService = Depends(get_task_service)):
    return service.get_task(task_id)


@router.post("/", response_model=TaskResponseSchema, status_code=201)
def create_task(data: TaskCreateSchema, service: TaskService = Depends(get_task_service)):
    return service.create_task(data)


@router.put("/{task_id}", response_model=TaskResponseSchema)
def update_task(task_id: int, data: TaskUpdateSchema, service: TaskService = Depends(get_task_service)):
    return service.update_task(task_id, data)


@router.patch("/{task_id}/status", response_model=TaskResponseSchema)
def update_task_status(task_id: int, data: TaskStatusUpdateSchema, service: TaskService = Depends(get_task_service)):
    return service.update_status(task_id, data)


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, service: TaskService = Depends(get_task_service)):
    service.delete_task(task_id)