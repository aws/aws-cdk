import { Grant, IGrantable } from '@aws-cdk/aws-iam';
import { Construct, Resource } from '@aws-cdk/core';
import { CfnProfilingGroup } from './codeguruprofiler.generated';

/**
 * Properties for creating a new Profiling Group.
 */
export interface ProfilingGroupProps {

  /**
   * A name for the profiling group.
   */
  readonly profilingGroupName: string;

}

/**
 * A new Profiling Group.
 */
export class ProfilingGroup extends Resource {

  /**
   * The name of this ProfilingGroup
   */
  public readonly profilingGroupName: string;

  /**
   * The ARN of this ProfilingGroup
   */
  public readonly profilingGroupArn: string;

  constructor(scope: Construct, id: string, props: ProfilingGroupProps) {
    super(scope, id, {
      physicalName: props.profilingGroupName,
    });

    const profilingGroup = new CfnProfilingGroup(this, 'ProfilingGroup', {
      profilingGroupName: props.profilingGroupName,
    });

    this.profilingGroupName = this.getResourceNameAttribute(profilingGroup.ref);

    this.profilingGroupArn = this.getResourceArnAttribute(profilingGroup.attrArn, {
      service: 'codeguruprofiler',
      resource: this.physicalName,
    });
  }

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
