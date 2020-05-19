import { Grant, IGrantable } from '@aws-cdk/aws-iam';
import { IResource, Resource } from '@aws-cdk/core';

export interface IProfilingGroup extends IResource {

  /**
   * A name for the profiling group.
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
  grantPublish(grantee: IGrantable): void;

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
  grantRead(grantee: IGrantable): void;

}

export abstract class ProfilingGroupBase extends Resource implements IProfilingGroup {

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
