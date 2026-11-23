from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from app.models.task_enums import TaskPriority, TaskStatus


class TaskCreateSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=150)
    description: Optional[str] = None
    responsible: str = Field(min_length=1, max_length=100)
    due_date: date
    priority: TaskPriority


class TaskUpdateSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=150)
    description: Optional[str] = None
    responsible: str = Field(min_length=1, max_length=100)
    due_date: date
    priority: TaskPriority

class TaskStatusUpdateSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    status: TaskStatus

class TaskResponseSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    responsible: str
    due_date: date
    priority: TaskPriority
    status: TaskStatus
    created_at: datetime
    updated_at: datetime