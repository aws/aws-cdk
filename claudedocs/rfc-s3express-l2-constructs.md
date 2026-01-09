# S3 Express One Zone L2 Constructs

* **Original Author(s)**: @syasoda
* **Tracking Issue**: [Link to GitHub issue will be added]
* **API Bar Raiser**: TBD

## Summary

Add L2 constructs for AWS S3 Express One Zone, providing a type-safe, developer-friendly interface for creating directory buckets and access points with high-performance storage capabilities.

## Working Backwards

### CHANGELOG

```
feat(s3express): add L2 constructs for S3 Express One Zone directory buckets and access points

This change introduces DirectoryBucket and DirectoryBucketAccessPoint L2 constructs for the `@aws-cdk/aws-s3express` module, enabling developers to create high-performance S3 storage resources with single-digit millisecond latency.

New classes:
- `DirectoryBucket` - L2 construct for S3 Express One Zone directory buckets
- `DirectoryBucketAccessPoint` - L2 construct for directory bucket access points
- `IDirectoryBucket` - Interface for directory bucket references
- `IDirectoryBucketAccessPoint` - Interface for access point references

New enums:
- `DataRedundancy` - SingleAvailabilityZone or SingleLocalZone options
- `DirectoryBucketEncryption` - S3_MANAGED or KMS encryption types

New methods:
- `DirectoryBucket.fromBucketArn()` - Import existing directory bucket by ARN
- `DirectoryBucket.fromBucketName()` - Import existing directory bucket by name
- `DirectoryBucket.grantRead()` - Grant read permissions to IAM principals
- `DirectoryBucket.grantWrite()` - Grant write permissions to IAM principals
- `DirectoryBucket.grantReadWrite()` - Grant read/write permissions to IAM principals

BREAKING CHANGE: None. This is a new feature addition to the aws-s3express module.
```

### README

#### S3 Express One Zone Directory Buckets

S3 Express One Zone is a high-performance, single-Availability Zone S3 storage class that delivers consistent single-digit millisecond data access, up to 10x faster than S3 Standard. Directory buckets are designed for latency-sensitive applications requiring high transaction rates.

##### Basic Usage

```typescript
import * as s3express from 'aws-cdk-lib/aws-s3express';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

// Create a directory bucket with default settings
const bucket = new s3express.DirectoryBucket(this, 'MyDirectoryBucket', {
  location: {
    availabilityZone: 'us-east-1a',
  },
});

// Bucket name format: bucket-base-name--useast1-az1--x-s3
console.log(bucket.bucketName);
```

##### Encryption Configuration

Directory buckets support server-side encryption with either S3-managed keys or AWS KMS keys:

```typescript
import * as kms from 'aws-cdk-lib/aws-kms';

// S3-managed encryption (default)
const bucketWithS3Encryption = new s3express.DirectoryBucket(this, 'S3Encrypted', {
  location: { availabilityZone: 'us-west-2a' },
  encryption: s3express.DirectoryBucketEncryption.S3_MANAGED,
});

// KMS encryption with customer-managed key
const encryptionKey = new kms.Key(this, 'BucketKey');
const bucketWithKMSEncryption = new s3express.DirectoryBucket(this, 'KMSEncrypted', {
  location: { availabilityZone: 'us-west-2a' },
  encryption: s3express.DirectoryBucketEncryption.KMS,
  encryptionKey: encryptionKey,
});
```

##### Data Redundancy

Choose between single Availability Zone or single Local Zone redundancy:

```typescript
// Single Availability Zone (default)
const azBucket = new s3express.DirectoryBucket(this, 'AZBucket', {
  location: { availabilityZone: 'us-east-1a' },
  dataRedundancy: s3express.DataRedundancy.SINGLE_AVAILABILITY_ZONE,
});

// Single Local Zone
const lzBucket = new s3express.DirectoryBucket(this, 'LZBucket', {
  location: { localZone: 'us-west-2-lax-1a' },
  dataRedundancy: s3express.DataRedundancy.SINGLE_LOCAL_ZONE,
});
```

##### IAM Permissions

Grant read, write, or full access permissions to IAM principals:

