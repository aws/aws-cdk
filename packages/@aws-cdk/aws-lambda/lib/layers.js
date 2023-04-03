"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerVersion = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const lambda_generated_1 = require("./lambda.generated");
const runtime_1 = require("./runtime");
/**
 * A reference to a Lambda Layer version.
 */
class LayerVersionBase extends core_1.Resource {
    addPermission(id, permission) {
        if (permission.organizationId != null && permission.accountId !== '*') {
            throw new Error(`OrganizationId can only be specified if AwsAccountId is '*', but it is ${permission.accountId}`);
        }
        new lambda_generated_1.CfnLayerVersionPermission(this, id, {
            action: 'lambda:GetLayerVersion',
            layerVersionArn: this.layerVersionArn,
            principal: permission.accountId,
            organizationId: permission.organizationId,
        });
    }
}
/**
 * Defines a new Lambda Layer version.
 */
class LayerVersion extends LayerVersionBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.layerVersionName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_LayerVersionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LayerVersion);
            }
            throw error;
        }
        if (props.compatibleRuntimes && props.compatibleRuntimes.length === 0) {
            throw new Error('Attempted to define a Lambda layer that supports no runtime!');
        }
        // Allow usage of the code in this context...
        const code = props.code.bind(this);
        if (code.inlineCode) {
            throw new Error('Inline code is not supported for AWS Lambda layers');
        }
        if (!code.s3Location) {
            throw new Error('Code must define an S3 location');
        }
        const resource = new lambda_generated_1.CfnLayerVersion(this, 'Resource', {
            compatibleRuntimes: props.compatibleRuntimes && props.compatibleRuntimes.map(r => r.name),
            compatibleArchitectures: props.compatibleArchitectures?.map(a => a.name),
            content: {
                s3Bucket: code.s3Location.bucketName,
                s3Key: code.s3Location.objectKey,
                s3ObjectVersion: code.s3Location.objectVersion,
            },
            description: props.description,
            layerName: this.physicalName,
            licenseInfo: props.license,
        });
        if (props.removalPolicy) {
            resource.applyRemovalPolicy(props.removalPolicy);
        }
        props.code.bindToResource(resource, {
            resourceProperty: 'Content',
        });
        this.layerVersionArn = resource.ref;
        this.compatibleRuntimes = props.compatibleRuntimes;
    }
    /**
     * Imports a layer version by ARN. Assumes it is compatible with all Lambda runtimes.
     */
    static fromLayerVersionArn(scope, id, layerVersionArn) {
        return LayerVersion.fromLayerVersionAttributes(scope, id, {
            layerVersionArn,
            compatibleRuntimes: runtime_1.Runtime.ALL,
        });
    }
    /**
     * Imports a Layer that has been defined externally.
     *
     * @param scope the parent Construct that will use the imported layer.
     * @param id    the id of the imported layer in the construct tree.
     * @param attrs the properties of the imported layer.
     */
    static fromLayerVersionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_LayerVersionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLayerVersionAttributes);
            }
            throw error;
        }
        if (attrs.compatibleRuntimes && attrs.compatibleRuntimes.length === 0) {
            throw new Error('Attempted to import a Lambda layer that supports no runtime!');
        }
        class Import extends LayerVersionBase {
            constructor() {
                super(...arguments);
                this.layerVersionArn = attrs.layerVersionArn;
                this.compatibleRuntimes = attrs.compatibleRuntimes;
            }
        }
        return new Import(scope, id);
    }
}
exports.LayerVersion = LayerVersion;
_a = JSII_RTTI_SYMBOL_1;
LayerVersion[_a] = { fqn: "@aws-cdk/aws-lambda.LayerVersion", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFtRTtBQUluRSx5REFBZ0Y7QUFDaEYsdUNBQW9DO0FBc0ZwQzs7R0FFRztBQUNILE1BQWUsZ0JBQWlCLFNBQVEsZUFBUTtJQUl2QyxhQUFhLENBQUMsRUFBVSxFQUFFLFVBQWtDO1FBQ2pFLElBQUksVUFBVSxDQUFDLGNBQWMsSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxHQUFHLEVBQUU7WUFDckUsTUFBTSxJQUFJLEtBQUssQ0FBQywwRUFBMEUsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7U0FDbkg7UUFFRCxJQUFJLDRDQUF5QixDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDdEMsTUFBTSxFQUFFLHdCQUF3QjtZQUNoQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDckMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTO1lBQy9CLGNBQWMsRUFBRSxVQUFVLENBQUMsY0FBYztTQUMxQyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBbUNEOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsZ0JBQWdCO0lBbUNoRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7U0FDckMsQ0FBQyxDQUFDOzs7Ozs7K0NBdENNLFlBQVk7Ozs7UUF3Q3JCLElBQUksS0FBSyxDQUFDLGtCQUFrQixJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3JFLE1BQU0sSUFBSSxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQztTQUNqRjtRQUVELDZDQUE2QztRQUM3QyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsTUFBTSxRQUFRLEdBQW9CLElBQUksa0NBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RFLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN6Rix1QkFBdUIsRUFBRSxLQUFLLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN4RSxPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVTtnQkFDcEMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUztnQkFDaEMsZUFBZSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYTthQUMvQztZQUNELFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDNUIsV0FBVyxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQzNCLENBQUMsQ0FBQztRQUVILElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRTtZQUN2QixRQUFRLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFO1lBQ2xDLGdCQUFnQixFQUFFLFNBQVM7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUM7S0FDcEQ7SUExRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsZUFBdUI7UUFDckYsT0FBTyxZQUFZLENBQUMsMEJBQTBCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUN4RCxlQUFlO1lBQ2Ysa0JBQWtCLEVBQUUsaUJBQU8sQ0FBQyxHQUFHO1NBQ2hDLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLDBCQUEwQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCOzs7Ozs7Ozs7O1FBQ2xHLElBQUksS0FBSyxDQUFDLGtCQUFrQixJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3JFLE1BQU0sSUFBSSxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQztTQUNqRjtRQUVELE1BQU0sTUFBTyxTQUFRLGdCQUFnQjtZQUFyQzs7Z0JBQ2tCLG9CQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztnQkFDeEMsdUJBQWtCLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1lBQ2hFLENBQUM7U0FBQTtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlCOztBQTlCSCxvQ0E2RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb3VyY2UsIFJlbW92YWxQb2xpY3ksIFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFyY2hpdGVjdHVyZSB9IGZyb20gJy4vYXJjaGl0ZWN0dXJlJztcbmltcG9ydCB7IENvZGUgfSBmcm9tICcuL2NvZGUnO1xuaW1wb3J0IHsgQ2ZuTGF5ZXJWZXJzaW9uLCBDZm5MYXllclZlcnNpb25QZXJtaXNzaW9uIH0gZnJvbSAnLi9sYW1iZGEuZ2VuZXJhdGVkJztcbmltcG9ydCB7IFJ1bnRpbWUgfSBmcm9tICcuL3J1bnRpbWUnO1xuXG4vKipcbiAqIE5vbiBydW50aW1lIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYXllclZlcnNpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBkZXNjcmlwdGlvbiB0aGUgdGhpcyBMYW1iZGEgTGF5ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFNQRFggbGljZW5jZSBpZGVudGlmaWVyIG9yIFVSTCB0byB0aGUgbGljZW5zZSBmaWxlIGZvciB0aGlzIGxheWVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGxpY2Vuc2UgaW5mb3JtYXRpb24gd2lsbCBiZSByZWNvcmRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGxpY2Vuc2U/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBsYXllci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5hbWUgd2lsbCBiZSBnZW5lcmF0ZWQuXG4gICAqL1xuICByZWFkb25seSBsYXllclZlcnNpb25OYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHJldGFpbiB0aGlzIHZlcnNpb24gb2YgdGhlIGxheWVyIHdoZW4gYSBuZXcgdmVyc2lvbiBpcyBhZGRlZFxuICAgKiBvciB3aGVuIHRoZSBzdGFjayBpcyBkZWxldGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBSZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICovXG4gIHJlYWRvbmx5IHJlbW92YWxQb2xpY3k/OiBSZW1vdmFsUG9saWN5O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExheWVyVmVyc2lvblByb3BzIGV4dGVuZHMgTGF5ZXJWZXJzaW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcnVudGltZXMgY29tcGF0aWJsZSB3aXRoIHRoaXMgTGF5ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQWxsIHJ1bnRpbWVzIGFyZSBzdXBwb3J0ZWQuXG4gICAqL1xuICByZWFkb25seSBjb21wYXRpYmxlUnVudGltZXM/OiBSdW50aW1lW107XG5cbiAgLyoqXG4gICAqIFRoZSBzeXN0ZW0gYXJjaGl0ZWN0dXJlcyBjb21wYXRpYmxlIHdpdGggdGhpcyBsYXllci5cbiAgICogQGRlZmF1bHQgW0FyY2hpdGVjdHVyZS5YODZfNjRdXG4gICAqL1xuICByZWFkb25seSBjb21wYXRpYmxlQXJjaGl0ZWN0dXJlcz86IEFyY2hpdGVjdHVyZVtdO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGVudCBvZiB0aGlzIExheWVyLlxuICAgKlxuICAgKiBVc2luZyBgQ29kZS5mcm9tSW5saW5lYCBpcyBub3Qgc3VwcG9ydGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgY29kZTogQ29kZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTGF5ZXJWZXJzaW9uIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIExhbWJkYSBMYXllciB2ZXJzaW9uIHRoYXQgdGhpcyBMYXllciBkZWZpbmVzLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBsYXllclZlcnNpb25Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJ1bnRpbWVzIGNvbXBhdGlibGUgd2l0aCB0aGlzIExheWVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBSdW50aW1lLkFsbFxuICAgKi9cbiAgcmVhZG9ubHkgY29tcGF0aWJsZVJ1bnRpbWVzPzogUnVudGltZVtdO1xuXG4gIC8qKlxuICAgKiBBZGQgcGVybWlzc2lvbiBmb3IgdGhpcyBsYXllciB2ZXJzaW9uIHRvIHNwZWNpZmljIGVudGl0aWVzLiBVc2FnZSB3aXRoaW5cbiAgICogdGhlIHNhbWUgYWNjb3VudCB3aGVyZSB0aGUgbGF5ZXIgaXMgZGVmaW5lZCBpcyBhbHdheXMgYWxsb3dlZCBhbmQgZG9lcyBub3RcbiAgICogcmVxdWlyZSBjYWxsaW5nIHRoaXMgbWV0aG9kLiBOb3RlIHRoYXQgdGhlIHByaW5jaXBhbCB0aGF0IGNyZWF0ZXMgdGhlXG4gICAqIExhbWJkYSBmdW5jdGlvbiB1c2luZyB0aGUgbGF5ZXIgKGZvciBleGFtcGxlLCBhIENsb3VkRm9ybWF0aW9uIGNoYW5nZXNldFxuICAgKiBleGVjdXRpb24gcm9sZSkgYWxzbyBuZWVkcyB0byBoYXZlIHRoZSBgYGxhbWJkYTpHZXRMYXllclZlcnNpb25gYFxuICAgKiBwZXJtaXNzaW9uIG9uIHRoZSBsYXllciB2ZXJzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgdGhlIElEIG9mIHRoZSBncmFudCBpbiB0aGUgY29uc3RydWN0IHRyZWUuXG4gICAqIEBwYXJhbSBwZXJtaXNzaW9uIHRoZSBpZGVudGlmaWNhdGlvbiBvZiB0aGUgZ3JhbnRlZS5cbiAgICovXG4gIGFkZFBlcm1pc3Npb24oaWQ6IHN0cmluZywgcGVybWlzc2lvbjogTGF5ZXJWZXJzaW9uUGVybWlzc2lvbik6IHZvaWQ7XG59XG5cbi8qKlxuICogQSByZWZlcmVuY2UgdG8gYSBMYW1iZGEgTGF5ZXIgdmVyc2lvbi5cbiAqL1xuYWJzdHJhY3QgY2xhc3MgTGF5ZXJWZXJzaW9uQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUxheWVyVmVyc2lvbiB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBsYXllclZlcnNpb25Bcm46IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNvbXBhdGlibGVSdW50aW1lcz86IFJ1bnRpbWVbXTtcblxuICBwdWJsaWMgYWRkUGVybWlzc2lvbihpZDogc3RyaW5nLCBwZXJtaXNzaW9uOiBMYXllclZlcnNpb25QZXJtaXNzaW9uKSB7XG4gICAgaWYgKHBlcm1pc3Npb24ub3JnYW5pemF0aW9uSWQgIT0gbnVsbCAmJiBwZXJtaXNzaW9uLmFjY291bnRJZCAhPT0gJyonKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE9yZ2FuaXphdGlvbklkIGNhbiBvbmx5IGJlIHNwZWNpZmllZCBpZiBBd3NBY2NvdW50SWQgaXMgJyonLCBidXQgaXQgaXMgJHtwZXJtaXNzaW9uLmFjY291bnRJZH1gKTtcbiAgICB9XG5cbiAgICBuZXcgQ2ZuTGF5ZXJWZXJzaW9uUGVybWlzc2lvbih0aGlzLCBpZCwge1xuICAgICAgYWN0aW9uOiAnbGFtYmRhOkdldExheWVyVmVyc2lvbicsXG4gICAgICBsYXllclZlcnNpb25Bcm46IHRoaXMubGF5ZXJWZXJzaW9uQXJuLFxuICAgICAgcHJpbmNpcGFsOiBwZXJtaXNzaW9uLmFjY291bnRJZCxcbiAgICAgIG9yZ2FuaXphdGlvbklkOiBwZXJtaXNzaW9uLm9yZ2FuaXphdGlvbklkLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogSWRlbnRpZmljYXRpb24gb2YgYW4gYWNjb3VudCAob3Igb3JnYW5pemF0aW9uKSB0aGF0IGlzIGFsbG93ZWQgdG8gYWNjZXNzIGEgTGFtYmRhIExheWVyIFZlcnNpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF5ZXJWZXJzaW9uUGVybWlzc2lvbiB7XG4gIC8qKlxuICAgKiBUaGUgQVdTIEFjY291bnQgaWQgb2YgdGhlIGFjY291bnQgdGhhdCBpcyBhdXRob3JpemVkIHRvIHVzZSBhIExhbWJkYSBMYXllciBWZXJzaW9uLiBUaGUgd2lsZC1jYXJkIGBgJyonYGAgY2FuIGJlXG4gICAqIHVzZWQgdG8gZ3JhbnQgYWNjZXNzIHRvIFwiYW55XCIgYWNjb3VudCAob3IgYW55IGFjY291bnQgaW4gYW4gb3JnYW5pemF0aW9uIHdoZW4gYGBvcmdhbml6YXRpb25JZGBgIGlzIHNwZWNpZmllZCkuXG4gICAqL1xuICByZWFkb25seSBhY2NvdW50SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBBV1MgT3JnYW5pemF0aW9uIHRvIHdoaWNoIHRoZSBncmFudCBpcyByZXN0cmljdGVkLlxuICAgKlxuICAgKiBDYW4gb25seSBiZSBzcGVjaWZpZWQgaWYgYGBhY2NvdW50SWRgYCBpcyBgYCcqJ2BgXG4gICAqL1xuICByZWFkb25seSBvcmdhbml6YXRpb25JZD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG5lY2Vzc2FyeSB0byBpbXBvcnQgYSBMYXllclZlcnNpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF5ZXJWZXJzaW9uQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBMYXllclZlcnNpb24uXG4gICAqL1xuICByZWFkb25seSBsYXllclZlcnNpb25Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgY29tcGF0aWJsZSBydW50aW1lcyB3aXRoIHRoaXMgTGF5ZXIuXG4gICAqL1xuICByZWFkb25seSBjb21wYXRpYmxlUnVudGltZXM/OiBSdW50aW1lW107XG59XG5cbi8qKlxuICogRGVmaW5lcyBhIG5ldyBMYW1iZGEgTGF5ZXIgdmVyc2lvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIExheWVyVmVyc2lvbiBleHRlbmRzIExheWVyVmVyc2lvbkJhc2Uge1xuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGEgbGF5ZXIgdmVyc2lvbiBieSBBUk4uIEFzc3VtZXMgaXQgaXMgY29tcGF0aWJsZSB3aXRoIGFsbCBMYW1iZGEgcnVudGltZXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21MYXllclZlcnNpb25Bcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgbGF5ZXJWZXJzaW9uQXJuOiBzdHJpbmcpOiBJTGF5ZXJWZXJzaW9uIHtcbiAgICByZXR1cm4gTGF5ZXJWZXJzaW9uLmZyb21MYXllclZlcnNpb25BdHRyaWJ1dGVzKHNjb3BlLCBpZCwge1xuICAgICAgbGF5ZXJWZXJzaW9uQXJuLFxuICAgICAgY29tcGF0aWJsZVJ1bnRpbWVzOiBSdW50aW1lLkFMTCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGEgTGF5ZXIgdGhhdCBoYXMgYmVlbiBkZWZpbmVkIGV4dGVybmFsbHkuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgcGFyZW50IENvbnN0cnVjdCB0aGF0IHdpbGwgdXNlIHRoZSBpbXBvcnRlZCBsYXllci5cbiAgICogQHBhcmFtIGlkICAgIHRoZSBpZCBvZiB0aGUgaW1wb3J0ZWQgbGF5ZXIgaW4gdGhlIGNvbnN0cnVjdCB0cmVlLlxuICAgKiBAcGFyYW0gYXR0cnMgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGltcG9ydGVkIGxheWVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTGF5ZXJWZXJzaW9uQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogTGF5ZXJWZXJzaW9uQXR0cmlidXRlcyk6IElMYXllclZlcnNpb24ge1xuICAgIGlmIChhdHRycy5jb21wYXRpYmxlUnVudGltZXMgJiYgYXR0cnMuY29tcGF0aWJsZVJ1bnRpbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0ZWQgdG8gaW1wb3J0IGEgTGFtYmRhIGxheWVyIHRoYXQgc3VwcG9ydHMgbm8gcnVudGltZSEnKTtcbiAgICB9XG5cbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBMYXllclZlcnNpb25CYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBsYXllclZlcnNpb25Bcm4gPSBhdHRycy5sYXllclZlcnNpb25Bcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgY29tcGF0aWJsZVJ1bnRpbWVzID0gYXR0cnMuY29tcGF0aWJsZVJ1bnRpbWVzO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgbGF5ZXJWZXJzaW9uQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjb21wYXRpYmxlUnVudGltZXM/OiBSdW50aW1lW107XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExheWVyVmVyc2lvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmxheWVyVmVyc2lvbk5hbWUsXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuY29tcGF0aWJsZVJ1bnRpbWVzICYmIHByb3BzLmNvbXBhdGlibGVSdW50aW1lcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXR0ZW1wdGVkIHRvIGRlZmluZSBhIExhbWJkYSBsYXllciB0aGF0IHN1cHBvcnRzIG5vIHJ1bnRpbWUhJyk7XG4gICAgfVxuXG4gICAgLy8gQWxsb3cgdXNhZ2Ugb2YgdGhlIGNvZGUgaW4gdGhpcyBjb250ZXh0Li4uXG4gICAgY29uc3QgY29kZSA9IHByb3BzLmNvZGUuYmluZCh0aGlzKTtcbiAgICBpZiAoY29kZS5pbmxpbmVDb2RlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lubGluZSBjb2RlIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIEFXUyBMYW1iZGEgbGF5ZXJzJyk7XG4gICAgfVxuICAgIGlmICghY29kZS5zM0xvY2F0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvZGUgbXVzdCBkZWZpbmUgYW4gUzMgbG9jYXRpb24nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZTogQ2ZuTGF5ZXJWZXJzaW9uID0gbmV3IENmbkxheWVyVmVyc2lvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBjb21wYXRpYmxlUnVudGltZXM6IHByb3BzLmNvbXBhdGlibGVSdW50aW1lcyAmJiBwcm9wcy5jb21wYXRpYmxlUnVudGltZXMubWFwKHIgPT4gci5uYW1lKSxcbiAgICAgIGNvbXBhdGlibGVBcmNoaXRlY3R1cmVzOiBwcm9wcy5jb21wYXRpYmxlQXJjaGl0ZWN0dXJlcz8ubWFwKGEgPT4gYS5uYW1lKSxcbiAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgczNCdWNrZXQ6IGNvZGUuczNMb2NhdGlvbi5idWNrZXROYW1lLFxuICAgICAgICBzM0tleTogY29kZS5zM0xvY2F0aW9uLm9iamVjdEtleSxcbiAgICAgICAgczNPYmplY3RWZXJzaW9uOiBjb2RlLnMzTG9jYXRpb24ub2JqZWN0VmVyc2lvbixcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdGlvbjogcHJvcHMuZGVzY3JpcHRpb24sXG4gICAgICBsYXllck5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgbGljZW5zZUluZm86IHByb3BzLmxpY2Vuc2UsXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMucmVtb3ZhbFBvbGljeSkge1xuICAgICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KHByb3BzLnJlbW92YWxQb2xpY3kpO1xuICAgIH1cblxuICAgIHByb3BzLmNvZGUuYmluZFRvUmVzb3VyY2UocmVzb3VyY2UsIHtcbiAgICAgIHJlc291cmNlUHJvcGVydHk6ICdDb250ZW50JyxcbiAgICB9KTtcblxuICAgIHRoaXMubGF5ZXJWZXJzaW9uQXJuID0gcmVzb3VyY2UucmVmO1xuICAgIHRoaXMuY29tcGF0aWJsZVJ1bnRpbWVzID0gcHJvcHMuY29tcGF0aWJsZVJ1bnRpbWVzO1xuICB9XG59XG4iXX0=