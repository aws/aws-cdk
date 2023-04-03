"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinuxArmBuildImage = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const run_script_linux_build_spec_1 = require("./private/run-script-linux-build-spec");
const project_1 = require("./project");
/**
 * A CodeBuild image running aarch64 Linux.
 *
 * This class has a bunch of public constants that represent the CodeBuild ARM images.
 *
 * You can also specify a custom image using the static method:
 *
 * - LinuxBuildImage.fromEcrRepository(repo[, tag])
 *
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
class LinuxArmBuildImage {
    constructor(props) {
        this.type = 'ARM_CONTAINER';
        this.defaultComputeType = project_1.ComputeType.LARGE;
        this.imageId = props.imageId;
        this.imagePullPrincipalType = props.imagePullPrincipalType;
        this.secretsManagerCredentials = props.secretsManagerCredentials;
        this.repository = props.repository;
    }
    /**
     * Returns an ARM image running Linux from an ECR repository.
     *
     * NOTE: if the repository is external (i.e. imported), then we won't be able to add
     * a resource policy statement for it so CodeBuild can pull the image.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-ecr.html
     *
     * @param repository The ECR repository
     * @param tagOrDigest Image tag or digest (default "latest", digests must start with `sha256:`)
     * @returns An aarch64 Linux build image from an ECR repository.
     */
    static fromEcrRepository(repository, tagOrDigest = 'latest') {
        return new LinuxArmBuildImage({
            imageId: repository.repositoryUriForTagOrDigest(tagOrDigest),
            imagePullPrincipalType: project_1.ImagePullPrincipalType.SERVICE_ROLE,
            repository,
        });
    }
    /**
     * Uses a Docker image provided by CodeBuild.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
     *
     * @param id The image identifier
     * @example 'aws/codebuild/amazonlinux2-aarch64-standard:1.0'
     * @returns A Docker image provided by CodeBuild.
     */
    static fromCodeBuildImageId(id) {
        return new LinuxArmBuildImage({
            imageId: id,
            imagePullPrincipalType: project_1.ImagePullPrincipalType.CODEBUILD,
        });
    }
    /**
     * Validates by checking the BuildEnvironment computeType as aarch64 images only support ComputeType.SMALL and
     * ComputeType.LARGE
     * @param buildEnvironment BuildEnvironment
     */
    validate(buildEnvironment) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_BuildEnvironment(buildEnvironment);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.validate);
            }
            throw error;
        }
        const ret = [];
        if (buildEnvironment.computeType &&
            buildEnvironment.computeType !== project_1.ComputeType.SMALL &&
            buildEnvironment.computeType !== project_1.ComputeType.LARGE) {
            ret.push(`ARM images only support ComputeTypes '${project_1.ComputeType.SMALL}' and '${project_1.ComputeType.LARGE}' - ` +
                `'${buildEnvironment.computeType}' was given`);
        }
        return ret;
    }
    runScriptBuildspec(entrypoint) {
        return run_script_linux_build_spec_1.runScriptLinuxBuildSpec(entrypoint);
    }
}
exports.LinuxArmBuildImage = LinuxArmBuildImage;
_a = JSII_RTTI_SYMBOL_1;
LinuxArmBuildImage[_a] = { fqn: "@aws-cdk/aws-codebuild.LinuxArmBuildImage", version: "0.0.0" };
/** Image "aws/codebuild/amazonlinux2-aarch64-standard:1.0". */
LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0 = LinuxArmBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux2-aarch64-standard:1.0');
/** Image "aws/codebuild/amazonlinux2-aarch64-standard:2.0". */
LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0 = LinuxArmBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux2-aarch64-standard:2.0');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludXgtYXJtLWJ1aWxkLWltYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGludXgtYXJtLWJ1aWxkLWltYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLHVGQUFnRjtBQUNoRix1Q0FBK0Y7QUFhL0Y7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFhLGtCQUFrQjtJQWlEN0IsWUFBb0IsS0FBOEI7UUFQbEMsU0FBSSxHQUFHLGVBQWUsQ0FBQztRQUN2Qix1QkFBa0IsR0FBRyxxQkFBVyxDQUFDLEtBQUssQ0FBQztRQU9yRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztRQUMzRCxJQUFJLENBQUMseUJBQXlCLEdBQUcsS0FBSyxDQUFDLHlCQUF5QixDQUFDO1FBQ2pFLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztLQUNwQztJQWhERDs7Ozs7Ozs7Ozs7T0FXRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUEyQixFQUFFLGNBQXNCLFFBQVE7UUFDekYsT0FBTyxJQUFJLGtCQUFrQixDQUFDO1lBQzVCLE9BQU8sRUFBRSxVQUFVLENBQUMsMkJBQTJCLENBQUMsV0FBVyxDQUFDO1lBQzVELHNCQUFzQixFQUFFLGdDQUFzQixDQUFDLFlBQVk7WUFDM0QsVUFBVTtTQUNYLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsb0JBQW9CLENBQUMsRUFBVTtRQUMzQyxPQUFPLElBQUksa0JBQWtCLENBQUM7WUFDNUIsT0FBTyxFQUFFLEVBQUU7WUFDWCxzQkFBc0IsRUFBRSxnQ0FBc0IsQ0FBQyxTQUFTO1NBQ3pELENBQUMsQ0FBQztLQUNKO0lBZ0JEOzs7O09BSUc7SUFDSSxRQUFRLENBQUMsZ0JBQWtDOzs7Ozs7Ozs7O1FBQ2hELE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksZ0JBQWdCLENBQUMsV0FBVztZQUM1QixnQkFBZ0IsQ0FBQyxXQUFXLEtBQUsscUJBQVcsQ0FBQyxLQUFLO1lBQ2xELGdCQUFnQixDQUFDLFdBQVcsS0FBSyxxQkFBVyxDQUFDLEtBQUssRUFBRTtZQUN0RCxHQUFHLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxxQkFBVyxDQUFDLEtBQUssVUFBVSxxQkFBVyxDQUFDLEtBQUssTUFBTTtnQkFDM0YsSUFBSSxnQkFBZ0IsQ0FBQyxXQUFXLGFBQWEsQ0FBQyxDQUFDO1NBQ3pEO1FBQ0QsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUVNLGtCQUFrQixDQUFDLFVBQWtCO1FBQzFDLE9BQU8scURBQXVCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDNUM7O0FBMUVILGdEQTJFQzs7O0FBMUVDLCtEQUErRDtBQUN4Qyw4Q0FBMkIsR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0FBQ2hKLCtEQUErRDtBQUN4Qyw4Q0FBMkIsR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWNyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3InO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyJztcbmltcG9ydCB7IEJ1aWxkU3BlYyB9IGZyb20gJy4vYnVpbGQtc3BlYyc7XG5pbXBvcnQgeyBydW5TY3JpcHRMaW51eEJ1aWxkU3BlYyB9IGZyb20gJy4vcHJpdmF0ZS9ydW4tc2NyaXB0LWxpbnV4LWJ1aWxkLXNwZWMnO1xuaW1wb3J0IHsgQnVpbGRFbnZpcm9ubWVudCwgQ29tcHV0ZVR5cGUsIElCdWlsZEltYWdlLCBJbWFnZVB1bGxQcmluY2lwYWxUeXBlIH0gZnJvbSAnLi9wcm9qZWN0JztcblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiBgTGludXhBcm1CdWlsZEltYWdlYC5cbiAqIE1vZHVsZS1wcml2YXRlLCBhcyB0aGUgY29uc3RydWN0b3Igb2YgYExpbnV4QXJtQnVpbGRJbWFnZWAgaXMgcHJpdmF0ZS5cbiAqL1xuaW50ZXJmYWNlIExpbnV4QXJtQnVpbGRJbWFnZVByb3BzIHtcbiAgcmVhZG9ubHkgaW1hZ2VJZDogc3RyaW5nO1xuICByZWFkb25seSBpbWFnZVB1bGxQcmluY2lwYWxUeXBlPzogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTtcbiAgcmVhZG9ubHkgc2VjcmV0c01hbmFnZXJDcmVkZW50aWFscz86IHNlY3JldHNtYW5hZ2VyLklTZWNyZXQ7XG4gIHJlYWRvbmx5IHJlcG9zaXRvcnk/OiBlY3IuSVJlcG9zaXRvcnk7XG59XG5cbi8qKlxuICogQSBDb2RlQnVpbGQgaW1hZ2UgcnVubmluZyBhYXJjaDY0IExpbnV4LlxuICpcbiAqIFRoaXMgY2xhc3MgaGFzIGEgYnVuY2ggb2YgcHVibGljIGNvbnN0YW50cyB0aGF0IHJlcHJlc2VudCB0aGUgQ29kZUJ1aWxkIEFSTSBpbWFnZXMuXG4gKlxuICogWW91IGNhbiBhbHNvIHNwZWNpZnkgYSBjdXN0b20gaW1hZ2UgdXNpbmcgdGhlIHN0YXRpYyBtZXRob2Q6XG4gKlxuICogLSBMaW51eEJ1aWxkSW1hZ2UuZnJvbUVjclJlcG9zaXRvcnkocmVwb1ssIHRhZ10pXG4gKlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLWVudi1yZWYtYXZhaWxhYmxlLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIExpbnV4QXJtQnVpbGRJbWFnZSBpbXBsZW1lbnRzIElCdWlsZEltYWdlIHtcbiAgLyoqIEltYWdlIFwiYXdzL2NvZGVidWlsZC9hbWF6b25saW51eDItYWFyY2g2NC1zdGFuZGFyZDoxLjBcIi4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTUFaT05fTElOVVhfMl9TVEFOREFSRF8xXzAgPSBMaW51eEFybUJ1aWxkSW1hZ2UuZnJvbUNvZGVCdWlsZEltYWdlSWQoJ2F3cy9jb2RlYnVpbGQvYW1hem9ubGludXgyLWFhcmNoNjQtc3RhbmRhcmQ6MS4wJyk7XG4gIC8qKiBJbWFnZSBcImF3cy9jb2RlYnVpbGQvYW1hem9ubGludXgyLWFhcmNoNjQtc3RhbmRhcmQ6Mi4wXCIuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQU1BWk9OX0xJTlVYXzJfU1RBTkRBUkRfMl8wID0gTGludXhBcm1CdWlsZEltYWdlLmZyb21Db2RlQnVpbGRJbWFnZUlkKCdhd3MvY29kZWJ1aWxkL2FtYXpvbmxpbnV4Mi1hYXJjaDY0LXN0YW5kYXJkOjIuMCcpO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEFSTSBpbWFnZSBydW5uaW5nIExpbnV4IGZyb20gYW4gRUNSIHJlcG9zaXRvcnkuXG4gICAqXG4gICAqIE5PVEU6IGlmIHRoZSByZXBvc2l0b3J5IGlzIGV4dGVybmFsIChpLmUuIGltcG9ydGVkKSwgdGhlbiB3ZSB3b24ndCBiZSBhYmxlIHRvIGFkZFxuICAgKiBhIHJlc291cmNlIHBvbGljeSBzdGF0ZW1lbnQgZm9yIGl0IHNvIENvZGVCdWlsZCBjYW4gcHVsbCB0aGUgaW1hZ2UuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL3NhbXBsZS1lY3IuaHRtbFxuICAgKlxuICAgKiBAcGFyYW0gcmVwb3NpdG9yeSBUaGUgRUNSIHJlcG9zaXRvcnlcbiAgICogQHBhcmFtIHRhZ09yRGlnZXN0IEltYWdlIHRhZyBvciBkaWdlc3QgKGRlZmF1bHQgXCJsYXRlc3RcIiwgZGlnZXN0cyBtdXN0IHN0YXJ0IHdpdGggYHNoYTI1NjpgKVxuICAgKiBAcmV0dXJucyBBbiBhYXJjaDY0IExpbnV4IGJ1aWxkIGltYWdlIGZyb20gYW4gRUNSIHJlcG9zaXRvcnkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FY3JSZXBvc2l0b3J5KHJlcG9zaXRvcnk6IGVjci5JUmVwb3NpdG9yeSwgdGFnT3JEaWdlc3Q6IHN0cmluZyA9ICdsYXRlc3QnKTogSUJ1aWxkSW1hZ2Uge1xuICAgIHJldHVybiBuZXcgTGludXhBcm1CdWlsZEltYWdlKHtcbiAgICAgIGltYWdlSWQ6IHJlcG9zaXRvcnkucmVwb3NpdG9yeVVyaUZvclRhZ09yRGlnZXN0KHRhZ09yRGlnZXN0KSxcbiAgICAgIGltYWdlUHVsbFByaW5jaXBhbFR5cGU6IEltYWdlUHVsbFByaW5jaXBhbFR5cGUuU0VSVklDRV9ST0xFLFxuICAgICAgcmVwb3NpdG9yeSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VzIGEgRG9ja2VyIGltYWdlIHByb3ZpZGVkIGJ5IENvZGVCdWlsZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvYnVpbGQtZW52LXJlZi1hdmFpbGFibGUuaHRtbFxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIGltYWdlIGlkZW50aWZpZXJcbiAgICogQGV4YW1wbGUgJ2F3cy9jb2RlYnVpbGQvYW1hem9ubGludXgyLWFhcmNoNjQtc3RhbmRhcmQ6MS4wJ1xuICAgKiBAcmV0dXJucyBBIERvY2tlciBpbWFnZSBwcm92aWRlZCBieSBDb2RlQnVpbGQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Db2RlQnVpbGRJbWFnZUlkKGlkOiBzdHJpbmcpOiBJQnVpbGRJbWFnZSB7XG4gICAgcmV0dXJuIG5ldyBMaW51eEFybUJ1aWxkSW1hZ2Uoe1xuICAgICAgaW1hZ2VJZDogaWQsXG4gICAgICBpbWFnZVB1bGxQcmluY2lwYWxUeXBlOiBJbWFnZVB1bGxQcmluY2lwYWxUeXBlLkNPREVCVUlMRCxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSB0eXBlID0gJ0FSTV9DT05UQUlORVInO1xuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdENvbXB1dGVUeXBlID0gQ29tcHV0ZVR5cGUuTEFSR0U7XG4gIHB1YmxpYyByZWFkb25seSBpbWFnZUlkOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBpbWFnZVB1bGxQcmluY2lwYWxUeXBlPzogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTtcbiAgcHVibGljIHJlYWRvbmx5IHNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHM/OiBzZWNyZXRzbWFuYWdlci5JU2VjcmV0O1xuICBwdWJsaWMgcmVhZG9ubHkgcmVwb3NpdG9yeT86IGVjci5JUmVwb3NpdG9yeTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByb3BzOiBMaW51eEFybUJ1aWxkSW1hZ2VQcm9wcykge1xuICAgIHRoaXMuaW1hZ2VJZCA9IHByb3BzLmltYWdlSWQ7XG4gICAgdGhpcy5pbWFnZVB1bGxQcmluY2lwYWxUeXBlID0gcHJvcHMuaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTtcbiAgICB0aGlzLnNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHMgPSBwcm9wcy5zZWNyZXRzTWFuYWdlckNyZWRlbnRpYWxzO1xuICAgIHRoaXMucmVwb3NpdG9yeSA9IHByb3BzLnJlcG9zaXRvcnk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIGJ5IGNoZWNraW5nIHRoZSBCdWlsZEVudmlyb25tZW50IGNvbXB1dGVUeXBlIGFzIGFhcmNoNjQgaW1hZ2VzIG9ubHkgc3VwcG9ydCBDb21wdXRlVHlwZS5TTUFMTCBhbmRcbiAgICogQ29tcHV0ZVR5cGUuTEFSR0VcbiAgICogQHBhcmFtIGJ1aWxkRW52aXJvbm1lbnQgQnVpbGRFbnZpcm9ubWVudFxuICAgKi9cbiAgcHVibGljIHZhbGlkYXRlKGJ1aWxkRW52aXJvbm1lbnQ6IEJ1aWxkRW52aXJvbm1lbnQpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgaWYgKGJ1aWxkRW52aXJvbm1lbnQuY29tcHV0ZVR5cGUgJiZcbiAgICAgICAgYnVpbGRFbnZpcm9ubWVudC5jb21wdXRlVHlwZSAhPT0gQ29tcHV0ZVR5cGUuU01BTEwgJiZcbiAgICAgICAgYnVpbGRFbnZpcm9ubWVudC5jb21wdXRlVHlwZSAhPT0gQ29tcHV0ZVR5cGUuTEFSR0UpIHtcbiAgICAgIHJldC5wdXNoKGBBUk0gaW1hZ2VzIG9ubHkgc3VwcG9ydCBDb21wdXRlVHlwZXMgJyR7Q29tcHV0ZVR5cGUuU01BTEx9JyBhbmQgJyR7Q29tcHV0ZVR5cGUuTEFSR0V9JyAtIGAgK1xuICAgICAgICAgICAgICAgYCcke2J1aWxkRW52aXJvbm1lbnQuY29tcHV0ZVR5cGV9JyB3YXMgZ2l2ZW5gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIHB1YmxpYyBydW5TY3JpcHRCdWlsZHNwZWMoZW50cnlwb2ludDogc3RyaW5nKTogQnVpbGRTcGVjIHtcbiAgICByZXR1cm4gcnVuU2NyaXB0TGludXhCdWlsZFNwZWMoZW50cnlwb2ludCk7XG4gIH1cbn1cbiJdfQ==