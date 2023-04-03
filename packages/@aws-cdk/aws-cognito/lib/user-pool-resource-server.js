"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolResourceServer = exports.ResourceServerScope = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const cognito_generated_1 = require("./cognito.generated");
/**
 * A scope for ResourceServer
 */
class ResourceServerScope {
    constructor(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_ResourceServerScopeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ResourceServerScope);
            }
            throw error;
        }
        this.scopeName = props.scopeName;
        this.scopeDescription = props.scopeDescription;
    }
}
exports.ResourceServerScope = ResourceServerScope;
_a = JSII_RTTI_SYMBOL_1;
ResourceServerScope[_a] = { fqn: "@aws-cdk/aws-cognito.ResourceServerScope", version: "0.0.0" };
/**
 * Defines a User Pool OAuth2.0 Resource Server
 */
class UserPoolResourceServer extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.identifier,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolResourceServerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPoolResourceServer);
            }
            throw error;
        }
        const resource = new cognito_generated_1.CfnUserPoolResourceServer(this, 'Resource', {
            identifier: this.physicalName,
            name: props.userPoolResourceServerName ?? this.physicalName,
            scopes: props.scopes,
            userPoolId: props.userPool.userPoolId,
        });
        this.userPoolResourceServerId = resource.ref;
    }
    /**
     * Import a user pool resource client given its id.
     */
    static fromUserPoolResourceServerId(scope, id, userPoolResourceServerId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.userPoolResourceServerId = userPoolResourceServerId;
            }
        }
        return new Import(scope, id);
    }
}
exports.UserPoolResourceServer = UserPoolResourceServer;
_b = JSII_RTTI_SYMBOL_1;
UserPoolResourceServer[_b] = { fqn: "@aws-cdk/aws-cognito.UserPoolResourceServer", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLXJlc291cmNlLXNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXItcG9vbC1yZXNvdXJjZS1zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQW9EO0FBRXBELDJEQUFnRTtBQTZCaEU7O0dBRUc7QUFDSCxNQUFhLG1CQUFtQjtJQVc5QixZQUFZLEtBQStCOzs7Ozs7K0NBWGhDLG1CQUFtQjs7OztRQVk1QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztLQUNoRDs7QUFkSCxrREFlQzs7O0FBbUNEOztHQUVHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxlQUFRO0lBY2xELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0M7UUFDMUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLFVBQVU7U0FDL0IsQ0FBQyxDQUFDOzs7Ozs7K0NBakJNLHNCQUFzQjs7OztRQW1CL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSw2Q0FBeUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQy9ELFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWTtZQUM3QixJQUFJLEVBQUUsS0FBSyxDQUFDLDBCQUEwQixJQUFJLElBQUksQ0FBQyxZQUFZO1lBQzNELE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVO1NBQ3RDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyx3QkFBd0IsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO0tBQzlDO0lBMUJEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLDRCQUE0QixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLHdCQUFnQztRQUN2RyxNQUFNLE1BQU8sU0FBUSxlQUFRO1lBQTdCOztnQkFDa0IsNkJBQXdCLEdBQUcsd0JBQXdCLENBQUM7WUFDdEUsQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7O0FBVkgsd0RBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5Vc2VyUG9vbFJlc291cmNlU2VydmVyIH0gZnJvbSAnLi9jb2duaXRvLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJVXNlclBvb2wgfSBmcm9tICcuL3VzZXItcG9vbCc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIENvZ25pdG8gdXNlciBwb29sIHJlc291cmNlIHNlcnZlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyUG9vbFJlc291cmNlU2VydmVyIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFJlc291cmNlIHNlcnZlciBpZFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSB1c2VyUG9vbFJlc291cmNlU2VydmVySWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wcyB0byBpbml0aWFsaXplIFJlc291cmNlU2VydmVyU2NvcGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZVNlcnZlclNjb3BlUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNjb3BlXG4gICAqL1xuICByZWFkb25seSBzY29wZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQSBkZXNjcmlwdGlvbiBvZiB0aGUgc2NvcGUuXG4gICAqL1xuICByZWFkb25seSBzY29wZURlc2NyaXB0aW9uOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBzY29wZSBmb3IgUmVzb3VyY2VTZXJ2ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFJlc291cmNlU2VydmVyU2NvcGUge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNjb3BlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2NvcGVOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIHNjb3BlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNjb3BlRGVzY3JpcHRpb246IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUmVzb3VyY2VTZXJ2ZXJTY29wZVByb3BzKSB7XG4gICAgdGhpcy5zY29wZU5hbWUgPSBwcm9wcy5zY29wZU5hbWU7XG4gICAgdGhpcy5zY29wZURlc2NyaXB0aW9uID0gcHJvcHMuc2NvcGVEZXNjcmlwdGlvbjtcbiAgfVxufVxuXG5cbi8qKlxuICogT3B0aW9ucyB0byBjcmVhdGUgYSBVc2VyUG9vbFJlc291cmNlU2VydmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXNlclBvb2xSZXNvdXJjZVNlcnZlck9wdGlvbnMge1xuICAvKipcbiAgICogQSB1bmlxdWUgcmVzb3VyY2Ugc2VydmVyIGlkZW50aWZpZXIgZm9yIHRoZSByZXNvdXJjZSBzZXJ2ZXIuXG4gICAqL1xuICByZWFkb25seSBpZGVudGlmaWVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZnJpZW5kbHkgbmFtZSBmb3IgdGhlIHJlc291cmNlIHNlcnZlci5cbiAgICogQGRlZmF1bHQgLSBzYW1lIGFzIGBpZGVudGlmaWVyYFxuICAgKi9cbiAgcmVhZG9ubHkgdXNlclBvb2xSZXNvdXJjZVNlcnZlck5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE9hdXRoIHNjb3Blc1xuICAgKiBAZGVmYXVsdCAtIE5vIHNjb3BlcyB3aWxsIGJlIGFkZGVkXG4gICAqL1xuICByZWFkb25seSBzY29wZXM/OiBSZXNvdXJjZVNlcnZlclNjb3BlW107XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgdGhlIFVzZXJQb29sUmVzb3VyY2VTZXJ2ZXIgY29uc3RydWN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXNlclBvb2xSZXNvdXJjZVNlcnZlclByb3BzIGV4dGVuZHMgVXNlclBvb2xSZXNvdXJjZVNlcnZlck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHVzZXIgcG9vbCB0byBhZGQgdGhpcyByZXNvdXJjZSBzZXJ2ZXIgdG9cbiAgICovXG4gIHJlYWRvbmx5IHVzZXJQb29sOiBJVXNlclBvb2w7XG59XG5cbi8qKlxuICogRGVmaW5lcyBhIFVzZXIgUG9vbCBPQXV0aDIuMCBSZXNvdXJjZSBTZXJ2ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFVzZXJQb29sUmVzb3VyY2VTZXJ2ZXIgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElVc2VyUG9vbFJlc291cmNlU2VydmVyIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhIHVzZXIgcG9vbCByZXNvdXJjZSBjbGllbnQgZ2l2ZW4gaXRzIGlkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVXNlclBvb2xSZXNvdXJjZVNlcnZlcklkKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHVzZXJQb29sUmVzb3VyY2VTZXJ2ZXJJZDogc3RyaW5nKTogSVVzZXJQb29sUmVzb3VyY2VTZXJ2ZXIge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVVzZXJQb29sUmVzb3VyY2VTZXJ2ZXIge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHVzZXJQb29sUmVzb3VyY2VTZXJ2ZXJJZCA9IHVzZXJQb29sUmVzb3VyY2VTZXJ2ZXJJZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHVzZXJQb29sUmVzb3VyY2VTZXJ2ZXJJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBVc2VyUG9vbFJlc291cmNlU2VydmVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuaWRlbnRpZmllcixcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblVzZXJQb29sUmVzb3VyY2VTZXJ2ZXIodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgaWRlbnRpZmllcjogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBuYW1lOiBwcm9wcy51c2VyUG9vbFJlc291cmNlU2VydmVyTmFtZSA/PyB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHNjb3BlczogcHJvcHMuc2NvcGVzLFxuICAgICAgdXNlclBvb2xJZDogcHJvcHMudXNlclBvb2wudXNlclBvb2xJZCxcbiAgICB9KTtcblxuICAgIHRoaXMudXNlclBvb2xSZXNvdXJjZVNlcnZlcklkID0gcmVzb3VyY2UucmVmO1xuICB9XG59XG4iXX0=