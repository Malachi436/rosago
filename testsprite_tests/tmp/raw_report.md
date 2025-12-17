
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** rosago
- **Date:** 2025-12-16
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** post auth login
- **Test Code:** [TC001_post_auth_login.py](./TC001_post_auth_login.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/e1e0ab2d-75b7-4b4f-9597-0d5d3ab6d2d6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** post auth refresh
- **Test Code:** [TC002_post_auth_refresh.py](./TC002_post_auth_refresh.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 28, in test_post_auth_refresh
  File "/var/task/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 400 Client Error: Bad Request for url: http://localhost:3000/auth/refresh

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 47, in <module>
  File "<string>", line 45, in test_post_auth_refresh
AssertionError: Token refresh failed or invalid response: 400 Client Error: Bad Request for url: http://localhost:3000/auth/refresh

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/414cc09f-b30b-4201-8ac9-41c8bc041b7f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** post auth logout
- **Test Code:** [TC003_post_auth_logout.py](./TC003_post_auth_logout.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 47, in <module>
  File "<string>", line 45, in test_post_auth_logout
AssertionError: Access with logged-out token should be denied, got 200

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/83b0a35a-9dc0-41f2-acda-b80bbf6ef513
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** post auth forgot password
- **Test Code:** [TC004_post_auth_forgot_password.py](./TC004_post_auth_forgot_password.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/ae07d5db-df3f-4763-b301-fcbc74876578
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** post auth reset password
- **Test Code:** [TC005_post_auth_reset_password.py](./TC005_post_auth_reset_password.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 60, in <module>
  File "<string>", line 54, in test_post_auth_reset_password
AssertionError: Expected error message in reset password failure response

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/f71ba20f-291e-46ac-ae36-5b4d909b7a91
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** get admin company companyid data isolation
- **Test Code:** [TC006_get_admin_company_companyid_data_isolation.py](./TC006_get_admin_company_companyid_data_isolation.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 49, in <module>
  File "<string>", line 35, in test_get_admin_company_companyid_data_isolation
AssertionError: Admin should access company data, got 404

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/47834cc5-a077-4b42-9062-122c526727b6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** post children bulk onboard
- **Test Code:** [TC007_post_children_bulk_onboard.py](./TC007_post_children_bulk_onboard.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 80, in <module>
  File "<string>", line 59, in test_tc007_post_children_bulk_onboard
AssertionError: Expected 201 Created, got 400

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/1bd72da5-3316-4b76-9829-b13a75f20238
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** post children link
- **Test Code:** [TC008_post_children_link.py](./TC008_post_children_link.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 70, in <module>
  File "<string>", line 52, in test_post_children_link
  File "<string>", line 34, in create_child
  File "/var/task/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 400 Client Error: Bad Request for url: http://localhost:3000/children/bulk-onboard

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/651ff18d-8ce9-4742-8b7b-4ef32b6ad6a4
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** get children
- **Test Code:** [TC009_get_children.py](./TC009_get_children.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/5503d047-729c-4a9b-bd04-2999af8ace0e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** patch children id
- **Test Code:** [TC010_patch_children_id.py](./TC010_patch_children_id.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 89, in <module>
  File "<string>", line 68, in test_patch_children_id
AssertionError: Failed to patch child: {"statusCode":500,"message":"Internal server error"}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/93fb1f89-0408-4d4a-8f32-2db4993b461a/55a8cde4-dc7b-434e-bea2-219f9cc4efac
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **30.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---