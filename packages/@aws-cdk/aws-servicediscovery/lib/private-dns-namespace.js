"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateDnsNamespace = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const namespace_1 = require("./namespace");
const service_1 = require("./service");
const servicediscovery_generated_1 = require("./servicediscovery.generated");
/**
 * Define a Service Discovery HTTP Namespace
 */
class PrivateDnsNamespace extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_PrivateDnsNamespaceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PrivateDnsNamespace);
            }
            throw error;
        }
        if (props.vpc === undefined) {
            throw new Error('VPC must be specified for PrivateDNSNamespaces');
        }
        const ns = new servicediscovery_generated_1.CfnPrivateDnsNamespace(this, 'Resource', {
            name: props.name,
            description: props.description,
            vpc: props.vpc.vpcId,
        });
        this.namespaceName = props.name;
        this.namespaceId = ns.attrId;
        this.namespaceArn = ns.attrArn;
        this.namespaceHostedZoneId = ns.attrHostedZoneId;
        this.type = namespace_1.NamespaceType.DNS_PRIVATE;
    }
    static fromPrivateDnsNamespaceAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_PrivateDnsNamespaceAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromPrivateDnsNamespaceAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.namespaceName = attrs.namespaceName;
                this.namespaceId = attrs.namespaceId;
                this.namespaceArn = attrs.namespaceArn;
                this.type = namespace_1.NamespaceType.DNS_PRIVATE;
            }
        }
        return new Import(scope, id);
    }
    /** @attribute */
    get privateDnsNamespaceArn() { return this.namespaceArn; }
    /** @attribute */
    get privateDnsNamespaceName() { return this.namespaceName; }
    /** @attribute */
    get privateDnsNamespaceId() { return this.namespaceId; }
    /**
     * Creates a service within the namespace
     */
    createService(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_DnsServiceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.createService);
            }
            throw error;
        }
        return new service_1.Service(this, id, {
            namespace: this,
            ...props,
        });
    }
}
exports.PrivateDnsNamespace = PrivateDnsNamespace;
_a = JSII_RTTI_SYMBOL_1;
PrivateDnsNamespace[_a] = { fqn: "@aws-cdk/aws-servicediscovery.PrivateDnsNamespace", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZS1kbnMtbmFtZXNwYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJpdmF0ZS1kbnMtbmFtZXNwYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUF5QztBQUV6QywyQ0FBNEU7QUFDNUUsdUNBQXFEO0FBQ3JELDZFQUFzRTtBQTRCdEU7O0dBRUc7QUFDSCxNQUFhLG1CQUFvQixTQUFRLGVBQVE7SUFxQy9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBK0I7UUFDdkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXRDUixtQkFBbUI7Ozs7UUF1QzVCLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsTUFBTSxFQUFFLEdBQUcsSUFBSSxtREFBc0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RELElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSztTQUNyQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDO1FBQ2pELElBQUksQ0FBQyxJQUFJLEdBQUcseUJBQWEsQ0FBQyxXQUFXLENBQUM7S0FDdkM7SUFwRE0sTUFBTSxDQUFDLGlDQUFpQyxDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9DOzs7Ozs7Ozs7O1FBQ2hILE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNTLGtCQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztnQkFDcEMsZ0JBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO2dCQUNoQyxpQkFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0JBQ2xDLFNBQUksR0FBRyx5QkFBYSxDQUFDLFdBQVcsQ0FBQztZQUMxQyxDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQThDRCxpQkFBaUI7SUFDakIsSUFBVyxzQkFBc0IsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtJQUVqRSxpQkFBaUI7SUFDakIsSUFBVyx1QkFBdUIsS0FBSyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtJQUVuRSxpQkFBaUI7SUFDakIsSUFBVyxxQkFBcUIsS0FBSyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtJQUUvRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxFQUFVLEVBQUUsS0FBdUI7Ozs7Ozs7Ozs7UUFDdEQsT0FBTyxJQUFJLGlCQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMzQixTQUFTLEVBQUUsSUFBSTtZQUNmLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQztLQUNKOztBQXpFSCxrREEwRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCYXNlTmFtZXNwYWNlUHJvcHMsIElOYW1lc3BhY2UsIE5hbWVzcGFjZVR5cGUgfSBmcm9tICcuL25hbWVzcGFjZSc7XG5pbXBvcnQgeyBEbnNTZXJ2aWNlUHJvcHMsIFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2UnO1xuaW1wb3J0IHsgQ2ZuUHJpdmF0ZURuc05hbWVzcGFjZSB9IGZyb20gJy4vc2VydmljZWRpc2NvdmVyeS5nZW5lcmF0ZWQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByaXZhdGVEbnNOYW1lc3BhY2VQcm9wcyBleHRlbmRzIEJhc2VOYW1lc3BhY2VQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIFZQQyB0aGF0IHlvdSB3YW50IHRvIGFzc29jaWF0ZSB0aGUgbmFtZXNwYWNlIHdpdGguXG4gICAqL1xuICByZWFkb25seSB2cGM6IGVjMi5JVnBjO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQcml2YXRlRG5zTmFtZXNwYWNlIGV4dGVuZHMgSU5hbWVzcGFjZSB7IH1cblxuZXhwb3J0IGludGVyZmFjZSBQcml2YXRlRG5zTmFtZXNwYWNlQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBBIG5hbWUgZm9yIHRoZSBOYW1lc3BhY2UuXG4gICAqL1xuICByZWFkb25seSBuYW1lc3BhY2VOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5hbWVzcGFjZSBJZCBmb3IgdGhlIE5hbWVzcGFjZS5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWVzcGFjZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5hbWVzcGFjZSBBUk4gZm9yIHRoZSBOYW1lc3BhY2UuXG4gICAqL1xuICByZWFkb25seSBuYW1lc3BhY2VBcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBTZXJ2aWNlIERpc2NvdmVyeSBIVFRQIE5hbWVzcGFjZVxuICovXG5leHBvcnQgY2xhc3MgUHJpdmF0ZURuc05hbWVzcGFjZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVByaXZhdGVEbnNOYW1lc3BhY2Uge1xuXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVByaXZhdGVEbnNOYW1lc3BhY2VBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBQcml2YXRlRG5zTmFtZXNwYWNlQXR0cmlidXRlcyk6IElQcml2YXRlRG5zTmFtZXNwYWNlIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElQcml2YXRlRG5zTmFtZXNwYWNlIHtcbiAgICAgIHB1YmxpYyBuYW1lc3BhY2VOYW1lID0gYXR0cnMubmFtZXNwYWNlTmFtZTtcbiAgICAgIHB1YmxpYyBuYW1lc3BhY2VJZCA9IGF0dHJzLm5hbWVzcGFjZUlkO1xuICAgICAgcHVibGljIG5hbWVzcGFjZUFybiA9IGF0dHJzLm5hbWVzcGFjZUFybjtcbiAgICAgIHB1YmxpYyB0eXBlID0gTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgUHJpdmF0ZURuc05hbWVzcGFjZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lc3BhY2VOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5hbWVzcGFjZSBJZCBvZiB0aGUgUHJpdmF0ZURuc05hbWVzcGFjZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lc3BhY2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lc3BhY2UgQXJuIG9mIHRoZSBuYW1lc3BhY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZXNwYWNlQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElEIG9mIGhvc3RlZCB6b25lIGNyZWF0ZWQgYnkgbmFtZXNwYWNlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZXNwYWNlSG9zdGVkWm9uZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIG5hbWVzcGFjZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBOYW1lc3BhY2VUeXBlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQcml2YXRlRG5zTmFtZXNwYWNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIGlmIChwcm9wcy52cGMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdWUEMgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIFByaXZhdGVETlNOYW1lc3BhY2VzJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbnMgPSBuZXcgQ2ZuUHJpdmF0ZURuc05hbWVzcGFjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiBwcm9wcy5uYW1lLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgdnBjOiBwcm9wcy52cGMudnBjSWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLm5hbWVzcGFjZU5hbWUgPSBwcm9wcy5uYW1lO1xuICAgIHRoaXMubmFtZXNwYWNlSWQgPSBucy5hdHRySWQ7XG4gICAgdGhpcy5uYW1lc3BhY2VBcm4gPSBucy5hdHRyQXJuO1xuICAgIHRoaXMubmFtZXNwYWNlSG9zdGVkWm9uZUlkID0gbnMuYXR0ckhvc3RlZFpvbmVJZDtcbiAgICB0aGlzLnR5cGUgPSBOYW1lc3BhY2VUeXBlLkROU19QUklWQVRFO1xuICB9XG5cbiAgLyoqIEBhdHRyaWJ1dGUgKi9cbiAgcHVibGljIGdldCBwcml2YXRlRG5zTmFtZXNwYWNlQXJuKCkgeyByZXR1cm4gdGhpcy5uYW1lc3BhY2VBcm47IH1cblxuICAvKiogQGF0dHJpYnV0ZSAqL1xuICBwdWJsaWMgZ2V0IHByaXZhdGVEbnNOYW1lc3BhY2VOYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lc3BhY2VOYW1lOyB9XG5cbiAgLyoqIEBhdHRyaWJ1dGUgKi9cbiAgcHVibGljIGdldCBwcml2YXRlRG5zTmFtZXNwYWNlSWQoKSB7IHJldHVybiB0aGlzLm5hbWVzcGFjZUlkOyB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBzZXJ2aWNlIHdpdGhpbiB0aGUgbmFtZXNwYWNlXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlU2VydmljZShpZDogc3RyaW5nLCBwcm9wcz86IERuc1NlcnZpY2VQcm9wcyk6IFNlcnZpY2Uge1xuICAgIHJldHVybiBuZXcgU2VydmljZSh0aGlzLCBpZCwge1xuICAgICAgbmFtZXNwYWNlOiB0aGlzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==