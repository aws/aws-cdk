import { Construct } from 'constructs';
import { CfnListenerCertificate } from '../elasticloadbalancingv2.generated';
import { IListenerCertificate } from '../shared/listener-certificate';
import { INetworkListener } from './network-listener';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties for adding a set of certificates to a listener
 */
export interface NetworkListenerCertificateProps {
  /**
   * The listener to attach the rule to
   */
  readonly listener: INetworkListener;

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
export class NetworkListenerCertificate extends CoreConstruct {
  constructor(scope: Construct, id: string, props: NetworkListenerCertificateProps) {
    super(scope, id);

    const certificates = [
      ...(props.certificates || []).map(c => ({ certificateArn: c.certificateArn })),
    ];

    new CfnListenerCertificate(this, 'Resource', {
      listenerArn: props.listener.listenerArn,
      certificates,
    });
  }
}
