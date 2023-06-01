import * as core from 'aws-cdk-lib';

import {
  aws_vpclattice,
  aws_iam as iam,
}
  from 'aws-cdk-lib';

import { Construct } from 'constructs';
import {
  FixedResponse,
  PathMatchType,
  PathMatch,
  HeaderMatch,
  WeightedTargetGroup,
  Protocol,
  HTTPMethods,
  MatchOperator,
} from './index';

interface IHttpMatchProperty {
  /**
   * The header matches. Matches incoming requests with rule based on request header value before applying rule action.
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-httpmatch.html#cfn-vpclattice-rule-httpmatch-headermatches
   */
  headerMatches?: Array<aws_vpclattice.CfnRule.HeaderMatchProperty | core.IResolvable> | core.IResolvable;
  /**
   * The HTTP method type.
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-httpmatch.html#cfn-vpclattice-rule-httpmatch-method
   */
  method?: string;
  /**
   * The path match.
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-httpmatch.html#cfn-vpclattice-rule-httpmatch-pathmatch
   */
  pathMatch?: aws_vpclattice.CfnRule.PathMatchProperty | core.IResolvable;
}

/**
 * Props for AddListener
 */
export interface AddListenerProps {
  /**
   *  The default action that will be taken if no rules match.
   * @default The default action will be to return 404 not found
  */
  readonly defaultAction?: aws_vpclattice.CfnListener.DefaultActionProperty | undefined;

  /**
  * protocol that the listener will listen on
  * @default HTTPS
  * @see vpclattice.Protocol
  */
  readonly protocol?: Protocol | undefined;

  /**
  * Optional port number for the listener. If not supplied, will default to 80 or 443, depending on the Protocol
  * @default 80 or 443 depending on the Protocol
  */
  readonly port?: number | undefined;

  /**
  * The Id of the service that this will be added to.
  */
  readonly name: string;

}


/**
 * Propertys to Create a Lattice Listener
 */
export interface ListenerProps {
  /**
   *  * A default action that will be taken if no rules match.
   *  @default 404 NOT Found
  */
  readonly defaultAction?: aws_vpclattice.CfnListener.DefaultActionProperty | undefined;
  /**
  * protocol that the listener will listen on
  */
  readonly protocol: Protocol
  /**
  * Optional port number for the listener. If not supplied, will default to 80 or 443, depending on the Protocol
  * @default 80 or 443 depending on the Protocol

  */
  readonly port?: number | undefined
  /**
  * The Id of the service that this will be added to.
  */
  readonly name: string;
  /**
   * The service
   */
  readonly serviceId: string;
  /**
   * the authpolicy for the service this listener is associated with
   * @default none.
   */
  readonly serviceAuthPolicy?: iam.PolicyDocument | undefined
}

/**
 * Create a vpcLattice service.
 * Implemented by `Service`.
 */
export interface IListener extends core.IResource {
  /**
  * The Amazon Resource Name (ARN) of the service.
  */
  readonly listenerArn: string;
  /**
  * The Id of the Service Network
  */
  readonly listenerId: string;

  /**
   * Add A Listener Rule to the Listener
   */
  addListenerRule(props: AddRuleProps): void;

}


/**
 * Properties to add rules to to a listener
 * One of headerMatch, PathMatch, or methodMatch can be supplied,
 * the Rule can not match multiple Types
 */
export interface AddRuleProps {
  /**
  * A name for the the Rule
  */
  readonly name: string
  /**
  * the action for the rule, is either a fixed Reponse, or a being sent to  Weighted TargetGroup
  */

  readonly action: FixedResponse | WeightedTargetGroup[]
  /**
  * the priority of this rule, a lower priority will be processed first
  */

  readonly priority: number
  /** Properties for a header match
  * A header match can search for multiple headers
  * @default none
  */
  readonly headerMatchs?: HeaderMatch[] | undefined
  /**
  * Properties for a Path Match
  * @default none
  */
  readonly pathMatch?: PathMatch | undefined

  /**
  * Properties for a method Match
  * @default none
  */
  readonly methodMatch?: HTTPMethods | undefined

  /**
   * AuthPolicy for rule
   * @default none
  */
  readonly allowedPrincipals?: iam.IPrincipal[] | undefined;

}


/**
 *  This class should not be called directly.
 *   Preference is to use the .addListener() Method on an instance of LatticeService
 *  Creates a vpcLattice Listener
 */
export class Listener extends core.Resource implements IListener {
  /**
   *  The Id of the Listener
   */
  readonly listenerId: string;
  /**
   * THe Arn of the Listener
   */
  readonly listenerArn: string;
  /**
   * A list of prioritys, to check for duplicates
   */
  listenerPrioritys: number[] = []
  /**
   * The Id of the service this listener is attached to
   */
  readonly serviceId: string;
  /**
   * Service auth Policy
   * @default none.
   */
  readonly serviceAuthPolicy?: iam.PolicyDocument | undefined;


  constructor(scope: Construct, id: string, props: ListenerProps) {
    super(scope, id);

    let defaultAction: aws_vpclattice.CfnListener.DefaultActionProperty = {};
    // the default action is a not provided, it will be set to NOT_FOUND
    if (props.defaultAction === undefined) {
      defaultAction = {
        fixedResponse: {
          statusCode: FixedResponse.NOT_FOUND,
        },
      };
    }

    const listener = new aws_vpclattice.CfnListener(this, 'Resource', {
      name: props.name,
      defaultAction: defaultAction,
      protocol: props.protocol,
      port: props.port,
      serviceIdentifier: props.serviceId,
    });

    this.listenerId = listener.attrId;
    this.listenerArn = listener.attrArn;
    this.serviceId = props.serviceId;

  }

