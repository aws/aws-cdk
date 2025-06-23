# Contributing to AWS CDK - LLM Guide

This guide provides a comprehensive workflow for Large Language Models (LLMs) to automatically contribute to the AWS CDK repository. It covers the complete process from issue analysis to pull request creation.

## Workflow Overview: "PR this &lt;github_issue_url&gt;"

The automated contribution process generates two key files:
1. **plan.md** - Initial comprehensive analysis and implementation plan
2. **pr.md** - Final PR description following CDK template format

## Phase 1: Issue Analysis & Branch Creation

### Step 1.1: Fetch Issue Details
```bash
# Use GitHub MCP to get issue information
mcp__github__get_issue --owner aws --repo aws-cdk --issue_number <number>
```

### Step 1.2: Sync with Upstream and Create Working Branch
Ensure your local repository is up-to-date with the upstream main branch before creating a new branch:
```bash
# Fetch the latest changes from upstream
git fetch upstream

# Switch to main branch and update it
git checkout main
git pull upstream main

# Create and switch to new branch based on issue number
git checkout -b fix-<issue-number>
# Example: git checkout -b fix-12345
```

**Branch Naming Convention:**
- For bug fixes: `fix-<issue-number>`
- For features: `feat-<issue-number>`
- For enhancements: `enhance-<issue-number>`

**Note**: If you haven't set up the upstream remote yet:
```bash
# Add upstream remote (one-time setup)
git remote add upstream https://github.com/aws/aws-cdk.git
```

### Step 1.3: Clean and Setup Working Branch
After creating the working branch, clean the workspace and set up dependencies:
```bash
# Clean the working directory completely (removes all untracked files and build artifacts)
git clean -fqdx .

# Install all dependencies (run from repository root)
yarn install

# Build core modules needed for development (may timeout - check for errors before timeout)
npx lerna run build --scope=aws-cdk-lib --scope=@aws-cdk-testing/framework-integ --skip-nx-cache
```

**Build Strategy Notes:**
- **Full builds require adequate timeout** - use 10-minute timeout for build commands (build completes in ~3.5 minutes)
- **2-minute default timeout will fail** - always extend timeout for build commands to 600000ms (10 minutes)
- **Check for compilation errors** in output before timeout occurs
- **Alternative**: Build specific modules only: `cd packages/aws-cdk-lib && yarn build`
- **JSII compilation errors** will appear early in build output
- **Build success indicators**: Look for "Successfully ran target build" message

This step ensures:
- Complete cleanup of any leftover files from previous work
- All package dependencies are freshly installed
- Core CDK library (`aws-cdk-lib`) is built and ready
- Integration testing framework is built and available
- Clean starting state for the new branch work

### Step 1.4: Analyze Issue Content
- Parse issue description, comments, and related information
- Identify issue type:
  - **Bug fix**: Incorrect behavior that needs correction
  - **Feature request**: New functionality to implement
  - **Enhancement**: Improvement to existing functionality
- Extract current vs expected behavior
- Identify affected CDK modules/packages
- Check for existing attempts or related work

### Step 1.5: Determine Scope
- Locate relevant code using search tools (Grep, Glob)
- Identify which packages are affected:
  - `packages/aws-cdk-lib/aws-<service>/` for stable constructs
  - `packages/@aws-cdk/<package>/` for experimental constructs
- Check for dependencies and integration points

## Phase 2: Generate plan.md

Create a comprehensive `plan.md` file containing:

### Template for plan.md:
```markdown
# Implementation Plan for Issue #<issue-number>

## Problem Statement
[Clear description of the issue from user perspective]

## Root Cause Analysis
### Current Behavior
[What currently happens]

### Expected Behavior  
[What should happen instead]

### Technical Analysis
[Root cause of the gap between current and expected behavior]

## Implementation Approach
### Solution Strategy
[High-level approach to solve the problem]

### Design Considerations
- Backward compatibility
- Performance impact
- Security implications
- Breaking changes (if any)

## Files to be Modified
### Core Implementation
- `packages/aws-cdk-lib/aws-<service>/lib/<file>.ts`
- [List all files that need changes]

### Tests
- `packages/aws-cdk-lib/test/aws-<service>/<test-file>.test.ts`
- `packages/@aws-cdk-testing/framework-integ/test/aws-<service>/test/integ.<name>.ts`

## Testing Strategy
### Unit Tests
[Describe unit tests to be written/modified]

### Integration Tests
[Describe integration tests needed]

### Manual Testing
[Steps to manually verify the fix]

## Risk Assessment
- **Breaking Changes**: [Yes/No and explanation]
- **Performance Impact**: [Assessment]
- **Security Impact**: [Assessment]

## Success Criteria
- [ ] Issue requirements are met
- [ ] All existing tests pass
- [ ] New tests provide adequate coverage
- [ ] No breaking changes (unless required)
- [ ] Linting passes
```

## Phase 3: Implementation

### Step 3.1: Follow CDK Patterns
- Review existing similar constructs for patterns
- Follow [CDK Design Guidelines](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md)
- Maintain consistency with existing APIs
- Use appropriate TypeScript types and interfaces

### Step 3.2: JSII Compatibility Requirements
**Critical**: CDK uses JSII for cross-language support, which has specific constraints:

```typescript
// ❌ WRONG - Cannot extend native Error class
export class MyError extends Error { }

// ✅ CORRECT - Use existing CDK error types
import { UnscopedValidationError } from '../../core';
throw new UnscopedValidationError('Clear error message with suggested fix');

// ✅ CORRECT - For construct-specific errors
import { ConstructError } from '../../core';
export class MyError extends ConstructError { }
```

**Error Handling Patterns:**
- **Use `UnscopedValidationError`** for validation errors without construct scope
- **Use `ConstructError`** for construct-specific errors (advanced cases)
- **Always provide actionable error messages** with suggested fixes
- **Include suggestions in error text**: "Use '10.0.64.0/19' instead"

### Step 3.3: Make Code Changes
- Ensure you are on the correct working branch (`fix-<issue-number>`)
- Implement changes according to plan.md
- **Test JSII compatibility early**: `cd packages/aws-cdk-lib && yarn build`
- Handle edge cases and error conditions
- Maintain backward compatibility unless breaking change is required
- Commit changes regularly with descriptive commit messages

### Step 3.4: Common Implementation Patterns
- **Validation**: Add early validation with clear error messages
- **Breaking changes**: Update existing behavior with helpful migration guidance
- **Error messages**: Include specific suggestions for fixes
- **Testing strategy**: Plan to update existing tests + add new validation tests

### Step 3.5: Build Workflow
```bash
# For aws-cdk-lib modules
cd packages/aws-cdk-lib/aws-<module>
yarn build

# For experimental modules  
cd packages/@aws-cdk/<module>
yarn build
```

## Phase 4: Test Development & Execution

### Step 4.1: Unit Testing

#### Module-Specific Testing (Recommended):
```bash
# Test specific file (fastest, ideal for development)
cd packages/aws-cdk-lib
yarn test aws-ec2/test/network-utils.test.ts

# Test all files in a module
cd packages/aws-cdk-lib 
yarn test aws-ec2

# Coverage warnings are normal for single-file testing
```

#### For aws-cdk-lib modules:
```bash
# Build the specific module first
cd packages/aws-cdk-lib && yarn build

# Run tests for the module
yarn test <module>
```

#### For experimental modules:
```bash
cd packages/@aws-cdk/<module>
yarn build
yarn test
```

#### Updating Tests for Breaking Changes:
When implementing validation that changes behavior:
1. **Identify affected tests**: Look for tests using the old behavior
2. **Update test expectations**: Change misaligned examples to aligned ones
3. **Add validation tests**: Test both error cases and success cases
4. **Verify integration tests**: Use Task tool to ensure no integration tests break

**Example test update pattern:**
```typescript
// OLD: Test expected silent adjustment
['10.0.3.1/28', '10.0.3.31']  // Would adjust to 10.0.3.16/28

// NEW: Test with properly aligned CIDR
['10.0.3.16/28', '10.0.3.31'] // Properly aligned

// ADD: Test validation errors
expect(() => new CidrBlock('10.0.3.1/28')).toThrow(/invalid base address/);
```