```typescript
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const bucket = new s3express.DirectoryBucket(this, 'MyBucket', {
  location: { availabilityZone: 'us-east-1a' },
});

const readFunction = new lambda.Function(this, 'ReadFunction', {
  // ... function configuration
});

const writeFunction = new lambda.Function(this, 'WriteFunction', {
  // ... function configuration
});

// Grant read access
bucket.grantRead(readFunction);

// Grant write access
bucket.grantWrite(writeFunction);

// Grant full read/write access
bucket.grantReadWrite(readFunction);
```

##### Importing Existing Directory Buckets

Reference existing directory buckets by ARN or name:

```typescript
// Import by ARN
const importedByArn = s3express.DirectoryBucket.fromBucketArn(
  this,
  'ImportedBucket',
  'arn:aws:s3express:us-east-1:123456789012:bucket/my-bucket--useast1-az1--x-s3'
);

// Import by bucket name
const importedByName = s3express.DirectoryBucket.fromBucketName(
  this,
  'ImportedBucket',
  'my-bucket--useast1-az1--x-s3'
);

// Use imported bucket
importedByArn.grantRead(someRole);
```

##### Directory Bucket Access Points

Create access points for directory buckets to simplify data access management:

```typescript
const bucket = new s3express.DirectoryBucket(this, 'MyBucket', {
  location: { availabilityZone: 'us-east-1a' },
});

const accessPoint = new s3express.DirectoryBucketAccessPoint(this, 'MyAccessPoint', {
  bucket: bucket,
});

// Grant access through the access point
accessPoint.grantRead(someFunction);
```

##### Bucket Policies

Apply resource policies to directory buckets:

```typescript
import * as iam from 'aws-cdk-lib/aws-iam';

const bucket = new s3express.DirectoryBucket(this, 'MyBucket', {
  location: { availabilityZone: 'us-east-1a' },
});

bucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3express:CreateSession'],
  resources: [bucket.bucketArn],
  principals: [new iam.AccountPrincipal('123456789012')],
}));
```

### PRESS RELEASE

**AWS CDK Launches L2 Constructs for S3 Express One Zone**

*High-performance storage resources now available with type-safe, developer-friendly APIs*

**SEATTLE** - Today, AWS Cloud Development Kit (CDK) announced the general availability of L2 constructs for Amazon S3 Express One Zone, enabling developers to easily provision high-performance storage resources that deliver consistent single-digit millisecond data access.

S3 Express One Zone is a new storage class designed for latency-sensitive applications requiring high transaction rates. With performance up to 10x faster than S3 Standard and request costs reduced by 50%, S3 Express One Zone is ideal for machine learning training, financial modeling, real-time analytics, and media content creation workloads.

Prior to this release, developers could only use low-level CloudFormation (L1) constructs to create directory buckets, requiring manual configuration of encryption, IAM policies, and location settings. The new L2 constructs abstract these complexities, providing sensible defaults, type-safe APIs, and integration with other CDK constructs.

"The new DirectoryBucket construct makes it incredibly simple to add high-performance storage to our CDK applications," said a CDK user. "We can now create directory buckets with just a few lines of code, and the construct handles all the complexity around encryption, permissions, and naming conventions."

Key features of the new L2 constructs include:

- **Type-safe configuration**: Enums for encryption types and data redundancy options prevent configuration errors
- **IAM grant methods**: Simple `grantRead()`, `grantWrite()`, and `grantReadWrite()` methods for permission management
- **Import capabilities**: Reference existing directory buckets by ARN or name
- **Validation**: Automatic validation of bucket names, location settings, and encryption configurations
- **Access point support**: Create and manage directory bucket access points with ease

The DirectoryBucket construct supports both S3-managed and AWS KMS encryption, single Availability Zone and Local Zone redundancy options, and seamless integration with AWS Lambda, Amazon ECS, and other compute services.

Developers can start using the new L2 constructs today by upgrading to the latest version of AWS CDK. For more information, visit the AWS CDK documentation at https://docs.aws.amazon.com/cdk/.

## Public FAQ

### What are we launching today?

We are launching L2 (high-level) constructs for AWS S3 Express One Zone directory buckets and access points in the AWS CDK. These constructs provide a developer-friendly, type-safe API for creating and managing high-performance S3 storage resources.

