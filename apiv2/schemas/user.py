def userEntity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "nombre": user["nombre"],
        "apellido": user["apellido"],
        "telefono": user["telefono"],
        "correo": user["correo"],
        "genero": str(user["genero"]),
        "rut": user["rut"],
        "dv": str(user["dv"]),
        "password": user["password"],
        "urlFotoPerfil": user.get("urlFotoPerfil")
    }

def usersEntity(users) -> list:
    return [userEntity(user) for user in users]