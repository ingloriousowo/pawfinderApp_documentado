from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: Optional[str] = None
    nombre: str
    apellido: str
    telefono: int
    correo: str
    genero: str
    rut: int
    dv: str
    password: str
    urlFotoPerfil: Optional[str] = None