### Why should I use this feature?

You should use these L2 constructs if you need high-performance storage with single-digit millisecond latency for your applications. The constructs simplify the creation and management of directory buckets by:

1. **Reducing boilerplate**: Create directory buckets with sensible defaults in just a few lines of code
2. **Improving type safety**: Enums and interfaces prevent common configuration errors
3. **Simplifying IAM management**: Grant methods handle complex permission configurations automatically
4. **Ensuring validation**: Automatic validation of bucket names, encryption settings, and location configurations
5. **Enabling imports**: Easily reference existing directory buckets in your CDK applications

Without these L2 constructs, you would need to use low-level CfnDirectoryBucket constructs with manual configuration of all properties, no validation, and complex IAM policy management.

## Internal FAQ

### Why are we doing this?

S3 Express One Zone was launched by AWS to provide high-performance storage for latency-sensitive workloads. However, the aws-s3express CDK module currently only contains auto-generated L1 CloudFormation constructs, which are difficult to use and require extensive boilerplate code.

By creating L2 constructs, we enable CDK users to:
- Easily adopt S3 Express One Zone in their applications
- Follow CDK best practices with high-level constructs
- Reduce errors through validation and type safety
- Integrate seamlessly with other AWS services through grant methods

This aligns with the CDK's mission to provide the best developer experience for infrastructure as code.

### Why should we _not_ do this?

Potential arguments against this feature:

1. **Limited adoption**: S3 Express One Zone is a newer storage class with potentially limited adoption compared to S3 Standard
2. **Maintenance burden**: L2 constructs require ongoing maintenance as AWS adds new features
3. **API surface complexity**: Adding comprehensive L2 constructs increases the module's API surface

However, these concerns are outweighed by:
- Growing adoption of S3 Express One Zone for performance-critical workloads
- Standard CDK maintenance processes handle L2 construct updates
- Well-designed L2 APIs actually reduce complexity for users

### What is the technical solution?

We will implement the following classes in the `@aws-cdk/aws-s3express` module:

#### DirectoryBucket Class

```typescript
export interface DirectoryBucketProps {
  readonly bucketName?: string;
  readonly location: {
    readonly availabilityZone?: string;
    readonly localZone?: string;
  };
  readonly dataRedundancy?: DataRedundancy;
  readonly encryption?: DirectoryBucketEncryption;
  readonly encryptionKey?: kms.IKey;
}

export interface IDirectoryBucket extends IResource {
  readonly bucketArn: string;
  readonly bucketName: string;
  grantRead(identity: iam.IGrantable, objectsKeyPattern?: string): iam.Grant;
  grantWrite(identity: iam.IGrantable, objectsKeyPattern?: string): iam.Grant;
  grantReadWrite(identity: iam.IGrantable, objectsKeyPattern?: string): iam.Grant;
  addToResourcePolicy(permission: iam.PolicyStatement): iam.AddToResourcePolicyResult;
}

export class DirectoryBucket extends Resource implements IDirectoryBucket {
  public static fromBucketArn(scope: Construct, id: string, bucketArn: string): IDirectoryBucket;
  public static fromBucketName(scope: Construct, id: string, bucketName: string): IDirectoryBucket;

  public readonly bucketArn: string;
  public readonly bucketName: string;

  constructor(scope: Construct, id: string, props: DirectoryBucketProps);
}
```

#### DirectoryBucketAccessPoint Class

```typescript
export interface DirectoryBucketAccessPointProps {
  readonly accessPointName?: string;
  readonly bucket: IDirectoryBucket;
}

export interface IDirectoryBucketAccessPoint extends IResource {
  readonly accessPointArn: string;
  readonly accessPointName: string;
  grantRead(identity: iam.IGrantable): iam.Grant;
  grantWrite(identity: iam.IGrantable): iam.Grant;
  grantReadWrite(identity: iam.IGrantable): iam.Grant;
}

export class DirectoryBucketAccessPoint extends Resource implements IDirectoryBucketAccessPoint {
  public static fromAccessPointArn(scope: Construct, id: string, accessPointArn: string): IDirectoryBucketAccessPoint;

  public readonly accessPointArn: string;
  public readonly accessPointName: string;

  constructor(scope: Construct, id: string, props: DirectoryBucketAccessPointProps);
}
```

