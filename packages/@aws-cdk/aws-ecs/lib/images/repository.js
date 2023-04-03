"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryImage = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const container_image_1 = require("../container-image");
/**
 * Regex pattern to check if it is an ECR image URL.
 *
 */
const ECR_IMAGE_REGEX = /(^[a-zA-Z0-9][a-zA-Z0-9-_]*).dkr.ecr.([a-zA-Z0-9][a-zA-Z0-9-_]*).amazonaws.com(.cn)?\/.*/;
/**
 * An image hosted in a public or private repository. For images hosted in Amazon ECR, see
 * [EcrImage](https://docs.aws.amazon.com/AmazonECR/latest/userguide/images.html).
 */
class RepositoryImage extends container_image_1.ContainerImage {
    /**
     * Constructs a new instance of the RepositoryImage class.
     */
    constructor(imageName, props = {}) {
        super();
        this.imageName = imageName;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_RepositoryImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RepositoryImage);
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
        // name could be a Token - in that case, skip validation altogether
        if (!core_1.Token.isUnresolved(this.imageName) && ECR_IMAGE_REGEX.test(this.imageName)) {
            core_1.Annotations.of(scope).addWarning("Proper policies need to be attached before pulling from ECR repository, or use 'fromEcrRepository'.");
        }
        if (this.props.credentials) {
            this.props.credentials.grantRead(containerDefinition.taskDefinition.obtainExecutionRole());
        }
        return {
            imageName: this.imageName,
            repositoryCredentials: this.props.credentials && {
                credentialsParameter: this.props.credentials.secretArn,
            },
        };
    }
}
exports.RepositoryImage = RepositoryImage;
_a = JSII_RTTI_SYMBOL_1;
RepositoryImage[_a] = { fqn: "@aws-cdk/aws-ecs.RepositoryImage", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0NBQW1EO0FBR25ELHdEQUEwRTtBQUUxRTs7O0dBR0c7QUFDSCxNQUFNLGVBQWUsR0FBRywwRkFBMEYsQ0FBQztBQWFuSDs7O0dBR0c7QUFDSCxNQUFhLGVBQWdCLFNBQVEsZ0NBQWM7SUFFakQ7O09BRUc7SUFDSCxZQUE2QixTQUFpQixFQUFtQixRQUE4QixFQUFFO1FBQy9GLEtBQUssRUFBRSxDQUFDO1FBRG1CLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBMkI7Ozs7OzsrQ0FMdEYsZUFBZTs7OztLQU96QjtJQUVNLElBQUksQ0FBQyxLQUFnQixFQUFFLG1CQUF3Qzs7Ozs7Ozs7OztRQUNwRSxtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQy9FLGtCQUFXLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxxR0FBcUcsQ0FBQyxDQUFDO1NBQ3pJO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztTQUM1RjtRQUVELE9BQU87WUFDTCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIscUJBQXFCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUk7Z0JBQy9DLG9CQUFvQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVM7YUFDdkQ7U0FDRixDQUFDO0tBQ0g7O0FBekJILDBDQTBCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJ0Bhd3MtY2RrL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ29udGFpbmVyRGVmaW5pdGlvbiB9IGZyb20gJy4uL2NvbnRhaW5lci1kZWZpbml0aW9uJztcbmltcG9ydCB7IENvbnRhaW5lckltYWdlLCBDb250YWluZXJJbWFnZUNvbmZpZyB9IGZyb20gJy4uL2NvbnRhaW5lci1pbWFnZSc7XG5cbi8qKlxuICogUmVnZXggcGF0dGVybiB0byBjaGVjayBpZiBpdCBpcyBhbiBFQ1IgaW1hZ2UgVVJMLlxuICpcbiAqL1xuY29uc3QgRUNSX0lNQUdFX1JFR0VYID0gLyheW2EtekEtWjAtOV1bYS16QS1aMC05LV9dKikuZGtyLmVjci4oW2EtekEtWjAtOV1bYS16QS1aMC05LV9dKikuYW1hem9uYXdzLmNvbSguY24pP1xcLy4qLztcblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgYW4gaW1hZ2UgaG9zdGVkIGluIGEgcHVibGljIG9yIHByaXZhdGUgcmVwb3NpdG9yeS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXBvc2l0b3J5SW1hZ2VQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgc2VjcmV0IHRvIGV4cG9zZSB0byB0aGUgY29udGFpbmVyIHRoYXQgY29udGFpbnMgdGhlIGNyZWRlbnRpYWxzIGZvciB0aGUgaW1hZ2UgcmVwb3NpdG9yeS5cbiAgICogVGhlIHN1cHBvcnRlZCB2YWx1ZSBpcyB0aGUgZnVsbCBBUk4gb2YgYW4gQVdTIFNlY3JldHMgTWFuYWdlciBzZWNyZXQuXG4gICAqL1xuICByZWFkb25seSBjcmVkZW50aWFscz86IHNlY3JldHNtYW5hZ2VyLklTZWNyZXQ7XG59XG5cbi8qKlxuICogQW4gaW1hZ2UgaG9zdGVkIGluIGEgcHVibGljIG9yIHByaXZhdGUgcmVwb3NpdG9yeS4gRm9yIGltYWdlcyBob3N0ZWQgaW4gQW1hem9uIEVDUiwgc2VlXG4gKiBbRWNySW1hZ2VdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1IvbGF0ZXN0L3VzZXJndWlkZS9pbWFnZXMuaHRtbCkuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5SW1hZ2UgZXh0ZW5kcyBDb250YWluZXJJbWFnZSB7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFJlcG9zaXRvcnlJbWFnZSBjbGFzcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaW1hZ2VOYW1lOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IFJlcG9zaXRvcnlJbWFnZVByb3BzID0ge30pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgY29udGFpbmVyRGVmaW5pdGlvbjogQ29udGFpbmVyRGVmaW5pdGlvbik6IENvbnRhaW5lckltYWdlQ29uZmlnIHtcbiAgICAvLyBuYW1lIGNvdWxkIGJlIGEgVG9rZW4gLSBpbiB0aGF0IGNhc2UsIHNraXAgdmFsaWRhdGlvbiBhbHRvZ2V0aGVyXG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5pbWFnZU5hbWUpICYmIEVDUl9JTUFHRV9SRUdFWC50ZXN0KHRoaXMuaW1hZ2VOYW1lKSkge1xuICAgICAgQW5ub3RhdGlvbnMub2Yoc2NvcGUpLmFkZFdhcm5pbmcoXCJQcm9wZXIgcG9saWNpZXMgbmVlZCB0byBiZSBhdHRhY2hlZCBiZWZvcmUgcHVsbGluZyBmcm9tIEVDUiByZXBvc2l0b3J5LCBvciB1c2UgJ2Zyb21FY3JSZXBvc2l0b3J5Jy5cIik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY3JlZGVudGlhbHMpIHtcbiAgICAgIHRoaXMucHJvcHMuY3JlZGVudGlhbHMuZ3JhbnRSZWFkKGNvbnRhaW5lckRlZmluaXRpb24udGFza0RlZmluaXRpb24ub2J0YWluRXhlY3V0aW9uUm9sZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaW1hZ2VOYW1lOiB0aGlzLmltYWdlTmFtZSxcbiAgICAgIHJlcG9zaXRvcnlDcmVkZW50aWFsczogdGhpcy5wcm9wcy5jcmVkZW50aWFscyAmJiB7XG4gICAgICAgIGNyZWRlbnRpYWxzUGFyYW1ldGVyOiB0aGlzLnByb3BzLmNyZWRlbnRpYWxzLnNlY3JldEFybixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIl19