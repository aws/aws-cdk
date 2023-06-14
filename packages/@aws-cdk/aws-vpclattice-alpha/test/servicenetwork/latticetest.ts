import * as core from 'aws-cdk-lib';

import {
  aws_iam as iam,
}
  from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { SupportResources } from './support';
import {
  ServiceNetwork,
  Service,
  TargetGroup,
  Target,
  HTTPMethods,
}
  from '../../lib/index';

export class LatticeTestStack extends core.Stack {

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    const support = new SupportResources(this, 'supportresources');

    // Create a Lattice Service
    // this will default to using IAM Authentication
    const myLatticeService = new Service(this, 'myLatticeService', {
      shares: [{
        name: 'LatticeShare',
        allowExternalPrincipals: false,
        accounts: [
          '123456654321',
        ],
      }],
    });

    myLatticeService.node.addDependency(support.vpc1);
    myLatticeService.node.addDependency(support.vpc2);

    // add a listener to the service, using the defaults
    // - HTTPS
    // - Port 443
    // - default action of providing 404 NOT Found,
    // - cloudformation name
    const myListener = myLatticeService.addListener({});

    myListener.addListenerRule({
      name: 'thing',
      priority: 100,
      action: [
        {
          targetGroup: new TargetGroup(this, 'lambdatargets', {
            name: 'lambda1',
            target: Target.lambda([
              support.helloWorld,
            ]),
          }),
        },
      ],
      // the conditions for the match are effectively AND'ed together
      httpMatch: {
        pathMatches: { path: '/hello' },
        method: HTTPMethods.GET,
      },
      allowedPrincipals: [support.checkHelloWorld.role as iam.Role],
    });

    myLatticeService.applyAuthPolicy();

    /**
     * Create a ServiceNetwork.
     * OPINIONATED DEFAULT: The default behavior is to create a
     * service network that requries an IAM policy, and authenticated access
     * ( requestors must send signed requests )
     */

    const serviceNetwork = new ServiceNetwork(this, 'LatticeServiceNetwork', {
      services: [myLatticeService],
      vpcs: [
        support.vpc1,
        support.vpc2,
      ],
    });

    serviceNetwork.applyAuthPolicyToServiceNetwork();
  }
}