#### Enums

```typescript
export enum DataRedundancy {
  SINGLE_AVAILABILITY_ZONE = 'SingleAvailabilityZone',
  SINGLE_LOCAL_ZONE = 'SingleLocalZone',
}

export enum DirectoryBucketEncryption {
  S3_MANAGED = 'aws:kms:dsse',
  KMS = 'aws:kms',
}
```

Implementation details:
- Use existing `CfnDirectoryBucket` and `CfnBucketAccessPoint` L1 constructs as the underlying resources
- Validate bucket naming format: `bucket-base-name--zone-id--x-s3`
- Default to S3-managed encryption if not specified
- Validate that `encryptionKey` is only provided when `encryption` is KMS
- Implement standard IAM grant methods following the pattern from `aws-s3.Bucket`
- Generate bucket name with zone ID suffix if not provided

### Is this a breaking change?

No. This is a new feature addition to the `@aws-cdk/aws-s3express` module. The existing L1 constructs (`CfnDirectoryBucket`, `CfnBucketAccessPoint`, `CfnBucketPolicy`) remain unchanged.

### What alternative solutions were considered?

#### Alternative 1: Extend existing S3 Bucket class

We considered extending the existing `aws-s3.Bucket` class to support directory buckets.

**Pros**:
- Familiar API for users already using S3
- Code reuse from existing S3 implementation

**Cons**:
- Directory buckets have different behavior and restrictions (e.g., no versioning, no website hosting, different naming format)
- Would complicate the S3 Bucket API with conditional logic
- S3 Express uses different IAM actions (`s3express:*` vs `s3:*`)
- Risk of breaking changes to existing S3 Bucket users

**Decision**: Rejected. Directory buckets are sufficiently different to warrant separate constructs.

#### Alternative 2: Single unified Express construct

We considered creating a single `S3Express` construct that handles both directory buckets and access points.

**Pros**:
- Simpler module structure
- Fewer classes to maintain

**Cons**:
- Violates single responsibility principle
- Less flexible for users who only need buckets or access points
- Harder to compose with other constructs

**Decision**: Rejected. Separate constructs provide better composability and follow CDK patterns.

#### Alternative 3: Wait for AWS-provided L2 constructs

We considered waiting for AWS to provide official L2 constructs.

**Pros**:
- AWS might have better insights into future feature development
- Less maintenance burden for CDK team

**Cons**:
- Uncertain timeline for AWS-provided L2 constructs
- CDK users need these constructs now for production workloads
- Community-driven development is a core strength of CDK

**Decision**: Rejected. Proceeding with implementation.

### What are the drawbacks of this solution?

1. **Maintenance overhead**: New L2 constructs require ongoing maintenance as S3 Express evolves
   - *Mitigation*: Follow standard CDK maintenance processes, leverage existing patterns from aws-s3

2. **API evolution risk**: S3 Express is relatively new and may add features that require API changes
   - *Mitigation*: Design extensible APIs with optional properties for future additions

3. **Feature parity with S3**: Users might expect full S3 Bucket feature parity
   - *Mitigation*: Clear documentation explaining directory bucket limitations and differences

4. **Testing complexity**: Directory buckets require actual AWS resources for integration testing
   - *Mitigation*: Comprehensive unit tests with mocked resources, integration tests in CDK CI/CD pipeline

### What is the high-level project plan?

**Phase 1: Core DirectoryBucket construct (Week 1-2)**
- Implement `DirectoryBucket` class with basic functionality
- Implement `IDirectoryBucket` interface
- Add validation for bucket names and location settings
- Implement encryption configuration (S3-managed and KMS)
- Write comprehensive unit tests

**Phase 2: IAM integration (Week 2-3)**
- Implement `grantRead()`, `grantWrite()`, `grantReadWrite()` methods
- Implement `addToResourcePolicy()` method
- Test IAM permission generation
- Write integration tests for IAM scenarios

