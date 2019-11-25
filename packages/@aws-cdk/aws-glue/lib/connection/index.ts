import { Construct, IResource, Resource, Aws } from '@aws-cdk/core';
import { IConnectionInput } from './connection-input'
import { CfnConnection } from './glue.generated';

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
    super(scope, id, {
      physicalName: '',
    });

    this.catalogId = props.catalogId || Aws.ACCOUNT_ID;
    this.connectionInput = props.connectionInput;

    const connectionResource = new CfnConnection(this, 'Connection', {
      catalogId: this.catalogId,
      connectionInput: this.connectionInput
    })

    this.connectionName = this.getResourceNameAttribute(connectionResource.ref);
  }
}
