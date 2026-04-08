import type * as ec2 from '../../../aws-ec2';
import { UnscopedValidationError } from '../../../core';
import { findClosestRelatedResource, findL1FromRef, memoizedGetter } from '../../../core/lib/helpers-internal';
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
    this._accessPoint = findL1FromRef<IAccessPointRef, CfnAccessPoint>(
      accessPointRef,
      'AWS::S3Files::AccessPoint',
      (cfnAccessPoint, ref) => cfnAccessPoint.accessPointRef.accessPointId === ref.accessPointRef.accessPointId,
    );
  }

  /**
   * The underlying CfnAccessPoint resource.
   * @throws If the CfnAccessPoint cannot be found in the construct tree.
   */
  public get accessPoint(): CfnAccessPoint {
    if (!this._accessPoint) {
      throw new UnscopedValidationError(
        'CfnAccessPointNotFound',
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
    const fs = findClosestRelatedResource<CfnAccessPoint, CfnFileSystem>(
      this.accessPoint,
      'AWS::S3Files::FileSystem',
      (accessPoint, fileSystem) => accessPoint.fileSystemId === fileSystem.ref || accessPoint.fileSystemId === fileSystem.attrFileSystemId,
    );
    if (!fs) {
      throw new UnscopedValidationError(
        'CfnFileSystemNotFound',
        `Unable to find the CfnFileSystem for access point at ${this.accessPoint.node.path}. ` +
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
        'MountTargetsNotFound',
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
          'MountTargetMissingSecurityGroups',
          `Mount target ${mountTarget.node.path} does not have security groups. Add security groups to the mount target.`,
        );
      }
      for (const securityGroupId of mountTarget.securityGroups) {
        if (seen.has(securityGroupId)) continue;
        seen.add(securityGroupId);
        const cfnSecurityGroup = findClosestRelatedResource<CfnMountTarget, ec2.CfnSecurityGroup>(
          mountTarget, 'AWS::EC2::SecurityGroup',
          (_, candidate) => candidate.ref === securityGroupId || candidate.attrGroupId === securityGroupId,
        );
        if (cfnSecurityGroup) {
          securityGroups.push(cfnSecurityGroup);
        }
      }
    }
    return securityGroups;
  }
}
