import cdk = require('@aws-cdk/cdk');
import { CfnReceiptFilter } from './ses.generated';

/**
 * The policy for the receipt filter.
 */
export enum ReceiptFilterPolicy {
  /**
   * Allow the ip address or range.
   */
  Allow = 'Allow',

  /**
   * Block the ip address or range.
   */
  Block = 'Block'
}

/**
 * Construction properties for a ReceiptFilter.
 */
export interface ReceiptFilterProps {
  /**
   * The name for the receipt filter.
   *
   * @default a CloudFormation generated name
   */
  name?: string;

  /**
   * The ip address or range to filter.
   *
   * @default 0.0.0.0/0
   */
  ip?: string;

  /**
   * The policy for the filter.
   *
   * @default Block
   */
  policy?: ReceiptFilterPolicy;
}

/**
 * A receipt filter. When instantiated without props, it creates a
 * block all receipt filter.
 */
export class ReceiptFilter extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props?: ReceiptFilterProps) {
    super(scope, id);

    new CfnReceiptFilter(this, 'Resource', {
      filter: {
        ipFilter: {
          cidr: (props && props.ip) || '0.0.0.0/0',
          policy: (props && props.policy) || ReceiptFilterPolicy.Block
        },
        name: props ? props.name : undefined
      }
    });
  }
}

/**
 * Construction properties for a WhiteListReceiptFilter.
 */
export interface WhiteListReceiptFilterProps {
  /**
   * A list of ip addresses or ranges to white list.
   */
  ips: string[];
}

/**
 * A white list receipt filter.
 */
export class WhiteListReceiptFilter extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: WhiteListReceiptFilterProps) {
    super(scope, id);

    new ReceiptFilter(this, 'BlockAll');

    props.ips.forEach(ip => {
      new ReceiptFilter(this, `Allow${ip.replace(/[^\d]/g, '')}`, {
        ip,
        policy: ReceiptFilterPolicy.Allow
      });
    });
  }
}
