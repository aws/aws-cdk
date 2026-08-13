import { Construct } from 'constructs';
import type { aws_elasticloadbalancingv2 as elbv2 } from '../../../interfaces';
import { CfnListenerCertificate } from '../elasticloadbalancingv2.generated';
import type { IListenerCertificate } from '../shared/listener-certificate';

/**
 * Properties for adding a set of certificates to a listener
 */
export interface NetworkListenerCertificateProps {
  /**
   * The listener to attach the rule to
   */
  readonly listener: elbv2.IListenerRef;

  /**
   * Certificates to attach
   *
   * Duplicates are not allowed.
   */
  readonly certificates: IListenerCertificate[];
}

/**
 * Add certificates to a listener
 */
export class NetworkListenerCertificate extends Construct {
  constructor(scope: Construct, id: string, props: NetworkListenerCertificateProps) {
    super(scope, id);

    const certificates = [
      ...(props.certificates || []).map(c => ({ certificateArn: c.certificateArn })),
    ];

    new CfnListenerCertificate(this, 'Resource', {
      listenerArn: props.listener.listenerRef.listenerArn,
      certificates,
    });
  }
}
