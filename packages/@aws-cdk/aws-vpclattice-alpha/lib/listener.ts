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
  WeightedTargetGroup,
  Protocol,
  MatchOperator,
  HTTPMatch,
  IService,
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
  * @default HTTPS
  */
  readonly protocol?: Protocol | undefined;
  /**
  * Optional port number for the listener. If not supplied, will default to 80 or 443, depending on the Protocol
  * @default 80 or 443 depending on the Protocol

  */
  readonly port?: number | undefined
  /**
  * The Name of the service.
  * @default CloudFormation provided name.
  */
  readonly name?: string;
  /**
   * The Id of the service that this listener is associated with.
   */
  readonly service: IService;
}

/**
 * Create a vpcLattice Listener.
 * Implemented by `Listener`.
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
  * @default 50
  */
  readonly priority?: number
  /**
  * the Matching criteria for the rule. This must contain at least one of
  * header, method or patchMatches
  */
  readonly httpMatch: HTTPMatch
  /**
   * AuthPolicy for rule
   * @default none
  */
  readonly allowedPrincipals?: iam.IPrincipal[] | undefined;

}

/**
 *  This class should not be called directly.
 *  Use the .addListener() Method on an instance of LatticeService
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
   * The service this listener is attached to
   */
  readonly service: IService;
  /**
   * Service auth Policy
   * @default none.
   */
  readonly serviceAuthPolicy?: iam.PolicyDocument | undefined;

  constructor(scope: Construct, id: string, props: ListenerProps) {
    super(scope, id);

    // the default action is a not provided, it will be set to NOT_FOUND
    let defaultAction: aws_vpclattice.CfnListener.DefaultActionProperty = props.defaultAction ?? {
      fixedResponse: {
        statusCode: FixedResponse.NOT_FOUND,
      },
    };

    // default to using HTTPS
    let protocol = props.protocol ?? Protocol.HTTPS;

    // check the the port is in range if it is specificed
    if (props.port) {
      if (props.port < 0 || props.port > 65535) {
        throw new Error('Port out of range');
      }
    }

    // if its not specified, set it to the default port based on the protcol
    let port: number;
    if (protocol === Protocol.HTTP) {
      port = props.port ?? 80;
    } else if ( protocol === Protocol.HTTPS) {
      port = props.port ?? 443;
    } else {
      throw new Error('Protocol not supported');
    }

    if (props.name !== undefined) {
      if (props.name.match(/^[a-z0-9\-]{3,63}$/) === null) {
        throw new Error('The listener name must be between 3 and 63 characters long. The name can only contain  lower case alphanumeric characters and hyphens. The name must be unique to the account.');
      }
    }

    const listener = new aws_vpclattice.CfnListener(this, 'Resource', {
      name: props.name,
      defaultAction: defaultAction,
      protocol: protocol,
      port: port,
      serviceIdentifier: props.service.serviceId,
    });

    this.listenerId = listener.attrId;
    this.listenerArn = listener.attrArn;
    this.service = props.service;

  }

  /**
   * add a rule to the listener
   * @param props AddRuleProps
   */
  public addListenerRule(props: AddRuleProps): void {

    // if priority is undefined set it to 50.  This should only be used if there is a single rule
    const priority = props.priority ?? 50;
    let policyStatement: iam.PolicyStatement = new iam.PolicyStatement();

    // conditionaly build a policy statement if principals where provided
    if (props.allowedPrincipals) {

      // add default enforcement conditions if they have been made at the service level

      if (this.service.anonymousAccessAllowed === false) {
        policyStatement.addCondition('StringNotEqualsIgnoreCase', { 'aws:PrincipalType': 'anonymous' } );
      };
      if (this.service.externalPrincipalsAllowed === false) {
        policyStatement.addCondition('StringEquals', { 'aws:PrincipalOrgID': [this.service.orgId] } );
      };

      // add the action for the statement. There is only one permissiable action
      policyStatement.addActions('vpc-lattice-svcs:Invoke');

      // add principals to the statement
      // if needed, explicity permit all principals by using iam.AnyPrincipal();
      props.allowedPrincipals.forEach((principal) => {
        principal.addToPrincipalPolicy(policyStatement);
      });
    };

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
    * Validate the priority is not already in use.
    */
    if (priority in this.listenerPrioritys) {
      throw new Error('Priority is already in use, ensure all listerner rules have unique prioritys');
    }
    this.listenerPrioritys.push(priority);
    // check to see if priority is between 1 and 100
    if (priority < 1 || priority > 100) {
      throw new Error('Priority must be between 1 and 100');
    }
    // process the match
    // fail if at least one method is not selected
    if (Object.keys(props.httpMatch).length < 1) {
      throw new Error('At least one of pathMatches, headerMatches, or method must be provided');
    };

    let match: IHttpMatchProperty = {};

    // method match
    if (props.httpMatch.method) {
      // set the method match for the lattice rule
      match.method = props.httpMatch.method;

      // add a policy statemenet for the Auth Rule
      policyStatement.addCondition('StringEquals', { 'vpc-lattice-svcs:RequestMethod': props.httpMatch.method });
    }

    // path match
    if (props.httpMatch.pathMatches) {

      const matchType = props.httpMatch.pathMatches.pathMatchType ?? PathMatchType.EXACT;

      if (matchType === PathMatchType.EXACT) {
        match.pathMatch = {
          match: {
            exact: props.httpMatch.pathMatches.path,
          },
          caseSensitive: props.httpMatch.pathMatches.caseSensitive ?? true,
        };
        const arn = `arn:${core.Aws.PARTITION}:vpc-lattice:${core.Aws.REGION}:${core.Aws.ACCOUNT_ID}:service/${this.service.serviceId}`;
        policyStatement.addResources(arn + props.httpMatch.pathMatches.path);
      };

      if (matchType === PathMatchType.PREFIX) {
        match.pathMatch = {
          match: {
            prefix: props.httpMatch.pathMatches.path,
          },
          caseSensitive: props.httpMatch.pathMatches.caseSensitive ?? true,
        };
        const arn = `arn:${core.Aws.PARTITION}:vpc-lattice:${core.Aws.REGION}:${core.Aws.ACCOUNT_ID}:service/${this.service.serviceId}`;
        policyStatement.addResources(arn + props.httpMatch.pathMatches.path + '*');
      };

    }
    // header Match
    if (props.httpMatch.headerMatches) {

      let headerMatches: aws_vpclattice.CfnRule.HeaderMatchProperty[] = [];

      props.httpMatch.headerMatches.forEach((headerMatch) => {

        const matchOperator = headerMatch.matchOperator ?? MatchOperator.EXACT;

        if (matchOperator === MatchOperator.EXACT) {
          headerMatches.push({
            name: headerMatch.headername,
            match: {
              exact: headerMatch.matchValue,
            },
            caseSensitive: headerMatch.caseSensitive ?? false,
          });
          policyStatement.addCondition('StringEquals', { [`vpc-lattice-svcs:RequestHeader/${headerMatch.headername}`]: headerMatch.matchValue } );
        } else if (matchOperator === MatchOperator.CONTAINS) {
          headerMatches.push({
            name: headerMatch.headername,
            match: {
              contains: headerMatch.matchValue,
            },
            caseSensitive: headerMatch.caseSensitive ?? false,
          });
          policyStatement.addCondition('StringEquals', { [`vpc-lattice-svcs:RequestHeader/${headerMatch.headername}`]: `*${headerMatch.matchValue}*` });

        } else if (matchOperator === MatchOperator.PREFIX) {
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

    // only add the policy statement if principals where provided
    if (props.allowedPrincipals && this.serviceAuthPolicy) {
      this.serviceAuthPolicy.addStatements(policyStatement);
    }

    // finally create a rule
    new aws_vpclattice.CfnRule(this, `${props.name}-Rule`, {
      action: action,
      match: {
        httpMatch: match,
      },
      priority: priority,
      listenerIdentifier: this.listenerId,
      serviceIdentifier: this.service.serviceId,
    });

  }
}
