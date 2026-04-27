"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenIdConnectProvider = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("aws-cdk-lib/aws-iam");
const metadata_resource_1 = require("aws-cdk-lib/core/lib/metadata-resource");
const prop_injectable_1 = require("aws-cdk-lib/core/lib/prop-injectable");
/**
 * IAM OIDC identity providers are entities in IAM that describe an external
 * identity provider (IdP) service that supports the OpenID Connect (OIDC)
 * standard, such as Google or Salesforce. You use an IAM OIDC identity provider
 * when you want to establish trust between an OIDC-compatible IdP and your AWS
 * account.
 *
 * This implementation has default values for thumbprints and clientIds props
 * that will be compatible with the eks cluster
 *
 * @see http://openid.net/connect
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html
 *
 * @resource AWS::CloudFormation::CustomResource
 */
let OpenIdConnectProvider = (() => {
    let _classDecorators = [prop_injectable_1.propertyInjectable];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = iam.OpenIdConnectProvider;
    var OpenIdConnectProvider = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            OpenIdConnectProvider = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.OpenIdConnectProvider", version: "0.0.0" };
        /** Uniquely identifies this class. */
        static PROPERTY_INJECTION_ID = '@aws-cdk.aws-eks-v2-alpha.OpenIdConnectProvider';
        /**
         * Defines an OpenID Connect provider.
         * @param scope The definition scope
         * @param id Construct ID
         * @param props Initialization properties
         */
        constructor(scope, id, props) {
            try {
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_OpenIdConnectProviderProps(props);
            }
            catch (error) {
                if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                    Error.captureStackTrace(error, OpenIdConnectProvider);
                }
                throw error;
            }
            const clientIds = ['sts.amazonaws.com'];
            super(scope, id, {
                url: props.url,
                clientIds,
            });
            // Enhanced CDK Analytics Telemetry
            (0, metadata_resource_1.addConstructMetadata)(this, props);
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return OpenIdConnectProvider = _classThis;
})();
exports.OpenIdConnectProvider = OpenIdConnectProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9pZGMtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQTJDO0FBQzNDLDhFQUE4RTtBQUM5RSwwRUFBMEU7QUFvQjFFOzs7Ozs7Ozs7Ozs7OztHQWNHO0lBRVUscUJBQXFCOzRCQURqQyxvQ0FBa0I7Ozs7c0JBQ3dCLEdBQUcsQ0FBQyxxQkFBcUI7cUNBQWpDLFNBQVEsV0FBeUI7Ozs7WUFBcEUsNktBb0JDOzs7OztRQW5CQyxzQ0FBc0M7UUFDL0IsTUFBTSxDQUFVLHFCQUFxQixHQUFXLGlEQUFpRCxDQUFDO1FBRXpHOzs7OztXQUtHO1FBQ0gsWUFBbUIsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBaUM7Ozs7OzttREFWdkUscUJBQXFCOzs7O1lBVzlCLE1BQU0sU0FBUyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUV4QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtnQkFDZixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7Z0JBQ2QsU0FBUzthQUNWLENBQUMsQ0FBQztZQUNILG1DQUFtQztZQUNuQyxJQUFBLHdDQUFvQixFQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNuQzs7WUFuQlUsdURBQXFCOzs7OztBQUFyQixzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBhZGRDb25zdHJ1Y3RNZXRhZGF0YSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUvbGliL21ldGFkYXRhLXJlc291cmNlJztcbmltcG9ydCB7IHByb3BlcnR5SW5qZWN0YWJsZSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUvbGliL3Byb3AtaW5qZWN0YWJsZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBJbml0aWFsaXphdGlvbiBwcm9wZXJ0aWVzIGZvciBgT3BlbklkQ29ubmVjdFByb3ZpZGVyYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPcGVuSWRDb25uZWN0UHJvdmlkZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgVVJMIG9mIHRoZSBpZGVudGl0eSBwcm92aWRlci4gVGhlIFVSTCBtdXN0IGJlZ2luIHdpdGggaHR0cHM6Ly8gYW5kXG4gICAqIHNob3VsZCBjb3JyZXNwb25kIHRvIHRoZSBpc3MgY2xhaW0gaW4gdGhlIHByb3ZpZGVyJ3MgT3BlbklEIENvbm5lY3QgSURcbiAgICogdG9rZW5zLiBQZXIgdGhlIE9JREMgc3RhbmRhcmQsIHBhdGggY29tcG9uZW50cyBhcmUgYWxsb3dlZCBidXQgcXVlcnlcbiAgICogcGFyYW1ldGVycyBhcmUgbm90LiBUeXBpY2FsbHkgdGhlIFVSTCBjb25zaXN0cyBvZiBvbmx5IGEgaG9zdG5hbWUsIGxpa2VcbiAgICogaHR0cHM6Ly9zZXJ2ZXIuZXhhbXBsZS5vcmcgb3IgaHR0cHM6Ly9leGFtcGxlLmNvbS5cbiAgICpcbiAgICogWW91IGNhbiBmaW5kIHlvdXIgT0lEQyBJc3N1ZXIgVVJMIGJ5OlxuICAgKiBhd3MgZWtzIGRlc2NyaWJlLWNsdXN0ZXIgLS1uYW1lICVjbHVzdGVyX25hbWUlIC0tcXVlcnkgXCJjbHVzdGVyLmlkZW50aXR5Lm9pZGMuaXNzdWVyXCIgLS1vdXRwdXQgdGV4dFxuICAgKi9cbiAgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG59XG5cbi8qKlxuICogSUFNIE9JREMgaWRlbnRpdHkgcHJvdmlkZXJzIGFyZSBlbnRpdGllcyBpbiBJQU0gdGhhdCBkZXNjcmliZSBhbiBleHRlcm5hbFxuICogaWRlbnRpdHkgcHJvdmlkZXIgKElkUCkgc2VydmljZSB0aGF0IHN1cHBvcnRzIHRoZSBPcGVuSUQgQ29ubmVjdCAoT0lEQylcbiAqIHN0YW5kYXJkLCBzdWNoIGFzIEdvb2dsZSBvciBTYWxlc2ZvcmNlLiBZb3UgdXNlIGFuIElBTSBPSURDIGlkZW50aXR5IHByb3ZpZGVyXG4gKiB3aGVuIHlvdSB3YW50IHRvIGVzdGFibGlzaCB0cnVzdCBiZXR3ZWVuIGFuIE9JREMtY29tcGF0aWJsZSBJZFAgYW5kIHlvdXIgQVdTXG4gKiBhY2NvdW50LlxuICpcbiAqIFRoaXMgaW1wbGVtZW50YXRpb24gaGFzIGRlZmF1bHQgdmFsdWVzIGZvciB0aHVtYnByaW50cyBhbmQgY2xpZW50SWRzIHByb3BzXG4gKiB0aGF0IHdpbGwgYmUgY29tcGF0aWJsZSB3aXRoIHRoZSBla3MgY2x1c3RlclxuICpcbiAqIEBzZWUgaHR0cDovL29wZW5pZC5uZXQvY29ubmVjdFxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvaWRfcm9sZXNfcHJvdmlkZXJzX29pZGMuaHRtbFxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZVxuICovXG5AcHJvcGVydHlJbmplY3RhYmxlXG5leHBvcnQgY2xhc3MgT3BlbklkQ29ubmVjdFByb3ZpZGVyIGV4dGVuZHMgaWFtLk9wZW5JZENvbm5lY3RQcm92aWRlciB7XG4gIC8qKiBVbmlxdWVseSBpZGVudGlmaWVzIHRoaXMgY2xhc3MuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPUEVSVFlfSU5KRUNUSU9OX0lEOiBzdHJpbmcgPSAnQGF3cy1jZGsuYXdzLWVrcy12Mi1hbHBoYS5PcGVuSWRDb25uZWN0UHJvdmlkZXInO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIE9wZW5JRCBDb25uZWN0IHByb3ZpZGVyLlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIGRlZmluaXRpb24gc2NvcGVcbiAgICogQHBhcmFtIGlkIENvbnN0cnVjdCBJRFxuICAgKiBAcGFyYW0gcHJvcHMgSW5pdGlhbGl6YXRpb24gcHJvcGVydGllc1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBPcGVuSWRDb25uZWN0UHJvdmlkZXJQcm9wcykge1xuICAgIGNvbnN0IGNsaWVudElkcyA9IFsnc3RzLmFtYXpvbmF3cy5jb20nXTtcblxuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgdXJsOiBwcm9wcy51cmwsXG4gICAgICBjbGllbnRJZHMsXG4gICAgfSk7XG4gICAgLy8gRW5oYW5jZWQgQ0RLIEFuYWx5dGljcyBUZWxlbWV0cnlcbiAgICBhZGRDb25zdHJ1Y3RNZXRhZGF0YSh0aGlzLCBwcm9wcyk7XG4gIH1cbn1cbiJdfQ==