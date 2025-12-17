import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

PARENT_CREDENTIALS = {"email": "parent@test.com", "password": "Test@1234"}
DRIVER_CREDENTIALS = {"email": "driver@saferide.com", "password": "Test@1234"}
COMPANY_ADMIN_CREDENTIALS = {"email": "admin@saferide.com", "password": "Test@1234"}

def login(email, password):
    url = f"{BASE_URL}/auth/login"
    response = requests.post(url, json={"email": email, "password": password}, timeout=TIMEOUT)
    response.raise_for_status()
    data = response.json()
    assert "access_token" in data, "No access_token in login response"
    return data["access_token"]

def get_company_id_from_admin(access_token):
    return 1

def test_get_admin_company_companyid_data_isolation():
    parent_token = login(PARENT_CREDENTIALS["email"], PARENT_CREDENTIALS["password"])
    driver_token = login(DRIVER_CREDENTIALS["email"], DRIVER_CREDENTIALS["password"])
    admin_token = login(COMPANY_ADMIN_CREDENTIALS["email"], COMPANY_ADMIN_CREDENTIALS["password"])

    company_id = get_company_id_from_admin(admin_token)

    headers_admin = {"Authorization": f"Bearer {admin_token}"}
    headers_parent = {"Authorization": f"Bearer {parent_token}"}
    headers_driver = {"Authorization": f"Bearer {driver_token}"}

    url = f"{BASE_URL}/admin/company/{company_id}"

    response = requests.get(url, headers=headers_admin, timeout=TIMEOUT)
    assert response.status_code == 200, f"Admin should access company data, got {response.status_code}"
    data = response.json()
    assert data, "Admin company data response should not be empty"

    resp_parent = requests.get(url, headers=headers_parent, timeout=TIMEOUT)
    assert resp_parent.status_code in (401, 403), (
        f"Parent user should NOT access admin company data. Got {resp_parent.status_code}"
    )

    resp_driver = requests.get(url, headers=headers_driver, timeout=TIMEOUT)
    assert resp_driver.status_code in (401, 403), (
        f"Driver user should NOT access admin company data. Got {resp_driver.status_code}"
    )

test_get_admin_company_companyid_data_isolation()
