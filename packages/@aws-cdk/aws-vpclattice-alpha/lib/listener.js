"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const index_1 = require("./index");
/**
 *  This class should not be called directly.
 *  Use the .addListener() Method on an instance of LatticeService
 *  Creates a vpcLattice Listener
 */
class Listener extends core.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * A list of prioritys, to check for duplicates
         */
        this.listenerPrioritys = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_ListenerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Listener);
            }
            throw error;
        }
        let defaultAction = {};
        // the default action is a not provided, it will be set to NOT_FOUND
        if (props.defaultAction === undefined) {
            defaultAction = {
                fixedResponse: {
                    statusCode: index_1.FixedResponse.NOT_FOUND,
                },
            };
        }
        const listener = new aws_cdk_lib_1.aws_vpclattice.CfnListener(this, 'Resource', {
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
    addListenerRule(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_AddRuleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addListenerRule);
            }
            throw error;
        }
        // conditionaly build a policy statement if principals where provided
        let policyStatement = new aws_cdk_lib_1.aws_iam.PolicyStatement();
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
        let action;
        // if the rule has a fixed response
        if (typeof (props.action) === 'number') {
            action = {
                fixedResponse: {
                    statusCode: props.action,
                },
            };
        }
        else { // this is a forwarding action
            let targetGroups = [];
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
        let match = {};
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
            const pathMatchType = props.pathMatch.pathMatchType ?? index_1.PathMatchType.EXACT;
            if (pathMatchType === index_1.PathMatchType.EXACT) {
                match.pathMatch = {
                    match: {
                        exact: props.pathMatch.path,
                    },
                    caseSensitive: props.pathMatch.caseSensitive ?? false,
                };
                const arn = `arn:${core.Aws.PARTITION}:vpc-lattice:${core.Aws.REGION}:${core.Aws.ACCOUNT_ID}:service/${this.serviceId}`;
                policyStatement.addResources(arn + props.pathMatch.path);
            }
            ;
            if (pathMatchType === index_1.PathMatchType.PREFIX) {
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
            let headerMatches = [];
            props.headerMatchs.forEach((headerMatch) => {
                if (headerMatch.matchOperator === index_1.MatchOperator.EXACT) {
                    headerMatches.push({
                        name: headerMatch.headername,
                        match: {
                            exact: headerMatch.matchValue,
                        },
                        caseSensitive: headerMatch.caseSensitive ?? false,
                    });
                    policyStatement.addCondition('StringEquals', { [`vpc-lattice-svcs:RequestHeader/${headerMatch.headername}`]: headerMatch.matchValue });
                }
                else if (headerMatch.matchOperator === index_1.MatchOperator.CONTAINS) {
                    headerMatches.push({
                        name: headerMatch.headername,
                        match: {
                            contains: headerMatch.matchValue,
                        },
                        caseSensitive: headerMatch.caseSensitive ?? false,
                    });
                    policyStatement.addCondition('StringEquals', { [`vpc-lattice-svcs:RequestHeader/${headerMatch.headername}`]: `*${headerMatch.matchValue}*` });
                }
                else if (headerMatch.matchOperator === index_1.MatchOperator.PREFIX) {
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
        }
        ;
        // only add the policy statement if there are principals
        if (props.allowedPrincipals && this.serviceAuthPolicy) {
            this.serviceAuthPolicy.addStatements(policyStatement);
        }
        // finally create a rule
        new aws_cdk_lib_1.aws_vpclattice.CfnRule(this, `${props.name}-Rule`, {
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
_a = JSII_RTTI_SYMBOL_1;
Listener[_a] = { fqn: "@aws-cdk/aws-vpclattice-alpha.Listener", version: "0.0.0" };
exports.Listener = Listener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxvQ0FBb0M7QUFFcEMsNkNBSXFCO0FBR3JCLG1DQVNpQjtBQTZKakI7Ozs7R0FJRztBQUNILE1BQWEsUUFBUyxTQUFRLElBQUksQ0FBQyxRQUFRO0lBd0J6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFoQm5COztXQUVHO1FBQ0gsc0JBQWlCLEdBQWEsRUFBRSxDQUFBOzs7Ozs7K0NBWnJCLFFBQVE7Ozs7UUEyQmpCLElBQUksYUFBYSxHQUFxRCxFQUFFLENBQUM7UUFDekUsb0VBQW9FO1FBQ3BFLElBQUksS0FBSyxDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUU7WUFDckMsYUFBYSxHQUFHO2dCQUNkLGFBQWEsRUFBRTtvQkFDYixVQUFVLEVBQUUscUJBQWEsQ0FBQyxTQUFTO2lCQUNwQzthQUNGLENBQUM7U0FDSDtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksNEJBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNoRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsYUFBYSxFQUFFLGFBQWE7WUFDNUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixpQkFBaUIsRUFBRSxLQUFLLENBQUMsU0FBUztTQUNuQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztLQUVsQztJQUVEOzs7T0FHRztJQUNJLGVBQWUs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WUFDSCxLQUFLLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztTQUNyQztRQUFBLENBQUM7UUFFRix3REFBd0Q7UUFDeEQsSUFBSSxLQUFLLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3JELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDdkQ7UUFHRCx3QkFBd0I7UUFDeEIsSUFBSSw0QkFBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxPQUFPLEVBQUU7WUFDckQsTUFBTSxFQUFFLE1BQU07WUFDZCxLQUFLLEVBQUU7Z0JBQ0wsU0FBUyxFQUFFO29CQUNULFNBQVMsRUFBRTt3QkFDVCxLQUFLLEVBQUU7NEJBQ0wsS0FBSyxFQUFFLE9BQU87NEJBQ2QsTUFBTSxFQUFFLEdBQUc7eUJBQ1o7d0JBQ0QsYUFBYSxFQUFFLEtBQUs7cUJBQ3JCO2lCQUNGO2FBQ0Y7WUFDRCx3REFBd0Q7WUFDeEQsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVO1lBQ25DLGlCQUFpQixFQUFFLElBQUksQ0FBQyxTQUFTO1NBQ2xDLENBQUMsQ0FBQztLQUVKOzs7O0FBMU5VLDRCQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29yZSBmcm9tICdhd3MtY2RrLWxpYic7XG5cbmltcG9ydCB7XG4gIGF3c192cGNsYXR0aWNlLFxuICBhd3NfaWFtIGFzIGlhbSxcbn1cbiAgZnJvbSAnYXdzLWNkay1saWInO1xuXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7XG4gIEZpeGVkUmVzcG9uc2UsXG4gIFBhdGhNYXRjaFR5cGUsXG4gIFBhdGhNYXRjaCxcbiAgSGVhZGVyTWF0Y2gsXG4gIFdlaWdodGVkVGFyZ2V0R3JvdXAsXG4gIFByb3RvY29sLFxuICBIVFRQTWV0aG9kcyxcbiAgTWF0Y2hPcGVyYXRvcixcbn0gZnJvbSAnLi9pbmRleCc7XG5cbmludGVyZmFjZSBJSHR0cE1hdGNoUHJvcGVydHkge1xuICAvKipcbiAgICogVGhlIGhlYWRlciBtYXRjaGVzLiBNYXRjaGVzIGluY29taW5nIHJlcXVlc3RzIHdpdGggcnVsZSBiYXNlZCBvbiByZXF1ZXN0IGhlYWRlciB2YWx1ZSBiZWZvcmUgYXBwbHlpbmcgcnVsZSBhY3Rpb24uXG4gICAqXG4gICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtdnBjbGF0dGljZS1ydWxlLWh0dHBtYXRjaC5odG1sI2Nmbi12cGNsYXR0aWNlLXJ1bGUtaHR0cG1hdGNoLWhlYWRlcm1hdGNoZXNcbiAgICovXG4gIGhlYWRlck1hdGNoZXM/OiBBcnJheTxhd3NfdnBjbGF0dGljZS5DZm5SdWxlLkhlYWRlck1hdGNoUHJvcGVydHkgfCBjb3JlLklSZXNvbHZhYmxlPiB8IGNvcmUuSVJlc29sdmFibGU7XG4gIC8qKlxuICAgKiBUaGUgSFRUUCBtZXRob2QgdHlwZS5cbiAgICpcbiAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy12cGNsYXR0aWNlLXJ1bGUtaHR0cG1hdGNoLmh0bWwjY2ZuLXZwY2xhdHRpY2UtcnVsZS1odHRwbWF0Y2gtbWV0aG9kXG4gICAqL1xuICBtZXRob2Q/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBtYXRjaC5cbiAgICpcbiAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy12cGNsYXR0aWNlLXJ1bGUtaHR0cG1hdGNoLmh0bWwjY2ZuLXZwY2xhdHRpY2UtcnVsZS1odHRwbWF0Y2gtcGF0aG1hdGNoXG4gICAqL1xuICBwYXRoTWF0Y2g/OiBhd3NfdnBjbGF0dGljZS5DZm5SdWxlLlBhdGhNYXRjaFByb3BlcnR5IHwgY29yZS5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBQcm9wcyBmb3IgQWRkTGlzdGVuZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZGRMaXN0ZW5lclByb3BzIHtcbiAgLyoqXG4gICAqICBUaGUgZGVmYXVsdCBhY3Rpb24gdGhhdCB3aWxsIGJlIHRha2VuIGlmIG5vIHJ1bGVzIG1hdGNoLlxuICAgKiBAZGVmYXVsdCBUaGUgZGVmYXVsdCBhY3Rpb24gd2lsbCBiZSB0byByZXR1cm4gNDA0IG5vdCBmb3VuZFxuICAqL1xuICByZWFkb25seSBkZWZhdWx0QWN0aW9uPzogYXdzX3ZwY2xhdHRpY2UuQ2ZuTGlzdGVuZXIuRGVmYXVsdEFjdGlvblByb3BlcnR5IHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAqIHByb3RvY29sIHRoYXQgdGhlIGxpc3RlbmVyIHdpbGwgbGlzdGVuIG9uXG4gICogQGRlZmF1bHQgSFRUUFNcbiAgKiBAc2VlIHZwY2xhdHRpY2UuUHJvdG9jb2xcbiAgKi9cbiAgcmVhZG9ubHkgcHJvdG9jb2w/OiBQcm90b2NvbCB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgKiBPcHRpb25hbCBwb3J0IG51bWJlciBmb3IgdGhlIGxpc3RlbmVyLiBJZiBub3Qgc3VwcGxpZWQsIHdpbGwgZGVmYXVsdCB0byA4MCBvciA0NDMsIGRlcGVuZGluZyBvbiB0aGUgUHJvdG9jb2xcbiAgKiBAZGVmYXVsdCA4MCBvciA0NDMgZGVwZW5kaW5nIG9uIHRoZSBQcm90b2NvbFxuICAqL1xuICByZWFkb25seSBwb3J0PzogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAqIFRoZSBJZCBvZiB0aGUgc2VydmljZSB0aGF0IHRoaXMgd2lsbCBiZSBhZGRlZCB0by5cbiAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxufVxuXG5cbi8qKlxuICogUHJvcGVydHlzIHRvIENyZWF0ZSBhIExhdHRpY2UgTGlzdGVuZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaXN0ZW5lclByb3BzIHtcbiAgLyoqXG4gICAqICAqIEEgZGVmYXVsdCBhY3Rpb24gdGhhdCB3aWxsIGJlIHRha2VuIGlmIG5vIHJ1bGVzIG1hdGNoLlxuICAgKiAgQGRlZmF1bHQgNDA0IE5PVCBGb3VuZFxuICAqL1xuICByZWFkb25seSBkZWZhdWx0QWN0aW9uPzogYXdzX3ZwY2xhdHRpY2UuQ2ZuTGlzdGVuZXIuRGVmYXVsdEFjdGlvblByb3BlcnR5IHwgdW5kZWZpbmVkO1xuICAvKipcbiAgKiBwcm90b2NvbCB0aGF0IHRoZSBsaXN0ZW5lciB3aWxsIGxpc3RlbiBvblxuICAqL1xuICByZWFkb25seSBwcm90b2NvbDogUHJvdG9jb2xcbiAgLyoqXG4gICogT3B0aW9uYWwgcG9ydCBudW1iZXIgZm9yIHRoZSBsaXN0ZW5lci4gSWYgbm90IHN1cHBsaWVkLCB3aWxsIGRlZmF1bHQgdG8gODAgb3IgNDQzLCBkZXBlbmRpbmcgb24gdGhlIFByb3RvY29sXG4gICogQGRlZmF1bHQgODAgb3IgNDQzIGRlcGVuZGluZyBvbiB0aGUgUHJvdG9jb2xcblxuICAqL1xuICByZWFkb25seSBwb3J0PzogbnVtYmVyIHwgdW5kZWZpbmVkXG4gIC8qKlxuICAqIFRoZSBOYW1lIG9mIHRoZSBzZXJ2aWNlLlxuICAqIEBkZWZhdWx0IENsb3VkRm9ybWF0aW9uIHByb3ZpZGVkIG5hbWUuXG4gICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgc2VydmljZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZUlkOiBzdHJpbmc7XG4gIC8qKlxuICAgKiB0aGUgYXV0aHBvbGljeSBmb3IgdGhlIHNlcnZpY2UgdGhpcyBsaXN0ZW5lciBpcyBhc3NvY2lhdGVkIHdpdGhcbiAgICogQGRlZmF1bHQgbm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VBdXRoUG9saWN5PzogaWFtLlBvbGljeURvY3VtZW50IHwgdW5kZWZpbmVkXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgdnBjTGF0dGljZSBMaXN0ZW5lci5cbiAqIEltcGxlbWVudGVkIGJ5IGBMaXN0ZW5lcmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUxpc3RlbmVyIGV4dGVuZHMgY29yZS5JUmVzb3VyY2Uge1xuICAvKipcbiAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIHNlcnZpY2UuXG4gICovXG4gIHJlYWRvbmx5IGxpc3RlbmVyQXJuOiBzdHJpbmc7XG4gIC8qKlxuICAqIFRoZSBJZCBvZiB0aGUgU2VydmljZSBOZXR3b3JrXG4gICovXG4gIHJlYWRvbmx5IGxpc3RlbmVySWQ6IHN0cmluZztcblxuICAvKipcbiAgICogQWRkIEEgTGlzdGVuZXIgUnVsZSB0byB0aGUgTGlzdGVuZXJcbiAgICovXG4gIGFkZExpc3RlbmVyUnVsZShwcm9wczogQWRkUnVsZVByb3BzKTogdm9pZDtcblxufVxuXG5cbi8qKlxuICogUHJvcGVydGllcyB0byBhZGQgcnVsZXMgdG8gdG8gYSBsaXN0ZW5lclxuICogT25lIG9mIGhlYWRlck1hdGNoLCBQYXRoTWF0Y2gsIG9yIG1ldGhvZE1hdGNoIGNhbiBiZSBzdXBwbGllZCxcbiAqIHRoZSBSdWxlIGNhbiBub3QgbWF0Y2ggbXVsdGlwbGUgVHlwZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZGRSdWxlUHJvcHMge1xuICAvKipcbiAgKiBBIG5hbWUgZm9yIHRoZSB0aGUgUnVsZVxuICAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmdcbiAgLyoqXG4gICogdGhlIGFjdGlvbiBmb3IgdGhlIHJ1bGUsIGlzIGVpdGhlciBhIGZpeGVkIFJlcG9uc2UsIG9yIGEgYmVpbmcgc2VudCB0byAgV2VpZ2h0ZWQgVGFyZ2V0R3JvdXBcbiAgKi9cblxuICByZWFkb25seSBhY3Rpb246IEZpeGVkUmVzcG9uc2UgfCBXZWlnaHRlZFRhcmdldEdyb3VwW11cbiAgLyoqXG4gICogdGhlIHByaW9yaXR5IG9mIHRoaXMgcnVsZSwgYSBsb3dlciBwcmlvcml0eSB3aWxsIGJlIHByb2Nlc3NlZCBmaXJzdFxuICAqL1xuXG4gIHJlYWRvbmx5IHByaW9yaXR5OiBudW1iZXJcbiAgLyoqIFByb3BlcnRpZXMgZm9yIGEgaGVhZGVyIG1hdGNoXG4gICogQSBoZWFkZXIgbWF0Y2ggY2FuIHNlYXJjaCBmb3IgbXVsdGlwbGUgaGVhZGVyc1xuICAqIEBkZWZhdWx0IG5vbmVcbiAgKi9cbiAgcmVhZG9ubHkgaGVhZGVyTWF0Y2hzPzogSGVhZGVyTWF0Y2hbXSB8IHVuZGVmaW5lZFxuICAvKipcbiAgKiBQcm9wZXJ0aWVzIGZvciBhIFBhdGggTWF0Y2hcbiAgKiBAZGVmYXVsdCBub25lXG4gICovXG4gIHJlYWRvbmx5IHBhdGhNYXRjaD86IFBhdGhNYXRjaCB8IHVuZGVmaW5lZFxuXG4gIC8qKlxuICAqIFByb3BlcnRpZXMgZm9yIGEgbWV0aG9kIE1hdGNoXG4gICogQGRlZmF1bHQgbm9uZVxuICAqL1xuICByZWFkb25seSBtZXRob2RNYXRjaD86IEhUVFBNZXRob2RzIHwgdW5kZWZpbmVkXG5cbiAgLyoqXG4gICAqIEF1dGhQb2xpY3kgZm9yIHJ1bGVcbiAgICogQGRlZmF1bHQgbm9uZVxuICAqL1xuICByZWFkb25seSBhbGxvd2VkUHJpbmNpcGFscz86IGlhbS5JUHJpbmNpcGFsW10gfCB1bmRlZmluZWQ7XG5cbn1cblxuXG4vKipcbiAqICBUaGlzIGNsYXNzIHNob3VsZCBub3QgYmUgY2FsbGVkIGRpcmVjdGx5LlxuICogIFVzZSB0aGUgLmFkZExpc3RlbmVyKCkgTWV0aG9kIG9uIGFuIGluc3RhbmNlIG9mIExhdHRpY2VTZXJ2aWNlXG4gKiAgQ3JlYXRlcyBhIHZwY0xhdHRpY2UgTGlzdGVuZXJcbiAqL1xuZXhwb3J0IGNsYXNzIExpc3RlbmVyIGV4dGVuZHMgY29yZS5SZXNvdXJjZSBpbXBsZW1lbnRzIElMaXN0ZW5lciB7XG4gIC8qKlxuICAgKiAgVGhlIElkIG9mIHRoZSBMaXN0ZW5lclxuICAgKi9cbiAgcmVhZG9ubHkgbGlzdGVuZXJJZDogc3RyaW5nO1xuICAvKipcbiAgICogVEhlIEFybiBvZiB0aGUgTGlzdGVuZXJcbiAgICovXG4gIHJlYWRvbmx5IGxpc3RlbmVyQXJuOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgcHJpb3JpdHlzLCB0byBjaGVjayBmb3IgZHVwbGljYXRlc1xuICAgKi9cbiAgbGlzdGVuZXJQcmlvcml0eXM6IG51bWJlcltdID0gW11cbiAgLyoqXG4gICAqIFRoZSBJZCBvZiB0aGUgc2VydmljZSB0aGlzIGxpc3RlbmVyIGlzIGF0dGFjaGVkIHRvXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlSWQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFNlcnZpY2UgYXV0aCBQb2xpY3lcbiAgICogQGRlZmF1bHQgbm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VBdXRoUG9saWN5PzogaWFtLlBvbGljeURvY3VtZW50IHwgdW5kZWZpbmVkO1xuXG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExpc3RlbmVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgbGV0IGRlZmF1bHRBY3Rpb246IGF3c192cGNsYXR0aWNlLkNmbkxpc3RlbmVyLkRlZmF1bHRBY3Rpb25Qcm9wZXJ0eSA9IHt9O1xuICAgIC8vIHRoZSBkZWZhdWx0IGFjdGlvbiBpcyBhIG5vdCBwcm92aWRlZCwgaXQgd2lsbCBiZSBzZXQgdG8gTk9UX0ZPVU5EXG4gICAgaWYgKHByb3BzLmRlZmF1bHRBY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmYXVsdEFjdGlvbiA9IHtcbiAgICAgICAgZml4ZWRSZXNwb25zZToge1xuICAgICAgICAgIHN0YXR1c0NvZGU6IEZpeGVkUmVzcG9uc2UuTk9UX0ZPVU5ELFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ZW5lciA9IG5ldyBhd3NfdnBjbGF0dGljZS5DZm5MaXN0ZW5lcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiBwcm9wcy5uYW1lLFxuICAgICAgZGVmYXVsdEFjdGlvbjogZGVmYXVsdEFjdGlvbixcbiAgICAgIHByb3RvY29sOiBwcm9wcy5wcm90b2NvbCxcbiAgICAgIHBvcnQ6IHByb3BzLnBvcnQsXG4gICAgICBzZXJ2aWNlSWRlbnRpZmllcjogcHJvcHMuc2VydmljZUlkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5saXN0ZW5lcklkID0gbGlzdGVuZXIuYXR0cklkO1xuICAgIHRoaXMubGlzdGVuZXJBcm4gPSBsaXN0ZW5lci5hdHRyQXJuO1xuICAgIHRoaXMuc2VydmljZUlkID0gcHJvcHMuc2VydmljZUlkO1xuXG4gIH1cblxuICAvKipcbiAgICogYWRkIGEgcnVsZSB0byB0aGUgbGlzdGVuZXJcbiAgICogQHBhcmFtIHByb3BzIEFkZFJ1bGVQcm9wc1xuICAgKi9cbiAgcHVibGljIGFkZExpc3RlbmVyUnVsZShwcm9wczogQWRkUnVsZVByb3BzKTogdm9pZCB7XG5cbiAgICAvLyBjb25kaXRpb25hbHkgYnVpbGQgYSBwb2xpY3kgc3RhdGVtZW50IGlmIHByaW5jaXBhbHMgd2hlcmUgcHJvdmlkZWRcbiAgICBsZXQgcG9saWN5U3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoKTtcblxuICAgIC8vIGFkZCBwcmluY2lwYWxzXG4gICAgaWYgKHByb3BzLmFsbG93ZWRQcmluY2lwYWxzKSB7XG4gICAgICAvLyBhZGQgdGhlIHByaW5jaXBhbHNcbiAgICAgIHByb3BzLmFsbG93ZWRQcmluY2lwYWxzLmZvckVhY2goKHByaW5jaXBhbCkgPT4ge1xuICAgICAgICBwcmluY2lwYWwuYWRkVG9QcmluY2lwYWxQb2xpY3kocG9saWN5U3RhdGVtZW50KTtcbiAgICAgIH0pO1xuICAgICAgLy8gYWRkIHRoZSBhY3Rpb24gZm9yIHRoZSBzdGF0ZW1lbnRcbiAgICAgIHBvbGljeVN0YXRlbWVudC5hZGRBY3Rpb25zKCd2cGMtbGF0dGljZS1zdmNzOkludm9rZScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQ3JlYXRlIHRoZSBBY3Rpb24gZm9yIHRoZSBSdWxlXG4gICAgKi9cbiAgICBsZXQgYWN0aW9uOiBhd3NfdnBjbGF0dGljZS5DZm5SdWxlLkFjdGlvblByb3BlcnR5O1xuXG4gICAgLy8gaWYgdGhlIHJ1bGUgaGFzIGEgZml4ZWQgcmVzcG9uc2VcbiAgICBpZiAodHlwZW9mIChwcm9wcy5hY3Rpb24pID09PSAnbnVtYmVyJykge1xuICAgICAgYWN0aW9uID0ge1xuICAgICAgICBmaXhlZFJlc3BvbnNlOiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogcHJvcHMuYWN0aW9uLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9IGVsc2UgeyAvLyB0aGlzIGlzIGEgZm9yd2FyZGluZyBhY3Rpb25cblxuICAgICAgbGV0IHRhcmdldEdyb3VwczogYXdzX3ZwY2xhdHRpY2UuQ2ZuUnVsZS5XZWlnaHRlZFRhcmdldEdyb3VwUHJvcGVydHlbXSA9IFtdO1xuXG4gICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGFjdGlvbiB0byBidWlsZCBhIHNldCBvZiB0YXJnZXQgZ3JvdXBzXG4gICAgICBwcm9wcy5hY3Rpb24uZm9yRWFjaCgodGFyZ2V0R3JvdXApID0+IHtcbiAgICAgICAgdGFyZ2V0R3JvdXBzLnB1c2goe1xuICAgICAgICAgIHRhcmdldEdyb3VwSWRlbnRpZmllcjogdGFyZ2V0R3JvdXAudGFyZ2V0R3JvdXAudGFyZ2V0R3JvdXBJZCxcbiAgICAgICAgICAvLyBpZiB0aGUgdGFyZ2V0R3JvdXAgaXMgbm8gc3BlY2lmaWVkIHNldCBzZW5zaWJsZSBkZWZhdWx0IG9mIDEwMFxuICAgICAgICAgIC8vIHRoaXMgaXMgYW4gb3BpbmlvbmF0ZWQgY2hvaWNlLlxuICAgICAgICAgIHdlaWdodDogdGFyZ2V0R3JvdXAud2VpZ2h0ID8/IDEwMCxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgYWN0aW9uID0ge1xuICAgICAgICBmb3J3YXJkOiB7XG4gICAgICAgICAgdGFyZ2V0R3JvdXBzOiB0YXJnZXRHcm91cHMsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICogVmFsaWRhdGUgdGhlIHByaW9yaXR5IGFuZCBzZXQgaXQgaW4gdGVoIHJ1bGVcbiAgICAqL1xuICAgIGlmIChwcm9wcy5wcmlvcml0eSBpbiB0aGlzLmxpc3RlbmVyUHJpb3JpdHlzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ByaW9yaXR5IGlzIGFscmVhZHkgaW4gdXNlJyk7XG4gICAgfVxuICAgIHRoaXMubGlzdGVuZXJQcmlvcml0eXMucHVzaChwcm9wcy5wcmlvcml0eSk7XG5cbiAgICAvLyBwcm9jZXNzIHRoZSBtYXRjaGluZyB0eXBlXG4gICAgbGV0IG1hdGNoOiBJSHR0cE1hdGNoUHJvcGVydHkgPSB7fTtcbiAgICAvLyBmYWlsIGlmIGF0IGxlYXN0IG9uZSBtZXRob2QgaXMgbm90IHNlbGVjdGVkXG4gICAgaWYgKCEocHJvcHMubWV0aG9kTWF0Y2ggfHwgcHJvcHMucGF0aE1hdGNoIHx8IHByb3BzLmhlYWRlck1hdGNocykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIG9mIFBhdGhNYXRjaCwgaGVhZGVyTWF0Y2gsIG9yIE1ldGhvZE1hdGNoIG11c3QgYmUgc2V0Jyk7XG4gICAgfVxuXG4gICAgLy8gbWV0aG9kIG1hdGNoXG4gICAgaWYgKHByb3BzLm1ldGhvZE1hdGNoKSB7XG4gICAgICBtYXRjaC5tZXRob2QgPSBwcm9wcy5tZXRob2RNYXRjaDtcbiAgICAgIHBvbGljeVN0YXRlbWVudC5hZGRDb25kaXRpb24oJ1N0cmluZ0VxdWFscycsIHsgJ3ZwYy1sYXR0aWNlLXN2Y3M6UmVxdWVzdE1ldGhvZCc6IHByb3BzLm1ldGhvZE1hdGNoIH0pO1xuICAgIH1cblxuICAgIC8vIHBhdGggbWF0Y2hcbiAgICBpZiAocHJvcHMucGF0aE1hdGNoKSB7XG5cbiAgICAgIGNvbnN0IHBhdGhNYXRjaFR5cGUgPSBwcm9wcy5wYXRoTWF0Y2gucGF0aE1hdGNoVHlwZSA/PyBQYXRoTWF0Y2hUeXBlLkVYQUNUO1xuXG4gICAgICBpZiAocGF0aE1hdGNoVHlwZSA9PT0gUGF0aE1hdGNoVHlwZS5FWEFDVCkge1xuICAgICAgICBtYXRjaC5wYXRoTWF0Y2ggPSB7XG4gICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgIGV4YWN0OiBwcm9wcy5wYXRoTWF0Y2gucGF0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhc2VTZW5zaXRpdmU6IHByb3BzLnBhdGhNYXRjaC5jYXNlU2Vuc2l0aXZlID8/IGZhbHNlLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBhcm4gPSBgYXJuOiR7Y29yZS5Bd3MuUEFSVElUSU9OfTp2cGMtbGF0dGljZToke2NvcmUuQXdzLlJFR0lPTn06JHtjb3JlLkF3cy5BQ0NPVU5UX0lEfTpzZXJ2aWNlLyR7dGhpcy5zZXJ2aWNlSWR9YDtcbiAgICAgICAgcG9saWN5U3RhdGVtZW50LmFkZFJlc291cmNlcyhhcm4gKyBwcm9wcy5wYXRoTWF0Y2gucGF0aCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAocGF0aE1hdGNoVHlwZSA9PT0gUGF0aE1hdGNoVHlwZS5QUkVGSVgpIHtcbiAgICAgICAgbWF0Y2gucGF0aE1hdGNoID0ge1xuICAgICAgICAgIG1hdGNoOiB7XG4gICAgICAgICAgICBwcmVmaXg6IHByb3BzLnBhdGhNYXRjaC5wYXRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FzZVNlbnNpdGl2ZTogcHJvcHMucGF0aE1hdGNoLmNhc2VTZW5zaXRpdmUgPz8gZmFsc2UsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGFybiA9IGBhcm46JHtjb3JlLkF3cy5QQVJUSVRJT059OnZwYy1sYXR0aWNlOiR7Y29yZS5Bd3MuUkVHSU9OfToke2NvcmUuQXdzLkFDQ09VTlRfSUR9OnNlcnZpY2UvJHt0aGlzLnNlcnZpY2VJZH1gO1xuICAgICAgICBwb2xpY3lTdGF0ZW1lbnQuYWRkUmVzb3VyY2VzKGFybiArIHByb3BzLnBhdGhNYXRjaC5wYXRoICsgJyonKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBoZWFkZXIgTWF0Y2hcbiAgICBpZiAocHJvcHMuaGVhZGVyTWF0Y2hzKSB7XG5cbiAgICAgIGxldCBoZWFkZXJNYXRjaGVzOiBhd3NfdnBjbGF0dGljZS5DZm5SdWxlLkhlYWRlck1hdGNoUHJvcGVydHlbXSA9IFtdO1xuXG4gICAgICBwcm9wcy5oZWFkZXJNYXRjaHMuZm9yRWFjaCgoaGVhZGVyTWF0Y2gpID0+IHtcblxuICAgICAgICBpZiAoaGVhZGVyTWF0Y2gubWF0Y2hPcGVyYXRvciA9PT0gTWF0Y2hPcGVyYXRvci5FWEFDVCkge1xuICAgICAgICAgIGhlYWRlck1hdGNoZXMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBoZWFkZXJNYXRjaC5oZWFkZXJuYW1lLFxuICAgICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgICAgZXhhY3Q6IGhlYWRlck1hdGNoLm1hdGNoVmFsdWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FzZVNlbnNpdGl2ZTogaGVhZGVyTWF0Y2guY2FzZVNlbnNpdGl2ZSA/PyBmYWxzZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwb2xpY3lTdGF0ZW1lbnQuYWRkQ29uZGl0aW9uKCdTdHJpbmdFcXVhbHMnLCB7IFtgdnBjLWxhdHRpY2Utc3ZjczpSZXF1ZXN0SGVhZGVyLyR7aGVhZGVyTWF0Y2guaGVhZGVybmFtZX1gXTogaGVhZGVyTWF0Y2gubWF0Y2hWYWx1ZSB9ICk7XG4gICAgICAgIH0gZWxzZSBpZiAoaGVhZGVyTWF0Y2gubWF0Y2hPcGVyYXRvciA9PT0gTWF0Y2hPcGVyYXRvci5DT05UQUlOUykge1xuICAgICAgICAgIGhlYWRlck1hdGNoZXMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBoZWFkZXJNYXRjaC5oZWFkZXJuYW1lLFxuICAgICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgICAgY29udGFpbnM6IGhlYWRlck1hdGNoLm1hdGNoVmFsdWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FzZVNlbnNpdGl2ZTogaGVhZGVyTWF0Y2guY2FzZVNlbnNpdGl2ZSA/PyBmYWxzZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwb2xpY3lTdGF0ZW1lbnQuYWRkQ29uZGl0aW9uKCdTdHJpbmdFcXVhbHMnLCB7IFtgdnBjLWxhdHRpY2Utc3ZjczpSZXF1ZXN0SGVhZGVyLyR7aGVhZGVyTWF0Y2guaGVhZGVybmFtZX1gXTogYCoke2hlYWRlck1hdGNoLm1hdGNoVmFsdWV9KmAgfSk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChoZWFkZXJNYXRjaC5tYXRjaE9wZXJhdG9yID09PSBNYXRjaE9wZXJhdG9yLlBSRUZJWCkge1xuICAgICAgICAgIGhlYWRlck1hdGNoZXMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBoZWFkZXJNYXRjaC5oZWFkZXJuYW1lLFxuICAgICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgICAgcHJlZml4OiBoZWFkZXJNYXRjaC5tYXRjaFZhbHVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhc2VTZW5zaXRpdmU6IGhlYWRlck1hdGNoLmNhc2VTZW5zaXRpdmUgPz8gZmFsc2UsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcG9saWN5U3RhdGVtZW50LmFkZENvbmRpdGlvbignU3RyaW5nRXF1YWxzJywgeyBbYHZwYy1sYXR0aWNlLXN2Y3M6UmVxdWVzdEhlYWRlci8ke2hlYWRlck1hdGNoLmhlYWRlcm5hbWV9YF06IGAke2hlYWRlck1hdGNoLm1hdGNoVmFsdWV9KmAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbWF0Y2guaGVhZGVyTWF0Y2hlcyA9IGhlYWRlck1hdGNoZXM7XG4gICAgfTtcblxuICAgIC8vIG9ubHkgYWRkIHRoZSBwb2xpY3kgc3RhdGVtZW50IGlmIHRoZXJlIGFyZSBwcmluY2lwYWxzXG4gICAgaWYgKHByb3BzLmFsbG93ZWRQcmluY2lwYWxzICYmIHRoaXMuc2VydmljZUF1dGhQb2xpY3kpIHtcbiAgICAgIHRoaXMuc2VydmljZUF1dGhQb2xpY3kuYWRkU3RhdGVtZW50cyhwb2xpY3lTdGF0ZW1lbnQpO1xuICAgIH1cblxuXG4gICAgLy8gZmluYWxseSBjcmVhdGUgYSBydWxlXG4gICAgbmV3IGF3c192cGNsYXR0aWNlLkNmblJ1bGUodGhpcywgYCR7cHJvcHMubmFtZX0tUnVsZWAsIHtcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgbWF0Y2g6IHtcbiAgICAgICAgaHR0cE1hdGNoOiB7XG4gICAgICAgICAgcGF0aE1hdGNoOiB7XG4gICAgICAgICAgICBtYXRjaDoge1xuICAgICAgICAgICAgICBleGFjdDogJ2V4YWN0JyxcbiAgICAgICAgICAgICAgcHJlZml4OiAnLycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FzZVNlbnNpdGl2ZTogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAvLyBtYXRjaDogbWF0Y2ggYXMgYXdzX3ZwY2xhdHRpY2UuQ2ZuUnVsZS5NYXRjaFByb3BlcnR5LFxuICAgICAgcHJpb3JpdHk6IHByb3BzLnByaW9yaXR5LFxuICAgICAgbGlzdGVuZXJJZGVudGlmaWVyOiB0aGlzLmxpc3RlbmVySWQsXG4gICAgICBzZXJ2aWNlSWRlbnRpZmllcjogdGhpcy5zZXJ2aWNlSWQsXG4gICAgfSk7XG5cbiAgfVxufSJdfQ==