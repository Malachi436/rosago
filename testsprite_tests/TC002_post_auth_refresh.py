import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

PARENT_CREDENTIALS = {
    "email": "parent@test.com",
    "password": "Test@1234"
}

def test_post_auth_refresh():
    login_url = f"{BASE_URL}/auth/login"
    refresh_url = f"{BASE_URL}/auth/refresh"

    # Step 1: Login to get refresh token
    try:
        login_resp = requests.post(login_url, json=PARENT_CREDENTIALS, timeout=TIMEOUT)
        login_resp.raise_for_status()
        login_data = login_resp.json()
        refresh_token = login_data.get("refresh_token")
        assert refresh_token and isinstance(refresh_token, str), "No refresh_token in login response"
    except (requests.RequestException, AssertionError) as e:
        raise AssertionError(f"Login failed or invalid response: {e}")

    # Step 2: Use refresh token to get new access token
    try:
        refresh_resp = requests.post(refresh_url, json={"refresh_token": refresh_token}, timeout=TIMEOUT)
        refresh_resp.raise_for_status()
        refresh_data = refresh_resp.json()

        # Validate response content
        new_access_token = refresh_data.get("access_token")
        new_refresh_token = refresh_data.get("refresh_token")

        assert new_access_token and isinstance(new_access_token, str), "No access_token in refresh response"
        # Refresh token may or may not be rotated; if returned, validate format
        if new_refresh_token is not None:
            assert isinstance(new_refresh_token, str), "refresh_token returned is not string"

        # Simple JWT token format check (basic)
        # JWT tokens typically have 3 parts separated by dots
        assert new_access_token.count('.') == 2, "access_token format invalid"

    except (requests.RequestException, AssertionError) as e:
        raise AssertionError(f"Token refresh failed or invalid response: {e}")

test_post_auth_refresh()