import { Construct } from 'constructs';
import { CfnListenerCertificate } from '../elasticloadbalancingv2.generated';
import { IListenerCertificate } from '../shared/listener-certificate';
import { IApplicationListener } from './application-listener';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties for adding a set of certificates to a listener
 */
export interface ApplicationListenerCertificateProps {
  /**
   * The listener to attach the rule to
   */
  readonly listener: IApplicationListener;

  /**
   * ARNs of certificates to attach
   *
   * Duplicates are not allowed.
   *
   * @deprecated Use `certificates` instead.
   * @default - One of 'certificates' and 'certificateArns' is required.
   */
  readonly certificateArns?: string[];

  /**
   * Certificates to attach
   *
   * Duplicates are not allowed.
   *
   * @default - One of 'certificates' and 'certificateArns' is required.
   */
  readonly certificates?: IListenerCertificate[];
}

/**
 * Add certificates to a listener
 */
export class ApplicationListenerCertificate extends CoreConstruct {
  constructor(scope: Construct, id: string, props: ApplicationListenerCertificateProps) {
    super(scope, id);

    if (!props.certificateArns && !props.certificates) {
      throw new Error('At least one of \'certificateArns\' or \'certificates\' is required');
    }

    const certificates = [
      ...(props.certificates || []).map(c => ({ certificateArn: c.certificateArn })),
      ...(props.certificateArns || []).map(certificateArn => ({ certificateArn })),
    ];

    new CfnListenerCertificate(this, 'Resource', {
      listenerArn: props.listener.listenerArn,
      certificates,
    });
  }
}
