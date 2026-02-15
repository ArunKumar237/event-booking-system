from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    message = "Request failed."
    data = response.data

    if isinstance(data, dict):
        if "detail" in data:
            message = str(data["detail"])
        elif data:
            first_value = next(iter(data.values()))
            if isinstance(first_value, (list, tuple)) and first_value:
                message = str(first_value[0])
            elif first_value:
                message = str(first_value)
    elif isinstance(data, (list, tuple)) and data:
        message = str(data[0])

    response.data = {
        "status": "error",
        "message": message,
    }
    return response
