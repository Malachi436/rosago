import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

PARENT_CREDENTIALS = {
    "email": "parent@test.com",
    "password": "Test@1234"
}

def test_post_auth_logout():
    # Login to get access_token
    login_resp = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": PARENT_CREDENTIALS["email"],
            "password": PARENT_CREDENTIALS["password"]
        },
        timeout=TIMEOUT
    )
    assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
    login_data = login_resp.json()
    access_token = login_data.get("access_token")
    assert access_token, "access_token missing in login response"

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Logout with current token
    logout_resp = requests.post(
        f"{BASE_URL}/auth/logout",
        headers=headers,
        timeout=TIMEOUT
    )
    assert logout_resp.status_code == 200, f"Logout failed with status {logout_resp.status_code}"

    # Try to access a protected endpoint after logout to verify token invalidation
    protected_resp = requests.get(
        f"{BASE_URL}/children/parent/me",  # Using parent endpoint to test authorization
        headers=headers,
        timeout=TIMEOUT
    )
    # Expect unauthorized or forbidden status
    assert protected_resp.status_code in (401, 403), f"Access with logged-out token should be denied, got {protected_resp.status_code}"

test_post_auth_logout()
