import * as iam from '@aws-cdk/aws-iam';
import { App, Construct, Stack, StackProps } from "@aws-cdk/core";
import * as eks from '../lib';
import * as hello from './hello-k8s';

class FargateTest extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    const cluster = new eks.FargateCluster(this, 'MyCluster', {
      mastersRole
    });

    cluster.addResource('HelloApp', ...hello.resources);

    //
    // bear in mind that since Fargate doesn't yet support NLB/CLB, you will only
    // be able to access this service from within the cluster or through a kubectl proxy:
    //
    // start the proxy:
    //    $ kubectl proxy
    //    Starting to serve on 127.0.0.1:8001
    //
    // and then (in another terminal):
    //    $ curl -L http://localhost:8001/api/v1/namespaces/default/services/hello-kubernetes/proxy
    //    <html>....
    //
  }
}

const app = new App();
new FargateTest(app, 'fargate-integ-test');
app.synth();