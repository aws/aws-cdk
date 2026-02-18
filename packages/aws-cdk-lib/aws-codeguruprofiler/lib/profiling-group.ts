import type { Construct } from 'constructs';
import { ProfilingGroupGrants } from './codeguruprofiler-grants.generated';
import type { IProfilingGroupRef, ProfilingGroupReference } from './codeguruprofiler.generated';
import { CfnProfilingGroup } from './codeguruprofiler.generated';
import type { Grant, IGrantable } from '../../aws-iam';
import type { IResource } from '../../core';
import { ArnFormat, Lazy, Names, Resource, Stack } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * The compute platform of the profiling group.
 */
export enum ComputePlatform {
  /**
   * Use AWS_LAMBDA if your application runs on AWS Lambda.
   */
  AWS_LAMBDA = 'AWSLambda',

  /**
   * Use Default if your application runs on a compute platform that is not AWS Lambda,
   * such an Amazon EC2 instance, an on-premises server, or a different platform.
   */
  DEFAULT = 'Default',
}

/**
 * IResource represents a Profiling Group.
 */
export interface IProfilingGroup extends IResource, IProfilingGroupRef {

  /**
   * The name of the profiling group.
   *
   * @attribute
   */
  readonly profilingGroupName: string;

  /**
   * The ARN of the profiling group.
   *
   * @attribute
   */
  readonly profilingGroupArn: string;

  /**
   * Grant access to publish profiling information to the Profiling Group to the given identity.
   *
   * This will grant the following permissions:
   *
   *  - codeguru-profiler:ConfigureAgent
   *  - codeguru-profiler:PostAgentProfile
   *
   * @param grantee Principal to grant publish rights to
   */
  grantPublish(grantee: IGrantable): Grant;

  /**
   * Grant access to read profiling information from the Profiling Group to the given identity.
   *
   * This will grant the following permissions:
   *
   *  - codeguru-profiler:GetProfile
   *  - codeguru-profiler:DescribeProfilingGroup
   *
   * @param grantee Principal to grant read rights to
   */
  grantRead(grantee: IGrantable): Grant;

}

abstract class ProfilingGroupBase extends Resource implements IProfilingGroup {
  public abstract readonly profilingGroupName: string;

  public abstract readonly profilingGroupArn: string;

  /**
   * Collection of grant methods for a ProfilingGroup
   */
  public readonly grants = ProfilingGroupGrants.fromProfilingGroup(this);

  public get profilingGroupRef(): ProfilingGroupReference {
    return {
      profilingGroupArn: this.profilingGroupArn,
      profilingGroupName: this.profilingGroupName,
    };
  }

  /**
   * Grant access to publish profiling information to the Profiling Group to the given identity.
   *
   * This will grant the following permissions:
   *
   *  - codeguru-profiler:ConfigureAgent
   *  - codeguru-profiler:PostAgentProfile
   *
   *
   * The use of this method is discouraged. Please use `grants.publish()` instead.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee Principal to grant publish rights to
   */
  public grantPublish(grantee: IGrantable) {
    return this.grants.publish(grantee);
  }

  /**
   * Grant access to read profiling information from the Profiling Group to the given identity.
   *
   * This will grant the following permissions:
   *
   *  - codeguru-profiler:GetProfile
   *  - codeguru-profiler:DescribeProfilingGroup
   *
   *
   * The use of this method is discouraged. Please use `grants.read()` instead.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee Principal to grant read rights to
   */
  public grantRead(grantee: IGrantable) {
    return this.grants.read(grantee);
  }
}

/**
 * Properties for creating a new Profiling Group.
 */
export interface ProfilingGroupProps {

  /**
   * A name for the profiling group.
   * @default - automatically generated name.
   */
  readonly profilingGroupName?: string;

  /**
   * The compute platform of the profiling group.
   *
   * @default ComputePlatform.DEFAULT
   */
  readonly computePlatform?: ComputePlatform;

}

/**
 * A new Profiling Group.
 */
@propertyInjectable
export class ProfilingGroup extends ProfilingGroupBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-codeguruprofiler.ProfilingGroup';

  /**
   * Import an existing Profiling Group provided a Profiling Group Name.
   *
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param profilingGroupName Profiling Group Name
   */
  public static fromProfilingGroupName(scope: Construct, id: string, profilingGroupName: string): IProfilingGroup {
    const stack = Stack.of(scope);

    return this.fromProfilingGroupArn(scope, id, stack.formatArn({
      service: 'codeguru-profiler',
      resource: 'profilingGroup',
      resourceName: profilingGroupName,
    }));
  }

  /**
   * Import an existing Profiling Group provided an ARN.
   *
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param profilingGroupArn Profiling Group ARN
   */
  public static fromProfilingGroupArn(scope: Construct, id: string, profilingGroupArn: string): IProfilingGroup {
    class Import extends ProfilingGroupBase {
      public readonly profilingGroupName = Stack.of(scope).splitArn(profilingGroupArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly profilingGroupArn = profilingGroupArn;
    }

    return new Import(scope, id, {
      environmentFromArn: profilingGroupArn,
    });
  }

  private readonly resource: CfnProfilingGroup;

  @memoizedGetter
  public get profilingGroupName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  @memoizedGetter
  public get profilingGroupArn(): string {
    return this.getResourceArnAttribute(this.resource.attrArn, {
      service: 'codeguru-profiler',
      resource: 'profilingGroup',
      resourceName: this.physicalName,
    });
  }

  constructor(scope: Construct, id: string, props: ProfilingGroupProps = {}) {
    super(scope, id, {
      physicalName: props.profilingGroupName ?? Lazy.string({ produce: () => this.generateUniqueId() }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.resource = new CfnProfilingGroup(this, 'ProfilingGroup', {
      profilingGroupName: this.physicalName,
      computePlatform: props.computePlatform,
    });
  }

  private generateUniqueId(): string {
    const name = Names.uniqueId(this);
    if (name.length > 240) {
      return name.substring(0, 120) + name.substring(name.length - 120);
    }
    return name;
  }
}
