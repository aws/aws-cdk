import { Grant, IGrantable } from '@aws-cdk/aws-iam';
import { Construct, IResource, Lazy, Resource, Stack } from '@aws-cdk/core';
import { CfnProfilingGroup } from './codeguruprofiler.generated';

/**
 * IResource represents a Profiling Group.
 */
export interface IProfilingGroup extends IResource {

  /**
   * A name for the profiling group.
   *
   * @attribute
   */
  readonly profilingGroupName: string;

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
   * Grant access to publish profiling information to the Profiling Group to the given identity.
   *
   * This will grant the following permissions:
   *
   *  - codeguru-profiler:ConfigureAgent
   *  - codeguru-profiler:PostAgentProfile
   *
   * @param grantee Principal to grant publish rights to
   */
  public grantPublish(grantee: IGrantable) {
    // https://docs.aws.amazon.com/codeguru/latest/profiler-ug/security-iam.html#security-iam-access-control
    return Grant.addToPrincipal({
      grantee,
      actions: ['codeguru-profiler:ConfigureAgent', 'codeguru-profiler:PostAgentProfile'],
      resourceArns: [this.profilingGroupArn],
    });
  }

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
  public grantRead(grantee: IGrantable) {
    // https://docs.aws.amazon.com/codeguru/latest/profiler-ug/security-iam.html#security-iam-access-control
    return Grant.addToPrincipal({
      grantee,
      actions: ['codeguru-profiler:GetProfile', 'codeguru-profiler:DescribeProfilingGroup'],
      resourceArns: [this.profilingGroupArn],
    });
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

}

/**
 * A new Profiling Group.
 */
export class ProfilingGroup extends ProfilingGroupBase {

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
      public readonly profilingGroupName = Stack.of(scope).parseArn(profilingGroupArn).resource;
      public readonly profilingGroupArn = profilingGroupArn;
    }

    return new Import(scope, id);
  }

  /**
   * The name of the Profiling Group.
   *
   * @attribute
   */
  public readonly profilingGroupName: string;

  /**
   * The ARN of the Profiling Group.
   *
   * @attribute
   */
  public readonly profilingGroupArn: string;

  constructor(scope: Construct, id: string, props: ProfilingGroupProps = {}) {
    super(scope, id, {
      physicalName: props.profilingGroupName ?? Lazy.stringValue({ produce: () => this.generateUniqueId() }),
    });

    const profilingGroup = new CfnProfilingGroup(this, 'ProfilingGroup', {
      profilingGroupName: this.physicalName,
    });

    this.profilingGroupName = this.getResourceNameAttribute(profilingGroup.ref);

    this.profilingGroupArn = this.getResourceArnAttribute(profilingGroup.attrArn, {
      service: 'codeguru-profiler',
      resource: 'profilingGroup',
      resourceName: this.physicalName,
    });
  }

  private generateUniqueId(): string {
    const name = this.node.uniqueId;
    if (name.length > 240) {
      return name.substring(0, 120) + name.substring(name.length - 120);
    }
    return name;
  }

}
