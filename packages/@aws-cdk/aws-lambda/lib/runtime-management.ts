export enum UpdateRuntimeOn {
  AUTO = 'Auto',
  FUNCTION_UPDATE = 'Function update',
  MANUAL = 'Manual'
}

export interface RuntimeManagement {
  readonly arn?: string;
  readonly mode: UpdateRuntimeOn;
}
