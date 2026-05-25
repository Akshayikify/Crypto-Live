from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
import requests
from django.conf import settings
from apps.users.models import User
import time
import threading

# ---------------------------------------------------------------------------
# JWKS key cache — avoids fetching Clerk's public keys on every request
# ---------------------------------------------------------------------------
_jwks_cache = {"keys": None, "fetched_at": 0}
_jwks_lock = threading.Lock()
_JWKS_TTL = 3600  # 1 hour


def _get_clerk_jwks() -> list:
    """Fetch and cache Clerk's JWKS public keys."""
    with _jwks_lock:
        now = time.time()
        if _jwks_cache["keys"] is None or (now - _jwks_cache["fetched_at"]) > _JWKS_TTL:
            try:
                resp = requests.get(
                    "https://api.clerk.com/v1/jwks",
                    headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
                    timeout=10,
                )
                resp.raise_for_status()
                _jwks_cache["keys"] = resp.json().get("keys", [])
                _jwks_cache["fetched_at"] = now
                print("DEBUG AUTH: JWKS keys refreshed.")
            except Exception as e:
                print(f"DEBUG AUTH: Failed to fetch JWKS: {e}")
                # Return stale keys if available, otherwise empty list
                if _jwks_cache["keys"] is None:
                    _jwks_cache["keys"] = []
        return _jwks_cache["keys"]


class ClerkAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]

            if settings.DEBUG:
                # ----------------------------------------------------------------
                # Development: skip signature verification for convenience.
                # ----------------------------------------------------------------
                print("DEBUG AUTH: Development mode — skipping signature verification.")
                payload = jwt.decode(token, options={"verify_signature": False})
            else:
                # ----------------------------------------------------------------
                # Production: verify against Clerk's JWKS public keys.
                # ----------------------------------------------------------------
                jwks_keys = _get_clerk_jwks()
                if not jwks_keys:
                    raise AuthenticationFailed('Unable to fetch JWKS keys from Clerk.')

                # Build a PyJWT JWKS client to pick the right key by `kid`
                jwks_client = jwt.PyJWKClient.__new__(jwt.PyJWKClient)
                # Use PyJWT's jwks-client if available, else iterate manually
                try:
                    from jwt import PyJWKClient
                    jwks_client = PyJWKClient("https://api.clerk.com/v1/jwks")
                    signing_key = jwks_client.get_signing_key_from_jwt(token)
                    payload = jwt.decode(
                        token,
                        signing_key.key,
                        algorithms=["RS256"],
                        options={"verify_aud": False},
                    )
                except ImportError:
                    # Fallback: manual key iteration
                    header = jwt.get_unverified_header(token)
                    kid = header.get("kid")
                    matched_key = None
                    for k in jwks_keys:
                        if k.get("kid") == kid:
                            matched_key = jwt.algorithms.RSAAlgorithm.from_jwk(k)
                            break
                    if not matched_key:
                        raise AuthenticationFailed('No matching JWKS key found for token.')
                    payload = jwt.decode(
                        token,
                        matched_key,
                        algorithms=["RS256"],
                        options={"verify_aud": False},
                    )

            print(f"DEBUG AUTH: Payload keys: {list(payload.keys())}")

            # Basic expiration check (belt-and-suspenders)
            if 'exp' in payload and payload['exp'] < time.time():
                raise AuthenticationFailed('Token expired')

            clerk_id = payload.get('sub')
            if not clerk_id:
                raise AuthenticationFailed('Invalid token payload: missing sub')

            # Resolve email
            email = payload.get('email')
            if not email:
                email = f"{clerk_id}@clerk.user"

            # Sync User with MongoDB
            user = User.objects(clerk_id=clerk_id).first()
            if not user:
                user = User(clerk_id=clerk_id, email=email)
                user.save()
                print(f"DEBUG AUTH: Created new user {user.clerk_id}")
            else:
                print(f"DEBUG AUTH: Found existing user {user.clerk_id}")

            return (user, None)

        except AuthenticationFailed:
            raise
        except Exception as e:
            print(f"Auth Error: {e}")
            raise AuthenticationFailed(f'Invalid token: {e}')
