import { Construct, IResource, Resource, Aws } from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import { IConnectionInput } from './connection-input'
import { CfnConnection } from './glue.generated';

export enum ConnectionInputTypes {
  /**
   * The type of the connection. Currently, only JDBC is supported; SFTP is not supported.
   */
  JDBC = 'JDBC',
}


export interface IPhysicalRequirements {
  /**
   * @attribute
   */
  readonly availabilityZone?: string;

  /**
   * @attribute
   */
  readonly securityGroupIds?: ec2.ISecurityGroup[];

  /**
   * @attribute
   */
  readonly subnet?: ec2.ISubnet;
}

export interface IConnectionInput {
  /**
   * @attribute
   */
  readonly properties: object;

  /**
   * @attribute
   */
  readonly type: ConnectionInputTypes;

  /**
   * @attribute
   */
  readonly description?: string;

  /**
   * @attribute
   */
  readonly matchCriteria?: string[];

  /**
   * @attribute
   */
  readonly name?: string;

  /**
   * @attribute
   */
  readonly physicalRequirements?: IPhysicalRequirements;
}

export interface IConnection extends IResource {
  /**
   * @attribute
   */
  readonly catalogId: string;

  /**
   * @attribute
   */
  readonly connectionInput: IConnectionInput;

  /**
   * @attribute
   */
  readonly connectionName: string;
}


export interface ConnectionAttributes {
  readonly catalogId: string;
  readonly connectionInput: IConnectionInput;
  readonly connectionName: string;
}


export interface ConnectionProps {
  readonly catalogId?: string;
  readonly connectionInput: IConnectionInput;
}

export class Connection extends Resource implements IConnection {
  /**
   * The ID of the data catalog to create the catalog object in.
   * Currently, this should be the AWS account ID.
   * 
   * Note
   * 
   * To specify the account ID, you can use the Ref intrinsic
   * function with the AWS::AccountId pseudo parameter.
   * For example: !Ref AWS::AccountId.
   */
  public readonly catalogId: string;

  /**
   * The connection that you want to create.
   */
  public readonly connectionInput: IConnectionInput;

  /**
   * The connection name
   */
  public readonly connectionName: string;

  constructor(scope: Construct, id: string, props: ConnectionProps) {
    super(scope, id);

    this.catalogId = props.catalogId || Aws.ACCOUNT_ID;
    this.connectionInput = props.connectionInput;

    const connectionResource = new CfnConnection(this, 'Connection', {
      catalogId: this.catalogId,
      connectionInput: this.connectionInput
    })

    this.connectionName = this.getResourceNameAttribute(connectionResource.ref);

    this.node.defaultChild = connectionResource;
  }
}
