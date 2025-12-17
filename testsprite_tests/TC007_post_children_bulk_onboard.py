import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

COMPANY_ADMIN_CREDENTIALS = {
    "email": "admin@saferide.com",
    "password": "Test@1234"
}

def login(email: str, password: str) -> str:
    url = f"{BASE_URL}/auth/login"
    payload = {"email": email, "password": password}
    response = requests.post(url, json=payload, timeout=TIMEOUT)
    response.raise_for_status()
    data = response.json()
    assert "access_token" in data, "Login response missing access_token"
    return data["access_token"]

def bulk_onboard_children(token: str, children_data: list) -> dict:
    url = f"{BASE_URL}/children/bulk-onboard"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(url, json={"children": children_data}, headers=headers, timeout=TIMEOUT)
    return response

def delete_child(token: str, child_id: str):
    url = f"{BASE_URL}/children/{child_id}"
    headers = {"Authorization": f"Bearer {token}"}
    # Assuming DELETE /children/:id endpoint exists for cleanup
    # If not provided in PRD, skip deletion
    response = requests.delete(url, headers=headers, timeout=TIMEOUT)
    if response.status_code not in (200, 204, 404):
        response.raise_for_status()

def test_tc007_post_children_bulk_onboard():
    token = login(COMPANY_ADMIN_CREDENTIALS["email"], COMPANY_ADMIN_CREDENTIALS["password"])

    children_to_create = [
        {
            "first_name": "Alice",
            "last_name": "Smith",
            "dob": "2015-03-15",
            "gender": "female",
            "grade": 1
        },
        {
            "first_name": "Bob",
            "last_name": "Johnson",
            "dob": "2014-11-30",
            "gender": "male",
            "grade": 2
        }
    ]

    created_child_ids = []
    response = None
    try:
        response = bulk_onboard_children(token, children_to_create)
        assert response.status_code == 201, f"Expected 201 Created, got {response.status_code}"
        data = response.json()
        assert isinstance(data, dict), "Response body should be a dict"
        assert "children" in data, "Response missing 'children' key"
        created_children = data["children"]
        assert isinstance(created_children, list), "'children' should be a list"
        assert len(created_children) == len(children_to_create), "Number of created children does not match input"
        for original, created in zip(children_to_create, created_children):
            for key in ["first_name", "last_name", "dob", "gender", "grade"]:
                assert created.get(key) == original[key], f"{key} mismatch in created child"
            assert "id" in created and isinstance(created["id"], (str, int)), "Created child missing valid id"
            created_child_ids.append(str(created["id"]))
    finally:
        # Cleanup created children if API supports deletion
        for cid in created_child_ids:
            try:
                delete_child(token, cid)
            except Exception:
                # Log error or ignore cleanup failure
                pass

test_tc007_post_children_bulk_onboard()