### Step 4.2: Integration Testing

#### Integration test locations:
- `packages/@aws-cdk-testing/framework-integ/test/<packageName>/test/integ.*.test.ts`
- `packages/@aws-cdk/<packageName>/test/integ.*.test.ts`

#### Integration test workflow:
```bash
# 1. Compile TypeScript to JavaScript
cd packages/@aws-cdk-testing/framework-integ
yarn build
# OR for experimental packages
cd packages/@aws-cdk/<packageName>
yarn build

# 2. Run integration test
npx integ-runner packages/@aws-cdk-testing/framework-integ/test/<packageName>/test/integ.xxxx.test.js

# 3. If test fails, update snapshots
npx integ-runner packages/@aws-cdk-testing/framework-integ/test/<packageName>/test/integ.xxxx.test.js --update-on-failed
```

### Step 4.3: Test Requirements
- **Unit tests are required** for all new functionality
- **Integration tests are required** for:
  - New features
  - Bug fixes affecting CloudFormation templates
  - Cross-service integrations
  - New supported versions
  - Custom resources

### Step 4.4: Common Test Issues & Troubleshooting
- **JSII compilation errors**: Check error class inheritance and exports
- **Test failures from behavior changes**: Update test expectations systematically
- **Coverage warnings**: Normal when testing single files - focus on functionality
- **Integration test discovery**: Use Task tool to find potentially affected tests
- **Timeout issues**: Tests may timeout in CI - check for actual failures vs timeouts

**Test Failure Patterns:**
```bash
# Expected pattern when fixing behavior
ValidationError: CIDR block '10.0.40.0/19' has an invalid base address
# Solution: Update test to use properly aligned CIDR or test the validation
```

## Phase 5: Quality Assurance & Validation

### Step 5.1: Test Execution
```bash
# Run unit tests
yarn test <module>

# Run integration tests (if applicable)
npx integ-runner <path-to-integ-test.js>

# Run linting
yarn lint

# Full build verification
yarn build
```

### Step 5.2: Validation Checklist
- [ ] All unit tests pass
- [ ] Integration tests pass (snapshots updated if needed)
- [ ] Linting passes without errors
- [ ] No regression in existing functionality
- [ ] All success criteria from plan.md are met
- [ ] Breaking changes are documented (if any)

## Phase 6: Generate pr.md

Create `pr.md` file following the CDK PR template format:

**IMPORTANT**: After generating pr.md, do NOT commit changes and do NOT create the pull request automatically. The pr.md file serves as the final deliverable for manual review and PR creation when ready.

### Template for pr.md:
```markdown
### Issue # (if applicable)
Closes #<issue-number>

### Reason for this change
[Clear explanation of why this change is needed - summarize from plan.md]

### Description of changes
[Detailed technical description of what was implemented]
- [List key changes made]
- [Mention any architectural decisions]
- [Note any breaking changes]

### Describe any new or updated permissions being added
[Security impact assessment - typically "N/A" unless IAM permissions are involved]

### Description of how you validated changes
[Testing performed]
- Unit tests: [describe tests added/modified]
- Integration tests: [describe integration testing]
- Manual validation: [steps taken to verify]
- Regression testing: [existing tests verified]

### Checklist
- [x] My code adheres to the [CONTRIBUTING GUIDE](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) and [DESIGN GUIDELINES](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md)

---
*By submitting this pull request, I confirm that my contribution is made under the terms of the Apache-2.0 license*
```

## Phase 7: Manual PR Creation (When Ready)

**NOTE**: This phase is NOT automated. The pr.md file provides the complete content for manual PR creation.

### Step 7.1: PR Title Format (for reference)
Use conventional commit format:
- `feat(<module>): <description>` for new features
- `fix(<module>): <description>` for bug fixes  
- `refactor(<module>): <description>` for refactoring
- `chore(<module>): <description>` for maintenance

### Step 7.2: Manual Steps for PR Creation
When ready to create the actual pull request:

