"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cloudformation_1 = require("@aws-cdk/aws-cloudformation");
/**
 * Custom resource that is implemented using a Lambda
 *
 * As a custom resource author, you should be publishing a subclass of this class
 * that hides the choice of provider, and accepts a strongly-typed properties
 * object with the properties your provider accepts.
 */
class CustomResource extends aws_cloudformation_1.cloudformation.CustomResource {
    constructor(parent, name, props) {
        if (!!props.lambdaProvider === !!props.topicProvider) {
            throw new Error('Exactly one of "lambdaProvider" or "topicProvider" must be set.');
        }
        super(parent, name, {
            serviceToken: props.lambdaProvider ? props.lambdaProvider.functionArn : props.topicProvider.topicArn
        });
        this.userProperties = props.properties;
    }
    /**
     * Override renderProperties to mix in the user-defined properties
     */
    renderProperties() {
        const props = super.renderProperties();
        return Object.assign(props, uppercaseProperties(this.userProperties || {}));
    }
}
exports.CustomResource = CustomResource;
/**
 * Uppercase the first letter of every property name
 *
 * It's customary for CloudFormation properties to start with capitals, and our
 * properties to start with lowercase, so this function translates from one
 * to the other
 */
function uppercaseProperties(props) {
    const ret = {};
    Object.keys(props).forEach(key => {
        const upper = key.substr(0, 1).toUpperCase() + key.substr(1);
        ret[upper] = props[key];
    });
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9FQUE2RDtBQW9DN0Q7Ozs7OztHQU1HO0FBQ0gsb0JBQTRCLFNBQVEsbUNBQWMsQ0FBQyxjQUFjO0lBTTdELFlBQVksTUFBcUIsRUFBRSxJQUFZLEVBQUUsS0FBMEI7UUFDdkUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtZQUNsRCxNQUFNLElBQUksS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7U0FDdEY7UUFFRCxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtZQUNoQixZQUFZLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFjLENBQUMsUUFBUTtTQUN4RyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDM0MsQ0FBQztJQUVEOztPQUVHO0lBQ08sZ0JBQWdCO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3ZDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7Q0FFSjtBQTFCRCx3Q0EwQkM7QUFFRDs7Ozs7O0dBTUc7QUFDSCw2QkFBNkIsS0FBaUI7SUFDMUMsTUFBTSxHQUFHLEdBQWUsRUFBRSxDQUFDO0lBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzdCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyJ9