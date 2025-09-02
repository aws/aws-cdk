import * as cdk from '../../core';
import * as ecs from '../lib';

describe('amis', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '1234', region: 'testregion' },
    });
  });

  test.each([
    [ecs.BottlerocketEcsVariant.AWS_ECS_1, 'SsmParameterValueawsservicebottlerocketawsecs1x8664'],
    [ecs.BottlerocketEcsVariant.AWS_ECS_1_NVIDIA, 'SsmParameterValueawsservicebottlerocketawsecs1nvidiax8664'],
    [ecs.BottlerocketEcsVariant.AWS_ECS_2, 'SsmParameterValueawsservicebottlerocketawsecs2x8664'],
    [ecs.BottlerocketEcsVariant.AWS_ECS_2_NVIDIA, 'SsmParameterValueawsservicebottlerocketawsecs2nvidiax8664'],
  ])('BottleRocketImage with %s variant', (variant, ssmKey) => {
    // GIVEN
    const testApp = new cdk.App();
    const testStack = new cdk.Stack(testApp);

    // WHEN
    new ecs.BottleRocketImage({
      variant,
    }).getImage(testStack);

    // THEN
    const assembly = testApp.synth();
    const parameters = assembly.getStackByName(testStack.stackName).template.Parameters;
    expect(Object.entries(parameters).some(
      ([k, v]) => k.startsWith(ssmKey) && (v as any).Default.includes(`/bottlerocket/${variant}/x86_64/`),
    )).toEqual(true);
  });

  describe('EcsOptimizedImage additionalCacheKey', () => {
    test('amazonLinux2023 with additionalCacheKey', () => {
      // GIVEN: A stack with account and region for context lookup
      // WHEN: Creating an Amazon Linux 2023 ECS optimized image with additionalCacheKey
      // This tests that the amazonLinux2023() static method now correctly passes
      // the additionalCacheKey parameter to the underlying EcsOptimizedImage constructor
      const ami = ecs.EcsOptimizedImage.amazonLinux2023(ecs.AmiHardwareType.STANDARD, {
        cachedInContext: true,
        additionalCacheKey: 'test-key',
      }).getImage(stack).imageId;

      // THEN: The AMI ID should be the expected dummy value for testing
      expect(ami).toEqual('dummy-value-for-/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id');

      // AND: The synthesis manifest should include the additionalCacheKey in the cache key
      // This verifies that the additionalCacheKey is properly incorporated into the SSM parameter
      // lookup cache key, allowing users to have separate cache entries for different contexts
      expect(app.synth().manifest.missing).toEqual([
        {
          // The cache key now includes 'additionalCacheKey=test-key' which enables
          // separate caching for different deployment contexts (e.g., dev vs prod)
          key: 'ssm:account=1234:additionalCacheKey=test-key:parameterName=/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id:region=testregion',
          props: {
            account: '1234',
            lookupRoleArn: 'arn:${AWS::Partition}:iam::1234:role/cdk-hnb659fds-lookup-role-1234-testregion',
            region: 'testregion',
            parameterName: '/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id',
            additionalCacheKey: 'test-key', // This property was previously ignored
            dummyValue: 'dummy-value-for-/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id',
            ignoreErrorOnMissingContext: false,
          },
          provider: 'ssm',
        },
      ]);
    });

    test('amazonLinux2 with additionalCacheKey', () => {
      // WHEN: Creating an Amazon Linux 2 ECS optimized image with additionalCacheKey
      // This tests that the amazonLinux2() static method (the most commonly used method)
      // now correctly passes the additionalCacheKey parameter through to the constructor
      const ami = ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD, {
        cachedInContext: true,
        additionalCacheKey: 'test-key-al2',
      }).getImage(stack).imageId;

      // THEN: Verify the AMI lookup works correctly
      expect(ami).toEqual('dummy-value-for-/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id');

      // AND: Verify the cache key includes the additionalCacheKey for Amazon Linux 2
      // This ensures that AL2 AMI lookups can be cached separately based on context
      expect(app.synth().manifest.missing).toEqual([
        {
          // Different additionalCacheKey value demonstrates independent caching per context
          key: 'ssm:account=1234:additionalCacheKey=test-key-al2:parameterName=/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id:region=testregion',
          props: {
            account: '1234',
            lookupRoleArn: 'arn:${AWS::Partition}:iam::1234:role/cdk-hnb659fds-lookup-role-1234-testregion',
            region: 'testregion',
            parameterName: '/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id',
            additionalCacheKey: 'test-key-al2', // Previously ignored, now properly used
            dummyValue: 'dummy-value-for-/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id',
            ignoreErrorOnMissingContext: false,
          },
          provider: 'ssm',
        },
      ]);
    });

    test('amazonLinux with additionalCacheKey', () => {
      // WHEN: Creating an Amazon Linux (v1) ECS optimized image with additionalCacheKey
      // This tests the legacy amazonLinux() method to ensure backward compatibility
      // while adding the new additionalCacheKey functionality
      const ami = ecs.EcsOptimizedImage.amazonLinux({
        cachedInContext: true,
        additionalCacheKey: 'test-key-al1',
      }).getImage(stack).imageId;

      // THEN: Verify the legacy Amazon Linux AMI lookup still works
      expect(ami).toEqual('dummy-value-for-/aws/service/ecs/optimized-ami/amazon-linux/recommended/image_id');

      // AND: Verify the cache key properly includes additionalCacheKey for legacy AL1
      // This ensures even the older Amazon Linux version supports the new caching feature
      expect(app.synth().manifest.missing).toEqual([
        {
          // Cache key for Amazon Linux v1 with additionalCacheKey support
          key: 'ssm:account=1234:additionalCacheKey=test-key-al1:parameterName=/aws/service/ecs/optimized-ami/amazon-linux/recommended/image_id:region=testregion',
          props: {
            account: '1234',
            lookupRoleArn: 'arn:${AWS::Partition}:iam::1234:role/cdk-hnb659fds-lookup-role-1234-testregion',
            region: 'testregion',
            parameterName: '/aws/service/ecs/optimized-ami/amazon-linux/recommended/image_id',
            additionalCacheKey: 'test-key-al1', // Now supported for legacy AL1 too
            dummyValue: 'dummy-value-for-/aws/service/ecs/optimized-ami/amazon-linux/recommended/image_id',
            ignoreErrorOnMissingContext: false,
          },
          provider: 'ssm',
        },
      ]);
    });

    test('windows with additionalCacheKey', () => {
      // WHEN: Creating a Windows Server ECS optimized image with additionalCacheKey
      // This tests the windows() static method to ensure it also supports the new
      // additionalCacheKey functionality, covering all 4 static factory methods
      const ami = ecs.EcsOptimizedImage.windows(ecs.WindowsOptimizedVersion.SERVER_2022, {
        cachedInContext: true,
        additionalCacheKey: 'test-key-windows',
      }).getImage(stack).imageId;

      // THEN: Verify Windows AMI lookup works with the expected parameter path
      expect(ami).toEqual('dummy-value-for-/aws/service/ami-windows-latest/Windows_Server-2022-English-Full-ECS_Optimized/image_id');

      // AND: Verify Windows AMI cache key includes additionalCacheKey
      // Note: Windows AMIs use a different SSM parameter path structure than Linux AMIs
      expect(app.synth().manifest.missing).toEqual([
        {
          // Windows AMI cache key with additionalCacheKey - different parameter path than Linux
          key: 'ssm:account=1234:additionalCacheKey=test-key-windows:parameterName=/aws/service/ami-windows-latest/Windows_Server-2022-English-Full-ECS_Optimized/image_id:region=testregion',
          props: {
            account: '1234',
            lookupRoleArn: 'arn:${AWS::Partition}:iam::1234:role/cdk-hnb659fds-lookup-role-1234-testregion',
            region: 'testregion',
            // Windows uses different SSM parameter naming convention
            parameterName: '/aws/service/ami-windows-latest/Windows_Server-2022-English-Full-ECS_Optimized/image_id',
            additionalCacheKey: 'test-key-windows', // Now works for Windows AMIs too
            dummyValue: 'dummy-value-for-/aws/service/ami-windows-latest/Windows_Server-2022-English-Full-ECS_Optimized/image_id',
            ignoreErrorOnMissingContext: false,
          },
          provider: 'ssm',
        },
      ]);
    });

    test('validation error when additionalCacheKey provided without cachedInContext', () => {
      // WHEN: Attempting to use additionalCacheKey without enabling cachedInContext
      // THEN: Should throw a clear validation error to prevent user confusion
      // This test ensures users understand that additionalCacheKey only works with caching enabled
      expect(() => {
        ecs.EcsOptimizedImage.amazonLinux2023(ecs.AmiHardwareType.STANDARD, {
          additionalCacheKey: 'test-key', // This will be ignored without cachedInContext: true
        });
      }).toThrow('"additionalCacheKey" was set but "cachedInContext" is false, so it will have no effect');

      // This validation prevents silent failures where users think they're getting
      // separate cache entries but additionalCacheKey is actually being ignored
    });

    test('no additionalCacheKey in manifest when not provided', () => {
      // WHEN: Using cachedInContext without providing additionalCacheKey
      // This tests backward compatibility - existing code should work unchanged
      const ami = ecs.EcsOptimizedImage.amazonLinux2023(ecs.AmiHardwareType.STANDARD, {
        cachedInContext: true,
        // additionalCacheKey intentionally omitted to test default behavior
      }).getImage(stack).imageId;

      // THEN: AMI lookup should work normally
      expect(ami).toEqual('dummy-value-for-/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id');

      // AND: Cache key should NOT include additionalCacheKey when not provided
      // This ensures backward compatibility - existing cache entries remain valid
      expect(app.synth().manifest.missing).toEqual([
        {
          // Cache key without additionalCacheKey - maintains backward compatibility
          key: 'ssm:account=1234:parameterName=/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id:region=testregion',
          props: {
            account: '1234',
            lookupRoleArn: 'arn:${AWS::Partition}:iam::1234:role/cdk-hnb659fds-lookup-role-1234-testregion',
            region: 'testregion',
            parameterName: '/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id',
            // Note: additionalCacheKey property is absent, not undefined
            dummyValue: 'dummy-value-for-/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id',
            ignoreErrorOnMissingContext: false,
          },
          provider: 'ssm',
        },
      ]);
    });
  });
});
