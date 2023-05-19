import {
  aws_vpclattice as vpclattice,
}
  from 'aws-cdk-lib';
import * as core from 'aws-cdk-lib';
import * as constructs from 'constructs';

import { serviceNetworkArnComponents } from './private/service-network-common';
/**
 * an authentication type for the service network
 */
export enum AuthType {
  /**
  * The resource does not use an IAM policy
  */
  NONE = 'NONE',

  /**
  * The resource uses an IAM policy. When this type is used, auth is enabled and an auth policy is required.
  */
  AWS_IAM = 'AWS_IAM',
}

/**
 * Create a vpc lattice service network.
 * Implemented by `ServiceNetwork` via `ServiceNetworkBase`.
 */
export interface IServiceNetwork extends core.IResource {

  /**
  * The Amazon Resource Name (ARN) of the service network.
  * @attribute
  */
  readonly serviceNetworkArn: string;
}

/**
 * A new or imported vpclattice ServiceNetwork.
 */
abstract class ServiceNetworkBase extends core.Resource implements IServiceNetwork {
  public abstract readonly serviceNetworkArn: string;
}
/**
 * Properties for a Service Network
 */
export interface ServiceNetworkProps {
  /**
  * The physical name of the service network.
  * If you don't provide one, CloudFormation will generate one for you.
  *
  * @default - CloudFormation-generated name
  */
  readonly name?: string

  /**
  * The type of IAM Policy.
  * @default NONE
  */
  readonly authType?: AuthType
}

/**
 * A VPC Lattice Service Network
 */
export class ServiceNetwork extends ServiceNetworkBase {
  /**
  * Import an existing ServiceNetwork from properties.
  *
  */
  public static fromServiceNetworkName(scope: constructs.Construct, id: string, serviceNetworkName: string): IServiceNetwork {
    class Import extends ServiceNetworkBase {
      public readonly serviceNetworkName = serviceNetworkName;
      public readonly serviceNetworkArn = core.Stack.of(scope)
        .formatArn(serviceNetworkArnComponents(serviceNetworkName))
    }
    return new Import(scope, id);
  }

  /*
  * The Arn of the Service Network
  */
  public readonly serviceNetworkArn: string;

  /**
   *  The Id of the service network
  */
  public readonly serviceNetworkId: string;

  constructor(scope: constructs.Construct, id: string, props: ServiceNetworkProps = {}) {
    super(scope, id);

    // validate the name
    if ( props.name !== undefined &&
      !core.Token.isUnresolved(props.name) &&
      !/(?!-)[a-z0-9-]+(?<!-)$/.test(props.name) ) {
      throw new Error('serviceNetworkName must be non-empty and contain only lower case letters and underscores, ' +
        ' or be an unresolved Token ' +
        `got: '${props.name}'`);
    }


    // The 'main' L1 you create should always have the logical ID 'Resource'.
    // This is important, so that the ConstructNode.defaultChild method works correctly.

    const serviceNetwork = new vpclattice.CfnServiceNetwork(this, 'Resource', {
      authType: props.authType ?? AuthType.NONE,
      name: props.name,
    });

    this.serviceNetworkId = serviceNetwork.attrId;
    this.serviceNetworkArn = serviceNetwork.attrArn;
  }
}