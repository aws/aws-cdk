import cdk = require('@aws-cdk/cdk');
import { BaseCluster, BaseClusterProps } from '../base/base-cluster';

// tslint:disable-next-line:no-empty-interface
export interface FargateClusterProps extends BaseClusterProps {
}

export class FargateCluster extends BaseCluster {
  constructor(parent: cdk.Construct, name: string, props: FargateClusterProps) {
    super(parent, name, props);
  }
}
