# fix(ec2): validate CIDR alignment and throw clear errors instead of silent adjustment

## Summary

Fixes #34784 by adding validation to `IpAddresses.cidr()` and `CidrBlock` constructor to detect misaligned CIDR blocks and throw clear errors instead of silently adjusting to the next valid block.

### Breaking Change

This is a **breaking change** that affects users providing misaligned CIDR blocks. Previously, these were silently adjusted to the next valid CIDR block. Now, validation errors are thrown with helpful error messages.

### Changes Made

- **Added CIDR alignment validation** in `CidrBlock` constructor
- **Throws `UnscopedValidationError`** for misaligned CIDR blocks with descriptive messages
- **Provides next valid CIDR suggestion** in error messages
- **Updated existing tests** that relied on silent adjustment behavior
- **Added comprehensive test coverage** for validation scenarios

## Example

### Before (Silent Adjustment)
```typescript
// Would silently create '10.0.3.16/28' instead of '10.0.3.1/28'
const cidr = IpAddresses.cidr('10.0.3.1/28');
console.log(cidr); // No indication of the adjustment
```

### After (Clear Error)
```typescript
// Now throws clear validation error
const cidr = IpAddresses.cidr('10.0.3.1/28');
// UnscopedValidationError: CIDR block '10.0.3.1/28' has an invalid base address. 
// The base IP address must be aligned on the appropriate boundary for the prefix length. 
// The next valid CIDR block would be '10.0.3.16/28'.
```

## Migration Guide

Users with misaligned CIDR blocks need to update their code to use properly aligned base addresses:

```typescript
// ❌ Before (will now throw error)
IpAddresses.cidr('10.0.3.1/28')
IpAddresses.cidr('192.168.1.5/24')

// ✅ After (properly aligned)
IpAddresses.cidr('10.0.3.0/28')   // or '10.0.3.16/28'
IpAddresses.cidr('192.168.1.0/24') // or '192.168.2.0/24'
```

## Technical Details

### Implementation
- Added `CidrBlock.isCidrAligned()` private static method for validation
- Uses modulo arithmetic to check if IP address aligns with network size
- Calculates and suggests the next valid CIDR block in error messages
- Maintains JSII compatibility by using existing `UnscopedValidationError`

### Test Coverage
- **Misaligned CIDR validation**: Tests various misaligned scenarios
- **Valid CIDR acceptance**: Ensures properly aligned CIDRs work correctly  
- **Edge cases**: Covers /30, /31, and /32 networks
- **Error message validation**: Verifies helpful error messages are provided
- **Backwards compatibility**: Updated existing tests for new behavior

### Files Changed
- `packages/aws-cdk-lib/aws-ec2/lib/network-util.ts`: Added validation logic
- `packages/aws-cdk-lib/aws-ec2/test/network-utils.test.ts`: Added tests and updated existing ones

## Testing

All tests pass including:
- 3 new test suites for CIDR validation scenarios
- Updated existing tests to use properly aligned CIDR blocks
- Comprehensive coverage of edge cases and error conditions

```bash
yarn test --testPathPattern=network-utils.test.ts
# ✅ 20 tests passed, including new validation tests
```

## Closes

Closes #34784

---

*🤖 Generated with [Claude Code](https://claude.ai/code)*

*Co-Authored-By: Claude <noreply@anthropic.com>*