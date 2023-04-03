"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaServicePrincipal = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
/**
 * A principal to allow access to a key if it's being used through another AWS service
 */
class ViaServicePrincipal extends iam.PrincipalBase {
    constructor(serviceName, basePrincipal) {
        super();
        this.serviceName = serviceName;
        this.basePrincipal = basePrincipal ? basePrincipal : new iam.AnyPrincipal();
    }
    get policyFragment() {
        // Make a copy of the base policyFragment to add a condition to it
        const base = this.basePrincipal.policyFragment;
        const conditions = Object.assign({}, base.conditions);
        if (conditions.StringEquals) {
            conditions.StringEquals = Object.assign({ 'kms:ViaService': this.serviceName }, conditions.StringEquals);
        }
        else {
            conditions.StringEquals = { 'kms:ViaService': this.serviceName };
        }
        return { principalJson: base.principalJson, conditions };
    }
    dedupeString() {
        const base = iam.ComparablePrincipal.dedupeStringFor(this.basePrincipal);
        return base !== undefined ? `ViaServicePrincipal:${this.serviceName}:${base}` : undefined;
    }
}
_a = JSII_RTTI_SYMBOL_1;
ViaServicePrincipal[_a] = { fqn: "@aws-cdk/aws-kms.ViaServicePrincipal", version: "0.0.0" };
exports.ViaServicePrincipal = ViaServicePrincipal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlhLXNlcnZpY2UtcHJpbmNpcGFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmlhLXNlcnZpY2UtcHJpbmNpcGFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0NBQXdDO0FBRXhDOztHQUVHO0FBQ0gsTUFBYSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsYUFBYTtJQUd4RCxZQUE2QixXQUFtQixFQUFFLGFBQThCO1FBQzlFLEtBQUssRUFBRSxDQUFDO1FBRG1CLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBRTlDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQzdFO0lBRUQsSUFBVyxjQUFjO1FBQ3ZCLGtFQUFrRTtRQUNsRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQztRQUMvQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdEQsSUFBSSxVQUFVLENBQUMsWUFBWSxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDMUc7YUFBTTtZQUNMLFVBQVUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbEU7UUFFRCxPQUFPLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLENBQUM7S0FDMUQ7SUFFTSxZQUFZO1FBQ2pCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztLQUMzRjs7OztBQXpCVSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cbi8qKlxuICogQSBwcmluY2lwYWwgdG8gYWxsb3cgYWNjZXNzIHRvIGEga2V5IGlmIGl0J3MgYmVpbmcgdXNlZCB0aHJvdWdoIGFub3RoZXIgQVdTIHNlcnZpY2VcbiAqL1xuZXhwb3J0IGNsYXNzIFZpYVNlcnZpY2VQcmluY2lwYWwgZXh0ZW5kcyBpYW0uUHJpbmNpcGFsQmFzZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYmFzZVByaW5jaXBhbDogaWFtLklQcmluY2lwYWw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nLCBiYXNlUHJpbmNpcGFsPzogaWFtLklQcmluY2lwYWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYmFzZVByaW5jaXBhbCA9IGJhc2VQcmluY2lwYWwgPyBiYXNlUHJpbmNpcGFsIDogbmV3IGlhbS5BbnlQcmluY2lwYWwoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcG9saWN5RnJhZ21lbnQoKTogaWFtLlByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICAvLyBNYWtlIGEgY29weSBvZiB0aGUgYmFzZSBwb2xpY3lGcmFnbWVudCB0byBhZGQgYSBjb25kaXRpb24gdG8gaXRcbiAgICBjb25zdCBiYXNlID0gdGhpcy5iYXNlUHJpbmNpcGFsLnBvbGljeUZyYWdtZW50O1xuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBiYXNlLmNvbmRpdGlvbnMpO1xuXG4gICAgaWYgKGNvbmRpdGlvbnMuU3RyaW5nRXF1YWxzKSB7XG4gICAgICBjb25kaXRpb25zLlN0cmluZ0VxdWFscyA9IE9iamVjdC5hc3NpZ24oeyAna21zOlZpYVNlcnZpY2UnOiB0aGlzLnNlcnZpY2VOYW1lIH0sIGNvbmRpdGlvbnMuU3RyaW5nRXF1YWxzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZGl0aW9ucy5TdHJpbmdFcXVhbHMgPSB7ICdrbXM6VmlhU2VydmljZSc6IHRoaXMuc2VydmljZU5hbWUgfTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBwcmluY2lwYWxKc29uOiBiYXNlLnByaW5jaXBhbEpzb24sIGNvbmRpdGlvbnMgfTtcbiAgfVxuXG4gIHB1YmxpYyBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBiYXNlID0gaWFtLkNvbXBhcmFibGVQcmluY2lwYWwuZGVkdXBlU3RyaW5nRm9yKHRoaXMuYmFzZVByaW5jaXBhbCk7XG4gICAgcmV0dXJuIGJhc2UgIT09IHVuZGVmaW5lZCA/IGBWaWFTZXJ2aWNlUHJpbmNpcGFsOiR7dGhpcy5zZXJ2aWNlTmFtZX06JHtiYXNlfWAgOiB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==