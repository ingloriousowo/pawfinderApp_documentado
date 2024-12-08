def adoptRegisterEntity(adopt) -> dict:
    return {
        "id": str(adopt["_id"]),
        "petName": adopt["petName"],
        "petType": adopt["petType"],
        "breed": adopt["breed"],
        "age": adopt["age"],
        "gender": adopt["gender"],
        "description": adopt["description"],
        "healthStatus": adopt["healthStatus"],
        "contactName": adopt["contactName"],
        "contactPhone": adopt["contactPhone"],
        "contactEmail": adopt["contactEmail"],
        "imageUrl": adopt.get("imageUrl")
    }

def adoptRegistersEntity(adopts) -> list:
    return [adoptRegisterEntity(adopt) for adopt in adopts]