from django.apps import AppConfig


class LongPollingAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'long_polling_app_wsgi_loop'
