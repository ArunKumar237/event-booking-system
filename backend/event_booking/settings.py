"""Django settings for event_booking project."""

from pathlib import Path
from decouple import AutoConfig, Csv

BASE_DIR = Path(__file__).resolve().parent.parent
config = AutoConfig(search_path=BASE_DIR)
DJANGO_ENV = config("DJANGO_ENV", default="development").lower()
IS_PRODUCTION = DJANGO_ENV == "production"

SECRET_KEY = config(
    "SECRET_KEY",
    default="django-insecure-change-me-in-production",
)

DEBUG = config("DEBUG", default=not IS_PRODUCTION, cast=bool)
if IS_PRODUCTION:
    # Only enable DEBUG in non-production environments.
    DEBUG = False

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default="localhost,127.0.0.1,testserver",
    cast=Csv(),
)

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:4200",
    cast=Csv(),
)

CORS_ALLOW_CREDENTIALS = config("CORS_ALLOW_CREDENTIALS", default=True, cast=bool)

CSRF_TRUSTED_ORIGINS = config(
    "CSRF_TRUSTED_ORIGINS",
    default="http://localhost:4200",
    cast=Csv(),
)

CORS_ALLOW_HEADERS = [
    "content-type",
    "authorization",
    "x-csrftoken",
]

# Set these to True in production so cookies are sent only over HTTPS.
CSRF_COOKIE_SECURE = config("CSRF_COOKIE_SECURE", default=IS_PRODUCTION, cast=bool)
SESSION_COOKIE_SECURE = config("SESSION_COOKIE_SECURE", default=IS_PRODUCTION, cast=bool)

# Keep this False for SPA CSRF token access unless your frontend strategy changes.
CSRF_COOKIE_HTTPONLY = config("CSRF_COOKIE_HTTPONLY", default=False, cast=bool)
SESSION_COOKIE_SAMESITE = "Lax"
SECURE_SSL_REDIRECT = config("SECURE_SSL_REDIRECT", default=IS_PRODUCTION, cast=bool)
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"

# HSTS should only be enabled in production over HTTPS.
SECURE_HSTS_SECONDS = config("SECURE_HSTS_SECONDS", default=31536000 if IS_PRODUCTION else 0, cast=int)
SECURE_HSTS_INCLUDE_SUBDOMAINS = config(
    "SECURE_HSTS_INCLUDE_SUBDOMAINS",
    default=IS_PRODUCTION,
    cast=bool,
)
SECURE_HSTS_PRELOAD = config("SECURE_HSTS_PRELOAD", default=IS_PRODUCTION, cast=bool)

if IS_PRODUCTION:
    # Enable this when behind a reverse proxy that sets X-Forwarded-Proto.
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'drf_yasg',
    'events',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'event_booking.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'event_booking.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": config("API_PAGE_SIZE", default=10, cast=int),
    "EXCEPTION_HANDLER": "event_booking.exceptions.custom_exception_handler",
}

DRF_THROTTLE_ANON_RATE = config("DRF_THROTTLE_ANON_RATE", default="")
DRF_THROTTLE_USER_RATE = config("DRF_THROTTLE_USER_RATE", default="")
if DRF_THROTTLE_ANON_RATE or DRF_THROTTLE_USER_RATE:
    throttle_classes = []
    throttle_rates = {}
    if DRF_THROTTLE_ANON_RATE:
        throttle_classes.append("rest_framework.throttling.AnonRateThrottle")
        throttle_rates["anon"] = DRF_THROTTLE_ANON_RATE
    if DRF_THROTTLE_USER_RATE:
        throttle_classes.append("rest_framework.throttling.UserRateThrottle")
        throttle_rates["user"] = DRF_THROTTLE_USER_RATE
    REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = tuple(throttle_classes)
    REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = throttle_rates


LOG_LEVEL = config("DJANGO_LOG_LEVEL", default="INFO")
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "{asctime} {levelname} {name}: {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": LOG_LEVEL,
            "propagate": True,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": False,
        },
        "django.server": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}
