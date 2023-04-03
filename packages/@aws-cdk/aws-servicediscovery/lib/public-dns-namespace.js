"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicDnsNamespace = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const namespace_1 = require("./namespace");
const service_1 = require("./service");
const servicediscovery_generated_1 = require("./servicediscovery.generated");
/**
 * Define a Public DNS Namespace
 */
class PublicDnsNamespace extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_PublicDnsNamespaceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PublicDnsNamespace);
            }
            throw error;
        }
        const ns = new servicediscovery_generated_1.CfnPublicDnsNamespace(this, 'Resource', {
            name: props.name,
            description: props.description,
        });
        this.namespaceName = props.name;
        this.namespaceId = ns.attrId;
        this.namespaceArn = ns.attrArn;
        this.namespaceHostedZoneId = ns.attrHostedZoneId;
        this.type = namespace_1.NamespaceType.DNS_PUBLIC;
    }
    static fromPublicDnsNamespaceAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_PublicDnsNamespaceAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromPublicDnsNamespaceAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.namespaceName = attrs.namespaceName;
                this.namespaceId = attrs.namespaceId;
                this.namespaceArn = attrs.namespaceArn;
                this.type = namespace_1.NamespaceType.DNS_PUBLIC;
            }
        }
        return new Import(scope, id);
    }
    /** @attribute */
    get publicDnsNamespaceArn() { return this.namespaceArn; }
    /** @attribute */
    get publicDnsNamespaceName() { return this.namespaceName; }
    /** @attribute */
    get publicDnsNamespaceId() { return this.namespaceId; }
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
exports.PublicDnsNamespace = PublicDnsNamespace;
_a = JSII_RTTI_SYMBOL_1;
PublicDnsNamespace[_a] = { fqn: "@aws-cdk/aws-servicediscovery.PublicDnsNamespace", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWRucy1uYW1lc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwdWJsaWMtZG5zLW5hbWVzcGFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBeUM7QUFFekMsMkNBQTRFO0FBQzVFLHVDQUFxRDtBQUNyRCw2RUFBcUU7QUFxQnJFOztHQUVHO0FBQ0gsTUFBYSxrQkFBbUIsU0FBUSxlQUFRO0lBcUM5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQThCO1FBQ3RFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0F0Q1Isa0JBQWtCOzs7O1FBd0MzQixNQUFNLEVBQUUsR0FBRyxJQUFJLGtEQUFxQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDckQsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDO1FBQ2pELElBQUksQ0FBQyxJQUFJLEdBQUcseUJBQWEsQ0FBQyxVQUFVLENBQUM7S0FDdEM7SUFoRE0sTUFBTSxDQUFDLGdDQUFnQyxDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1DOzs7Ozs7Ozs7O1FBQzlHLE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNTLGtCQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztnQkFDcEMsZ0JBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO2dCQUNoQyxpQkFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0JBQ2xDLFNBQUksR0FBRyx5QkFBYSxDQUFDLFVBQVUsQ0FBQztZQUN6QyxDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQTBDRCxpQkFBaUI7SUFDakIsSUFBVyxxQkFBcUIsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtJQUVoRSxpQkFBaUI7SUFDakIsSUFBVyxzQkFBc0IsS0FBSyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtJQUVsRSxpQkFBaUI7SUFDakIsSUFBVyxvQkFBb0IsS0FBSyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtJQUU5RDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxFQUFVLEVBQUUsS0FBdUI7Ozs7Ozs7Ozs7UUFDdEQsT0FBTyxJQUFJLGlCQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMzQixTQUFTLEVBQUUsSUFBSTtZQUNmLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQztLQUNKOztBQXJFSCxnREFzRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCYXNlTmFtZXNwYWNlUHJvcHMsIElOYW1lc3BhY2UsIE5hbWVzcGFjZVR5cGUgfSBmcm9tICcuL25hbWVzcGFjZSc7XG5pbXBvcnQgeyBEbnNTZXJ2aWNlUHJvcHMsIFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2UnO1xuaW1wb3J0IHsgQ2ZuUHVibGljRG5zTmFtZXNwYWNlIH0gZnJvbSAnLi9zZXJ2aWNlZGlzY292ZXJ5LmdlbmVyYXRlZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHVibGljRG5zTmFtZXNwYWNlUHJvcHMgZXh0ZW5kcyBCYXNlTmFtZXNwYWNlUHJvcHMge31cbmV4cG9ydCBpbnRlcmZhY2UgSVB1YmxpY0Ruc05hbWVzcGFjZSBleHRlbmRzIElOYW1lc3BhY2UgeyB9XG5leHBvcnQgaW50ZXJmYWNlIFB1YmxpY0Ruc05hbWVzcGFjZUF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgTmFtZXNwYWNlLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZXNwYWNlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lc3BhY2UgSWQgZm9yIHRoZSBOYW1lc3BhY2UuXG4gICAqL1xuICByZWFkb25seSBuYW1lc3BhY2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lc3BhY2UgQVJOIGZvciB0aGUgTmFtZXNwYWNlLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZXNwYWNlQXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lIGEgUHVibGljIEROUyBOYW1lc3BhY2VcbiAqL1xuZXhwb3J0IGNsYXNzIFB1YmxpY0Ruc05hbWVzcGFjZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVB1YmxpY0Ruc05hbWVzcGFjZSB7XG5cbiAgcHVibGljIHN0YXRpYyBmcm9tUHVibGljRG5zTmFtZXNwYWNlQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogUHVibGljRG5zTmFtZXNwYWNlQXR0cmlidXRlcyk6IElQdWJsaWNEbnNOYW1lc3BhY2Uge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVB1YmxpY0Ruc05hbWVzcGFjZSB7XG4gICAgICBwdWJsaWMgbmFtZXNwYWNlTmFtZSA9IGF0dHJzLm5hbWVzcGFjZU5hbWU7XG4gICAgICBwdWJsaWMgbmFtZXNwYWNlSWQgPSBhdHRycy5uYW1lc3BhY2VJZDtcbiAgICAgIHB1YmxpYyBuYW1lc3BhY2VBcm4gPSBhdHRycy5uYW1lc3BhY2VBcm47XG4gICAgICBwdWJsaWMgdHlwZSA9IE5hbWVzcGFjZVR5cGUuRE5TX1BVQkxJQztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG5hbWUgZm9yIHRoZSBuYW1lc3BhY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZXNwYWNlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lc3BhY2UgSWQgZm9yIHRoZSBuYW1lc3BhY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZXNwYWNlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZXNwYWNlIEFybiBmb3IgdGhlIG5hbWVzcGFjZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lc3BhY2VBcm46IHN0cmluZztcblxuICAvKipcbiAgICogSUQgb2YgaG9zdGVkIHpvbmUgY3JlYXRlZCBieSBuYW1lc3BhY2VcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lc3BhY2VIb3N0ZWRab25lSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVHlwZSBvZiB0aGUgbmFtZXNwYWNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6IE5hbWVzcGFjZVR5cGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFB1YmxpY0Ruc05hbWVzcGFjZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IG5zID0gbmV3IENmblB1YmxpY0Ruc05hbWVzcGFjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiBwcm9wcy5uYW1lLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgIH0pO1xuXG4gICAgdGhpcy5uYW1lc3BhY2VOYW1lID0gcHJvcHMubmFtZTtcbiAgICB0aGlzLm5hbWVzcGFjZUlkID0gbnMuYXR0cklkO1xuICAgIHRoaXMubmFtZXNwYWNlQXJuID0gbnMuYXR0ckFybjtcbiAgICB0aGlzLm5hbWVzcGFjZUhvc3RlZFpvbmVJZCA9IG5zLmF0dHJIb3N0ZWRab25lSWQ7XG4gICAgdGhpcy50eXBlID0gTmFtZXNwYWNlVHlwZS5ETlNfUFVCTElDO1xuICB9XG5cbiAgLyoqIEBhdHRyaWJ1dGUgKi9cbiAgcHVibGljIGdldCBwdWJsaWNEbnNOYW1lc3BhY2VBcm4oKSB7IHJldHVybiB0aGlzLm5hbWVzcGFjZUFybjsgfVxuXG4gIC8qKiBAYXR0cmlidXRlICovXG4gIHB1YmxpYyBnZXQgcHVibGljRG5zTmFtZXNwYWNlTmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZXNwYWNlTmFtZTsgfVxuXG4gIC8qKiBAYXR0cmlidXRlICovXG4gIHB1YmxpYyBnZXQgcHVibGljRG5zTmFtZXNwYWNlSWQoKSB7IHJldHVybiB0aGlzLm5hbWVzcGFjZUlkOyB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBzZXJ2aWNlIHdpdGhpbiB0aGUgbmFtZXNwYWNlXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlU2VydmljZShpZDogc3RyaW5nLCBwcm9wcz86IERuc1NlcnZpY2VQcm9wcyk6IFNlcnZpY2Uge1xuICAgIHJldHVybiBuZXcgU2VydmljZSh0aGlzLCBpZCwge1xuICAgICAgbmFtZXNwYWNlOiB0aGlzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==