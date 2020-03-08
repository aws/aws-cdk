
export interface MetadataEntry {
  readonly type: string;
  readonly data: any;
  readonly trace?: string[];
}

export class ConstructMetadata {
  public static readonly DISABLE_STACK_TRACE_IN_METADATA = 'disable-stack-trace';
  public static readonly INFO_METADATA_KEY = 'info';
  public static readonly WARNING_METADATA_KEY = 'warning';
  public static readonly ERROR_METADATA_KEY = 'error';

  private constructor() { }
}