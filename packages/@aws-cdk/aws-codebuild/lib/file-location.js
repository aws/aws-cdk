"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemLocation = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * FileSystemLocation provider definition for a CodeBuild Project.
 */
class FileSystemLocation {
    /**
     * EFS file system provider.
     * @param props the EFS File System location property.
     */
    static efs(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_EfsFileSystemLocationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.efs);
            }
            throw error;
        }
        return new EfsFileSystemLocation(props);
    }
}
exports.FileSystemLocation = FileSystemLocation;
_a = JSII_RTTI_SYMBOL_1;
FileSystemLocation[_a] = { fqn: "@aws-cdk/aws-codebuild.FileSystemLocation", version: "0.0.0" };
/**
 * EfsFileSystemLocation definition for a CodeBuild project.
 */
class EfsFileSystemLocation {
    constructor(props) {
        this.props = props;
    }
    bind(_scope, _project) {
        return {
            location: {
                identifier: this.props.identifier,
                location: this.props.location,
                mountOptions: this.props.mountOptions,
                mountPoint: this.props.mountPoint,
                type: 'EFS',
            },
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1sb2NhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUtbG9jYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBMkJBOztHQUVHO0FBQ0gsTUFBYSxrQkFBa0I7SUFDN0I7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFpQzs7Ozs7Ozs7OztRQUNqRCxPQUFPLElBQUkscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekM7O0FBUEgsZ0RBUUM7OztBQUVEOztHQUVHO0FBQ0gsTUFBTSxxQkFBcUI7SUFDekIsWUFBNkIsS0FBaUM7UUFBakMsVUFBSyxHQUFMLEtBQUssQ0FBNEI7S0FBSTtJQUUzRCxJQUFJLENBQUMsTUFBaUIsRUFBRSxRQUFrQjtRQUMvQyxPQUFPO1lBQ0wsUUFBUSxFQUFFO2dCQUNSLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7Z0JBQ2pDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7Z0JBQzdCLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7Z0JBQ3JDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7Z0JBQ2pDLElBQUksRUFBRSxLQUFLO2FBQ1o7U0FDRixDQUFDO0tBQ0g7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuUHJvamVjdCB9IGZyb20gJy4vY29kZWJ1aWxkLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJUHJvamVjdCB9IGZyb20gJy4vcHJvamVjdCc7XG5cbi8qKlxuICogVGhlIHR5cGUgcmV0dXJuZWQgZnJvbSBgSUZpbGVTeXN0ZW1Mb2NhdGlvbiNiaW5kYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaWxlU3lzdGVtQ29uZmlnIHtcbiAgLyoqXG4gICAqIEZpbGUgc3lzdGVtIGxvY2F0aW9uIHdyYXBwZXIgcHJvcGVydHkuXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1jb2RlYnVpbGQtcHJvamVjdC1wcm9qZWN0ZmlsZXN5c3RlbWxvY2F0aW9uLmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IGxvY2F0aW9uOiBDZm5Qcm9qZWN0LlByb2plY3RGaWxlU3lzdGVtTG9jYXRpb25Qcm9wZXJ0eTtcbn1cblxuLyoqXG4gKiBUaGUgaW50ZXJmYWNlIG9mIGEgQ29kZUJ1aWxkIEZpbGVTeXN0ZW1Mb2NhdGlvbi5cbiAqIEltcGxlbWVudGVkIGJ5IGBFZnNGaWxlU3lzdGVtTG9jYXRpb25gLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGaWxlU3lzdGVtTG9jYXRpb24ge1xuICAvKipcbiAgICogQ2FsbGVkIGJ5IHRoZSBwcm9qZWN0IHdoZW4gYSBmaWxlIHN5c3RlbSBpcyBhZGRlZCBzbyBpdCBjYW4gcGVyZm9ybVxuICAgKiBiaW5kaW5nIG9wZXJhdGlvbnMgb24gdGhpcyBmaWxlIHN5c3RlbSBsb2NhdGlvbi5cbiAgICovXG4gIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgcHJvamVjdDogSVByb2plY3QpOiBGaWxlU3lzdGVtQ29uZmlnO1xufVxuXG4vKipcbiAqIEZpbGVTeXN0ZW1Mb2NhdGlvbiBwcm92aWRlciBkZWZpbml0aW9uIGZvciBhIENvZGVCdWlsZCBQcm9qZWN0LlxuICovXG5leHBvcnQgY2xhc3MgRmlsZVN5c3RlbUxvY2F0aW9uIHtcbiAgLyoqXG4gICAqIEVGUyBmaWxlIHN5c3RlbSBwcm92aWRlci5cbiAgICogQHBhcmFtIHByb3BzIHRoZSBFRlMgRmlsZSBTeXN0ZW0gbG9jYXRpb24gcHJvcGVydHkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGVmcyhwcm9wczogRWZzRmlsZVN5c3RlbUxvY2F0aW9uUHJvcHMpOiBJRmlsZVN5c3RlbUxvY2F0aW9uIHtcbiAgICByZXR1cm4gbmV3IEVmc0ZpbGVTeXN0ZW1Mb2NhdGlvbihwcm9wcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBFZnNGaWxlU3lzdGVtTG9jYXRpb24gZGVmaW5pdGlvbiBmb3IgYSBDb2RlQnVpbGQgcHJvamVjdC5cbiAqL1xuY2xhc3MgRWZzRmlsZVN5c3RlbUxvY2F0aW9uIGltcGxlbWVudHMgSUZpbGVTeXN0ZW1Mb2NhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEVmc0ZpbGVTeXN0ZW1Mb2NhdGlvblByb3BzKSB7fVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBfcHJvamVjdDogSVByb2plY3QpOiBGaWxlU3lzdGVtQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgaWRlbnRpZmllcjogdGhpcy5wcm9wcy5pZGVudGlmaWVyLFxuICAgICAgICBsb2NhdGlvbjogdGhpcy5wcm9wcy5sb2NhdGlvbixcbiAgICAgICAgbW91bnRPcHRpb25zOiB0aGlzLnByb3BzLm1vdW50T3B0aW9ucyxcbiAgICAgICAgbW91bnRQb2ludDogdGhpcy5wcm9wcy5tb3VudFBvaW50LFxuICAgICAgICB0eXBlOiAnRUZTJyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBgRWZzRmlsZVN5c3RlbUxvY2F0aW9uYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFZnNGaWxlU3lzdGVtTG9jYXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSB1c2VkIHRvIGFjY2VzcyBhIGZpbGUgc3lzdGVtIGNyZWF0ZWQgYnkgQW1hem9uIEVGUy5cbiAgICovXG4gIHJlYWRvbmx5IGlkZW50aWZpZXI6IHN0cmluZztcblxuICAvKipcbiAgICogQSBzdHJpbmcgdGhhdCBzcGVjaWZpZXMgdGhlIGxvY2F0aW9uIG9mIHRoZSBmaWxlIHN5c3RlbSwgbGlrZSBBbWF6b24gRUZTLlxuICAgKlxuICAgKiBUaGlzIHZhbHVlIGxvb2tzIGxpa2UgYGZzLWFiY2QxMjM0LmVmcy51cy13ZXN0LTIuYW1hem9uYXdzLmNvbTovbXktZWZzLW1vdW50LWRpcmVjdG9yeWAuXG4gICAqL1xuICByZWFkb25seSBsb2NhdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbW91bnQgb3B0aW9ucyBmb3IgYSBmaWxlIHN5c3RlbSBzdWNoIGFzIEFtYXpvbiBFRlMuXG4gICAqIEBkZWZhdWx0ICduZnN2ZXJzPTQuMSxyc2l6ZT0xMDQ4NTc2LHdzaXplPTEwNDg1NzYsaGFyZCx0aW1lbz02MDAscmV0cmFucz0yJy5cbiAgICovXG4gIHJlYWRvbmx5IG1vdW50T3B0aW9ucz86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxvY2F0aW9uIGluIHRoZSBjb250YWluZXIgd2hlcmUgeW91IG1vdW50IHRoZSBmaWxlIHN5c3RlbS5cbiAgICovXG4gIHJlYWRvbmx5IG1vdW50UG9pbnQ6IHN0cmluZztcbn1cbiJdfQ==