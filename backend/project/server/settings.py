import os
import environ

env = environ.Env()
environ.Env.read_env()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")

# ALLOWED_HOSTS = env("ALLOWED_HOSTS").split(",")
ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "phonenumber_field",
    "channels",
    "modeltranslation",
    "data.apps.DataConfig",
    "accounts.apps.AccountsConfig",
    "meetings.apps.MeetingsConfig",
]


###########################################################
# Only in development
###########################################################
class DisableCSRFMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)
        response = self.get_response(request)
        return response


###########################################################

MIDDLEWARE = [
    #############################################
    # Enable only in development !!!
    "server.settings.DisableCSRFMiddleware",
    #############################################
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.locale.LocaleMiddleware',
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "server.api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS":
        [os.path.join(BASE_DIR, "static"),
         os.path.join(BASE_DIR, "build")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

ASGI_APPLICATION = "server.asgi.application"

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

# TODO: Create seperate databases for different countries
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": env("DATABASE_NAME"),
        "USER": env("DATABASE_USER"),
        "PASSWORD": env("DATABASE_PASSWORD"),
        "HOST": env("DATABASE_HOST", default="localhost"),
        "PORT": env("DATABASE_PORT", default=""),
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_USER_MODEL = "accounts.Account"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
        "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

CHANNEL_LAYERS = {
    "default": {
        # In development
        "BACKEND": "channels.layers.InMemoryChannelLayer",
        # In production
        # "BACKEND": "channels_redis.core.RedisChannelLayer",
        # "CONFIG": {
        #     "hosts": [("127.0.0.1", 6379)],
        # },
    },
}

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGES = (
    ('en', 'English'),
    ('pl', 'Polish'),
)

LANGUAGE_CODE = "en"

PHONENUMBER_DB_FORMAT = "INTERNATIONAL"

TIME_ZONE = "Europe/Warsaw"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = "/static/"
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
    os.path.join(BASE_DIR, "build/static"),
    os.path.join(BASE_DIR, "build"),
]
# STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATIC_ROOT = '192.168.1.31:8000/static/'

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

CORS_ALLOW_CREDENTIALS = True
# change to https://app.example.com in production settings
CORS_ORIGIN_WHITELIST = ['http://127.0.0.1:3000']

# change to app.example.com in production settings
CSRF_TRUSTED_ORIGINS = ['127.0.0.1:3000']

# RECAPTCHA_SECRET_KEY = env("RECAPTCHA_SECRET_KEY")

REST_FRAMEWORK = {
    "TIME_FORMAT": "%H:%M",
    "TIME_INPUT_FORMATS": ["%H:%M"],
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'sql.log',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
