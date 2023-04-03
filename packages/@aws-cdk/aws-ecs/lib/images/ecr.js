"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrImage = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const container_image_1 = require("../container-image");
/**
 * An image from an Amazon ECR repository.
 */
class EcrImage extends container_image_1.ContainerImage {
    /**
     * Constructs a new instance of the EcrImage class.
     */
    constructor(repository, tagOrDigest) {
        super();
        this.repository = repository;
        this.tagOrDigest = tagOrDigest;
        this.imageName = this.repository.repositoryUriForTagOrDigest(this.tagOrDigest);
    }
    bind(_scope, containerDefinition) {
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
        return {
            imageName: this.imageName,
        };
    }
}
exports.EcrImage = EcrImage;
_a = JSII_RTTI_SYMBOL_1;
EcrImage[_a] = { fqn: "@aws-cdk/aws-ecs.EcrImage", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLHdEQUEwRTtBQUUxRTs7R0FFRztBQUNILE1BQWEsUUFBUyxTQUFRLGdDQUFjO0lBVTFDOztPQUVHO0lBQ0gsWUFBNkIsVUFBMkIsRUFBbUIsV0FBbUI7UUFDNUYsS0FBSyxFQUFFLENBQUM7UUFEbUIsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFBbUIsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFHNUYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNoRjtJQUVNLElBQUksQ0FBQyxNQUFpQixFQUFFLG1CQUF3Qzs7Ozs7Ozs7OztRQUNyRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBRXBGLE9BQU87WUFDTCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7U0FDMUIsQ0FBQztLQUNIOztBQXpCSCw0QkEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvbnRhaW5lckRlZmluaXRpb24gfSBmcm9tICcuLi9jb250YWluZXItZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBDb250YWluZXJJbWFnZSwgQ29udGFpbmVySW1hZ2VDb25maWcgfSBmcm9tICcuLi9jb250YWluZXItaW1hZ2UnO1xuXG4vKipcbiAqIEFuIGltYWdlIGZyb20gYW4gQW1hem9uIEVDUiByZXBvc2l0b3J5LlxuICovXG5leHBvcnQgY2xhc3MgRWNySW1hZ2UgZXh0ZW5kcyBDb250YWluZXJJbWFnZSB7XG4gIC8qKlxuICAgKiBUaGUgaW1hZ2UgbmFtZS4gSW1hZ2VzIGluIEFtYXpvbiBFQ1IgcmVwb3NpdG9yaWVzIGNhbiBiZSBzcGVjaWZpZWQgYnkgZWl0aGVyIHVzaW5nIHRoZSBmdWxsIHJlZ2lzdHJ5L3JlcG9zaXRvcnk6dGFnIG9yXG4gICAqIHJlZ2lzdHJ5L3JlcG9zaXRvcnlAZGlnZXN0LlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgMDEyMzQ1Njc4OTEwLmRrci5lY3IuPHJlZ2lvbi1uYW1lPi5hbWF6b25hd3MuY29tLzxyZXBvc2l0b3J5LW5hbWU+OmxhdGVzdCBvclxuICAgKiAwMTIzNDU2Nzg5MTAuZGtyLmVjci48cmVnaW9uLW5hbWU+LmFtYXpvbmF3cy5jb20vPHJlcG9zaXRvcnktbmFtZT5Ac2hhMjU2Ojk0YWZkMWYyZTY0ZDkwOGJjOTBkYmNhMDAzNWE1YjU2N0VYQU1QTEUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW1hZ2VOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEVjckltYWdlIGNsYXNzLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSByZXBvc2l0b3J5OiBlY3IuSVJlcG9zaXRvcnksIHByaXZhdGUgcmVhZG9ubHkgdGFnT3JEaWdlc3Q6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmltYWdlTmFtZSA9IHRoaXMucmVwb3NpdG9yeS5yZXBvc2l0b3J5VXJpRm9yVGFnT3JEaWdlc3QodGhpcy50YWdPckRpZ2VzdCk7XG4gIH1cblxuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgY29udGFpbmVyRGVmaW5pdGlvbjogQ29udGFpbmVyRGVmaW5pdGlvbik6IENvbnRhaW5lckltYWdlQ29uZmlnIHtcbiAgICB0aGlzLnJlcG9zaXRvcnkuZ3JhbnRQdWxsKGNvbnRhaW5lckRlZmluaXRpb24udGFza0RlZmluaXRpb24ub2J0YWluRXhlY3V0aW9uUm9sZSgpKTtcblxuICAgIHJldHVybiB7XG4gICAgICBpbWFnZU5hbWU6IHRoaXMuaW1hZ2VOYW1lLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==