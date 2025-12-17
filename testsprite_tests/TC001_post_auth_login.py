import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_post_auth_login():
    login_endpoint = f"{BASE_URL}/auth/login"
    headers = {
        "Content-Type": "application/json"
    }

    users = [
        {"email": "parent@test.com", "password": "Test@1234", "expected_role": "parent"},
        {"email": "driver@saferide.com", "password": "Test@1234", "expected_role": "driver"}
    ]

    for user in users:
        payload = {
            "email": user["email"],
            "password": user["password"]
        }

        response = requests.post(login_endpoint, json=payload, headers=headers, timeout=TIMEOUT)
        try:
            # Validate HTTP status code
            assert response.status_code == 200, f"Expected 200 OK for {user['email']}, got {response.status_code}"

            data = response.json()

            # Validate that access_token is in snake_case
            assert "access_token" in data, f"'access_token' not found in response for {user['email']}"

            access_token = data["access_token"]
            # Basic validation of token type and length (JWT tokens are typically three dot-separated parts)
            assert isinstance(access_token, str) and len(access_token.split('.')) == 3, \
                f"Invalid JWT token format for {user['email']}"

            # Check user role information - assuming response contains a 'user' object with 'role' field
            assert "user" in data, f"User info missing in response for {user['email']}"
            user_info = data["user"]
            assert "role" in user_info, f"User role missing in response for {user['email']}"
            # Role should correspond to login used
            assert user_info["role"].lower() == user["expected_role"], \
                f"User role '{user_info['role']}' does not match expected '{user['expected_role']}' for {user['email']}"
        except (AssertionError, KeyError) as e:
            raise AssertionError(f"Login test failed for {user['email']}: {e}")

test_post_auth_login()