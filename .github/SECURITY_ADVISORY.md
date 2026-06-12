# Security Advisory

Sentinel detected 3 security findings in your GitHub Actions workflows that require manual review.

## dangerous-triggers

### integration-test-deployment.yml (line 40)

**Severity:** critical
**Issue:** pull_request_target + checkout of PR head — fork code runs with base repo secrets
**Fix:** Use pull_request trigger instead, or don't checkout PR head code

### request-cli-integ-test.yml (line 25)

**Severity:** critical
**Issue:** pull_request_target + checkout of PR head — fork code runs with base repo secrets
**Fix:** Use pull_request trigger instead, or don't checkout PR head code

### request-cli-integ-test.yml (line 25)

**Severity:** critical
**Issue:** pull_request_target + checkout of PR head — fork code runs with base repo secrets
**Fix:** Use pull_request trigger instead, or don't checkout PR head code

