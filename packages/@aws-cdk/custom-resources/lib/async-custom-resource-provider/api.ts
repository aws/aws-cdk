
export interface AsyncResourceHandler {
  begin(event: ResourceEvent): BeginResult;
  complete(event: CompleteResourceEvent): CompleteResult;
}

export interface CompleteResult {
  readonly complete: boolean;
}

export interface BeginResult {
  readonly PhysicalResourceId: string;
  readonly Data?: any;
}

export interface ResourceEvent {
  readonly RequestType: RequestType;
  readonly RequestId: string;
  readonly Data?: any; // attributes
  readonly StackId: string;
  readonly ResponseURL: string;
  readonly ResourceType: string;
  readonly LogicalResourceId: string;
  readonly ResourceProperties: { [key: string]: any };
  readonly PhysicalResourceId?: string;
  readonly ServiceToken: string;
}

export interface CompleteResourceEvent extends ResourceEvent {
  readonly PhysicalResourceId: string;
}

export enum RequestType {
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete'
}
