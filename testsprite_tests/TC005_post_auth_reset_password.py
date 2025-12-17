import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

PARENT_EMAIL = "parent@test.com"
PARENT_PASSWORD = "Test@1234"

def test_post_auth_reset_password():
    try:
        # Step 1: Login as parent to get access token
        login_resp = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": PARENT_EMAIL, "password": PARENT_PASSWORD},
            timeout=TIMEOUT
        )
        assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
        login_data = login_resp.json()
        assert "access_token" in login_data and "refresh_token" in login_data, "Missing tokens in login response"

        # Step 2: Initiate forgot-password to generate reset token sent to email
        forgot_resp = requests.post(
            f"{BASE_URL}/auth/forgot-password",
            json={"email": PARENT_EMAIL},
            timeout=TIMEOUT
        )
        # It's assumed this returns 200 even if email is valid and processes sending reset email
        assert forgot_resp.status_code == 200, f"Forgot-password failed with status {forgot_resp.status_code}"

        # Since we cannot actually get the reset token sent via email during test,
        # we cannot proceed to test reset-password properly with a valid reset_token.
        # Therefore, we only check that reset-password endpoint with invalid token returns 400.

        reset_token = "invalid_reset_token_for_test"

        # Step 3: Use reset-password endpoint with invalid reset token and new password
        new_password = "NewTest@1234"
        headers = {"Content-Type": "application/json"}
        reset_payload = {
            "reset_token": reset_token,
            "password": new_password,
            "password_confirm": new_password
        }
        reset_resp = requests.post(
            f"{BASE_URL}/auth/reset-password",
            json=reset_payload,
            headers=headers,
            timeout=TIMEOUT
        )

        # Validate failure response due to invalid reset token
        assert reset_resp.status_code == 400, f"Reset password should fail with status 400 due to invalid token, got {reset_resp.status_code}"
        reset_data = reset_resp.json()
        assert "message" in reset_data and isinstance(reset_data["message"], str), "Expected error message in reset password failure response"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"


test_post_auth_reset_password()
