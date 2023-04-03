"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFrontTarget = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
/**
 * Use a CloudFront Distribution as an alias record target
 */
class CloudFrontTarget {
    constructor(distribution) {
        this.distribution = distribution;
    }
    /**
     * Get the hosted zone id for the current scope.
     *
     * @param scope - scope in which this resource is defined
     */
    static getHostedZoneId(scope) {
        const mappingName = 'AWSCloudFrontPartitionHostedZoneIdMap';
        const scopeStack = core_1.Stack.of(scope);
        let mapping = scopeStack.node.tryFindChild(mappingName) ??
            new core_1.CfnMapping(scopeStack, mappingName, {
                mapping: {
                    ['aws']: {
                        zoneId: 'Z2FDTNDATAQYW2',
                    },
                    ['aws-cn']: {
                        zoneId: 'Z3RFFRIM2A3IF5',
                    },
                },
            });
        return mapping.findInMap(core_1.Aws.PARTITION, 'zoneId');
    }
    bind(_record, _zone) {
        return {
            hostedZoneId: CloudFrontTarget.getHostedZoneId(this.distribution),
            dnsName: this.distribution.distributionDomainName,
        };
    }
}
exports.CloudFrontTarget = CloudFrontTarget;
_a = JSII_RTTI_SYMBOL_1;
CloudFrontTarget[_a] = { fqn: "@aws-cdk/aws-route53-targets.CloudFrontTarget", version: "0.0.0" };
/**
 * The hosted zone Id if using an alias record in Route53.
 * This value never changes.
 */
CloudFrontTarget.CLOUDFRONT_ZONE_ID = 'Z2FDTNDATAQYW2';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRmcm9udC10YXJnZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbG91ZGZyb250LXRhcmdldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLHdDQUF1RDtBQUd2RDs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBZ0MzQixZQUE2QixZQUFzQztRQUF0QyxpQkFBWSxHQUFaLFlBQVksQ0FBMEI7S0FDbEU7SUExQkQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBaUI7UUFDN0MsTUFBTSxXQUFXLEdBQUcsdUNBQXVDLENBQUM7UUFDNUQsTUFBTSxVQUFVLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuQyxJQUFJLE9BQU8sR0FDUixVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQWdCO1lBQ3pELElBQUksaUJBQVUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFO2dCQUN0QyxPQUFPLEVBQUU7b0JBQ1AsQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDUCxNQUFNLEVBQUUsZ0JBQWdCO3FCQUN6QjtvQkFDRCxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUNWLE1BQU0sRUFBRSxnQkFBZ0I7cUJBQ3pCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBRUwsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbkQ7SUFLTSxJQUFJLENBQUMsT0FBMkIsRUFBRSxLQUEyQjtRQUNsRSxPQUFPO1lBQ0wsWUFBWSxFQUFFLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ2pFLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLHNCQUFzQjtTQUNsRCxDQUFDO0tBQ0g7O0FBeENILDRDQXlDQzs7O0FBeENDOzs7R0FHRztBQUNvQixtQ0FBa0IsR0FBRyxnQkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3VkZnJvbnQnO1xuaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgeyBBd3MsIENmbk1hcHBpbmcsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogVXNlIGEgQ2xvdWRGcm9udCBEaXN0cmlidXRpb24gYXMgYW4gYWxpYXMgcmVjb3JkIHRhcmdldFxuICovXG5leHBvcnQgY2xhc3MgQ2xvdWRGcm9udFRhcmdldCBpbXBsZW1lbnRzIHJvdXRlNTMuSUFsaWFzUmVjb3JkVGFyZ2V0IHtcbiAgLyoqXG4gICAqIFRoZSBob3N0ZWQgem9uZSBJZCBpZiB1c2luZyBhbiBhbGlhcyByZWNvcmQgaW4gUm91dGU1My5cbiAgICogVGhpcyB2YWx1ZSBuZXZlciBjaGFuZ2VzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBDTE9VREZST05UX1pPTkVfSUQgPSAnWjJGRFROREFUQVFZVzInO1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGhvc3RlZCB6b25lIGlkIGZvciB0aGUgY3VycmVudCBzY29wZS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldEhvc3RlZFpvbmVJZChzY29wZTogSUNvbnN0cnVjdCkge1xuICAgIGNvbnN0IG1hcHBpbmdOYW1lID0gJ0FXU0Nsb3VkRnJvbnRQYXJ0aXRpb25Ib3N0ZWRab25lSWRNYXAnO1xuICAgIGNvbnN0IHNjb3BlU3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG5cbiAgICBsZXQgbWFwcGluZyA9XG4gICAgICAoc2NvcGVTdGFjay5ub2RlLnRyeUZpbmRDaGlsZChtYXBwaW5nTmFtZSkgYXMgQ2ZuTWFwcGluZykgPz9cbiAgICAgIG5ldyBDZm5NYXBwaW5nKHNjb3BlU3RhY2ssIG1hcHBpbmdOYW1lLCB7XG4gICAgICAgIG1hcHBpbmc6IHtcbiAgICAgICAgICBbJ2F3cyddOiB7XG4gICAgICAgICAgICB6b25lSWQ6ICdaMkZEVE5EQVRBUVlXMicsIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTMtYWxpYXN0YXJnZXQuaHRtbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgWydhd3MtY24nXToge1xuICAgICAgICAgICAgem9uZUlkOiAnWjNSRkZSSU0yQTNJRjUnLCAvLyBodHRwczovL2RvY3MuYW1hem9uYXdzLmNuL2VuX3VzL2F3cy9sYXRlc3QvdXNlcmd1aWRlL3JvdXRlNTMuaHRtbFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIHJldHVybiBtYXBwaW5nLmZpbmRJbk1hcChBd3MuUEFSVElUSU9OLCAnem9uZUlkJyk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGRpc3RyaWJ1dGlvbjogY2xvdWRmcm9udC5JRGlzdHJpYnV0aW9uKSB7XG4gIH1cblxuICBwdWJsaWMgYmluZChfcmVjb3JkOiByb3V0ZTUzLklSZWNvcmRTZXQsIF96b25lPzogcm91dGU1My5JSG9zdGVkWm9uZSk6IHJvdXRlNTMuQWxpYXNSZWNvcmRUYXJnZXRDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBob3N0ZWRab25lSWQ6IENsb3VkRnJvbnRUYXJnZXQuZ2V0SG9zdGVkWm9uZUlkKHRoaXMuZGlzdHJpYnV0aW9uKSxcbiAgICAgIGRuc05hbWU6IHRoaXMuZGlzdHJpYnV0aW9uLmRpc3RyaWJ1dGlvbkRvbWFpbk5hbWUsXG4gICAgfTtcbiAgfVxufVxuIl19