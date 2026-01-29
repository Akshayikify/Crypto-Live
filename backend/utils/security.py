from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
import requests
from django.conf import settings
from apps.users.models import User
import time

class ClerkAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        
        try:
            token = auth_header.split(' ')[1]
            
            # Simple decoding for development to get claims
            # For now, we trust the token if we can decode it and it has a valid 'sub'
            print(f"DEBUG AUTH: Decoding token...")
            payload = jwt.decode(token, options={"verify_signature": False})
            print(f"DEBUG AUTH: Payload keys: {payload.keys()}")
            
            # Basic expiration check
            if 'exp' in payload and payload['exp'] < time.time():
                raise AuthenticationFailed('Token expired')
                
            clerk_id = payload.get('sub')
            
            if not clerk_id:
                raise AuthenticationFailed('Invalid token payload')
                
            # Get email from payload or API
            # Clerk JWTs usually have 'email' or 'email_addresses' in private claims
            # For this MVP, we try to get it from custom claims or set a placeholder
            email = payload.get('email')
            if not email:
                 # Try finding primary email in clerk claims structure if complex
                 # Or just fallback to a placeholder based on ID for sync
                 email = f"{clerk_id}@clerk.user"

            # Sync User with MongoDB
            user = User.objects(clerk_id=clerk_id).first()
            
            if not user:
                user = User(
                    clerk_id=clerk_id,
                    email=email
                )
                user.save()
                print(f"DEBUG AUTH: Created new user {user.clerk_id}")
            else:
                 print(f"DEBUG AUTH: Found existing user {user.clerk_id}")
            
            return (user, None)
            
        except Exception as e:
            print(f"Auth Error: {e}") # Print to server console for debug
            raise AuthenticationFailed(f'Invalid token: {e}')
            # return None 
