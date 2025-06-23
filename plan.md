# Implementation Plan for Issue #34784

## Problem Statement

When using `aws_ec2.IpAddresses.cidr()` in the AWS CDK to define a VPC or subnet CIDR block, if the provided base IP address is not properly aligned for the specified prefix length, the CDK silently "rounds up" the address to the next valid CIDR block without issuing a warning or error. This can result in unexpected address space being allocated, which may go unnoticed during deployment and lead to future routing or peering issues.

## Root Cause Analysis

### Current Behavior
The `IpAddresses.cidr()` method creates a `Cidr` instance that internally uses the `CidrBlock` class in `network-util.ts`. The `CidrBlock` constructor contains explicit logic that automatically adjusts misaligned IP addresses to the next valid CIDR block boundary through modulo arithmetic in the `minAddress()` method.

**Example**: When `10.0.40.0/19` is provided:
- `/19` requires alignment on 8192-address boundaries (2^(32-19) = 8192)
- `10.0.40.0` is not aligned on an 8192 boundary
- CDK silently adjusts it to `10.0.64.0/19` (the next valid boundary)

### Expected Behavior  
Users expect the CDK to validate CIDR blocks and throw an error when the base address is not aligned for the specified prefix length, rather than silently adjusting the input.

### Technical Analysis
The silent adjustment occurs in `/packages/aws-cdk-lib/aws-ec2/lib/network-util.ts`:

1. **CidrBlock constructor** (lines 220-243): Accepts misaligned CIDR strings
2. **minAddress() method** (lines 263-266): Uses modulo arithmetic to calculate the next aligned boundary
3. **Result**: The `this.cidr` property contains the adjusted CIDR, not the original input

The behavior is documented in code comments but not exposed to users, making it a source of confusion.

## Implementation Approach

### Solution Strategy
Implement **validation with clear error messaging** in the `CidrBlock` constructor to detect misaligned CIDR blocks and throw descriptive errors before any adjustment occurs.

**Rationale**: 
- Prevents unexpected network address allocation
- Maintains deterministic behavior that users expect
- Follows the principle of least surprise
- Allows users to correct their CIDR specifications explicitly

### Design Considerations
- **Backward compatibility**: This is a breaking change that will cause existing code with misaligned CIDRs to fail
- **Performance impact**: Minimal - validation adds negligible overhead
- **Security implications**: Positive - prevents accidental network misconfigurations
- **Breaking changes**: Yes - existing stacks with invalid CIDRs will need updating

## Files to be Modified

### Core Implementation
- `packages/aws-cdk-lib/aws-ec2/lib/network-util.ts`
  - Add CIDR alignment validation to `CidrBlock` constructor
  - Create helper method `isCidrAligned()` for validation logic
  - Throw descriptive error for misaligned CIDR blocks using `UnscopedValidationError`

### Tests
- `packages/aws-cdk-lib/aws-ec2/test/network-utils.test.ts`
  - Update existing tests that rely on silent adjustment behavior
  - Add new tests for validation error cases
  - Test error messages provide helpful suggestions

### Integration Tests
- Verify no integration tests in `packages/@aws-cdk-testing/framework-integ/test/aws-ec2/` use misaligned CIDRs

## Testing Strategy

### Unit Tests
1. **Validation Tests**: Test that misaligned CIDRs throw appropriate errors with helpful messages
2. **Aligned CIDR Tests**: Ensure properly aligned CIDRs continue to work unchanged
3. **Error Message Tests**: Verify error messages include suggestions for correct CIDRs
4. **Edge Case Tests**: Test various prefix lengths and misalignment scenarios

### Integration Tests  
1. **Verify no breakage**: Ensure integration tests use properly aligned CIDRs
2. **VPC Creation**: Test VPC creation with validation
3. **Cross-service Integration**: Ensure no other services depend on silent adjustment

### Manual Testing
1. Create CDK app with misaligned CIDR (`10.0.40.0/19`)
2. Verify clear error message during synthesis with suggested fix
3. Update to aligned CIDR (`10.0.64.0/19`) and verify success
4. Test with various prefix lengths (/16, /20, /24, /28)

## Implementation Details

### New Validation Logic
```typescript
private static isCidrAligned(ipAddress: string, prefixLength: number): boolean {
  const ip = NetworkUtils.ipToNum(ipAddress);
  const networkSize = CidrBlock.calculateNetsize(prefixLength);
  return ip % networkSize === 0;
}
```

### Error Handling
Following JSII compatibility requirements, use `UnscopedValidationError`:
```typescript
if (!CidrBlock.isCidrAligned(ipAddressStr, this.mask)) {
  const networkSize = CidrBlock.calculateNetsize(this.mask);
  const ip = NetworkUtils.ipToNum(ipAddressStr);
  const nextAlignedIp = NetworkUtils.numToIp(
    ip + networkSize - (ip % networkSize)
  );
  throw new UnscopedValidationError(
    `CIDR block '${ipAddressOrCidr}' has an invalid base address. ` +
    `The base IP address must be aligned on the appropriate boundary for the prefix length. ` +
    `The next valid CIDR block would be '${nextAlignedIp}/${this.mask}'.`
  );
}
```

## Risk Assessment

- **Breaking Changes**: **YES** - Existing stacks with misaligned CIDRs will fail synthesis
- **Performance Impact**: **Minimal** - Simple modulo check adds negligible overhead  
- **Security Impact**: **Positive** - Prevents network misconfigurations
- **Migration Path**: Users need to update CIDR blocks to aligned values as suggested in error messages

## Success Criteria

- [ ] Issue requirements are met: No more silent CIDR adjustments
- [ ] Misaligned CIDR specifications throw clear, actionable errors
- [ ] Properly aligned CIDR specifications continue to work unchanged
- [ ] All existing tests pass (after updating tests with misaligned CIDRs)
- [ ] New tests provide adequate coverage for validation logic
- [ ] No breaking changes to aligned CIDR usage patterns
- [ ] Clear error messages guide users to correct CIDR values
- [ ] Integration tests continue to pass with aligned CIDRs
- [ ] JSII compilation succeeds
- [ ] Linting passes