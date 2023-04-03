"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCapabilities = exports.SingletonPolicy = void 0;
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
/**
 * Manages a bunch of singleton-y statements on the policy of an IAM Role.
 * Dedicated methods can be used to add specific permissions to the role policy
 * using as few statements as possible (adding resources to existing compatible
 * statements instead of adding new statements whenever possible).
 *
 * Statements created outside of this class are not considered when adding new
 * permissions.
 */
class SingletonPolicy extends constructs_1.Construct {
    constructor(role) {
        super(role, SingletonPolicy.UUID);
        this.role = role;
        this.statements = {};
        this.grantPrincipal = role;
    }
    /**
     * Obtain a SingletonPolicy for a given role.
     * @param role the Role this policy is bound to.
     * @returns the SingletonPolicy for this role.
     */
    static forRole(role) {
        const found = role.node.tryFindChild(SingletonPolicy.UUID);
        return found || new SingletonPolicy(role);
    }
    grantExecuteChangeSet(props) {
        this.statementFor({
            actions: [
                'cloudformation:DescribeStacks',
                'cloudformation:DescribeChangeSet',
                'cloudformation:ExecuteChangeSet',
            ],
            conditions: { StringEqualsIfExists: { 'cloudformation:ChangeSetName': props.changeSetName } },
        }).addResources(this.stackArnFromProps(props));
    }
    grantCreateReplaceChangeSet(props) {
        this.statementFor({
            actions: [
                'cloudformation:CreateChangeSet',
                'cloudformation:DeleteChangeSet',
                'cloudformation:DescribeChangeSet',
                'cloudformation:DescribeStacks',
            ],
            conditions: { StringEqualsIfExists: { 'cloudformation:ChangeSetName': props.changeSetName } },
        }).addResources(this.stackArnFromProps(props));
    }
    grantCreateUpdateStack(props) {
        const actions = [
            'cloudformation:DescribeStack*',
            'cloudformation:CreateStack',
            'cloudformation:UpdateStack',
            'cloudformation:GetTemplate*',
            'cloudformation:ValidateTemplate',
            'cloudformation:GetStackPolicy',
            'cloudformation:SetStackPolicy',
        ];
        if (props.replaceOnFailure) {
            actions.push('cloudformation:DeleteStack');
        }
        this.statementFor({ actions }).addResources(this.stackArnFromProps(props));
    }
    grantCreateUpdateStackSet(props) {
        const actions = [
            'cloudformation:CreateStackSet',
            'cloudformation:UpdateStackSet',
            'cloudformation:DescribeStackSet',
            'cloudformation:DescribeStackSetOperation',
            'cloudformation:ListStackInstances',
            'cloudformation:CreateStackInstances',
        ];
        this.statementFor({ actions }).addResources(this.stackSetArnFromProps(props));
    }
    grantDeleteStack(props) {
        this.statementFor({
            actions: [
                'cloudformation:DescribeStack*',
                'cloudformation:DeleteStack',
            ],
        }).addResources(this.stackArnFromProps(props));
    }
    grantPassRole(role) {
        this.statementFor({ actions: ['iam:PassRole'] }).addResources(typeof role === 'string' ? role : role.roleArn);
    }
    statementFor(template) {
        const key = keyFor(template);
        if (!(key in this.statements)) {
            this.statements[key] = new iam.PolicyStatement({ actions: template.actions });
            if (template.conditions) {
                this.statements[key].addConditions(template.conditions);
            }
            this.role.addToPolicy(this.statements[key]);
        }
        return this.statements[key];
        function keyFor(props) {
            const actions = `${props.actions.sort().join('\x1F')}`;
            const conditions = formatConditions(props.conditions);
            return `${actions}\x1D${conditions}`;
            function formatConditions(cond) {
                if (cond == null) {
                    return '';
                }
                let result = '';
                for (const op of Object.keys(cond).sort()) {
                    result += `${op}\x1E`;
                    const condition = cond[op];
                    for (const attribute of Object.keys(condition).sort()) {
                        const value = condition[attribute];
                        result += `${value}\x1F`;
                    }
                }
                return result;
            }
        }
    }
    stackArnFromProps(props) {
        return cdk.Stack.of(this).formatArn({
            region: props.region,
            service: 'cloudformation',
            resource: 'stack',
            resourceName: `${props.stackName}/*`,
        });
    }
    stackSetArnFromProps(props) {
        return cdk.Stack.of(this).formatArn({
            region: props.region,
            service: 'cloudformation',
            resource: 'stackset',
            resourceName: `${props.stackSetName}:*`,
        });
    }
}
exports.SingletonPolicy = SingletonPolicy;
SingletonPolicy.UUID = '8389e75f-0810-4838-bf64-d6f85a95cf83';
function parseCapabilities(capabilities) {
    if (capabilities === undefined) {
        return undefined;
    }
    else if (capabilities.length === 1) {
        const capability = capabilities.toString();
        return (capability === '') ? undefined : capability;
    }
    else if (capabilities.length > 1) {
        return capabilities.join(',');
    }
    return undefined;
}
exports.parseCapabilities = parseCapabilities;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xldG9uLXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpbmdsZXRvbi1wb2xpY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQywyQ0FBdUM7QUFFdkM7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsc0JBQVM7SUFpQjVDLFlBQXFDLElBQWU7UUFDbEQsS0FBSyxDQUFDLElBQTRCLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRHZCLFNBQUksR0FBSixJQUFJLENBQVc7UUFGNUMsZUFBVSxHQUEyQyxFQUFFLENBQUM7UUFJOUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7S0FDNUI7SUFuQkQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBZTtRQUNuQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsT0FBUSxLQUF5QixJQUFJLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2hFO0lBYU0scUJBQXFCLENBQUMsS0FBb0U7UUFDL0YsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNoQixPQUFPLEVBQUU7Z0JBQ1AsK0JBQStCO2dCQUMvQixrQ0FBa0M7Z0JBQ2xDLGlDQUFpQzthQUNsQztZQUNELFVBQVUsRUFBRSxFQUFFLG9CQUFvQixFQUFFLEVBQUUsOEJBQThCLEVBQUUsS0FBSyxDQUFDLGFBQWEsRUFBRSxFQUFFO1NBQzlGLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDaEQ7SUFFTSwyQkFBMkIsQ0FBQyxLQUFvRTtRQUNyRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ2hCLE9BQU8sRUFBRTtnQkFDUCxnQ0FBZ0M7Z0JBQ2hDLGdDQUFnQztnQkFD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WUFBWSxFQUFFLEdBQUcsS0FBSyxDQUFDLFlBQVksSUFBSTtTQUN4QyxDQUFDLENBQUM7S0FDSjs7QUF0SUgsMENBdUlDO0FBNUh5QixvQkFBSSxHQUFHLHNDQUFzQyxDQUFDO0FBcUl4RSxTQUFnQixpQkFBaUIsQ0FBQyxZQUErQztJQUMvRSxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7UUFDOUIsT0FBTyxTQUFTLENBQUM7S0FDbEI7U0FBTSxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3BDLE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzQyxPQUFPLENBQUMsVUFBVSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztLQUNyRDtTQUFNLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDbEMsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQy9CO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQVhELDhDQVdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogTWFuYWdlcyBhIGJ1bmNoIG9mIHNpbmdsZXRvbi15IHN0YXRlbWVudHMgb24gdGhlIHBvbGljeSBvZiBhbiBJQU0gUm9sZS5cbiAqIERlZGljYXRlZCBtZXRob2RzIGNhbiBiZSB1c2VkIHRvIGFkZCBzcGVjaWZpYyBwZXJtaXNzaW9ucyB0byB0aGUgcm9sZSBwb2xpY3lcbiAqIHVzaW5nIGFzIGZldyBzdGF0ZW1lbnRzIGFzIHBvc3NpYmxlIChhZGRpbmcgcmVzb3VyY2VzIHRvIGV4aXN0aW5nIGNvbXBhdGlibGVcbiAqIHN0YXRlbWVudHMgaW5zdGVhZCBvZiBhZGRpbmcgbmV3IHN0YXRlbWVudHMgd2hlbmV2ZXIgcG9zc2libGUpLlxuICpcbiAqIFN0YXRlbWVudHMgY3JlYXRlZCBvdXRzaWRlIG9mIHRoaXMgY2xhc3MgYXJlIG5vdCBjb25zaWRlcmVkIHdoZW4gYWRkaW5nIG5ld1xuICogcGVybWlzc2lvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTaW5nbGV0b25Qb2xpY3kgZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBpYW0uSUdyYW50YWJsZSB7XG4gIC8qKlxuICAgKiBPYnRhaW4gYSBTaW5nbGV0b25Qb2xpY3kgZm9yIGEgZ2l2ZW4gcm9sZS5cbiAgICogQHBhcmFtIHJvbGUgdGhlIFJvbGUgdGhpcyBwb2xpY3kgaXMgYm91bmQgdG8uXG4gICAqIEByZXR1cm5zIHRoZSBTaW5nbGV0b25Qb2xpY3kgZm9yIHRoaXMgcm9sZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9sZShyb2xlOiBpYW0uSVJvbGUpOiBTaW5nbGV0b25Qb2xpY3kge1xuICAgIGNvbnN0IGZvdW5kID0gcm9sZS5ub2RlLnRyeUZpbmRDaGlsZChTaW5nbGV0b25Qb2xpY3kuVVVJRCk7XG4gICAgcmV0dXJuIChmb3VuZCBhcyBTaW5nbGV0b25Qb2xpY3kpIHx8IG5ldyBTaW5nbGV0b25Qb2xpY3kocm9sZSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBVVUlEID0gJzgzODllNzVmLTA4MTAtNDgzOC1iZjY0LWQ2Zjg1YTk1Y2Y4Myc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbDtcblxuICBwcml2YXRlIHN0YXRlbWVudHM6IHsgW2tleTogc3RyaW5nXTogaWFtLlBvbGljeVN0YXRlbWVudCB9ID0ge307XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHJvbGU6IGlhbS5JUm9sZSkge1xuICAgIHN1cGVyKHJvbGUgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3QsIFNpbmdsZXRvblBvbGljeS5VVUlEKTtcbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gcm9sZTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudEV4ZWN1dGVDaGFuZ2VTZXQocHJvcHM6IHsgc3RhY2tOYW1lOiBzdHJpbmcsIGNoYW5nZVNldE5hbWU6IHN0cmluZywgcmVnaW9uPzogc3RyaW5nIH0pOiB2b2lkIHtcbiAgICB0aGlzLnN0YXRlbWVudEZvcih7XG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrcycsXG4gICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZUNoYW5nZVNldCcsXG4gICAgICAgICdjbG91ZGZvcm1hdGlvbjpFeGVjdXRlQ2hhbmdlU2V0JyxcbiAgICAgIF0sXG4gICAgICBjb25kaXRpb25zOiB7wqBTdHJpbmdFcXVhbHNJZkV4aXN0czogeyAnY2xvdWRmb3JtYXRpb246Q2hhbmdlU2V0TmFtZSc6IHByb3BzLmNoYW5nZVNldE5hbWUgfSB9LFxuICAgIH0pLmFkZFJlc291cmNlcyh0aGlzLnN0YWNrQXJuRnJvbVByb3BzKHByb3BzKSk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRDcmVhdGVSZXBsYWNlQ2hhbmdlU2V0KHByb3BzOiB7IHN0YWNrTmFtZTogc3RyaW5nLCBjaGFuZ2VTZXROYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZyB9KTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZW1lbnRGb3Ioe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnY2xvdWRmb3JtYXRpb246Q3JlYXRlQ2hhbmdlU2V0JyxcbiAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkRlbGV0ZUNoYW5nZVNldCcsXG4gICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZUNoYW5nZVNldCcsXG4gICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrcycsXG4gICAgICBdLFxuICAgICAgY29uZGl0aW9uczogeyBTdHJpbmdFcXVhbHNJZkV4aXN0czogeyAnY2xvdWRmb3JtYXRpb246Q2hhbmdlU2V0TmFtZSc6IHByb3BzLmNoYW5nZVNldE5hbWUgfSB9LFxuICAgIH0pLmFkZFJlc291cmNlcyh0aGlzLnN0YWNrQXJuRnJvbVByb3BzKHByb3BzKSk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRDcmVhdGVVcGRhdGVTdGFjayhwcm9wczogeyBzdGFja05hbWU6IHN0cmluZywgcmVwbGFjZU9uRmFpbHVyZT86IGJvb2xlYW4sIHJlZ2lvbj86IHN0cmluZyB9KTogdm9pZCB7XG4gICAgY29uc3QgYWN0aW9ucyA9IFtcbiAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrKicsXG4gICAgICAnY2xvdWRmb3JtYXRpb246Q3JlYXRlU3RhY2snLFxuICAgICAgJ2Nsb3VkZm9ybWF0aW9uOlVwZGF0ZVN0YWNrJyxcbiAgICAgICdjbG91ZGZvcm1hdGlvbjpHZXRUZW1wbGF0ZSonLFxuICAgICAgJ2Nsb3VkZm9ybWF0aW9uOlZhbGlkYXRlVGVtcGxhdGUnLFxuICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkdldFN0YWNrUG9saWN5JyxcbiAgICAgICdjbG91ZGZvcm1hdGlvbjpTZXRTdGFja1BvbGljeScsXG4gICAgXTtcbiAgICBpZiAocHJvcHMucmVwbGFjZU9uRmFpbHVyZSkge1xuICAgICAgYWN0aW9ucy5wdXNoKCdjbG91ZGZvcm1hdGlvbjpEZWxldGVTdGFjaycpO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlbWVudEZvcih7IGFjdGlvbnMgfSkuYWRkUmVzb3VyY2VzKHRoaXMuc3RhY2tBcm5Gcm9tUHJvcHMocHJvcHMpKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudENyZWF0ZVVwZGF0ZVN0YWNrU2V0KHByb3BzOiB7IHN0YWNrU2V0TmFtZTogc3RyaW5nLCByZWdpb24/OiBzdHJpbmcgfSk6IHZvaWQge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBbXG4gICAgICAnY2xvdWRmb3JtYXRpb246Q3JlYXRlU3RhY2tTZXQnLFxuICAgICAgJ2Nsb3VkZm9ybWF0aW9uOlVwZGF0ZVN0YWNrU2V0JyxcbiAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrU2V0JyxcbiAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrU2V0T3BlcmF0aW9uJyxcbiAgICAgICdjbG91ZGZvcm1hdGlvbjpMaXN0U3RhY2tJbnN0YW5jZXMnLFxuICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkNyZWF0ZVN0YWNrSW5zdGFuY2VzJyxcbiAgICBdO1xuICAgIHRoaXMuc3RhdGVtZW50Rm9yKHsgYWN0aW9ucyB9KS5hZGRSZXNvdXJjZXModGhpcy5zdGFja1NldEFybkZyb21Qcm9wcyhwcm9wcykpO1xuICB9XG5cbiAgcHVibGljIGdyYW50RGVsZXRlU3RhY2socHJvcHM6IHsgc3RhY2tOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZyB9KTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZW1lbnRGb3Ioe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnY2xvdWRmb3JtYXRpb246RGVzY3JpYmVTdGFjayonLFxuICAgICAgICAnY2xvdWRmb3JtYXRpb246RGVsZXRlU3RhY2snLFxuICAgICAgXSxcbiAgICB9KS5hZGRSZXNvdXJjZXModGhpcy5zdGFja0FybkZyb21Qcm9wcyhwcm9wcykpO1xuICB9XG5cbiAgcHVibGljIGdyYW50UGFzc1JvbGUocm9sZTogaWFtLklSb2xlIHwgc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZW1lbnRGb3IoeyBhY3Rpb25zOiBbJ2lhbTpQYXNzUm9sZSddIH0pLmFkZFJlc291cmNlcyh0eXBlb2Ygcm9sZSA9PT0gJ3N0cmluZycgPyByb2xlIDogcm9sZS5yb2xlQXJuKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGVtZW50Rm9yKHRlbXBsYXRlOiBTdGF0ZW1lbnRUZW1wbGF0ZSk6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IGtleUZvcih0ZW1wbGF0ZSk7XG4gICAgaWYgKCEoa2V5IGluIHRoaXMuc3RhdGVtZW50cykpIHtcbiAgICAgIHRoaXMuc3RhdGVtZW50c1trZXldID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoeyBhY3Rpb25zOiB0ZW1wbGF0ZS5hY3Rpb25zIH0pO1xuICAgICAgaWYgKHRlbXBsYXRlLmNvbmRpdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zdGF0ZW1lbnRzW2tleV0uYWRkQ29uZGl0aW9ucyh0ZW1wbGF0ZS5jb25kaXRpb25zKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucm9sZS5hZGRUb1BvbGljeSh0aGlzLnN0YXRlbWVudHNba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YXRlbWVudHNba2V5XTtcblxuICAgIGZ1bmN0aW9uIGtleUZvcihwcm9wczogU3RhdGVtZW50VGVtcGxhdGUpOiBzdHJpbmcge1xuICAgICAgY29uc3QgYWN0aW9ucyA9IGAke3Byb3BzLmFjdGlvbnMuc29ydCgpLmpvaW4oJ1xceDFGJyl9YDtcbiAgICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBmb3JtYXRDb25kaXRpb25zKHByb3BzLmNvbmRpdGlvbnMpO1xuICAgICAgcmV0dXJuIGAke2FjdGlvbnN9XFx4MUQke2NvbmRpdGlvbnN9YDtcblxuICAgICAgZnVuY3Rpb24gZm9ybWF0Q29uZGl0aW9ucyhjb25kPzogU3RhdGVtZW50Q29uZGl0aW9uKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGNvbmQgPT0gbnVsbCkgeyByZXR1cm4gJyc7IH1cbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IG9wIG9mIE9iamVjdC5rZXlzKGNvbmQpLnNvcnQoKSkge1xuICAgICAgICAgIHJlc3VsdCArPSBgJHtvcH1cXHgxRWA7XG4gICAgICAgICAgY29uc3QgY29uZGl0aW9uID0gY29uZFtvcF07XG4gICAgICAgICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgT2JqZWN0LmtleXMoY29uZGl0aW9uKS5zb3J0KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29uZGl0aW9uW2F0dHJpYnV0ZV07XG4gICAgICAgICAgICByZXN1bHQgKz0gYCR7dmFsdWV9XFx4MUZgO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhY2tBcm5Gcm9tUHJvcHMocHJvcHM6IHsgc3RhY2tOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZyB9KTogc3RyaW5nIHtcbiAgICByZXR1cm4gY2RrLlN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICByZWdpb246IHByb3BzLnJlZ2lvbixcbiAgICAgIHNlcnZpY2U6ICdjbG91ZGZvcm1hdGlvbicsXG4gICAgICByZXNvdXJjZTogJ3N0YWNrJyxcbiAgICAgIHJlc291cmNlTmFtZTogYCR7cHJvcHMuc3RhY2tOYW1lfS8qYCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhY2tTZXRBcm5Gcm9tUHJvcHMocHJvcHM6IHsgc3RhY2tTZXROYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZyB9KTogc3RyaW5nIHtcbiAgICByZXR1cm4gY2RrLlN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICByZWdpb246IHByb3BzLnJlZ2lvbixcbiAgICAgIHNlcnZpY2U6ICdjbG91ZGZvcm1hdGlvbicsXG4gICAgICByZXNvdXJjZTogJ3N0YWNrc2V0JyxcbiAgICAgIHJlc291cmNlTmFtZTogYCR7cHJvcHMuc3RhY2tTZXROYW1lfToqYCxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRlbWVudFRlbXBsYXRlIHtcbiAgYWN0aW9uczogc3RyaW5nW107XG4gIGNvbmRpdGlvbnM/OiBTdGF0ZW1lbnRDb25kaXRpb247XG59XG5cbmV4cG9ydCB0eXBlIFN0YXRlbWVudENvbmRpdGlvbiA9IHsgW29wOiBzdHJpbmddOiB7IFthdHRyaWJ1dGU6IHN0cmluZ106IHN0cmluZyB9IH07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNhcGFiaWxpdGllcyhjYXBhYmlsaXRpZXM6IGNkay5DZm5DYXBhYmlsaXRpZXNbXSB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGlmIChjYXBhYmlsaXRpZXMgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAoY2FwYWJpbGl0aWVzLmxlbmd0aCA9PT0gMSkge1xuICAgIGNvbnN0IGNhcGFiaWxpdHkgPSBjYXBhYmlsaXRpZXMudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gKGNhcGFiaWxpdHkgPT09ICcnKSA/IHVuZGVmaW5lZCA6IGNhcGFiaWxpdHk7XG4gIH0gZWxzZSBpZiAoY2FwYWJpbGl0aWVzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gY2FwYWJpbGl0aWVzLmpvaW4oJywnKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59Il19