  /**
   * add a rule to the listener
   * @param props AddRuleProps
   */
  public addListenerRule(props: AddRuleProps): void {

    // conditionaly build a policy statement if principals where provided
    let policyStatement: iam.PolicyStatement = new iam.PolicyStatement();

    // add principals
    if (props.allowedPrincipals) {
      // add the principals
      props.allowedPrincipals.forEach((principal) => {
        principal.addToPrincipalPolicy(policyStatement);
      });
      // add the action for the statement
      policyStatement.addActions('vpc-lattice-svcs:Invoke');
    }

    /**
    * Create the Action for the Rule
    */
    let action: aws_vpclattice.CfnRule.ActionProperty;

    // if the rule has a fixed response
    if (typeof (props.action) === 'number') {
      action = {
        fixedResponse: {
          statusCode: props.action,
        },
      };
    } else { // this is a forwarding action

      let targetGroups: aws_vpclattice.CfnRule.WeightedTargetGroupProperty[] = [];

      // loop through the action to build a set of target groups
      props.action.forEach((targetGroup) => {
        targetGroups.push({
          targetGroupIdentifier: targetGroup.targetGroup.targetGroupId,
          // if the targetGroup is no specified set sensible default of 100
          // this is an opinionated choice.
          weight: targetGroup.weight ?? 100,
        });
      });

      action = {
        forward: {
          targetGroups: targetGroups,
        },
      };
    }

    /**
    * Validate the priority and set it in teh rule
    */
    if (props.priority in this.listenerPrioritys) {
      throw new Error('Priority is already in use');
    }
    this.listenerPrioritys.push(props.priority);

    // process the matching type
    let match: IHttpMatchProperty = {};
    // fail if at least one method is not selected
    if (!(props.methodMatch || props.pathMatch || props.headerMatchs)) {
      throw new Error('At least one of PathMatch, headerMatch, or MethodMatch must be set');
    }

    // method match
    if (props.methodMatch) {
      match.method = props.methodMatch;
      policyStatement.addCondition('StringEquals', { 'vpc-lattice-svcs:RequestMethod': props.methodMatch });
    }

    // path match
    if (props.pathMatch) {

      const pathMatchType = props.pathMatch.pathMatchType ?? PathMatchType.EXACT;

      if (pathMatchType === PathMatchType.EXACT) {
        match.pathMatch = {
          match: {
            exact: props.pathMatch.path,
          },
          caseSensitive: props.pathMatch.caseSensitive ?? false,
        };
        const arn = `arn:${core.Aws.PARTITION}:vpc-lattice:${core.Aws.REGION}:${core.Aws.ACCOUNT_ID}:service/${this.serviceId}`;
        policyStatement.addResources(arn + props.pathMatch.path);
      };

      if (pathMatchType === PathMatchType.PREFIX) {
        match.pathMatch = {
          match: {
            prefix: props.pathMatch.path,
          },
          caseSensitive: props.pathMatch.caseSensitive ?? false,
        };
        const arn = `arn:${core.Aws.PARTITION}:vpc-lattice:${core.Aws.REGION}:${core.Aws.ACCOUNT_ID}:service/${this.serviceId}`;
        policyStatement.addResources(arn + props.pathMatch.path + '*');
      }
    }

    // header Match
    if (props.headerMatchs) {

      let headerMatches: aws_vpclattice.CfnRule.HeaderMatchProperty[] = [];

      props.headerMatchs.forEach((headerMatch) => {

        if (headerMatch.matchOperator === MatchOperator.EXACT) {
          headerMatches.push({
            name: headerMatch.headername,
            match: {
              exact: headerMatch.matchValue,
            },
            caseSensitive: headerMatch.caseSensitive ?? false,
          });
          policyStatement.addCondition('StringEquals', { [`vpc-lattice-svcs:RequestHeader/${headerMatch.headername}`]: headerMatch.matchValue } );
        } else if (headerMatch.matchOperator === MatchOperator.CONTAINS) {
          headerMatches.push({
            name: headerMatch.headername,
            match: {
              contains: headerMatch.matchValue,
            },
            caseSensitive: headerMatch.caseSensitive ?? false,
          });
          policyStatement.addCondition('StringEquals', { [`vpc-lattice-svcs:RequestHeader/${headerMatch.headername}`]: `*${headerMatch.matchValue}*` });

        } else if (headerMatch.matchOperator === MatchOperator.PREFIX) {
          headerMatches.push({
            name: headerMatch.headername,
            match: {
              prefix: headerMatch.matchValue,
            },
            caseSensitive: headerMatch.caseSensitive ?? false,
          });
          policyStatement.addCondition('StringEquals', { [`vpc-lattice-svcs:RequestHeader/${headerMatch.headername}`]: `${headerMatch.matchValue}*` });
        }
      });
      match.headerMatches = headerMatches;
    };

    // only add the policy statement if there are principals
    if (props.allowedPrincipals && this.serviceAuthPolicy) {
      this.serviceAuthPolicy.addStatements(policyStatement);
    }


    // finally create a rule
    new aws_vpclattice.CfnRule(this, `${props.name}-Rule`, {
      action: action,
      match: {
        httpMatch: {
          pathMatch: {
            match: {
              exact: 'exact',
              prefix: '/',
            },
            caseSensitive: false,
          },
        },
      },
      // match: match as aws_vpclattice.CfnRule.MatchProperty,
      priority: props.priority,
      listenerIdentifier: this.listenerId,
      serviceIdentifier: this.serviceId,
    });

  }
}