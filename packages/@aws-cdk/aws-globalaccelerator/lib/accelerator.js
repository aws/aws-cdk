"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accelerator = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const ga = require("./globalaccelerator.generated");
const listener_1 = require("./listener");
/**
 * The Accelerator construct
 */
class Accelerator extends cdk.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_globalaccelerator_AcceleratorProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Accelerator);
            }
            throw error;
        }
        const resource = new ga.CfnAccelerator(this, 'Resource', {
            enabled: props.enabled ?? true,
            name: props.acceleratorName ?? cdk.Names.uniqueId(this),
        });
        this.acceleratorArn = resource.attrAcceleratorArn;
        this.dnsName = resource.attrDnsName;
    }
    /**
     * import from attributes
     */
    static fromAcceleratorAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_globalaccelerator_AcceleratorAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAcceleratorAttributes);
            }
            throw error;
        }
        class Import extends cdk.Resource {
            constructor() {
                super(...arguments);
                this.acceleratorArn = attrs.acceleratorArn;
                this.dnsName = attrs.dnsName;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Add a listener to the accelerator
     */
    addListener(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_globalaccelerator_ListenerOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addListener);
            }
            throw error;
        }
        return new listener_1.Listener(this, id, {
            accelerator: this,
            ...options,
        });
    }
}
exports.Accelerator = Accelerator;
_a = JSII_RTTI_SYMBOL_1;
Accelerator[_a] = { fqn: "@aws-cdk/aws-globalaccelerator.Accelerator", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZWxlcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhY2NlbGVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQ0FBcUM7QUFFckMsb0RBQW9EO0FBQ3BELHlDQUF1RDtBQXdEdkQ7O0dBRUc7QUFDSCxNQUFhLFdBQVksU0FBUSxHQUFHLENBQUMsUUFBUTtJQXNCM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUEwQixFQUFFO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0F2QlIsV0FBVzs7OztRQXlCcEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdkQsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSTtZQUM5QixJQUFJLEVBQUUsS0FBSyxDQUFDLGVBQWUsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FDeEQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO0tBQ3JDO0lBL0JEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLHlCQUF5QixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCOzs7Ozs7Ozs7O1FBQ2hHLE1BQU0sTUFBTyxTQUFRLEdBQUcsQ0FBQyxRQUFRO1lBQWpDOztnQkFDa0IsbUJBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO2dCQUN0QyxZQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUMxQyxDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQXdCRDs7T0FFRztJQUNJLFdBQVcsQ0FBQyxFQUFVLEVBQUUsT0FBd0I7Ozs7Ozs7Ozs7UUFDckQsT0FBTyxJQUFJLG1CQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUM1QixXQUFXLEVBQUUsSUFBSTtZQUNqQixHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7S0FDSjs7QUExQ0gsa0NBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBnYSBmcm9tICcuL2dsb2JhbGFjY2VsZXJhdG9yLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBMaXN0ZW5lciwgTGlzdGVuZXJPcHRpb25zIH0gZnJvbSAnLi9saXN0ZW5lcic7XG5cbi8qKlxuICogVGhlIGludGVyZmFjZSBvZiB0aGUgQWNjZWxlcmF0b3JcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQWNjZWxlcmF0b3IgZXh0ZW5kcyBjZGsuSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGFjY2VsZXJhdG9yXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGFjY2VsZXJhdG9yQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBEb21haW4gTmFtZSBTeXN0ZW0gKEROUykgbmFtZSB0aGF0IEdsb2JhbCBBY2NlbGVyYXRvciBjcmVhdGVzIHRoYXQgcG9pbnRzIHRvIHlvdXIgYWNjZWxlcmF0b3IncyBzdGF0aWNcbiAgICogSVAgYWRkcmVzc2VzLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBkbnNOYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29uc3RydWN0IHByb3BlcnRpZXMgb2YgdGhlIEFjY2VsZXJhdG9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWNjZWxlcmF0b3JQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYWNjZWxlcmF0b3JcbiAgICpcbiAgICogQGRlZmF1bHQgLSByZXNvdXJjZSBJRFxuICAgKi9cbiAgcmVhZG9ubHkgYWNjZWxlcmF0b3JOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYWNjZWxlcmF0b3IgaXMgZW5hYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQXR0cmlidXRlcyByZXF1aXJlZCB0byBpbXBvcnQgYW4gZXhpc3RpbmcgYWNjZWxlcmF0b3IgdG8gdGhlIHN0YWNrXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWNjZWxlcmF0b3JBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGFjY2VsZXJhdG9yXG4gICAqL1xuICByZWFkb25seSBhY2NlbGVyYXRvckFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgRE5TIG5hbWUgb2YgdGhlIGFjY2VsZXJhdG9yXG4gICAqL1xuICByZWFkb25seSBkbnNOYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIEFjY2VsZXJhdG9yIGNvbnN0cnVjdFxuICovXG5leHBvcnQgY2xhc3MgQWNjZWxlcmF0b3IgZXh0ZW5kcyBjZGsuUmVzb3VyY2UgaW1wbGVtZW50cyBJQWNjZWxlcmF0b3Ige1xuICAvKipcbiAgICogaW1wb3J0IGZyb20gYXR0cmlidXRlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQWNjZWxlcmF0b3JBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBBY2NlbGVyYXRvckF0dHJpYnV0ZXMpOiBJQWNjZWxlcmF0b3Ige1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIGNkay5SZXNvdXJjZSBpbXBsZW1lbnRzIElBY2NlbGVyYXRvciB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYWNjZWxlcmF0b3JBcm4gPSBhdHRycy5hY2NlbGVyYXRvckFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBkbnNOYW1lID0gYXR0cnMuZG5zTmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgYWNjZWxlcmF0b3IuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWNjZWxlcmF0b3JBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIERvbWFpbiBOYW1lIFN5c3RlbSAoRE5TKSBuYW1lIHRoYXQgR2xvYmFsIEFjY2VsZXJhdG9yIGNyZWF0ZXMgdGhhdCBwb2ludHMgdG8geW91ciBhY2NlbGVyYXRvcidzIHN0YXRpY1xuICAgKiBJUCBhZGRyZXNzZXMuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZG5zTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBBY2NlbGVyYXRvclByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgZ2EuQ2ZuQWNjZWxlcmF0b3IodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZW5hYmxlZDogcHJvcHMuZW5hYmxlZCA/PyB0cnVlLFxuICAgICAgbmFtZTogcHJvcHMuYWNjZWxlcmF0b3JOYW1lID8/IGNkay5OYW1lcy51bmlxdWVJZCh0aGlzKSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWNjZWxlcmF0b3JBcm4gPSByZXNvdXJjZS5hdHRyQWNjZWxlcmF0b3JBcm47XG4gICAgdGhpcy5kbnNOYW1lID0gcmVzb3VyY2UuYXR0ckRuc05hbWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gdGhlIGFjY2VsZXJhdG9yXG4gICAqL1xuICBwdWJsaWMgYWRkTGlzdGVuZXIoaWQ6IHN0cmluZywgb3B0aW9uczogTGlzdGVuZXJPcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBMaXN0ZW5lcih0aGlzLCBpZCwge1xuICAgICAgYWNjZWxlcmF0b3I6IHRoaXMsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG59XG4iXX0=