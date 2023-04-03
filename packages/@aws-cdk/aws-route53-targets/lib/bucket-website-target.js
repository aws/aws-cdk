"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketWebsiteTarget = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const region_info_1 = require("@aws-cdk/region-info");
/**
 * Use a S3 as an alias record target
 */
class BucketWebsiteTarget {
    constructor(bucket) {
        this.bucket = bucket;
    }
    bind(_record, _zone) {
        const { region } = core_1.Stack.of(this.bucket.stack);
        if (core_1.Token.isUnresolved(region)) {
            throw new Error([
                'Cannot use an S3 record alias in region-agnostic stacks.',
                'You must specify a specific region when you define the stack',
                '(see https://docs.aws.amazon.com/cdk/latest/guide/environments.html)',
            ].join(' '));
        }
        const { s3StaticWebsiteHostedZoneId: hostedZoneId, s3StaticWebsiteEndpoint: dnsName } = region_info_1.RegionInfo.get(region);
        if (!hostedZoneId || !dnsName) {
            throw new Error(`Bucket website target is not supported for the "${region}" region`);
        }
        return { hostedZoneId, dnsName };
    }
}
exports.BucketWebsiteTarget = BucketWebsiteTarget;
_a = JSII_RTTI_SYMBOL_1;
BucketWebsiteTarget[_a] = { fqn: "@aws-cdk/aws-route53-targets.BucketWebsiteTarget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LXdlYnNpdGUtdGFyZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVja2V0LXdlYnNpdGUtdGFyZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsd0NBQTZDO0FBQzdDLHNEQUFrRDtBQUVsRDs7R0FFRztBQUNILE1BQWEsbUJBQW1CO0lBQzlCLFlBQTZCLE1BQWtCO1FBQWxCLFdBQU0sR0FBTixNQUFNLENBQVk7S0FDOUM7SUFFTSxJQUFJLENBQUMsT0FBMkIsRUFBRSxLQUEyQjtRQUNsRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9DLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDO2dCQUNkLDBEQUEwRDtnQkFDMUQsOERBQThEO2dCQUM5RCxzRUFBc0U7YUFDdkUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNkO1FBRUQsTUFBTSxFQUFFLDJCQUEyQixFQUFFLFlBQVksRUFBRSx1QkFBdUIsRUFBRSxPQUFPLEVBQUUsR0FBRyx3QkFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvRyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELE1BQU0sVUFBVSxDQUFDLENBQUM7U0FDdEY7UUFFRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxDQUFDO0tBQ2xDOztBQXRCSCxrREF1QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFJlZ2lvbkluZm8gfSBmcm9tICdAYXdzLWNkay9yZWdpb24taW5mbyc7XG5cbi8qKlxuICogVXNlIGEgUzMgYXMgYW4gYWxpYXMgcmVjb3JkIHRhcmdldFxuICovXG5leHBvcnQgY2xhc3MgQnVja2V0V2Vic2l0ZVRhcmdldCBpbXBsZW1lbnRzIHJvdXRlNTMuSUFsaWFzUmVjb3JkVGFyZ2V0IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBidWNrZXQ6IHMzLklCdWNrZXQpIHtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9yZWNvcmQ6IHJvdXRlNTMuSVJlY29yZFNldCwgX3pvbmU/OiByb3V0ZTUzLklIb3N0ZWRab25lKTogcm91dGU1My5BbGlhc1JlY29yZFRhcmdldENvbmZpZyB7XG4gICAgY29uc3QgeyByZWdpb24gfSA9IFN0YWNrLm9mKHRoaXMuYnVja2V0LnN0YWNrKTtcblxuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQocmVnaW9uKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFtcbiAgICAgICAgJ0Nhbm5vdCB1c2UgYW4gUzMgcmVjb3JkIGFsaWFzIGluIHJlZ2lvbi1hZ25vc3RpYyBzdGFja3MuJyxcbiAgICAgICAgJ1lvdSBtdXN0IHNwZWNpZnkgYSBzcGVjaWZpYyByZWdpb24gd2hlbiB5b3UgZGVmaW5lIHRoZSBzdGFjaycsXG4gICAgICAgICcoc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2Vudmlyb25tZW50cy5odG1sKScsXG4gICAgICBdLmpvaW4oJyAnKSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzM1N0YXRpY1dlYnNpdGVIb3N0ZWRab25lSWQ6IGhvc3RlZFpvbmVJZCwgczNTdGF0aWNXZWJzaXRlRW5kcG9pbnQ6IGRuc05hbWUgfSA9IFJlZ2lvbkluZm8uZ2V0KHJlZ2lvbik7XG5cbiAgICBpZiAoIWhvc3RlZFpvbmVJZCB8fCAhZG5zTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBCdWNrZXQgd2Vic2l0ZSB0YXJnZXQgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhlIFwiJHtyZWdpb259XCIgcmVnaW9uYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgaG9zdGVkWm9uZUlkLCBkbnNOYW1lIH07XG4gIH1cbn1cbiJdfQ==