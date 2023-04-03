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
exports.ViaServicePrincipal = ViaServicePrincipal;
_a = JSII_RTTI_SYMBOL_1;
ViaServicePrincipal[_a] = { fqn: "@aws-cdk/aws-kms.ViaServicePrincipal", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlhLXNlcnZpY2UtcHJpbmNpcGFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmlhLXNlcnZpY2UtcHJpbmNpcGFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0NBQXdDO0FBRXhDOztHQUVHO0FBQ0gsTUFBYSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsYUFBYTtJQUd4RCxZQUE2QixXQUFtQixFQUFFLGFBQThCO1FBQzlFLEtBQUssRUFBRSxDQUFDO1FBRG1CLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBRTlDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQzdFO0lBRUQsSUFBVyxjQUFjO1FBQ3ZCLGtFQUFrRTtRQUNsRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQztRQUMvQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdEQsSUFBSSxVQUFVLENBQUMsWUFBWSxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDMUc7YUFBTTtZQUNMLFVBQVUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbEU7UUFFRCxPQUFPLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLENBQUM7S0FDMUQ7SUFFTSxZQUFZO1FBQ2pCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztLQUMzRjs7QUF6Qkgsa0RBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuXG4vKipcbiAqIEEgcHJpbmNpcGFsIHRvIGFsbG93IGFjY2VzcyB0byBhIGtleSBpZiBpdCdzIGJlaW5nIHVzZWQgdGhyb3VnaCBhbm90aGVyIEFXUyBzZXJ2aWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWFTZXJ2aWNlUHJpbmNpcGFsIGV4dGVuZHMgaWFtLlByaW5jaXBhbEJhc2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IGJhc2VQcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc2VydmljZU5hbWU6IHN0cmluZywgYmFzZVByaW5jaXBhbD86IGlhbS5JUHJpbmNpcGFsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmJhc2VQcmluY2lwYWwgPSBiYXNlUHJpbmNpcGFsID8gYmFzZVByaW5jaXBhbCA6IG5ldyBpYW0uQW55UHJpbmNpcGFsKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IGlhbS5QcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgLy8gTWFrZSBhIGNvcHkgb2YgdGhlIGJhc2UgcG9saWN5RnJhZ21lbnQgdG8gYWRkIGEgY29uZGl0aW9uIHRvIGl0XG4gICAgY29uc3QgYmFzZSA9IHRoaXMuYmFzZVByaW5jaXBhbC5wb2xpY3lGcmFnbWVudDtcbiAgICBjb25zdCBjb25kaXRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgYmFzZS5jb25kaXRpb25zKTtcblxuICAgIGlmIChjb25kaXRpb25zLlN0cmluZ0VxdWFscykge1xuICAgICAgY29uZGl0aW9ucy5TdHJpbmdFcXVhbHMgPSBPYmplY3QuYXNzaWduKHsgJ2ttczpWaWFTZXJ2aWNlJzogdGhpcy5zZXJ2aWNlTmFtZSB9LCBjb25kaXRpb25zLlN0cmluZ0VxdWFscyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmRpdGlvbnMuU3RyaW5nRXF1YWxzID0geyAna21zOlZpYVNlcnZpY2UnOiB0aGlzLnNlcnZpY2VOYW1lIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcHJpbmNpcGFsSnNvbjogYmFzZS5wcmluY2lwYWxKc29uLCBjb25kaXRpb25zIH07XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgYmFzZSA9IGlhbS5Db21wYXJhYmxlUHJpbmNpcGFsLmRlZHVwZVN0cmluZ0Zvcih0aGlzLmJhc2VQcmluY2lwYWwpO1xuICAgIHJldHVybiBiYXNlICE9PSB1bmRlZmluZWQgPyBgVmlhU2VydmljZVByaW5jaXBhbDoke3RoaXMuc2VydmljZU5hbWV9OiR7YmFzZX1gIDogdW5kZWZpbmVkO1xuICB9XG59XG4iXX0=