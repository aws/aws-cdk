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
  RuleAccessMode,
  ServiceNetworkAccessMode,
}
  from '../../lib/index';

export class LatticeTestStack extends core.Stack {

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    const support = new SupportResources(this, 'supportresources');

    // Create a Lattice Service
    // this will default to using IAM Authentication
    const myLatticeService = new Service(this, 'myLatticeService', {
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
      accessMode: RuleAccessMode.AUTHENTICATED_ONLY,
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
      accessMode: RuleAccessMode.UNAUTHENTICATED,

    });

    myListener.addListenerRule({
      name: 'rule3',
      priority: 30,
      action: [
        {
          targetGroup: new TargetGroup(this, 'lambdatargetsGoodbye3', {
            name: 'goodbyetarget3',
            target: Target.lambda([
              support.helloWorld,
            ]),
          }),
        },
      ],
      // the conditions for the match are effectively AND'ed together
      httpMatch: {
        pathMatches: { path: '/toys' },
        method: HTTPMethods.GET,
      },
      accessMode: RuleAccessMode.NO_STATEMENT,

    });

    /**
     * Create a ServiceNetwork.
     * OPINIONATED DEFAULT: The default behavior is to create a
     * service network that requries an IAM policy, and authenticated access
     * ( requestors must send signed requests )
     */

    const serviceNetwork = new ServiceNetwork(this, 'LatticeServiceNetwork', {
      accessmode: ServiceNetworkAccessMode.UNAUTHENTICATED,
      services: [myLatticeService],
      vpcs: [
        support.vpc1,
        support.vpc2,
      ],
    });

    // eslint-disable-next-line no-console
    console.log('****ServicePolicy*************');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(myLatticeService.authPolicy));

    serviceNetwork.applyAuthPolicyToServiceNetwork();
    myLatticeService.applyAuthPolicy();
  }
}