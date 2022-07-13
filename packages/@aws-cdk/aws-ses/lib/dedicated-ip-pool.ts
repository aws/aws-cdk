import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDedicatedIpPool } from './ses.generated';

/**
 * A dedicated IP pool
 */
export interface IDedicatedIpPool extends IResource {
  /**
   * The name of the dedicated IP pool
   *
   * @attribute
   */
  readonly dedicatedIpPoolName: string
}

/**
 * Properties for a dedicated IP pool
 */
export interface DedicatedIpPoolProps {
  /**
   * A name for the dedicated IP pool
   *
   * @default - a CloudFormation generated name
   */
  readonly dedicatedIpPoolName?: string;
}

/**
 * A dedicated IP pool
 */
export class DedicatedIpPool extends Resource implements IDedicatedIpPool {
  /**
   * Use an existing dedicated IP pool
   */
  public static fromDedicatedIpPoolName(scope: Construct, id: string, dedicatedIpPoolName: string): IDedicatedIpPool {
    class Import extends Resource implements IDedicatedIpPool {
      public readonly dedicatedIpPoolName = dedicatedIpPoolName;
    }
    return new Import(scope, id);
  }

  public readonly dedicatedIpPoolName: string;

  constructor(scope: Construct, id: string, props: DedicatedIpPoolProps = {}) {
    super(scope, id, {
      physicalName: props.dedicatedIpPoolName,
    });

    const pool = new CfnDedicatedIpPool(this, 'Resource', {
      poolName: this.physicalName,
    });

    this.dedicatedIpPoolName = pool.ref;
  }
}
