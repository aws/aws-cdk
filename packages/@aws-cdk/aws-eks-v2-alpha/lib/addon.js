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
exports.Addon = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const core_1 = require("aws-cdk-lib/core");
const metadata_resource_1 = require("aws-cdk-lib/core/lib/metadata-resource");
const prop_injectable_1 = require("aws-cdk-lib/core/lib/prop-injectable");
/**
 * Represents an Amazon EKS Add-On.
 * @resource AWS::EKS::Addon
 */
let Addon = (() => {
    let _classDecorators = [prop_injectable_1.propertyInjectable];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = core_1.Resource;
    var Addon = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Addon = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.Addon", version: "0.0.0" };
        /** Uniquely identifies this class. */
        static PROPERTY_INJECTION_ID = '@aws-cdk.aws-eks-v2-alpha.Addon';
        /**
         * Creates an `IAddon` instance from the given addon attributes.
         *
         * @param scope - The parent construct.
         * @param id - The construct ID.
         * @param attrs - The attributes of the addon, including the addon name and the cluster name.
         * @returns An `IAddon` instance.
         */
        static fromAddonAttributes(scope, id, attrs) {
            try {
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_AddonAttributes(attrs);
            }
            catch (error) {
                if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                    Error.captureStackTrace(error, this.fromAddonAttributes);
                }
                throw error;
            }
            class Import extends core_1.Resource {
                addonName = attrs.addonName;
                addonArn = core_1.Stack.of(scope).formatArn({
                    service: 'eks',
                    resource: 'addon',
                    resourceName: `${attrs.clusterName}/${attrs.addonName}`,
                });
            }
            return new Import(scope, id);
        }
        /**
         * Creates an `IAddon` from an existing addon ARN.
         *
         * @param scope - The parent construct.
         * @param id - The ID of the construct.
         * @param addonArn - The ARN of the addon.
         * @returns An `IAddon` implementation.
         */
        static fromAddonArn(scope, id, addonArn) {
            const parsedArn = core_1.Stack.of(scope).splitArn(addonArn, core_1.ArnFormat.COLON_RESOURCE_NAME);
            const splitResourceName = core_1.Fn.split('/', parsedArn.resourceName);
            class Import extends core_1.Resource {
                addonName = core_1.Fn.select(1, splitResourceName);
                addonArn = addonArn;
            }
            return new Import(scope, id);
        }
        /**
         * Name of the addon.
         */
        addonName;
        /**
         * Arn of the addon.
         */
        addonArn;
        clusterName;
        /**
         * Creates a new Amazon EKS Add-On.
         * @param scope The parent construct.
         * @param id The construct ID.
         * @param props The properties for the Add-On.
         */
        constructor(scope, id, props) {
            super(scope, id, {
                physicalName: props.addonName,
            });
            try {
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_AddonProps(props);
            }
            catch (error) {
                if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                    Error.captureStackTrace(error, Addon);
                }
                throw error;
            }
            // Enhanced CDK Analytics Telemetry
            (0, metadata_resource_1.addConstructMetadata)(this, props);
            this.clusterName = props.cluster.clusterName;
            this.addonName = props.addonName;
            const resource = new aws_eks_1.CfnAddon(this, 'Resource', {
                addonName: props.addonName,
                clusterName: this.clusterName,
                addonVersion: props.addonVersion,
                preserveOnDelete: props.preserveOnDelete,
                configurationValues: this.stack.toJsonString(props.configurationValues),
            });
            this.addonName = this.getResourceNameAttribute(resource.ref);
            this.addonArn = this.getResourceArnAttribute(resource.attrArn, {
                service: 'eks',
                resource: 'addon',
                resourceName: `${this.clusterName}/${this.addonName}/`,
            });
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return Addon = _classThis;
})();
exports.Addon = Addon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhZGRvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBK0M7QUFDL0MsMkNBQTZFO0FBQzdFLDhFQUE4RTtBQUM5RSwwRUFBMEU7QUF3RTFFOzs7R0FHRztJQUVVLEtBQUs7NEJBRGpCLG9DQUFrQjs7OztzQkFDUSxlQUFRO3FCQUFoQixTQUFRLFdBQVE7Ozs7WUFBbkMsNktBbUZDOzs7OztRQWxGQyxzQ0FBc0M7UUFDL0IsTUFBTSxDQUFVLHFCQUFxQixHQUFXLGlDQUFpQyxDQUFDO1FBRXpGOzs7Ozs7O1dBT0c7UUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7Ozs7Ozs7Ozs7WUFDcEYsTUFBTSxNQUFPLFNBQVEsZUFBUTtnQkFDWCxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDNUIsUUFBUSxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUNuRCxPQUFPLEVBQUUsS0FBSztvQkFDZCxRQUFRLEVBQUUsT0FBTztvQkFDakIsWUFBWSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO2lCQUN4RCxDQUFDLENBQUM7YUFDSjtZQUNELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzlCO1FBQ0Q7Ozs7Ozs7V0FPRztRQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBZ0I7WUFDdkUsTUFBTSxTQUFTLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLGdCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNwRixNQUFNLGlCQUFpQixHQUFHLFNBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxZQUFhLENBQUMsQ0FBQztZQUNqRSxNQUFNLE1BQU8sU0FBUSxlQUFRO2dCQUNYLFNBQVMsR0FBRyxTQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUM1QyxRQUFRLEdBQUcsUUFBUSxDQUFDO2FBQ3JDO1lBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDOUI7UUFFRDs7V0FFRztRQUNhLFNBQVMsQ0FBUztRQUNsQzs7V0FFRztRQUNhLFFBQVEsQ0FBUztRQUNoQixXQUFXLENBQVM7UUFFckM7Ozs7O1dBS0c7UUFDSCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWlCO1lBQ3pELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO2dCQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsU0FBUzthQUM5QixDQUFDLENBQUM7Ozs7OzttREE3RE0sS0FBSzs7OztZQThEZCxtQ0FBbUM7WUFDbkMsSUFBQSx3Q0FBb0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFFakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7Z0JBQzlDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztnQkFDMUIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUM3QixZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7Z0JBQ2hDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7Z0JBQ3hDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQzthQUN4RSxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDN0QsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRzthQUN2RCxDQUFDLENBQUM7U0FDSjs7WUFsRlUsdURBQUs7Ozs7O0FBQUwsc0JBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5BZGRvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBJUmVzb3VyY2UsIFJlc291cmNlLCBTdGFjaywgRm4gfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IGFkZENvbnN0cnVjdE1ldGFkYXRhIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZS9saWIvbWV0YWRhdGEtcmVzb3VyY2UnO1xuaW1wb3J0IHsgcHJvcGVydHlJbmplY3RhYmxlIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZS9saWIvcHJvcC1pbmplY3RhYmxlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUNsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gQW1hem9uIEVLUyBBZGQtT24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUFkZG9uIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIEFkZC1Pbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWRkb25OYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBUk4gb2YgdGhlIEFkZC1Pbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWRkb25Bcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyBhbiBBbWF6b24gRUtTIEFkZC1Pbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZGRvblByb3BzIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIEFkZC1Pbi5cbiAgICovXG4gIHJlYWRvbmx5IGFkZG9uTmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogVmVyc2lvbiBvZiB0aGUgQWRkLU9uLiBZb3UgY2FuIGNoZWNrIGFsbCBhdmFpbGFibGUgdmVyc2lvbnMgd2l0aCBkZXNjcmliZS1hZGRvbi12ZXJzaW9ucy5cbiAgICogRm9yIGV4YW1wbGUsIHRoaXMgbGlzdHMgYWxsIGF2YWlsYWJsZSB2ZXJzaW9ucyBmb3IgdGhlIGBla3MtcG9kLWlkZW50aXR5LWFnZW50YCBhZGRvbjpcbiAgICogJCBhd3MgZWtzIGRlc2NyaWJlLWFkZG9uLXZlcnNpb25zIC0tYWRkb24tbmFtZSBla3MtcG9kLWlkZW50aXR5LWFnZW50IFxcXG4gICAqIC0tcXVlcnkgJ2FkZG9uc1sqXS5hZGRvblZlcnNpb25zWypdLmFkZG9uVmVyc2lvbidcbiAgICpcbiAgICogQGRlZmF1bHQgdGhlIGxhdGVzdCB2ZXJzaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYWRkb25WZXJzaW9uPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIEVLUyBjbHVzdGVyIHRoZSBBZGQtT24gaXMgYXNzb2NpYXRlZCB3aXRoLlxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlcjogSUNsdXN0ZXI7XG4gIC8qKlxuICAgKiBTcGVjaWZ5aW5nIHRoaXMgb3B0aW9uIHByZXNlcnZlcyB0aGUgYWRkLW9uIHNvZnR3YXJlIG9uIHlvdXIgY2x1c3RlciBidXQgQW1hem9uIEVLUyBzdG9wcyBtYW5hZ2luZyBhbnkgc2V0dGluZ3MgZm9yIHRoZSBhZGQtb24uXG4gICAqIElmIGFuIElBTSBhY2NvdW50IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgYWRkLW9uLCBpdCBpc24ndCByZW1vdmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBwcmVzZXJ2ZU9uRGVsZXRlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gdmFsdWVzIGZvciB0aGUgQWRkLW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFVzZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICByZWFkb25seSBjb25maWd1cmF0aW9uVmFsdWVzPzogUmVjb3JkPHN0cmluZywgYW55Pjtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBhdHRyaWJ1dGVzIG9mIGFuIGFkZG9uIGZvciBhbiBBbWF6b24gRUtTIGNsdXN0ZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWRkb25BdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBhZGRvbi5cbiAgICovXG4gIHJlYWRvbmx5IGFkZG9uTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgQW1hem9uIEVLUyBjbHVzdGVyIHRoZSBhZGRvbiBpcyBhc3NvY2lhdGVkIHdpdGguXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyTmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gQW1hem9uIEVLUyBBZGQtT24uXG4gKiBAcmVzb3VyY2UgQVdTOjpFS1M6OkFkZG9uXG4gKi9cbkBwcm9wZXJ0eUluamVjdGFibGVcbmV4cG9ydCBjbGFzcyBBZGRvbiBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUFkZG9uIHtcbiAgLyoqIFVuaXF1ZWx5IGlkZW50aWZpZXMgdGhpcyBjbGFzcy4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQUk9QRVJUWV9JTkpFQ1RJT05fSUQ6IHN0cmluZyA9ICdAYXdzLWNkay5hd3MtZWtzLXYyLWFscGhhLkFkZG9uJztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgSUFkZG9uYCBpbnN0YW5jZSBmcm9tIHRoZSBnaXZlbiBhZGRvbiBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgLSBUaGUgcGFyZW50IGNvbnN0cnVjdC5cbiAgICogQHBhcmFtIGlkIC0gVGhlIGNvbnN0cnVjdCBJRC5cbiAgICogQHBhcmFtIGF0dHJzIC0gVGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGFkZG9uLCBpbmNsdWRpbmcgdGhlIGFkZG9uIG5hbWUgYW5kIHRoZSBjbHVzdGVyIG5hbWUuXG4gICAqIEByZXR1cm5zIEFuIGBJQWRkb25gIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQWRkb25BdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBBZGRvbkF0dHJpYnV0ZXMpOiBJQWRkb24ge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUFkZG9uIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhZGRvbk5hbWUgPSBhdHRycy5hZGRvbk5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYWRkb25Bcm4gPSBTdGFjay5vZihzY29wZSkuZm9ybWF0QXJuKHtcbiAgICAgICAgc2VydmljZTogJ2VrcycsXG4gICAgICAgIHJlc291cmNlOiAnYWRkb24nLFxuICAgICAgICByZXNvdXJjZU5hbWU6IGAke2F0dHJzLmNsdXN0ZXJOYW1lfS8ke2F0dHJzLmFkZG9uTmFtZX1gLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYElBZGRvbmAgZnJvbSBhbiBleGlzdGluZyBhZGRvbiBBUk4uXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSAtIFRoZSBwYXJlbnQgY29uc3RydWN0LlxuICAgKiBAcGFyYW0gaWQgLSBUaGUgSUQgb2YgdGhlIGNvbnN0cnVjdC5cbiAgICogQHBhcmFtIGFkZG9uQXJuIC0gVGhlIEFSTiBvZiB0aGUgYWRkb24uXG4gICAqIEByZXR1cm5zIEFuIGBJQWRkb25gIGltcGxlbWVudGF0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQWRkb25Bcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYWRkb25Bcm46IHN0cmluZyk6IElBZGRvbiB7XG4gICAgY29uc3QgcGFyc2VkQXJuID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKGFkZG9uQXJuLCBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSk7XG4gICAgY29uc3Qgc3BsaXRSZXNvdXJjZU5hbWUgPSBGbi5zcGxpdCgnLycsIHBhcnNlZEFybi5yZXNvdXJjZU5hbWUhKTtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElBZGRvbiB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYWRkb25OYW1lID0gRm4uc2VsZWN0KDEsIHNwbGl0UmVzb3VyY2VOYW1lKTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhZGRvbkFybiA9IGFkZG9uQXJuO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgYWRkb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWRkb25OYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBcm4gb2YgdGhlIGFkZG9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFkZG9uQXJuOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2x1c3Rlck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBBbWF6b24gRUtTIEFkZC1Pbi5cbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY29uc3RydWN0LlxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCBJRC5cbiAgICogQHBhcmFtIHByb3BzIFRoZSBwcm9wZXJ0aWVzIGZvciB0aGUgQWRkLU9uLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFkZG9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuYWRkb25OYW1lLFxuICAgIH0pO1xuICAgIC8vIEVuaGFuY2VkIENESyBBbmFseXRpY3MgVGVsZW1ldHJ5XG4gICAgYWRkQ29uc3RydWN0TWV0YWRhdGEodGhpcywgcHJvcHMpO1xuXG4gICAgdGhpcy5jbHVzdGVyTmFtZSA9IHByb3BzLmNsdXN0ZXIuY2x1c3Rlck5hbWU7XG4gICAgdGhpcy5hZGRvbk5hbWUgPSBwcm9wcy5hZGRvbk5hbWU7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5BZGRvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBhZGRvbk5hbWU6IHByb3BzLmFkZG9uTmFtZSxcbiAgICAgIGNsdXN0ZXJOYW1lOiB0aGlzLmNsdXN0ZXJOYW1lLFxuICAgICAgYWRkb25WZXJzaW9uOiBwcm9wcy5hZGRvblZlcnNpb24sXG4gICAgICBwcmVzZXJ2ZU9uRGVsZXRlOiBwcm9wcy5wcmVzZXJ2ZU9uRGVsZXRlLFxuICAgICAgY29uZmlndXJhdGlvblZhbHVlczogdGhpcy5zdGFjay50b0pzb25TdHJpbmcocHJvcHMuY29uZmlndXJhdGlvblZhbHVlcyksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZG9uTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG4gICAgdGhpcy5hZGRvbkFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzb3VyY2UuYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2VrcycsXG4gICAgICByZXNvdXJjZTogJ2FkZG9uJyxcbiAgICAgIHJlc291cmNlTmFtZTogYCR7dGhpcy5jbHVzdGVyTmFtZX0vJHt0aGlzLmFkZG9uTmFtZX0vYCxcbiAgICB9KTtcbiAgfVxufVxuIl19