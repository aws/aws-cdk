import type * as ec2 from '../../../aws-ec2';
import { UnscopedValidationError } from '../../../core';
import type { CfnResource } from '../../../core/lib/cfn-resource';
import { ConstructReflection, memoizedGetter } from '../../../core/lib/helpers-internal';
import { lit } from '../../../core/lib/private/literal-string';
import type { IAccessPointRef } from '../../../interfaces/generated/aws-s3files-interfaces.generated';
import { CfnMountTarget } from '../s3files.generated';
import type { CfnAccessPoint, CfnFileSystem } from '../s3files.generated';

/**
 * Provides read-only reflection on the configuration of an S3 Files access point
 * and its related resources (file system, mount targets, security groups).
 *
 * Use `AccessPointReflection.of()` to obtain an instance from any access point reference.
 * All getters read directly from the L1 resources in the construct tree.
 */
export class AccessPointReflection {
  /**
   * Creates an AccessPointReflection for the given access point reference.
   */
  static of(accessPointRef: IAccessPointRef) {
    return new AccessPointReflection(accessPointRef);
  }

  private readonly ref: IAccessPointRef;
  private readonly _accessPoint: CfnAccessPoint | undefined;

  private constructor(accessPointRef: IAccessPointRef) {
    this.ref = accessPointRef;
    this._accessPoint = ConstructReflection.of(accessPointRef).findCfnResource({
      cfnResourceType: 'AWS::S3Files::AccessPoint',
      matches: (candidate: CfnResource) =>
        (candidate as unknown as CfnAccessPoint).accessPointRef?.accessPointId === accessPointRef.accessPointRef.accessPointId,
    }) as CfnAccessPoint | undefined;
  }

  /**
   * The underlying CfnAccessPoint resource.
   * @throws If the CfnAccessPoint cannot be found in the construct tree.
   */
  public get accessPoint(): CfnAccessPoint {
    if (!this._accessPoint) {
      throw new UnscopedValidationError(
        lit`CfnAccessPointNotFound`,
        `Unable to find underlying CfnAccessPoint for ${this.ref.node.path}.`,
      );
    }
    return this._accessPoint;
  }

  /**
   * The CfnFileSystem associated with this access point.
   * @throws If the CfnFileSystem cannot be found in the construct tree.
   */
  @memoizedGetter
  public get fileSystem(): CfnFileSystem {
    const ap = this.accessPoint;
    const fs = ConstructReflection.of(ap).findRelatedCfnResource({
      cfnResourceType: 'AWS::S3Files::FileSystem',
      matches: (candidate: CfnResource) => {
        const cfnFs = candidate as unknown as CfnFileSystem;
        return ap.fileSystemId === cfnFs.ref || ap.fileSystemId === cfnFs.attrFileSystemId;
      },
    }) as CfnFileSystem | undefined;
    if (!fs) {
      throw new UnscopedValidationError(
        lit`CfnFileSystemNotFound`,
        `Unable to find the CfnFileSystem for access point at ${ap.node.path}. ` +
        'Ensure the file system is defined in the same CDK app and linked to the access point.',
      );
    }
    return fs;
  }

  /**
   * All CfnMountTarget resources associated with this access point's file system.
   */
  @memoizedGetter
  public get mountTargets(): CfnMountTarget[] {
    const fs = this.fileSystem;
    const result: CfnMountTarget[] = [];
    for (const child of this.ref.node.root.node.findAll()) {
      if (CfnMountTarget.isCfnMountTarget(child) && (child.fileSystemId === fs.ref || child.fileSystemId === fs.attrFileSystemId)) {
        result.push(child);
      }
    }
    if (result.length === 0) {
      throw new UnscopedValidationError(
        lit`MountTargetsNotFound`,
        `No mount targets found for file system at ${fs.node.path}. Create at least one CfnMountTarget for the file system.`,
      );
    }
    return result;
  }

  /**
   * The security groups attached to the mount targets, resolved from the construct tree.
   */
  @memoizedGetter
  public get mountTargetSecurityGroups(): ec2.CfnSecurityGroup[] {
    const securityGroups: ec2.CfnSecurityGroup[] = [];
    const seen = new Set<string>();
    for (const mountTarget of this.mountTargets) {
      if (!mountTarget.securityGroups || mountTarget.securityGroups.length === 0) {
        throw new UnscopedValidationError(
          lit`MountTargetMissingSecurityGroups`,
          `Mount target ${mountTarget.node.path} does not have security groups. Add security groups to the mount target.`,
        );
      }
      for (const securityGroupId of mountTarget.securityGroups) {
        if (seen.has(securityGroupId)) continue;
        seen.add(securityGroupId);
        const cfnSecurityGroup = ConstructReflection.of(mountTarget).findRelatedCfnResource({
          cfnResourceType: 'AWS::EC2::SecurityGroup',
          matches: (candidate: CfnResource) =>
            candidate.ref === securityGroupId || (candidate as unknown as ec2.CfnSecurityGroup).attrGroupId === securityGroupId,
        }) as ec2.CfnSecurityGroup | undefined;
        if (cfnSecurityGroup) {
          securityGroups.push(cfnSecurityGroup);
        }
      }
    }
    return securityGroups;
  }
}
