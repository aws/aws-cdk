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
  Listener,
}
  from '../../lib/index';

export class LatticeTestStack extends core.Stack {

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    const support = new SupportResources(this, 'supportresources');

    // Create a Lattice Service
    // this will default to using IAM Authentication
    const myLatticeService = new Service(this, 'myLatticeService', {
      allowUnauthenticatedAccess: true,
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

    const myListener = new Listener(this, 'myListener', {
      service: myLatticeService,
    });

    myListener.addListenerRule({
      name: 'rule1',
      priority: 10,
      action: [
        {
          targetGroup: new TargetGroup(this, 'lambdatargetsHello', {
            name: 'hellotarget',
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
      allowedPrincipals: [new iam.AnyPrincipal()],
    });

    myListener.addListenerRule({
      name: 'rule2',
      priority: 20,
      action: [
        {
          targetGroup: new TargetGroup(this, 'lambdatargetsGoodbye', {
            name: 'goodbyetarget',
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
      allowedPrincipals: [new iam.AnyPrincipal()],
    });

    /**
     * Create a ServiceNetwork.
     * OPINIONATED DEFAULT: The default behavior is to create a
     * service network that requries an IAM policy, and authenticated access
     * ( requestors must send signed requests )
     */

    const serviceNetwork = new ServiceNetwork(this, 'LatticeServiceNetwork', {
      allowUnauthenticatedAccess: true,
      services: [myLatticeService],
      vpcs: [
        support.vpc1,
        support.vpc2,
      ],
    });

    // eslint-disable-next-line no-console
    console.log(serviceNetwork.authPolicy);

    serviceNetwork.applyAuthPolicyToServiceNetwork();
    //myLatticeService.applyAuthPolicy();
  }
}