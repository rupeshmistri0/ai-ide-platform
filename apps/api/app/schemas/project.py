from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "in_progress"
    priority: str = "medium"

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: str
    project_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"

class ProjectCreate(ProjectBase):
    pass

class ProjectRead(ProjectBase):
    id: str
    owner_id: str
    created_at: datetime
    tasks: List[TaskRead] = []
    model_config = ConfigDict(from_attributes=True)
