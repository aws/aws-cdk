"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetImage = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_ecr_assets_1 = require("@aws-cdk/aws-ecr-assets");
const container_image_1 = require("../container-image");
/**
 * An image that will be built from a local directory with a Dockerfile
 */
class AssetImage extends container_image_1.ContainerImage {
    /**
     * Constructs a new instance of the AssetImage class.
     *
     * @param directory The directory containing the Dockerfile
     */
    constructor(directory, props = {}) {
        super();
        this.directory = directory;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AssetImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AssetImage);
            }
            throw error;
        }
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
        const asset = new aws_ecr_assets_1.DockerImageAsset(scope, 'AssetImage', {
            directory: this.directory,
            ...this.props,
        });
        asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
        return {
            imageName: asset.imageUri,
        };
    }
}
exports.AssetImage = AssetImage;
_a = JSII_RTTI_SYMBOL_1;
AssetImage[_a] = { fqn: "@aws-cdk/aws-ecs.AssetImage", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtaW1hZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhc3NldC1pbWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBb0Y7QUFHcEYsd0RBQTBFO0FBUTFFOztHQUVHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsZ0NBQWM7SUFDNUM7Ozs7T0FJRztJQUNILFlBQTZCLFNBQWlCLEVBQW1CLFFBQXlCLEVBQUU7UUFDMUYsS0FBSyxFQUFFLENBQUM7UUFEbUIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUFzQjs7Ozs7OytDQU5qRixVQUFVOzs7O0tBUXBCO0lBRU0sSUFBSSxDQUFDLEtBQWdCLEVBQUUsbUJBQXdDOzs7Ozs7Ozs7O1FBQ3BFLE1BQU0sS0FBSyxHQUFHLElBQUksaUNBQWdCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUN0RCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsR0FBRyxJQUFJLENBQUMsS0FBSztTQUNkLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7UUFFckYsT0FBTztZQUNMLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUMxQixDQUFDO0tBQ0g7O0FBckJILGdDQXNCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERvY2tlckltYWdlQXNzZXQsIERvY2tlckltYWdlQXNzZXRPcHRpb25zIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjci1hc3NldHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDb250YWluZXJEZWZpbml0aW9uIH0gZnJvbSAnLi4vY29udGFpbmVyLWRlZmluaXRpb24nO1xuaW1wb3J0IHsgQ29udGFpbmVySW1hZ2UsIENvbnRhaW5lckltYWdlQ29uZmlnIH0gZnJvbSAnLi4vY29udGFpbmVyLWltYWdlJztcblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgYnVpbGRpbmcgYW4gQXNzZXRJbWFnZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3NldEltYWdlUHJvcHMgZXh0ZW5kcyBEb2NrZXJJbWFnZUFzc2V0T3B0aW9ucyB7XG59XG5cbi8qKlxuICogQW4gaW1hZ2UgdGhhdCB3aWxsIGJlIGJ1aWx0IGZyb20gYSBsb2NhbCBkaXJlY3Rvcnkgd2l0aCBhIERvY2tlcmZpbGVcbiAqL1xuZXhwb3J0IGNsYXNzIEFzc2V0SW1hZ2UgZXh0ZW5kcyBDb250YWluZXJJbWFnZSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBBc3NldEltYWdlIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyZWN0b3J5IFRoZSBkaXJlY3RvcnkgY29udGFpbmluZyB0aGUgRG9ja2VyZmlsZVxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBkaXJlY3Rvcnk6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBwcm9wczogQXNzZXRJbWFnZVByb3BzID0ge30pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgY29udGFpbmVyRGVmaW5pdGlvbjogQ29udGFpbmVyRGVmaW5pdGlvbik6IENvbnRhaW5lckltYWdlQ29uZmlnIHtcbiAgICBjb25zdCBhc3NldCA9IG5ldyBEb2NrZXJJbWFnZUFzc2V0KHNjb3BlLCAnQXNzZXRJbWFnZScsIHtcbiAgICAgIGRpcmVjdG9yeTogdGhpcy5kaXJlY3RvcnksXG4gICAgICAuLi50aGlzLnByb3BzLFxuICAgIH0pO1xuXG4gICAgYXNzZXQucmVwb3NpdG9yeS5ncmFudFB1bGwoY29udGFpbmVyRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbi5vYnRhaW5FeGVjdXRpb25Sb2xlKCkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlTmFtZTogYXNzZXQuaW1hZ2VVcmksXG4gICAgfTtcbiAgfVxufVxuIl19