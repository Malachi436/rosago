import requests

BASE_URL = "http://localhost:3000"
PARENT_CREDENTIALS = {"email": "parent@test.com", "password": "Test@1234"}
ADMIN_CREDENTIALS = {"email": "admin@saferide.com", "password": "Test@1234"}

TIMEOUT = 30


def login(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {"email": email, "password": password}
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    assert "access_token" in data and data["access_token"]
    return data["access_token"]


def create_child(admin_token):
    url = f"{BASE_URL}/children/bulk-onboard"
    payload = {
        "children": [
            {
                "first_name": "TestChildTC008",
                "last_name": "LinkTest",
                "dob": "2015-04-15",
                "gender": "male"
            }
        ]
    }
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    assert "children" in data and len(data["children"]) == 1
    child = data["children"][0]
    assert "id" in child and "unique_code" in child
    return child["id"], child["unique_code"]


def delete_child(child_id, admin_token):
    pass


def test_post_children_link():
    parent_token = login(**PARENT_CREDENTIALS)
    admin_token = login(**ADMIN_CREDENTIALS)

    child_id = None
    try:
        child_id, unique_code = create_child(admin_token)

        url_link = f"{BASE_URL}/children/link"
        headers_link = {"Authorization": f"Bearer {parent_token}"}
        payload_link = {"unique_code": unique_code}

        resp_link = requests.post(url_link, json=payload_link, headers=headers_link, timeout=TIMEOUT)
        resp_link.raise_for_status()
        data_link = resp_link.json()

        assert "child_id" in data_link and data_link["child_id"] == child_id
        assert "parent_id" in data_link or "message" in data_link

    finally:
        if child_id:
            delete_child(child_id, admin_token)


test_post_children_link()
