from django.conf import settings
# import redis

# r = redis.Redis.from_url(settings.CELERY_BROKER_URL)

def get_cache(key):
    # return r.get(key)
    pass

def set_cache(key, value, timeout=300):
    # r.setex(key, timeout, value)
    pass
