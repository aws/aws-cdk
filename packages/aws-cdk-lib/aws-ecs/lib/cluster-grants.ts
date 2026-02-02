/* eslint-disable eol-last */
import type * as ecs from './ecs.generated';
import type { IGrantable } from '../../aws-iam';
import { Grant } from '../../aws-iam';
import { ArnFormat, Stack } from '../../core';

/**
 * Properties for ClusterGrants
 */
interface ClusterGrantsProps {
  /**
   * The resource on which actions will be allowed
   */
  readonly resource: ecs.IClusterRef;
}

/**
 * Collection of grant methods for a IClusterRef
 */
export class ClusterGrants {
  /**
   * Creates grants for ClusterGrants
   */
  public static fromCluster(resource: ecs.IClusterRef): ClusterGrants {
    return new ClusterGrants({
      resource: resource,
    });
  }

  protected readonly resource: ecs.IClusterRef;

  private constructor(props: ClusterGrantsProps) {
    this.resource = props.resource;
  }

  /**
   * Grants an ECS Task Protection API permission to the specified grantee.
   * This method provides a streamlined way to assign the 'ecs:UpdateTaskProtection'
   * permission, enabling the grantee to manage task protection in the ECS cluster.
   */
  public taskProtection(grantee: IGrantable): Grant {
    const actions = ['ecs:UpdateTaskProtection'];
    return Grant.addToPrincipal({
      actions: actions,
      grantee: grantee,
      resourceArns: [this.arnForTasks('*')],
    });
  }

  /**
   * Returns an ARN that represents all tasks within the cluster that match
   * the task pattern specified. To represent all tasks, specify ``"*"``.
   *
   * @param keyPattern Task id pattern
   */
  private arnForTasks(keyPattern: string): string {
    return Stack.of(this.resource).formatArn({
      service: 'ecs',
      resource: 'task',
      resourceName: `${this.resource.clusterRef.clusterName}/${keyPattern}`,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }
}