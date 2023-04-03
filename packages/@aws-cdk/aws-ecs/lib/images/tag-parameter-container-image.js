"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagParameterContainerImage = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const container_image_1 = require("../container-image");
/**
 * A special type of `ContainerImage` that uses an ECR repository for the image,
 * but a CloudFormation Parameter for the tag of the image in that repository.
 * This allows providing this tag through the Parameter at deploy time,
 * for example in a CodePipeline that pushes a new tag of the image to the repository during a build step,
 * and then provides that new tag through the CloudFormation Parameter in the deploy step.
 *
 * @see #tagParameterName
 */
class TagParameterContainerImage extends container_image_1.ContainerImage {
    constructor(repository) {
        super();
        this.repository = repository;
    }
    bind(scope, containerDefinition) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ContainerDefinition(containerDefinition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        this.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
        const imageTagParameter = new cdk.CfnParameter(scope, 'ImageTagParam');
        this.imageTagParameter = imageTagParameter;
        return {
            imageName: this.repository.repositoryUriForTag(imageTagParameter.valueAsString),
        };
    }
    /**
     * Returns the name of the CloudFormation Parameter that represents the tag of the image
     * in the ECR repository.
     */
    get tagParameterName() {
        return cdk.Lazy.string({
            produce: () => {
                if (this.imageTagParameter) {
                    return this.imageTagParameter.logicalId;
                }
                else {
                    throw new Error('TagParameterContainerImage must be used in a container definition when using tagParameterName');
                }
            },
        });
    }
    /**
     * Returns the value of the CloudFormation Parameter that represents the tag of the image
     * in the ECR repository.
     */
    get tagParameterValue() {
        return cdk.Lazy.string({
            produce: () => {
                if (this.imageTagParameter) {
                    return this.imageTagParameter.valueAsString;
                }
                else {
                    throw new Error('TagParameterContainerImage must be used in a container definition when using tagParameterValue');
                }
            },
        });
    }
}
exports.TagParameterContainerImage = TagParameterContainerImage;
_a = JSII_RTTI_SYMBOL_1;
TagParameterContainerImage[_a] = { fqn: "@aws-cdk/aws-ecs.TagParameterContainerImage", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLXBhcmFtZXRlci1jb250YWluZXItaW1hZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWctcGFyYW1ldGVyLWNvbnRhaW5lci1pbWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxxQ0FBcUM7QUFHckMsd0RBQTBFO0FBRTFFOzs7Ozs7OztHQVFHO0FBQ0gsTUFBYSwwQkFBMkIsU0FBUSxnQ0FBYztJQUk1RCxZQUFtQixVQUEyQjtRQUM1QyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0tBQzlCO0lBRU0sSUFBSSxDQUFDLEtBQWdCLEVBQUUsbUJBQXdDOzs7Ozs7Ozs7O1FBQ3BFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7UUFDcEYsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUMzQyxPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDO1NBQ2hGLENBQUM7S0FDSDtJQUVEOzs7T0FHRztJQUNILElBQVcsZ0JBQWdCO1FBQ3pCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDckIsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDWixJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtvQkFDMUIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDO2lCQUN6QztxQkFBTTtvQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLCtGQUErRixDQUFDLENBQUM7aUJBQ2xIO1lBQ0gsQ0FBQztTQUNGLENBQUMsQ0FBQztLQUNKO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxpQkFBaUI7UUFDMUIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNyQixPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUNaLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO29CQUMxQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUM7aUJBQzdDO3FCQUFNO29CQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0dBQWdHLENBQUMsQ0FBQztpQkFDbkg7WUFDSCxDQUFDO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7O0FBaERILGdFQWlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjciBmcm9tICdAYXdzLWNkay9hd3MtZWNyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ29udGFpbmVyRGVmaW5pdGlvbiB9IGZyb20gJy4uL2NvbnRhaW5lci1kZWZpbml0aW9uJztcbmltcG9ydCB7IENvbnRhaW5lckltYWdlLCBDb250YWluZXJJbWFnZUNvbmZpZyB9IGZyb20gJy4uL2NvbnRhaW5lci1pbWFnZSc7XG5cbi8qKlxuICogQSBzcGVjaWFsIHR5cGUgb2YgYENvbnRhaW5lckltYWdlYCB0aGF0IHVzZXMgYW4gRUNSIHJlcG9zaXRvcnkgZm9yIHRoZSBpbWFnZSxcbiAqIGJ1dCBhIENsb3VkRm9ybWF0aW9uIFBhcmFtZXRlciBmb3IgdGhlIHRhZyBvZiB0aGUgaW1hZ2UgaW4gdGhhdCByZXBvc2l0b3J5LlxuICogVGhpcyBhbGxvd3MgcHJvdmlkaW5nIHRoaXMgdGFnIHRocm91Z2ggdGhlIFBhcmFtZXRlciBhdCBkZXBsb3kgdGltZSxcbiAqIGZvciBleGFtcGxlIGluIGEgQ29kZVBpcGVsaW5lIHRoYXQgcHVzaGVzIGEgbmV3IHRhZyBvZiB0aGUgaW1hZ2UgdG8gdGhlIHJlcG9zaXRvcnkgZHVyaW5nIGEgYnVpbGQgc3RlcCxcbiAqIGFuZCB0aGVuIHByb3ZpZGVzIHRoYXQgbmV3IHRhZyB0aHJvdWdoIHRoZSBDbG91ZEZvcm1hdGlvbiBQYXJhbWV0ZXIgaW4gdGhlIGRlcGxveSBzdGVwLlxuICpcbiAqIEBzZWUgI3RhZ1BhcmFtZXRlck5hbWVcbiAqL1xuZXhwb3J0IGNsYXNzIFRhZ1BhcmFtZXRlckNvbnRhaW5lckltYWdlIGV4dGVuZHMgQ29udGFpbmVySW1hZ2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IHJlcG9zaXRvcnk6IGVjci5JUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBpbWFnZVRhZ1BhcmFtZXRlcj86IGNkay5DZm5QYXJhbWV0ZXI7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHJlcG9zaXRvcnk6IGVjci5JUmVwb3NpdG9yeSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5yZXBvc2l0b3J5ID0gcmVwb3NpdG9yeTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIGNvbnRhaW5lckRlZmluaXRpb246IENvbnRhaW5lckRlZmluaXRpb24pOiBDb250YWluZXJJbWFnZUNvbmZpZyB7XG4gICAgdGhpcy5yZXBvc2l0b3J5LmdyYW50UHVsbChjb250YWluZXJEZWZpbml0aW9uLnRhc2tEZWZpbml0aW9uLm9idGFpbkV4ZWN1dGlvblJvbGUoKSk7XG4gICAgY29uc3QgaW1hZ2VUYWdQYXJhbWV0ZXIgPSBuZXcgY2RrLkNmblBhcmFtZXRlcihzY29wZSwgJ0ltYWdlVGFnUGFyYW0nKTtcbiAgICB0aGlzLmltYWdlVGFnUGFyYW1ldGVyID0gaW1hZ2VUYWdQYXJhbWV0ZXI7XG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlTmFtZTogdGhpcy5yZXBvc2l0b3J5LnJlcG9zaXRvcnlVcmlGb3JUYWcoaW1hZ2VUYWdQYXJhbWV0ZXIudmFsdWVBc1N0cmluZyksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSBDbG91ZEZvcm1hdGlvbiBQYXJhbWV0ZXIgdGhhdCByZXByZXNlbnRzIHRoZSB0YWcgb2YgdGhlIGltYWdlXG4gICAqIGluIHRoZSBFQ1IgcmVwb3NpdG9yeS5cbiAgICovXG4gIHB1YmxpYyBnZXQgdGFnUGFyYW1ldGVyTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBjZGsuTGF6eS5zdHJpbmcoe1xuICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pbWFnZVRhZ1BhcmFtZXRlcikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlVGFnUGFyYW1ldGVyLmxvZ2ljYWxJZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhZ1BhcmFtZXRlckNvbnRhaW5lckltYWdlIG11c3QgYmUgdXNlZCBpbiBhIGNvbnRhaW5lciBkZWZpbml0aW9uIHdoZW4gdXNpbmcgdGFnUGFyYW1ldGVyTmFtZScpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBDbG91ZEZvcm1hdGlvbiBQYXJhbWV0ZXIgdGhhdCByZXByZXNlbnRzIHRoZSB0YWcgb2YgdGhlIGltYWdlXG4gICAqIGluIHRoZSBFQ1IgcmVwb3NpdG9yeS5cbiAgICovXG4gIHB1YmxpYyBnZXQgdGFnUGFyYW1ldGVyVmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY2RrLkxhenkuc3RyaW5nKHtcbiAgICAgIHByb2R1Y2U6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VUYWdQYXJhbWV0ZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZVRhZ1BhcmFtZXRlci52YWx1ZUFzU3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2UgbXVzdCBiZSB1c2VkIGluIGEgY29udGFpbmVyIGRlZmluaXRpb24gd2hlbiB1c2luZyB0YWdQYXJhbWV0ZXJWYWx1ZScpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG4iXX0=