"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerImage = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_ecr_assets_1 = require("@aws-cdk/aws-ecr-assets");
/**
 * Constructs for types of container images
 */
class ContainerImage {
    /**
     * Reference an image on DockerHub or another online registry
     */
    static fromRegistry(name, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_RepositoryImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromRegistry);
            }
            throw error;
        }
        return new repository_1.RepositoryImage(name, props);
    }
    /**
     * Reference an image in an ECR repository
     */
    static fromEcrRepository(repository, tag = 'latest') {
        return new ecr_1.EcrImage(repository, tag);
    }
    /**
     * Reference an image that's constructed directly from sources on disk.
     *
     * If you already have a `DockerImageAsset` instance, you can use the
     * `ContainerImage.fromDockerImageAsset` method instead.
     *
     * @param directory The directory containing the Dockerfile
     */
    static fromAsset(directory, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AssetImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAsset);
            }
            throw error;
        }
        return new asset_image_1.AssetImage(directory, props);
    }
    /**
     * Use an existing `DockerImageAsset` for this container image.
     *
     * @param asset The `DockerImageAsset` to use for this container definition.
     */
    static fromDockerImageAsset(asset) {
        return {
            bind(_scope, containerDefinition) {
                asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
                return {
                    imageName: asset.imageUri,
                };
            },
        };
    }
    /**
     * Use an existing tarball for this container image.
     *
     * Use this method if the container image has already been created by another process (e.g. jib)
     * and you want to add it as a container image asset.
     *
     * @param tarballFile Absolute path to the tarball. You can use language-specific idioms (such as `__dirname` in Node.js)
     *                    to create an absolute path based on the current script running directory.
     */
    static fromTarball(tarballFile) {
        return {
            bind(scope, containerDefinition) {
                const asset = new aws_ecr_assets_1.TarballImageAsset(scope, 'Tarball', { tarballFile });
                asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
                return {
                    imageName: asset.imageUri,
                };
            },
        };
    }
}
exports.ContainerImage = ContainerImage;
_a = JSII_RTTI_SYMBOL_1;
ContainerImage[_a] = { fqn: "@aws-cdk/aws-ecs.ContainerImage", version: "0.0.0" };
const asset_image_1 = require("./images/asset-image");
const ecr_1 = require("./images/ecr");
const repository_1 = require("./images/repository");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLWltYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udGFpbmVyLWltYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDREQUE4RTtBQUs5RTs7R0FFRztBQUNILE1BQXNCLGNBQWM7SUFDbEM7O09BRUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQVksRUFBRSxRQUE4QixFQUFFOzs7Ozs7Ozs7O1FBQ3ZFLE9BQU8sSUFBSSw0QkFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN6QztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQTJCLEVBQUUsTUFBYyxRQUFRO1FBQ2pGLE9BQU8sSUFBSSxjQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3RDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBaUIsRUFBRSxRQUF5QixFQUFFOzs7Ozs7Ozs7O1FBQ3BFLE9BQU8sSUFBSSx3QkFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN6QztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBdUI7UUFDeEQsT0FBTztZQUNMLElBQUksQ0FBQyxNQUFpQixFQUFFLG1CQUF3QztnQkFDOUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztnQkFDckYsT0FBTztvQkFDTCxTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVE7aUJBQzFCLENBQUM7WUFDSixDQUFDO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQW1CO1FBQzNDLE9BQU87WUFDTCxJQUFJLENBQUMsS0FBZ0IsRUFBRSxtQkFBd0M7Z0JBRTdELE1BQU0sS0FBSyxHQUFHLElBQUksa0NBQWlCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7Z0JBQ3ZFLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7Z0JBRXJGLE9BQU87b0JBQ0wsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRO2lCQUMxQixDQUFDO1lBQ0osQ0FBQztTQUNGLENBQUM7S0FDSDs7QUFoRUgsd0NBc0VDOzs7QUFpQkQsc0RBQW1FO0FBQ25FLHNDQUF3QztBQUN4QyxvREFBNEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgeyBEb2NrZXJJbWFnZUFzc2V0LCBUYXJiYWxsSW1hZ2VBc3NldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3ItYXNzZXRzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ29udGFpbmVyRGVmaW5pdGlvbiB9IGZyb20gJy4vY29udGFpbmVyLWRlZmluaXRpb24nO1xuaW1wb3J0IHsgQ2ZuVGFza0RlZmluaXRpb24gfSBmcm9tICcuL2Vjcy5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgZm9yIHR5cGVzIG9mIGNvbnRhaW5lciBpbWFnZXNcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbnRhaW5lckltYWdlIHtcbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBhbiBpbWFnZSBvbiBEb2NrZXJIdWIgb3IgYW5vdGhlciBvbmxpbmUgcmVnaXN0cnlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVJlZ2lzdHJ5KG5hbWU6IHN0cmluZywgcHJvcHM6IFJlcG9zaXRvcnlJbWFnZVByb3BzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFJlcG9zaXRvcnlJbWFnZShuYW1lLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVmZXJlbmNlIGFuIGltYWdlIGluIGFuIEVDUiByZXBvc2l0b3J5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FY3JSZXBvc2l0b3J5KHJlcG9zaXRvcnk6IGVjci5JUmVwb3NpdG9yeSwgdGFnOiBzdHJpbmcgPSAnbGF0ZXN0Jykge1xuICAgIHJldHVybiBuZXcgRWNySW1hZ2UocmVwb3NpdG9yeSwgdGFnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgYW4gaW1hZ2UgdGhhdCdzIGNvbnN0cnVjdGVkIGRpcmVjdGx5IGZyb20gc291cmNlcyBvbiBkaXNrLlxuICAgKlxuICAgKiBJZiB5b3UgYWxyZWFkeSBoYXZlIGEgYERvY2tlckltYWdlQXNzZXRgIGluc3RhbmNlLCB5b3UgY2FuIHVzZSB0aGVcbiAgICogYENvbnRhaW5lckltYWdlLmZyb21Eb2NrZXJJbWFnZUFzc2V0YCBtZXRob2QgaW5zdGVhZC5cbiAgICpcbiAgICogQHBhcmFtIGRpcmVjdG9yeSBUaGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhlIERvY2tlcmZpbGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUFzc2V0KGRpcmVjdG9yeTogc3RyaW5nLCBwcm9wczogQXNzZXRJbWFnZVByb3BzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEFzc2V0SW1hZ2UoZGlyZWN0b3J5LCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGFuIGV4aXN0aW5nIGBEb2NrZXJJbWFnZUFzc2V0YCBmb3IgdGhpcyBjb250YWluZXIgaW1hZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBhc3NldCBUaGUgYERvY2tlckltYWdlQXNzZXRgIHRvIHVzZSBmb3IgdGhpcyBjb250YWluZXIgZGVmaW5pdGlvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbURvY2tlckltYWdlQXNzZXQoYXNzZXQ6IERvY2tlckltYWdlQXNzZXQpOiBDb250YWluZXJJbWFnZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIGNvbnRhaW5lckRlZmluaXRpb246IENvbnRhaW5lckRlZmluaXRpb24pOiBDb250YWluZXJJbWFnZUNvbmZpZyB7XG4gICAgICAgIGFzc2V0LnJlcG9zaXRvcnkuZ3JhbnRQdWxsKGNvbnRhaW5lckRlZmluaXRpb24udGFza0RlZmluaXRpb24ub2J0YWluRXhlY3V0aW9uUm9sZSgpKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbWFnZU5hbWU6IGFzc2V0LmltYWdlVXJpLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBhbiBleGlzdGluZyB0YXJiYWxsIGZvciB0aGlzIGNvbnRhaW5lciBpbWFnZS5cbiAgICpcbiAgICogVXNlIHRoaXMgbWV0aG9kIGlmIHRoZSBjb250YWluZXIgaW1hZ2UgaGFzIGFscmVhZHkgYmVlbiBjcmVhdGVkIGJ5IGFub3RoZXIgcHJvY2VzcyAoZS5nLiBqaWIpXG4gICAqIGFuZCB5b3Ugd2FudCB0byBhZGQgaXQgYXMgYSBjb250YWluZXIgaW1hZ2UgYXNzZXQuXG4gICAqXG4gICAqIEBwYXJhbSB0YXJiYWxsRmlsZSBBYnNvbHV0ZSBwYXRoIHRvIHRoZSB0YXJiYWxsLiBZb3UgY2FuIHVzZSBsYW5ndWFnZS1zcGVjaWZpYyBpZGlvbXMgKHN1Y2ggYXMgYF9fZGlybmFtZWAgaW4gTm9kZS5qcylcbiAgICogICAgICAgICAgICAgICAgICAgIHRvIGNyZWF0ZSBhbiBhYnNvbHV0ZSBwYXRoIGJhc2VkIG9uIHRoZSBjdXJyZW50IHNjcmlwdCBydW5uaW5nIGRpcmVjdG9yeS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVRhcmJhbGwodGFyYmFsbEZpbGU6IHN0cmluZyk6IENvbnRhaW5lckltYWdlIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmluZChzY29wZTogQ29uc3RydWN0LCBjb250YWluZXJEZWZpbml0aW9uOiBDb250YWluZXJEZWZpbml0aW9uKTogQ29udGFpbmVySW1hZ2VDb25maWcge1xuXG4gICAgICAgIGNvbnN0IGFzc2V0ID0gbmV3IFRhcmJhbGxJbWFnZUFzc2V0KHNjb3BlLCAnVGFyYmFsbCcsIHsgdGFyYmFsbEZpbGUgfSk7XG4gICAgICAgIGFzc2V0LnJlcG9zaXRvcnkuZ3JhbnRQdWxsKGNvbnRhaW5lckRlZmluaXRpb24udGFza0RlZmluaXRpb24ub2J0YWluRXhlY3V0aW9uUm9sZSgpKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGltYWdlTmFtZTogYXNzZXQuaW1hZ2VVcmksXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGltYWdlIGlzIHVzZWQgYnkgYSBDb250YWluZXJEZWZpbml0aW9uXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgYmluZChzY29wZTogQ29uc3RydWN0LCBjb250YWluZXJEZWZpbml0aW9uOiBDb250YWluZXJEZWZpbml0aW9uKTogQ29udGFpbmVySW1hZ2VDb25maWc7XG59XG5cbi8qKlxuICogVGhlIGNvbmZpZ3VyYXRpb24gZm9yIGNyZWF0aW5nIGEgY29udGFpbmVyIGltYWdlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbnRhaW5lckltYWdlQ29uZmlnIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgbmFtZSBvZiB0aGUgY29udGFpbmVyIGltYWdlLlxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgY3JlZGVudGlhbHMgdXNlZCB0byBhY2Nlc3MgdGhlIGltYWdlIHJlcG9zaXRvcnkuXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5Q3JlZGVudGlhbHM/OiBDZm5UYXNrRGVmaW5pdGlvbi5SZXBvc2l0b3J5Q3JlZGVudGlhbHNQcm9wZXJ0eTtcbn1cblxuaW1wb3J0IHsgQXNzZXRJbWFnZSwgQXNzZXRJbWFnZVByb3BzIH0gZnJvbSAnLi9pbWFnZXMvYXNzZXQtaW1hZ2UnO1xuaW1wb3J0IHsgRWNySW1hZ2UgfSBmcm9tICcuL2ltYWdlcy9lY3InO1xuaW1wb3J0IHsgUmVwb3NpdG9yeUltYWdlLCBSZXBvc2l0b3J5SW1hZ2VQcm9wcyB9IGZyb20gJy4vaW1hZ2VzL3JlcG9zaXRvcnknO1xuXG4iXX0=