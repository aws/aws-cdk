"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyGroup = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const cloudfront_generated_1 = require("./cloudfront.generated");
/**
 * A Key Group configuration
 *
 * @resource AWS::CloudFront::KeyGroup
 */
class KeyGroup extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_KeyGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KeyGroup);
            }
            throw error;
        }
        const resource = new cloudfront_generated_1.CfnKeyGroup(this, 'Resource', {
            keyGroupConfig: {
                name: props.keyGroupName ?? this.generateName(),
                comment: props.comment,
                items: props.items.map(key => key.publicKeyId),
            },
        });
        this.keyGroupId = resource.ref;
    }
    /** Imports a Key Group from its id. */
    static fromKeyGroupId(scope, id, keyGroupId) {
        return new class extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.keyGroupId = keyGroupId;
            }
        }(scope, id);
    }
    generateName() {
        const name = core_1.Names.uniqueId(this);
        if (name.length > 80) {
            return name.substring(0, 40) + name.substring(name.length - 40);
        }
        return name;
    }
}
exports.KeyGroup = KeyGroup;
_a = JSII_RTTI_SYMBOL_1;
KeyGroup[_a] = { fqn: "@aws-cdk/aws-cloudfront.KeyGroup", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsia2V5LWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUEyRDtBQUUzRCxpRUFBcUQ7QUFvQ3JEOzs7O0dBSUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxlQUFRO0lBVXBDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQVhSLFFBQVE7Ozs7UUFhakIsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQ0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakQsY0FBYyxFQUFFO2dCQUNkLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQy9DLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQzthQUMvQztTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQztLQUNoQztJQXBCRCx1Q0FBdUM7SUFDaEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxVQUFrQjtRQUMzRSxPQUFPLElBQUksS0FBTSxTQUFRLGVBQVE7WUFBdEI7O2dCQUNPLGVBQVUsR0FBRyxVQUFVLENBQUM7WUFDMUMsQ0FBQztTQUFBLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2Q7SUFpQk8sWUFBWTtRQUNsQixNQUFNLElBQUksR0FBRyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDakU7UUFDRCxPQUFPLElBQUksQ0FBQztLQUNiOztBQTlCSCw0QkErQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb3VyY2UsIE5hbWVzLCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5LZXlHcm91cCB9IGZyb20gJy4vY2xvdWRmcm9udC5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVB1YmxpY0tleSB9IGZyb20gJy4vcHVibGljLWtleSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIEtleSBHcm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElLZXlHcm91cCBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIGtleSBncm91cC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkga2V5R3JvdXBJZDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGNyZWF0aW5nIGEgUHVibGljIEtleVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEtleUdyb3VwUHJvcHMge1xuICAvKipcbiAgICogQSBuYW1lIHRvIGlkZW50aWZ5IHRoZSBrZXkgZ3JvdXAuXG4gICAqIEBkZWZhdWx0IC0gZ2VuZXJhdGVkIGZyb20gdGhlIGBpZGBcbiAgICovXG4gIHJlYWRvbmx5IGtleUdyb3VwTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSBjb21tZW50IHRvIGRlc2NyaWJlIHRoZSBrZXkgZ3JvdXAuXG4gICAqIEBkZWZhdWx0IC0gbm8gY29tbWVudFxuICAgKi9cbiAgcmVhZG9ubHkgY29tbWVudD86IHN0cmluZztcblxuICAvKipcbiAgICogQSBsaXN0IG9mIHB1YmxpYyBrZXlzIHRvIGFkZCB0byB0aGUga2V5IGdyb3VwLlxuICAgKi9cbiAgcmVhZG9ubHkgaXRlbXM6IElQdWJsaWNLZXlbXTtcbn1cblxuLyoqXG4gKiBBIEtleSBHcm91cCBjb25maWd1cmF0aW9uXG4gKlxuICogQHJlc291cmNlIEFXUzo6Q2xvdWRGcm9udDo6S2V5R3JvdXBcbiAqL1xuZXhwb3J0IGNsYXNzIEtleUdyb3VwIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJS2V5R3JvdXAge1xuXG4gIC8qKiBJbXBvcnRzIGEgS2V5IEdyb3VwIGZyb20gaXRzIGlkLiAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21LZXlHcm91cElkKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGtleUdyb3VwSWQ6IHN0cmluZyk6IElLZXlHcm91cCB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUtleUdyb3VwIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBrZXlHcm91cElkID0ga2V5R3JvdXBJZDtcbiAgICB9KHNjb3BlLCBpZCk7XG4gIH1cbiAgcHVibGljIHJlYWRvbmx5IGtleUdyb3VwSWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogS2V5R3JvdXBQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5LZXlHcm91cCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBrZXlHcm91cENvbmZpZzoge1xuICAgICAgICBuYW1lOiBwcm9wcy5rZXlHcm91cE5hbWUgPz8gdGhpcy5nZW5lcmF0ZU5hbWUoKSxcbiAgICAgICAgY29tbWVudDogcHJvcHMuY29tbWVudCxcbiAgICAgICAgaXRlbXM6IHByb3BzLml0ZW1zLm1hcChrZXkgPT4ga2V5LnB1YmxpY0tleUlkKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmtleUdyb3VwSWQgPSByZXNvdXJjZS5yZWY7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlTmFtZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IG5hbWUgPSBOYW1lcy51bmlxdWVJZCh0aGlzKTtcbiAgICBpZiAobmFtZS5sZW5ndGggPiA4MCkge1xuICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyaW5nKDAsIDQwKSArIG5hbWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoIC0gNDApO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxufVxuIl19