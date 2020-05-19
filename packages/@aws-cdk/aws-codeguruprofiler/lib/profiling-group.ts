import { Construct, Lazy, Stack } from '@aws-cdk/core';
import { CfnProfilingGroup } from './codeguruprofiler.generated';
import { IProfilingGroup, ProfilingGroupBase } from './profiling-group-base';

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

  public static fromProfilingGroupName(scope: Construct, id: string, profilingGroupName: string): IProfilingGroup {
    const stack = Stack.of(scope);

    return this.fromProfilingGroupArn(scope, id, stack.formatArn({
      service: 'codeguru-profiler',
      resource: 'profilingGroup',
      resourceName: profilingGroupName,
    }));
  }

  public static fromProfilingGroupArn(scope: Construct, id: string, profilingGroupArn: string): IProfilingGroup {
    class Import extends ProfilingGroupBase {
      public readonly profilingGroupName = Stack.of(scope).parseArn(profilingGroupArn).resource;
      public readonly profilingGroupArn = profilingGroupArn;
    }

    return new Import(scope, id);
  }

  public readonly profilingGroupName: string;
  public readonly profilingGroupArn: string;

  constructor(scope: Construct, id: string, props: ProfilingGroupProps) {
    super(scope, id, {
      physicalName: props.profilingGroupName || Lazy.stringValue({ produce: () => this.node.uniqueId }),
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

}
