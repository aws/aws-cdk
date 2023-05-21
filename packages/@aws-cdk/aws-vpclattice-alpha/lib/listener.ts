import * as core from 'aws-cdk-lib';

import {
  aws_vpclattice,
}
  from 'aws-cdk-lib';

import { Construct } from 'constructs';
import * as vpclattice from './index';

/**
 * Propertys to Create a Lattice Listener
 */
export interface ListenerProps {
  /**
   *  * A default action that will be taken if no rules match.
  */
  readonly defaultAction: aws_vpclattice.CfnListener.DefaultActionProperty
  /**
  * protocol that the listener will listen on
  */
  readonly protocol: vpclattice.Protocol
  /**
  * Optional port number for the listener. If not supplied, will default to 80 or 443, depending on the Protocol
  * @default 80 or 443 depending on the Protocol

  */
  readonly port?: number | undefined
  /**
  * The Id of the service that this will be added to.
  */
  readonly serviceIdentifier: string
  /**
  * A name for the service which shoudl be unique
  */
  readonly name: string
}

/**
 * Create a vpcLattice service network.
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

  readonly action: vpclattice.FixedResponse | vpclattice.WeightedTargetGroup[]
  /**
  * the priority of this rule, a lower priority will be processed first
  */

  readonly priority: number
  /** Properties for a header match
  * A header match can search for multiple headers
  * @default none
  */
  readonly headerMatchs?: vpclattice.HeaderMatch[] | undefined
  /**
  * Properties for a Path Match
  * @default none
  */
  readonly pathMatch?: vpclattice.PathMatch | undefined

  /**
  * Properties for a method Match
  * @default none
  */
  readonly methodMatch?: vpclattice.HTTPMethods | undefined
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
  readonly serviceIdentifier: string

  constructor(scope: Construct, id: string, props: ListenerProps) {
    super(scope, id);

    const listener = new aws_vpclattice.CfnListener(this, 'Resource', {
      name: props.name,
      defaultAction: props.defaultAction,
      protocol: props.protocol,
      port: props.port,
      serviceIdentifier: props.serviceIdentifier,
    });

    this.listenerId = listener.attrId;
    this.listenerArn = listener.attrArn;
    this.serviceIdentifier = props.serviceIdentifier;
  }

  /**
   * add a rule to the listener
   * @param props AddRuleProps
   */
  public addListenerRule(props: AddRuleProps): void {
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
          targetGroupIdentifier: targetGroup.target.targetGroupId,
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

    let match: aws_vpclattice.CfnRule.MatchProperty = {
      httpMatch: {
        method: vpclattice.HTTPMethods.GET,
      },
    };

    // check to see if a rule with this priority has already been assigned
    if (props.priority in this.listenerPrioritys) {
      throw new Error('Priority is already in use');
    }
    this.listenerPrioritys.push(props.priority);

    if (!(props.methodMatch || props.pathMatch || props.headerMatchs)) {
      throw new Error('At least one of PathMatch, headerMatch, or MethodMatch must be set');
    } else {

      let matchMethodSet: boolean = false;

      // method match
      if (props.methodMatch) {
        matchMethodSet = true;
        match = {
          httpMatch: {
            method: props.methodMatch,
          },
        };
      }

      // path match
      if (props.pathMatch) {
        if (matchMethodSet) {
          throw new Error(' Only one of PathMatch, headerMatch, or MethodMatch can be set');
        }
        matchMethodSet = true;

        if (props.pathMatch.pathMatchType === vpclattice.PathMatchType.EXACT) {
          match = {
            httpMatch: {
              pathMatch: {
                match: {
                  exact: props.pathMatch.matchValue,
                },
                caseSensitive: props.pathMatch.caseSensitive ?? false,
              },

            },
          };
        }

        if (props.pathMatch.pathMatchType === vpclattice.PathMatchType.PREFIX) {
          match = {
            httpMatch: {
              pathMatch: {
                match: {
                  prefix: props.pathMatch.matchValue,
                },
                caseSensitive: props.pathMatch.caseSensitive ?? false,
              },
            },
          };
        }
      }

      // header Match
      if (props.headerMatchs) {
        if (matchMethodSet) {
          throw new Error(' Only one of PathMatch, headerMatch, or MethodMatch can be set');
        }

        let headerMatches: aws_vpclattice.CfnRule.HeaderMatchProperty[] = [];

        props.headerMatchs.forEach((headerMatch) => {

          if (headerMatch.matchOperator === vpclattice.MatchOperator.EXACT) {
            headerMatches.push({
              name: headerMatch.headername,
              match: {
                exact: headerMatch.matchValue,
              },
              caseSensitive: headerMatch.caseSensitive ?? false,
            });
          } else if (headerMatch.matchOperator === vpclattice.MatchOperator.CONTAINS) {
            headerMatches.push({
              name: headerMatch.headername,
              match: {
                contains: headerMatch.matchValue,
              },
              caseSensitive: headerMatch.caseSensitive ?? false,
            });
          } else if (headerMatch.matchOperator === vpclattice.MatchOperator.PREFIX) {
            headerMatches.push({
              name: headerMatch.headername,
              match: {
                prefix: headerMatch.matchValue,
              },
              caseSensitive: headerMatch.caseSensitive ?? false,
            });

          }
        });

        match = {
          httpMatch: {
            headerMatches: headerMatches,
          },
        };
      }

      // finally create a rule
      new aws_vpclattice.CfnRule(this, `${props.name}-Rule`, {
        action: action,
        match: match,
        priority: props.priority,
        listenerIdentifier: this.listenerId,
        serviceIdentifier: this.serviceIdentifier,
      });
    }

  }
}
