"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpNamespace = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const namespace_1 = require("./namespace");
const service_1 = require("./service");
const servicediscovery_generated_1 = require("./servicediscovery.generated");
/**
 * Define an HTTP Namespace
 */
class HttpNamespace extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_HttpNamespaceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, HttpNamespace);
            }
            throw error;
        }
        const ns = new servicediscovery_generated_1.CfnHttpNamespace(this, 'Resource', {
            name: props.name,
            description: props.description,
        });
        this.namespaceName = props.name;
        this.namespaceId = ns.attrId;
        this.namespaceArn = ns.attrArn;
        this.type = namespace_1.NamespaceType.HTTP;
    }
    static fromHttpNamespaceAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_HttpNamespaceAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromHttpNamespaceAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.namespaceName = attrs.namespaceName;
                this.namespaceId = attrs.namespaceId;
                this.namespaceArn = attrs.namespaceArn;
                this.type = namespace_1.NamespaceType.HTTP;
            }
        }
        return new Import(scope, id);
    }
    /** @attribute */
    get httpNamespaceArn() { return this.namespaceArn; }
    /** @attribute */
    get httpNamespaceName() { return this.namespaceName; }
    /** @attribute */
    get httpNamespaceId() { return this.namespaceId; }
    /**
     * Creates a service within the namespace
     */
    createService(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_BaseServiceProps(props);
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
exports.HttpNamespace = HttpNamespace;
_a = JSII_RTTI_SYMBOL_1;
HttpNamespace[_a] = { fqn: "@aws-cdk/aws-servicediscovery.HttpNamespace", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1uYW1lc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJodHRwLW5hbWVzcGFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBeUM7QUFFekMsMkNBQTRFO0FBQzVFLHVDQUFzRDtBQUN0RCw2RUFBZ0U7QUFxQmhFOztHQUVHO0FBQ0gsTUFBYSxhQUFjLFNBQVEsZUFBUTtJQWdDekMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBakNSLGFBQWE7Ozs7UUFtQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksNkNBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNoRCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQy9CLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcseUJBQWEsQ0FBQyxJQUFJLENBQUM7S0FDaEM7SUExQ00sTUFBTSxDQUFDLDJCQUEyQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQThCOzs7Ozs7Ozs7O1FBQ3BHLE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNTLGtCQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztnQkFDcEMsZ0JBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO2dCQUNoQyxpQkFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0JBQ2xDLFNBQUksR0FBRyx5QkFBYSxDQUFDLElBQUksQ0FBQztZQUNuQyxDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQW9DRCxpQkFBaUI7SUFDakIsSUFBVyxnQkFBZ0IsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtJQUUzRCxpQkFBaUI7SUFDakIsSUFBVyxpQkFBaUIsS0FBSyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtJQUU3RCxpQkFBaUI7SUFDakIsSUFBVyxlQUFlLEtBQUssT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7SUFFekQ7O09BRUc7SUFDSSxhQUFhLENBQUMsRUFBVSxFQUFFLEtBQXdCOzs7Ozs7Ozs7O1FBQ3ZELE9BQU8sSUFBSSxpQkFBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDM0IsU0FBUyxFQUFFLElBQUk7WUFDZixHQUFHLEtBQUs7U0FDVCxDQUFDLENBQUM7S0FDSjs7QUEvREgsc0NBZ0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQmFzZU5hbWVzcGFjZVByb3BzLCBJTmFtZXNwYWNlLCBOYW1lc3BhY2VUeXBlIH0gZnJvbSAnLi9uYW1lc3BhY2UnO1xuaW1wb3J0IHsgQmFzZVNlcnZpY2VQcm9wcywgU2VydmljZSB9IGZyb20gJy4vc2VydmljZSc7XG5pbXBvcnQgeyBDZm5IdHRwTmFtZXNwYWNlIH0gZnJvbSAnLi9zZXJ2aWNlZGlzY292ZXJ5LmdlbmVyYXRlZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSHR0cE5hbWVzcGFjZVByb3BzIGV4dGVuZHMgQmFzZU5hbWVzcGFjZVByb3BzIHt9XG5leHBvcnQgaW50ZXJmYWNlIElIdHRwTmFtZXNwYWNlIGV4dGVuZHMgSU5hbWVzcGFjZSB7IH1cbmV4cG9ydCBpbnRlcmZhY2UgSHR0cE5hbWVzcGFjZUF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgTmFtZXNwYWNlLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZXNwYWNlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lc3BhY2UgSWQgZm9yIHRoZSBOYW1lc3BhY2UuXG4gICAqL1xuICByZWFkb25seSBuYW1lc3BhY2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lc3BhY2UgQVJOIGZvciB0aGUgTmFtZXNwYWNlLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZXNwYWNlQXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lIGFuIEhUVFAgTmFtZXNwYWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBIdHRwTmFtZXNwYWNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJSHR0cE5hbWVzcGFjZSB7XG5cbiAgcHVibGljIHN0YXRpYyBmcm9tSHR0cE5hbWVzcGFjZUF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IEh0dHBOYW1lc3BhY2VBdHRyaWJ1dGVzKTogSUh0dHBOYW1lc3BhY2Uge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUh0dHBOYW1lc3BhY2Uge1xuICAgICAgcHVibGljIG5hbWVzcGFjZU5hbWUgPSBhdHRycy5uYW1lc3BhY2VOYW1lO1xuICAgICAgcHVibGljIG5hbWVzcGFjZUlkID0gYXR0cnMubmFtZXNwYWNlSWQ7XG4gICAgICBwdWJsaWMgbmFtZXNwYWNlQXJuID0gYXR0cnMubmFtZXNwYWNlQXJuO1xuICAgICAgcHVibGljIHR5cGUgPSBOYW1lc3BhY2VUeXBlLkhUVFA7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgbmFtZXNwYWNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5hbWVzcGFjZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZXNwYWNlIElkIGZvciB0aGUgbmFtZXNwYWNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5hbWVzcGFjZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5hbWVzcGFjZSBBcm4gZm9yIHRoZSBuYW1lc3BhY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZXNwYWNlQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIG5hbWVzcGFjZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBOYW1lc3BhY2VUeXBlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBIdHRwTmFtZXNwYWNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgbnMgPSBuZXcgQ2ZuSHR0cE5hbWVzcGFjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiBwcm9wcy5uYW1lLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgIH0pO1xuXG4gICAgdGhpcy5uYW1lc3BhY2VOYW1lID0gcHJvcHMubmFtZTtcbiAgICB0aGlzLm5hbWVzcGFjZUlkID0gbnMuYXR0cklkO1xuICAgIHRoaXMubmFtZXNwYWNlQXJuID0gbnMuYXR0ckFybjtcbiAgICB0aGlzLnR5cGUgPSBOYW1lc3BhY2VUeXBlLkhUVFA7XG4gIH1cblxuICAvKiogQGF0dHJpYnV0ZSAqL1xuICBwdWJsaWMgZ2V0IGh0dHBOYW1lc3BhY2VBcm4oKSB7IHJldHVybiB0aGlzLm5hbWVzcGFjZUFybjsgfVxuXG4gIC8qKiBAYXR0cmlidXRlICovXG4gIHB1YmxpYyBnZXQgaHR0cE5hbWVzcGFjZU5hbWUoKSB7IHJldHVybiB0aGlzLm5hbWVzcGFjZU5hbWU7IH1cblxuICAvKiogQGF0dHJpYnV0ZSAqL1xuICBwdWJsaWMgZ2V0IGh0dHBOYW1lc3BhY2VJZCgpIHsgcmV0dXJuIHRoaXMubmFtZXNwYWNlSWQ7IH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHNlcnZpY2Ugd2l0aGluIHRoZSBuYW1lc3BhY2VcbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTZXJ2aWNlKGlkOiBzdHJpbmcsIHByb3BzPzogQmFzZVNlcnZpY2VQcm9wcyk6IFNlcnZpY2Uge1xuICAgIHJldHVybiBuZXcgU2VydmljZSh0aGlzLCBpZCwge1xuICAgICAgbmFtZXNwYWNlOiB0aGlzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==