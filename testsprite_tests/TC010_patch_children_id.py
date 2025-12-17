import requests
import base64
import json

BASE_URL = "http://localhost:3000"
PARENT_EMAIL = "parent@test.com"
PARENT_PASSWORD = "Test@1234"
TIMEOUT = 30

def decode_jwt_payload(token):
    try:
        payload_part = token.split('.')[1]
        # Pad base64 string
        padding_len = 4 - (len(payload_part) % 4)
        if padding_len != 4:
            payload_part += '=' * padding_len
        decoded_bytes = base64.urlsafe_b64decode(payload_part)
        return json.loads(decoded_bytes)
    except Exception:
        return None

def test_patch_children_id():
    session = requests.Session()
    try:
        # Login as parent to get access_token
        auth_resp = session.post(
            f"{BASE_URL}/auth/login",
            json={"email": PARENT_EMAIL, "password": PARENT_PASSWORD},
            timeout=TIMEOUT
        )
        assert auth_resp.status_code == 200, f"Login failed: {auth_resp.text}"
        auth_data = auth_resp.json()
        access_token = auth_data.get("access_token")
        assert access_token, "access_token not found in login response"
        headers = {"Authorization": f"Bearer {access_token}"}

        # Decode JWT token to extract parent ID
        payload = decode_jwt_payload(access_token)
        assert payload and "sub" in payload, "JWT payload missing 'sub' field for parent ID"
        parent_id = payload["sub"]

        # Get children for this parent to find a child ID to update
        children_resp = session.get(f"{BASE_URL}/children/parent/{parent_id}", headers=headers, timeout=TIMEOUT)
        assert children_resp.status_code == 200, f"Failed to get children: {children_resp.text}"
        children = children_resp.json()
        assert isinstance(children, list), "Children response is not a list"
        if len(children) == 0:
            raise AssertionError("No children found for parent to update")

        child = children[0]
        child_id = child.get("id")
        assert child_id, "Child object missing 'id' field"

        # Prepare patch data - update child's profile with valid data
        patch_data = {
            "first_name": child.get("first_name", "UpdatedFirstName") + "_upd",
            "last_name": child.get("last_name", "UpdatedLastName") + "_upd",
            "nickname": "TestNickname",
            "grade": child.get("grade", 1),
        }

        patch_resp = session.patch(
            f"{BASE_URL}/children/{child_id}",
            json=patch_data,
            headers=headers,
            timeout=TIMEOUT
        )
        assert patch_resp.status_code == 200, f"Failed to patch child: {patch_resp.text}"
        patched_child = patch_resp.json()
        assert patched_child.get("first_name") == patch_data["first_name"]
        assert patched_child.get("last_name") == patch_data["last_name"]
        assert patched_child.get("nickname") == patch_data["nickname"]
        assert patched_child.get("grade") == patch_data["grade"]

        # Retrieve the child again to verify changes persisted
        get_resp = session.get(f"{BASE_URL}/children/parent/{parent_id}", headers=headers, timeout=TIMEOUT)
        assert get_resp.status_code == 200, f"Failed to get children after patch: {get_resp.text}"
        updated_children = get_resp.json()
        updated_child = next((c for c in updated_children if c.get("id") == child_id), None)
        assert updated_child is not None, "Updated child not found in children list"
        assert updated_child.get("first_name") == patch_data["first_name"]
        assert updated_child.get("last_name") == patch_data["last_name"]
        assert updated_child.get("nickname") == patch_data["nickname"]
        assert updated_child.get("grade") == patch_data["grade"]

    finally:
        session.close()

test_patch_children_id()
