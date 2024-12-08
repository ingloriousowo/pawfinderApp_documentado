from pydantic import BaseModel
from typing import Optional

class ReporteMascota(BaseModel):
    id: Optional[str] = None
    tipo_mascota: str
    nombre_mascota: str
    descripcion: str
    urlImagenMascota: Optional[str] = None
    emailContacto: str
    # Campos adicionales que estaban en localStorage
    raza: str
    edad: str
    color: str
    direccion: str
    fechaUltimaVista: str
    recompensa: bool
    montoRecompensa: Optional[float] = None
    ubicacion: dict  # Para lat y lng
    telefonoContacto: str