export type OnEventHandler = (event: LifecycleEvent) => Promise<LifecycleEvent>;
export type IsCompleteHandler = (event: LifecycleEvent) => Promise<boolean>;

export interface LifecycleEvent {
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

export enum RequestType {
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete'
}