1. **Final Sync and Push Branch**:
```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on the latest main (optional but recommended)
git rebase upstream/main

# Push the working branch to your fork
git push origin fix-<issue-number>

# If you rebased and need to force push (use with caution)
# git push --force-with-lease origin fix-<issue-number>
```

2. **Create Pull Request Manually**:
   - Go to GitHub web interface
   - Navigate to your fork of aws-cdk
   - Create pull request from `fix-<issue-number>` branch to upstream main
   - Use the content from `pr.md` as the PR description
   - Apply appropriate labels and request reviews as needed

### Step 7.3: Automated PR Creation (Optional)
If automated PR creation is desired:
```bash
# Use GitHub MCP to create PR
mcp__github__create_pull_request \
  --owner aws \
  --repo aws-cdk \
  --title "<conventional-commit-title>" \
  --body "$(cat pr.md)" \
  --head fix-<issue-number> \
  --base main
```

## Error Handling & Recovery

### Common Build Failures
1. **TypeScript compilation errors**: Fix syntax and type issues
2. **JSII compilation errors**: Use CDK error types instead of native Error class
3. **Linting violations**: Run `yarn lint` and fix reported issues
4. **Test failures**: Debug failing tests and update implementation
5. **Integration test snapshot mismatches**: Use `--update-on-failed` flag

### JSII-Specific Issues
```bash
# Error: Type "Error" cannot be used as the base class because it is private or @internal
# Solution: Use UnscopedValidationError or ConstructError

# Error: Unable to resolve type "Error"
# Solution: Import and use CDK error types from '../../core'
```

### Test Failure Recovery
```bash
# For unit test failures
cd packages/aws-cdk-lib
yarn test <module> --verbose

# For integration test failures
npx integ-runner <test-path> --verbose
npx integ-runner <test-path> --update-on-failed

# Check test coverage
yarn test <module> --coverage
```

### Dependency Issues
```bash
# If dependencies are out of sync
yarn install

# If build cache issues
yarn build --skip-nx-cache
```

### Git Sync Issues
```bash
# If your branch is behind upstream main
git fetch upstream
git rebase upstream/main

# If there are merge conflicts during rebase
# 1. Resolve conflicts in the affected files
# 2. Stage the resolved files: git add <file>
# 3. Continue rebase: git rebase --continue

# If rebase becomes complex, you can abort and merge instead
git rebase --abort
git merge upstream/main
```

## Tool Usage Strategy

### Tool Selection Guidelines
Based on practical experience, choose tools strategically for optimal performance:

- **Task tool**: Use for open-ended searches and complex analysis
  - Finding implementation patterns across codebase
  - Locating error class definitions and usage
  - Discovering integration tests that might be affected
  - Understanding cross-module dependencies

- **Read tool**: Use for specific files you know exist
  - Reading known file paths
  - Examining specific implementation details
  - Reviewing test files for patterns

- **Grep tool**: Use for targeted searches within known directories
  - Searching for specific patterns in limited scope
  - Finding usage of specific functions or classes

- **Multiple parallel tool calls**: Batch independent operations for speed
  - Read multiple related files simultaneously
  - Run multiple bash commands in parallel
  - Combine searches across different areas

**Example optimal usage:**
```bash
# Use Task tool for: "Find all CIDR validation patterns in CDK"
# Use Read tool for: Reading specific file after Task identifies it
# Use Grep tool for: Finding "extends Error" in aws-ec2 directory
# Use parallel calls for: Reading multiple test files at once
```

### Breaking Change Implementation Methodology

When implementing changes that alter existing behavior:

1. **Clear error messages**: Include suggestions for fixes
2. **Update plan.md**: Document migration path for users
3. **Test validation**: Verify errors are helpful and actionable
4. **PR description**: Explicitly call out breaking changes
5. **Migration examples**: Show before/after code patterns

**Breaking Change Template:**
```typescript
// Before (silent adjustment)
IpAddresses.cidr('10.0.40.0/19') // Silently became 10.0.64.0/19

// After (validation error with suggestion)
// Error: CIDR block '10.0.40.0/19' has an invalid base address. 
// The next valid CIDR block would be '10.0.64.0/19'.

// Migration
IpAddresses.cidr('10.0.64.0/19') // Use properly aligned CIDR
```

