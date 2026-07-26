from django.apps import AppConfig


class EchoConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "echo"

    def ready(self):
        import echo.signals