import requests

BASE_URL = "http://localhost:3000"
FORGOT_PASSWORD_ENDPOINT = "/auth/forgot-password"
TIMEOUT = 30

def test_post_auth_forgot_password():
    url = BASE_URL + FORGOT_PASSWORD_ENDPOINT
    headers = {"Content-Type": "application/json"}
    payload = {
        "email": "parent@test.com"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        # Expecting 200 OK for successful submission of forgot password request
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        json_response = response.json()
        # The API response for forgot password may be a message or confirmation
        assert "message" in json_response or "success" in json_response, "Response missing confirmation message"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_post_auth_forgot_password()