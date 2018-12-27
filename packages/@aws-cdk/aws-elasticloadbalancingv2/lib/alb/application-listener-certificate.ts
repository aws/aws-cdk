import cdk = require('@aws-cdk/cdk');
import { CfnListenerCertificate } from '../elasticloadbalancingv2.generated';
import { IApplicationListener } from './application-listener';

/**
 * Properties for adding a set of certificates to a listener
 */
export interface ApplicationListenerCertificateProps {
  /**
   * The listener to attach the rule to
   */
  listener: IApplicationListener;

  /**
   * ARNs of certificates to attach
   *
   * Duplicates are not allowed.
   */
  certificateArns: string[];
}

/**
 * Add certificates to a listener
 */
export class ApplicationListenerCertificate extends cdk.Construct implements cdk.IDependable {
  /**
   * The elements of this resou rce to add ordering dependencies on
   */
  public readonly dependencyElements: cdk.IDependable[] = [];

  constructor(scope: cdk.Construct, scid: string, props: ApplicationListenerCertificateProps) {
    super(scope, scid);

    const resource = new CfnListenerCertificate(this, 'Resource', {
      listenerArn: props.listener.listenerArn,
      certificates: props.certificateArns.map(certificateArn => ({ certificateArn })),
    });

    this.dependencyElements.push(resource);
  }
}