## Key Commands Reference

### Essential Commands
```bash
# Unit tests for aws-cdk-lib modules
cd packages/aws-cdk-lib/aws-<module> && yarn build
cd packages/aws-cdk-lib && yarn test <module>

# Unit tests for experimental modules
cd packages/@aws-cdk/<module> && yarn build && yarn test

# Integration tests compilation
cd packages/@aws-cdk-testing/framework-integ && yarn build

# Integration test execution
npx integ-runner packages/@aws-cdk-testing/framework-integ/test/<packageName>/test/integ.xxxx.test.js

# Integration test with snapshot update
npx integ-runner <test-path> --update-on-failed

# Linting
yarn lint

# Full repository build
npx lerna run build
```

### Debugging Commands
```bash
# Verbose test output
yarn test <module> --verbose

# Test a specific test file
npx jest <test-file-path>

# Check specific integration test
npx integ-runner <test-path> --verbose
```

## Workflow Summary

1. **Analyze**: Fetch and analyze GitHub issue using MCP
2. **Sync & Branch**: Sync with upstream main and create working branch `fix-<issue-number>`
3. **Clean & Setup**: Clean workspace (`git clean -fqdx .`) + install dependencies + build core modules
4. **Plan**: Generate comprehensive plan.md with implementation strategy  
5. **Implement**: Write code following CDK patterns and conventions
6. **Test**: Develop and execute unit tests and integration tests
7. **Validate**: Ensure all tests pass and linting is clean
8. **Document**: Generate pr.md following CDK template format (do NOT commit or create PR automatically)
9. **Manual Review**: Review the generated pr.md file and make any needed adjustments
10. **Manual PR Creation**: When ready, manually sync, push branch, and create pull request

## Success Metrics

A successful contribution should achieve:
- [ ] Issue requirements fully addressed
- [ ] All tests pass (unit + integration)
- [ ] No linting violations
- [ ] No breaking changes (unless explicitly required)
- [ ] Comprehensive test coverage
- [ ] Clear documentation in PR description
- [ ] Follows CDK design guidelines and patterns

This workflow enables systematic, high-quality contributions to the AWS CDK repository while maintaining consistency with project standards and practices.

## Troubleshooting Guide

### JSII Compilation Errors
**Problem**: `Type "Error" cannot be used as base class`  
**Solution**: Use CDK error types instead of native Error class
```typescript
// ❌ Fails JSII compilation
export class MyError extends Error { }

// ✅ Works with JSII
import { UnscopedValidationError } from '../../core';
throw new UnscopedValidationError('Message with suggestion');
```

### Test Failures After Implementation
**Problem**: Tests expecting old behavior fail  
**Solution**: Update test expectations systematically
```typescript
// Update misaligned test cases to aligned ones
// Add new tests for validation errors
// Verify error messages are helpful
```

### Build Timeouts
**Problem**: Build commands timeout with default 2-minute timeout  
**Solution**: Use 10-minute timeout for all build commands
```bash
# ✅ CORRECT: Use extended timeout for builds
npx lerna run build --scope=aws-cdk-lib --scope=@aws-cdk-testing/framework-integ --skip-nx-cache
# (with timeout: 600000 in tool call)

# ❌ WRONG: Using default 2-minute timeout will fail
# Build completes successfully in ~3.5 minutes when given adequate time

# Alternative for specific modules: cd packages/aws-cdk-lib && yarn build
```

### Integration Test Concerns
**Problem**: Worried about breaking integration tests  
**Solution**: Use Task tool to verify no affected tests
```bash
# Task tool can search all integration tests for potentially problematic patterns
# CDK integration tests typically use properly aligned CIDRs already
```

### Error Message Quality
**Problem**: Validation errors are not helpful enough  
**Solution**: Include specific suggestions in error messages
```typescript
throw new UnscopedValidationError(
  `CIDR block '${input}' has invalid base address. ` +
  `Use '${suggestedFix}' instead.`
);
```