**Phase 3: Import capabilities (Week 3)**
- Implement `fromBucketArn()` static method
- Implement `fromBucketName()` static method
- Test imported bucket behavior
- Document import use cases

**Phase 4: DirectoryBucketAccessPoint construct (Week 4)**
- Implement `DirectoryBucketAccessPoint` class
- Implement `IDirectoryBucketAccessPoint` interface
- Implement grant methods for access points
- Write unit and integration tests

**Phase 5: Documentation and examples (Week 5)**
- Update README with comprehensive examples
- Add JSDoc comments to all public APIs
- Create example CDK applications demonstrating common use cases
- Update CHANGELOG

**Phase 6: Testing and refinement (Week 6)**
- Run full integration test suite
- Performance testing
- Security review
- Address feedback from API bar raiser
- Final polish

### Are there any open issues?

1. **Session token handling**: S3 Express requires session tokens for data access (`CreateSession` API). Should the DirectoryBucket construct automatically handle session token creation?
   - *Proposed solution*: No automatic session handling in initial release. Document that users need to include `s3express:CreateSession` permission. Consider adding helper methods in future versions.

2. **Bucket naming validation**: Directory bucket names must follow the format `bucket-base-name--zone-id--x-s3`. Should we auto-generate the zone ID suffix?
   - *Proposed solution*: Yes, auto-generate the zone ID suffix based on the specified location. Allow users to override with fully-qualified name if needed.

3. **Cross-zone access**: Directory buckets are single-zone. Should we add warnings or validations when granting access from resources in different zones?
   - *Proposed solution*: Add documentation warnings about cross-zone latency. Consider adding optional validation in future versions.

4. **Cost visibility**: S3 Express has different pricing than S3 Standard. Should constructs provide cost estimation?
   - *Proposed solution*: Out of scope for initial release. Link to AWS pricing documentation in README.

5. **Metrics and monitoring**: Should DirectoryBucket expose CloudWatch metrics?
   - *Proposed solution*: Out of scope for initial release. Users can access metrics through standard CloudWatch APIs. Consider adding helper methods in future versions.

## Appendix

### A: CloudFormation Resources

The implementation will use the following existing CloudFormation resources:

- `AWS::S3Express::DirectoryBucket` - Already available as `CfnDirectoryBucket`
- `AWS::S3Express::BucketAccessPoint` - Already available as `CfnBucketAccessPoint`
- `AWS::S3Express::BucketPolicy` - Already available as `CfnBucketPolicy`

### B: IAM Actions for S3 Express

S3 Express uses a different set of IAM actions than standard S3:

**Read actions**:
- `s3express:CreateSession` (required for all data access)
- `s3express:GetObject`
- `s3express:ListBucket`

**Write actions**:
- `s3express:CreateSession` (required for all data access)
- `s3express:PutObject`
- `s3express:DeleteObject`
- `s3express:AbortMultipartUpload`

**Management actions**:
- `s3express:CreateBucket`
- `s3express:DeleteBucket`
- `s3express:PutBucketPolicy`
- `s3express:GetBucketPolicy`

### C: Naming Convention

Directory bucket names must follow this format:
```
bucket-base-name--zone-id--x-s3
```

Where:
- `bucket-base-name`: User-specified name (3-63 characters, lowercase, numbers, hyphens)
- `zone-id`: Availability Zone ID (e.g., `useast1-az1`) or Local Zone ID (e.g., `usweast2-lax-1a`)
- `x-s3`: Fixed suffix indicating S3 Express

Example: `my-app-data--useast1-az1--x-s3`

### D: Performance Characteristics

S3 Express One Zone provides:
- **Latency**: Consistent single-digit millisecond latency
- **Performance**: Up to 10x faster than S3 Standard
- **Request costs**: 50% lower than S3 Standard
- **Throughput**: Hundreds of thousands of requests per second
- **Use cases**: ML training, financial modeling, real-time analytics, media processing

### E: Limitations

Directory buckets have the following limitations compared to standard S3 buckets:
- No versioning support
- No website hosting
- No replication (CRR/SRR)
- No lifecycle policies
- No object lock
- No bucket inventory
- Single-zone redundancy only
- Must be in the same zone as compute resources for optimal performance
