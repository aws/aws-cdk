import { Construct } from '@aws-cdk/core';
import { Cluster } from './cluster';

export interface ServiceAccountOptions {
  readonly name: string
}

export interface ServiceAccountProps extends ServiceAccountOptions {
  readonly cluster: Cluster;
}

export class ServiceAccount extends Construct {

  constructor(scope: Construct, id: string, props: ServiceAccountProps) {
    super(scope, id);

    const { cluster } = props;
    // Ensure OpenIDConnect association
    cluster._enableOpenIDConnectIAMProvider();
    // Add ServiceAccount Kubernetes resource
    /*cluster.addResource('ServiceAccount', {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        annotations: {
          "eks.amazonaws.com/role-arn": serviceAccountRole.roleArn
        }
      }
    });*/

  }
}
