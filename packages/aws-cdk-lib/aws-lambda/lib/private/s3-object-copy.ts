import { Construct } from 'constructs';
import type * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import * as logs from '../../../aws-logs';
import type * as s3 from '../../../aws-s3';
import * as cdk from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { md5hash } from '../../../core/lib/helpers-internal';
import { lit } from '../../../core/lib/private/literal-string';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import type { S3ObjectCopySingletonFunction as S3ObjectCopySingletonFunctionType } from '../../../custom-resource-handlers/dist/aws-s3-deployment/s3-object-copy-provider.generated';
import type { WebFunctionCodeCopyOptions } from '../webfunction-code';

const RESOURCE_TYPE = 'Custom::S3ObjectCopy';

/**
 * Properties for `S3ObjectCopy`.
 */
export interface S3ObjectCopyProps extends WebFunctionCodeCopyOptions {
  /**
   * The bucket holding the object to copy from.
   */
  readonly sourceBucket: s3.IBucket;

  /**
   * The key of the object to copy from.
   */
  readonly sourceKey: string;

  /**
   * The bucket to copy the object into.
   *
   * Must have versioning enabled — the copied object's version is this construct's whole
   * output, and S3 only reports a version for a versioned bucket. If versioning is off, the
   * deployment fails with an actionable error.
   */
  readonly destinationBucket: s3.IBucket;

  /**
   * The key to copy the object to.
   */
  readonly destinationKey: string;

  /**
   * Object key pattern the copy function may write to, delete from and list in the
   * destination bucket.
   *
   * The copy function is shared by every copy in the stack, so its role's policy is shared
   * too. Granting each copy its exact key would add a statement per copy and the policy would
   * grow with the number of copies; a pattern shared by all copies into one bucket keeps it
   * to one set of statements per bucket. The pattern also has to be wider than `destinationKey`
   * for cleanup: when the resource is replaced, CloudFormation deletes the old object after
   * the policy has already moved on to the new key.
   */
  readonly destinationKeyPattern: string;
}

/**
 * Copies a single S3 object from one bucket to another at deploy time, and reports the version
 * of the object it wrote.
 *
 * Unlike `BucketDeployment`, which mirrors a directory tree, this copies exactly one object and
 * never prunes:
 *
 * - **On update** the new object is copied and prior versions of the destination object are
 *   left in place, so anything that pinned an earlier version keeps working.
 * - **On delete** every version of the object is removed. By then nothing that read the object
 *   through this resource's outputs exists any more.
 *
 * The copy is a server-side `CopyObject`, so the object's bytes never pass through Lambda. That
 * avoids the AWS CLI layer, the `/tmp` size ceiling and the long timeouts that
 * `BucketDeployment` needs. It also caps the source object at 5 GB, the limit of a single
 * `CopyObject` call.
 */
@propertyInjectable
export class S3ObjectCopy extends Construct {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-lambda.S3ObjectCopy';

  /**
   * The version of the destination object written by this copy.
   *
   * Resolved at deploy time. Because the copy reports the version it wrote itself, this is the
   * exact version of this object's contents — not merely whichever version happened to be
   * current afterwards.
   */
  public readonly versionId: string;

  /**
   * The bucket the object was written to, as reported by the copy.
   *
   * Resolved at deploy time. Together with `destinationObjectKey` and `versionId` this forms
   * the full address of the written object, so consumers can read the location entirely
   * through this resource's outputs.
   */
  public readonly destinationBucketName: string;

  /**
   * The key the object was written to, as reported by the copy.
   *
   * Resolved at deploy time.
   */
  public readonly destinationObjectKey: string;

  /** The execution role of the Lambda function performing the copy. */
  public readonly handlerRole: iam.IRole;

  private readonly cr: cdk.CustomResource;

  constructor(scope: Construct, id: string, props: S3ObjectCopyProps) {
    super(scope, id);

    // The generated provider class extends `lambda.SingletonFunction`, so its module
    // evaluates `extends` against the `aws-lambda` module root at load time. Because this
    // file is itself reached while `aws-lambda` is still initialising, a top-level import
    // would see a half-populated module and fail with "Class extends value undefined".
    // Requiring it here defers the load until synthesis, when the module is fully loaded.
    const { S3ObjectCopySingletonFunction } =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../../custom-resource-handlers/dist/aws-s3-deployment/s3-object-copy-provider.generated') as
        { S3ObjectCopySingletonFunction: typeof S3ObjectCopySingletonFunctionType };

    const uuid = renderSingletonUuid(props);
    const handler = new S3ObjectCopySingletonFunction(this, 'CustomResourceHandler', {
      uuid,
      lambdaPurpose: RESOURCE_TYPE,
      // Not exposed as an option yet. lambda.Function defaults to 3 seconds, which is too
      // short for copying a large object, so a usable value has to be set here.
      timeout: cdk.Duration.minutes(15),
      role: props.role,
      vpc: props.vpc,
      vpcSubnets: props.vpcSubnets,
      securityGroups: props.securityGroups,
      logGroup: props.logGroup ?? singletonLogGroup(this, uuid),
    });

    if (!handler.role) {
      throw new ValidationError(lit`S3ObjectCopyHandlerRoleMissing`, 'S3ObjectCopySingletonFunction should have created a Role', this);
    }
    this.handlerRole = handler.role;

    // CopyObject only reads the source object. The source is the CDK asset bucket, where objects
    // are keyed by content hash at the root, so there is no prefix to narrow the read to; a grant
    // per key would grow this shared role's policy with every asset. Bucket-wide object reads are
    // the deliberate trade between blast radius and policy size.
    iam.Grant.addToPrincipal({
      grantee: handler,
      actions: ['s3:GetObject', 's3:GetObjectVersion'],
      resourceArns: [props.sourceBucket.arnForObjects('*')],
    });
    const keyPattern = props.destinationKeyPattern;
    props.destinationBucket.grantPut(handler, keyPattern);
    // Deletion removes every version of the key, which takes a version listing on the bucket
    // plus DeleteObjectVersion on the objects.
    props.destinationBucket.grantDelete(handler, keyPattern);
    handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:ListBucketVersions'],
      // A version listing is a bucket-level operation, so the resource cannot be narrowed.
      // Condition it on the same pattern the put and delete grants use instead: the handler
      // lists with the object key as its prefix, so a destination bucket that holds unrelated
      // data cannot be enumerated through this role.
      resources: [props.destinationBucket.bucketArn],
      conditions: { StringLike: { 's3:prefix': keyPattern } },
    }));

    this.cr = new cdk.CustomResource(this, 'Resource', {
      serviceToken: handler.functionArn,
      resourceType: RESOURCE_TYPE,
      properties: {
        SourceBucketName: props.sourceBucket.bucketName,
        SourceObjectKey: props.sourceKey,
        DestinationBucketName: props.destinationBucket.bucketName,
        DestinationObjectKey: props.destinationKey,
      },
    });

    this.destinationBucketName = this.cr.getAttString('Bucket');
    this.destinationObjectKey = this.cr.getAttString('Key');
    this.versionId = this.cr.getAttString('VersionId');
  }
}

