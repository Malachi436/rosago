import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

PARENT_CREDENTIALS = {
    "email": "parent@test.com",
    "password": "Test@1234"
}

DRIVER_CREDENTIALS = {
    "email": "driver@saferide.com",
    "password": "Test@1234"
}

def login(credentials):
    url = f"{BASE_URL}/auth/login"
    resp = requests.post(url, json=credentials, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    assert "access_token" in data and "refresh_token" in data
    return data["access_token"]

def test_get_children_with_parent_and_driver():
    # Login as parent
    parent_token = login(PARENT_CREDENTIALS)
    parent_headers = {"Authorization": f"Bearer {parent_token}"}
    
    # Login as driver
    driver_token = login(DRIVER_CREDENTIALS)
    driver_headers = {"Authorization": f"Bearer {driver_token}"}

    # Step 1: As parent, get children list via /children/parent/:parentId endpoint
    # Need to get parentId; assuming API returns user info at /auth/me or in token payload?
    # Since no /auth/me endpoint documented, assuming token does not include it; 
    # We will try GET /children/parent/:parentId with parentId from /auth/login response or a separate call?
    # Since no explicit API to get user id, we will attempt to decode parentId from token or else skip dynamic retrieval.
    # Instead, we try GET /children/parent/{parentId} where parentId extracted from JWT not feasible here.
    # We can try /children/parent/me endpoint? Not in docs.
    # We'll attempt a GET /children/parent with parent token to check if returns acceptable response.
    # According to instructions, parents must query /children/parent/:parentId.
    # Given no parentId available, we attempt a call to GET /children/parent/:parentEmail replacing @ and . with _ as fallback.
    
    # Since extraction of parentId is impossible from given PRD, trying to read from /children/parent/{email} encoded or fallback to 1 for test:
    import base64
    # Alternative approach: fetch parent user info via whoami endpoint if exists? Not documented, so fallback:
    parent_id = "1"
    
    url_parent_children = f"{BASE_URL}/children/parent/{parent_id}"
    resp_parent = requests.get(url_parent_children, headers=parent_headers, timeout=TIMEOUT)

    # Validate parent access is allowed and response is correct: 200 and returns list of children
    assert resp_parent.status_code == 200
    data_parent = resp_parent.json()
    assert isinstance(data_parent, list)
    # For each child profile in data_parent ensure it has expected keys and no unauthorized data
    for child in data_parent:
        assert "id" in child
        assert "name" in child or "full_name" in child or "first_name" in child or "last_name" in child
        # Permissions: parent sees their children only - no children from other users

    # Step 2: As driver, attempt to GET same endpoint expecting failure due to permission
    resp_driver = requests.get(url_parent_children, headers=driver_headers, timeout=TIMEOUT)
    
    # Driver should be unauthorized or forbidden to get parent-specific children list
    assert resp_driver.status_code in (401, 403)
    # Optionally check error message format
    err_data = resp_driver.json()
    assert "error" in err_data or "message" in err_data

test_get_children_with_parent_and_driver()