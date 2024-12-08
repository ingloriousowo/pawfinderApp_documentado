def reporteMascotaEntity(reporte) -> dict:
    return {
        "id": str(reporte["_id"]),
        "tipo_mascota": reporte.get("tipo_mascota", "No especificado"),
        "nombre_mascota": reporte.get("nombre_mascota", "Sin nombre"),
        "descripcion": reporte.get("descripcion", "Sin descripción"),
        "urlImagenMascota": reporte.get("urlImagenMascota"),
        "emailContacto": reporte.get("emailContacto", "No especificado"),
        "raza": reporte.get("raza", "No especificada"),
        "edad": reporte.get("edad", "No especificada"),
        "color": reporte.get("color", "No especificado"),
        "direccion": reporte.get("direccion", "No especificada"),
        "fechaUltimaVista": reporte.get("fechaUltimaVista", "Fecha no especificada"),
        "recompensa": reporte.get("recompensa", False),
        "montoRecompensa": reporte.get("montoRecompensa"),
        "ubicacion": reporte.get("ubicacion", {"lat": 0, "lng": 0}),
        "telefonoContacto": reporte.get("telefonoContacto", "No especificado")
    }

def reportesMascotaEntity(reportes) -> list:
    return [reporteMascotaEntity(reporte) for reporte in reportes]