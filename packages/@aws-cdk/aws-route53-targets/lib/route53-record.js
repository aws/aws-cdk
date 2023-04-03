"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route53RecordTarget = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Use another Route 53 record as an alias record target
 */
class Route53RecordTarget {
    constructor(record) {
        this.record = record;
    }
    bind(_record, zone) {
        if (!zone) { // zone introduced as optional to avoid a breaking change
            throw new Error('Cannot bind to record without a zone');
        }
        return {
            dnsName: this.record.domainName,
            hostedZoneId: zone.hostedZoneId,
        };
    }
}
exports.Route53RecordTarget = Route53RecordTarget;
_a = JSII_RTTI_SYMBOL_1;
Route53RecordTarget[_a] = { fqn: "@aws-cdk/aws-route53-targets.Route53RecordTarget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGU1My1yZWNvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZTUzLXJlY29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBOztHQUVHO0FBQ0gsTUFBYSxtQkFBbUI7SUFDOUIsWUFBNkIsTUFBMEI7UUFBMUIsV0FBTSxHQUFOLE1BQU0sQ0FBb0I7S0FDdEQ7SUFFTSxJQUFJLENBQUMsT0FBMkIsRUFBRSxJQUEwQjtRQUNqRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUseURBQXlEO1lBQ3BFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUN6RDtRQUNELE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVO1lBQy9CLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtTQUNoQyxDQUFDO0tBQ0g7O0FBWkgsa0RBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcblxuLyoqXG4gKiBVc2UgYW5vdGhlciBSb3V0ZSA1MyByZWNvcmQgYXMgYW4gYWxpYXMgcmVjb3JkIHRhcmdldFxuICovXG5leHBvcnQgY2xhc3MgUm91dGU1M1JlY29yZFRhcmdldCBpbXBsZW1lbnRzIHJvdXRlNTMuSUFsaWFzUmVjb3JkVGFyZ2V0IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSByZWNvcmQ6IHJvdXRlNTMuSVJlY29yZFNldCkge1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3JlY29yZDogcm91dGU1My5JUmVjb3JkU2V0LCB6b25lPzogcm91dGU1My5JSG9zdGVkWm9uZSk6IHJvdXRlNTMuQWxpYXNSZWNvcmRUYXJnZXRDb25maWcge1xuICAgIGlmICghem9uZSkgeyAvLyB6b25lIGludHJvZHVjZWQgYXMgb3B0aW9uYWwgdG8gYXZvaWQgYSBicmVha2luZyBjaGFuZ2VcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGJpbmQgdG8gcmVjb3JkIHdpdGhvdXQgYSB6b25lJyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBkbnNOYW1lOiB0aGlzLnJlY29yZC5kb21haW5OYW1lLFxuICAgICAgaG9zdGVkWm9uZUlkOiB6b25lLmhvc3RlZFpvbmVJZCxcbiAgICB9O1xuICB9XG59XG4iXX0=