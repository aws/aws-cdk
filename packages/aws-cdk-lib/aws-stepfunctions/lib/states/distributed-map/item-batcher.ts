/**
 * Interface for ItemBatcher configuration properties
 */
export interface ItemBatcherProps {
  /**
   * MaxItemsPerBatch
   *
   * Specifies the maximum number of items that each child workflow execution processes, as static number
   *
   * @default - uses value of `maxItemsPerBatchPath` as the max items per batch,
   *   no limits on the number of items in a batch under the 256KB limit if that property was also not provided
   */
  readonly maxItemsPerBatch?: number;

  /**
   * MaxItemsPerBatchPath
   *
   * Specifies the maximum number of items that each child workflow execution processes, as JsonPath
   *
   * @default - uses value of `maxItemsPerBatch` as the max items per batch,
   *   no limits on the number of items in a batch under the 256KB limit if that property was also not provided
   */
  readonly maxItemsPerBatchPath?: string;

  /**
   * MaxInputBytesPerBatch
   *
   * Specifies the maximum number of bytes that each child workflow execution processes, as static number
   *
   * @default - uses value of `maxInputBytesPerBatchPath` as the max size per batch,
   *   no limits on the batch size under the 256KB limit if that property was also not provided
   */
  readonly maxInputBytesPerBatch?: number;

  /**
   * MaxInputBytesPerBatchPath
   *
   * Specifies the maximum number of bytes that each child workflow execution processes, as JsonPath
   *
   * @default - uses value of `maxInputBytesPerBatch` as the max size per batch,
   *   no limits on the batch size under the 256KB limit if that property was also not provided
   */
  readonly maxInputBytesPerBatchPath?: string;

  /**
   * BatchInput
   *
   * Fixed JSON input to include in each batch passed to each child workflow execution
   *
   * @default - No batchInput
   */
  readonly batchInput?: object;
}

/**
 * Configuration for processing a group of items in a single child workflow execution
 */
export class ItemBatcher {
  private props: ItemBatcherProps;

  constructor(props: ItemBatcherProps) {
    this.props = props;
  }

  /**
   * Render ItemBatcher in ASL JSON format
   */
  public render(): any {
    return {
      ...(this.props.maxItemsPerBatch && { MaxItemsPerBatch: this.props.maxItemsPerBatch }),
      ...(this.props.maxItemsPerBatchPath && { MaxItemsPerBatchPath: this.props.maxItemsPerBatchPath }),
      ...(this.props.maxInputBytesPerBatch && { MaxInputBytesPerBatch: this.props.maxInputBytesPerBatch }),
      ...(this.props.maxInputBytesPerBatchPath && { MaxInputBytesPerBatchPath: this.props.maxInputBytesPerBatchPath }),
      ...(this.props.batchInput && { BatchInput: this.props.batchInput }),
    };
  }

  /**
   * Validate this ItemBatcher
   */
  public validateItemBatcher(): string[] {
    const errors: string[] = [];
    if (this.props.maxItemsPerBatch && this.props.maxItemsPerBatchPath) {
      errors.push('Provide either `maxItemsPerBatch` or `maxItemsPerBatchPath`, but not both');
    }

    if (this.props.maxInputBytesPerBatch && this.props.maxInputBytesPerBatchPath) {
      errors.push('Provide either `maxInputBytesPerBatch` or `maxInputBytesPerBatchPath`, but not both');
    }

    if (
      !this.props.maxItemsPerBatch &&
      !this.props.maxItemsPerBatchPath &&
      !this.props.maxInputBytesPerBatch &&
      !this.props.maxInputBytesPerBatchPath &&
      !this.props.batchInput) {
      errors.push('Provide at least one value to the ItemBatcher');
    }

    return errors;
  }
}
