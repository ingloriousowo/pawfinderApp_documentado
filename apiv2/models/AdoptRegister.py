from pydantic import BaseModel, EmailStr
from typing import Optional

class AdoptRegister(BaseModel):
    id: Optional[str] = None
    petName: str
    petType: str
    breed: str
    age: str
    gender: str
    description: str
    healthStatus: str
    contactName: str
    contactPhone: str
    contactEmail: EmailStr
    imageUrl: Optional[str] = None