/**
 * The log group for the singleton function, shared like the function itself.
 *
 * Every copy with the same uuid gets the same function, so the log group is keyed by the uuid
 * too: one log group per function, instead of one per copy that only the first would use.
 */
function singletonLogGroup(scope: Construct, uuid: string): logs.ILogGroup {
  const stack = cdk.Stack.of(scope);
  const id = `S3ObjectCopyLogGroup${uuid.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (stack.node.tryFindChild(id) as logs.ILogGroup | undefined) ?? new logs.LogGroup(stack, id);
}

/**
 * Build the singleton function's identity.
 *
 * Anything that changes the function itself has to feed the uuid, otherwise two
 * differently-configured copies would silently share one function and the second
 * configuration would be dropped.
 *
 * A value is only appended when it is actually set, so adding a new option later leaves the
 * uuid — and therefore the logical ID — unchanged for consumers who do not use it.
 *
 * The destination is always part of it. The function's role is scoped to the destination, so
 * if a moved destination kept the same function, its role would be narrowed in place and the
 * Delete of the old object, which runs in the cleanup phase, would no longer be allowed. A new
 * function instead leaves the old one, with its grants, to delete the old object.
 */
function renderSingletonUuid(props: S3ObjectCopyProps): string {
  // A fixed, arbitrary seed for the function's logical ID. Do not change it: a new value
  // replaces the copy function in every stack that has one.
  let uuid = 'e2f8cf6b-1b0f-4b3f-9a2c-6f1f5b6d4a71';
  uuid += `-dest-${destinationIdentity(props.destinationBucket, props.destinationKeyPattern)}`;

  if (props.role) { uuid += `-role-${props.role.node.addr}`; }
  if (props.vpc) {
    uuid += `-vpc-${props.vpc.node.addr}`;
    if (props.vpcSubnets) { uuid += `-subnets-${renderSubnetSelectionIdentity(props.vpcSubnets)}`; }
  }
  if (props.securityGroups) { uuid += `-sg-${props.securityGroups.map(sg => sg.node.addr).sort().join('-')}`; }
  if (props.logGroup) { uuid += `-lg-${props.logGroup.node.addr}`; }

  return uuid;
}

/**
 * A hex identity for where a copy writes to. It feeds the function's uuid here, and the copy's
 * construct id in `WebFunctionCode`, so the two change together.
 *
 * The bucket is identified by its name as CloudFormation sees it — a literal for an imported
 * bucket, a `Ref` for one defined in the app — rather than by construct path. The copy's id has
 * to change only when the object it writes changes; a path that moves without the bucket would
 * give a new copy resource for the same object, and deleting the old one would remove the new
 * copy's object as well.
 *
 * Hashed because `SingletonFunction` drops the non-alphanumeric characters of the uuid, which
 * would make patterns such as `a/b/*` and `ab/*` the same identity.
 */
export function destinationIdentity(bucket: s3.IBucket, keyPattern: string): string {
  const bucketName = JSON.stringify(cdk.Stack.of(bucket).resolve(bucket.bucketName));
  return md5hash(`${bucketName}/${keyPattern}`);
}

/**
 * Reduce a subnet selection to a hex identity that is stable across synths and distinct for
 * distinct selections.
 *
 * Two details make the obvious `JSON.stringify(selection)` wrong here:
 *
 * - `subnets` holds constructs, which carry circular references through the construct tree, so
 *   stringifying them throws. They are identified by node address instead, like every other
 *   construct feeding this uuid.
 * - `SingletonFunction` slugifies the uuid by dropping every non-alphanumeric character, which
 *   would strip a raw JSON string of its delimiters and let distinct selections collapse onto
 *   one identifier. Hashing to hex survives that intact.
 */
function renderSubnetSelectionIdentity(selection: ec2.SubnetSelection): string {
  const { subnets, ...rest } = selection;
  return md5hash(JSON.stringify({
    ...rest,
    subnets: subnets?.map(subnet => subnet.node.addr).sort(),
  }));
}
