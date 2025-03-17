import { Construct } from 'constructs';
import { UnscopedValidationError } from '../../core';

/**
 * Creates a field index policy for CloudWatch Logs log groups.
 */
export class FieldIndexPolicy {
  private readonly fieldIndexPolicyProps: FieldIndexPolicyProps;

  constructor(props: FieldIndexPolicyProps) {
    if (props.fields.length > 20) {
      throw new UnscopedValidationError('A maximum of 20 fields can be indexed per log group');
    }
    this.fieldIndexPolicyProps = props;
  }

  /**
   * @internal
   */
  public _bind(_scope: Construct) {
    return { Fields: this.fieldIndexPolicyProps.fields };
  }
}

/**
 * Properties for creating field index policies
 */
export interface FieldIndexPolicyProps {
  /**
   * List of fields to index in log events.
   *
   * @default no fields
   */
  readonly fields: string[];
}
