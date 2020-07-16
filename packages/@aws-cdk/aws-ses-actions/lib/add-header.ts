import * as ses from '@aws-cdk/aws-ses';

/**
 * Construction properties for a add header action.
 */
export interface AddHeaderProps {
  /**
   * The name of the header to add. Must be between 1 and 50 characters,
   * inclusive, and consist of alphanumeric (a-z, A-Z, 0-9) characters
   * and dashes only.
   */
  readonly name: string;

  /**
   * The value of the header to add. Must be less than 2048 characters,
   * and must not contain newline characters ("\r" or "\n").
   */
  readonly value: string;
}

/**
 * Adds a header to the received email
 */
export class AddHeader implements ses.IReceiptRuleAction {
  private readonly name: string;
  private readonly value: string;

  constructor(props: AddHeaderProps) {
    if (!/^[a-zA-Z0-9-]{1,50}$/.test(props.name)) {
      // eslint-disable-next-line max-len
      throw new Error('Header `name` must be between 1 and 50 characters, inclusive, and consist of alphanumeric (a-z, A-Z, 0-9) characters and dashes only.');
    }

    if (!/^[^\n\r]{0,2047}$/.test(props.value)) {
      throw new Error('Header `value` must be less than 2048 characters, and must not contain newline characters ("\r" or "\n").');
    }

    this.name = props.name;
    this.value = props.value;
  }

  public bind(_rule: ses.IReceiptRule): ses.ReceiptRuleActionConfig {
    return {
      addHeaderAction: {
        headerName: this.name,
        headerValue: this.value,
      },
    };
  }
}
