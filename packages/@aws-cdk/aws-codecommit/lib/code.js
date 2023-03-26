"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const assets = require("@aws-cdk/aws-s3-assets");
/**
 * Represents the contents to initialize the repository with.
 */
class Code {
    /**
     * Code from directory.
     * @param directoryPath the path to the local directory containing the contents to initialize the repository with
     * @param branch the name of the branch to create in the repository. Default is "main"
     */
    static fromDirectory(directoryPath, branch) {
        const resolvedPath = path.resolve(directoryPath);
        const statResult = fs.statSync(resolvedPath);
        if (!statResult || !statResult.isDirectory()) {
            throw new Error(`'${directoryPath}' needs to be a path to a directory (resolved to: '${resolvedPath}')`);
        }
        return new PathResolvedCode(resolvedPath, branch);
    }
    /**
     * Code from preexisting ZIP file.
     * @param filePath the path to the local ZIP file containing the contents to initialize the repository with
     * @param branch the name of the branch to create in the repository. Default is "main"
     */
    static fromZipFile(filePath, branch) {
        const resolvedPath = path.resolve(filePath);
        const statResult = fs.statSync(resolvedPath);
        if (!statResult || !statResult.isFile()) {
            throw new Error(`'${filePath}' needs to be a path to a ZIP file (resolved to: '${resolvedPath}')`);
        }
        return new PathResolvedCode(resolvedPath, branch);
    }
    /**
     * Code from user-supplied asset.
     * @param asset pre-existing asset
     * @param branch the name of the branch to create in the repository. Default is "main"
     */
    static fromAsset(asset, branch) {
        return new AssetCode(asset, branch);
    }
}
exports.Code = Code;
_a = JSII_RTTI_SYMBOL_1;
Code[_a] = { fqn: "@aws-cdk/aws-codecommit.Code", version: "0.0.0" };
class PathResolvedCode extends Code {
    constructor(resolvedPath, branch) {
        super();
        this.resolvedPath = resolvedPath;
        this.branch = branch;
    }
    bind(scope) {
        const asset = new assets.Asset(scope, 'PathResolvedCodeAsset', {
            path: this.resolvedPath,
        });
        return (new AssetCode(asset, this.branch)).bind(scope);
    }
}
class AssetCode extends Code {
    constructor(asset, branch) {
        super();
        this.asset = asset;
        this.branch = branch;
    }
    bind(_scope) {
        if (!this.asset.isZipArchive) {
            throw new Error('Asset must be a .zip file or a directory (resolved to: ' + this.asset.assetPath + ' )');
        }
        return {
            code: {
                branchName: this.branch,
                s3: {
                    bucket: this.asset.s3BucketName,
                    key: this.asset.s3ObjectKey,
                },
            },
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLGlEQUFpRDtBQWNqRDs7R0FFRztBQUNILE1BQXNCLElBQUk7SUFDeEI7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBcUIsRUFBRSxNQUFlO1FBQ2hFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFakQsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxhQUFhLHNEQUFzRCxZQUFhLElBQUksQ0FBQyxDQUFDO1NBQzNHO1FBRUQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNuRDtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQWdCLEVBQUUsTUFBZTtRQUN6RCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksUUFBUSxxREFBcUQsWUFBYSxJQUFJLENBQUMsQ0FBQztTQUNyRztRQUVELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFtQixFQUFFLE1BQWU7UUFDMUQsT0FBTyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDckM7O0FBeENILG9CQWdEQzs7O0FBRUQsTUFBTSxnQkFBaUIsU0FBUSxJQUFJO0lBQ2pDLFlBQTZCLFlBQW9CLEVBQW1CLE1BQWU7UUFDakYsS0FBSyxFQUFFLENBQUM7UUFEbUIsaUJBQVksR0FBWixZQUFZLENBQVE7UUFBbUIsV0FBTSxHQUFOLE1BQU0sQ0FBUztLQUVsRjtJQUVNLElBQUksQ0FBQyxLQUFnQjtRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLHVCQUF1QixFQUFFO1lBQzdELElBQUksRUFBRSxJQUFJLENBQUMsWUFBWTtTQUN4QixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4RDtDQUNGO0FBRUQsTUFBTSxTQUFVLFNBQVEsSUFBSTtJQUMxQixZQUE2QixLQUFtQixFQUFtQixNQUFlO1FBQ2hGLEtBQUssRUFBRSxDQUFDO1FBRG1CLFVBQUssR0FBTCxLQUFLLENBQWM7UUFBbUIsV0FBTSxHQUFOLE1BQU0sQ0FBUztLQUVqRjtJQUVNLElBQUksQ0FBQyxNQUFpQjtRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUMxRztRQUVELE9BQU87WUFDTCxJQUFJLEVBQUU7Z0JBQ0osVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUN2QixFQUFFLEVBQUU7b0JBQ0YsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtvQkFDL0IsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVztpQkFDNUI7YUFDRjtTQUNGLENBQUM7S0FDSDtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGFzc2V0cyBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuUmVwb3NpdG9yeSB9IGZyb20gJy4vY29kZWNvbW1pdC5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIHN0cnVjdHVyZSB0byBwYXNzIGludG8gdGhlIHVuZGVybHlpbmcgQ2ZuUmVwb3NpdG9yeSBjbGFzcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb2RlQ29uZmlnIHtcbiAgLyoqXG4gICAqIHJlcHJlc2VudHMgdGhlIHVuZGVybHlpbmcgY29kZSBzdHJ1Y3R1cmVcbiAgICovXG4gIHJlYWRvbmx5IGNvZGU6IENmblJlcG9zaXRvcnkuQ29kZVByb3BlcnR5O1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGNvbnRlbnRzIHRvIGluaXRpYWxpemUgdGhlIHJlcG9zaXRvcnkgd2l0aC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvZGUge1xuICAvKipcbiAgICogQ29kZSBmcm9tIGRpcmVjdG9yeS5cbiAgICogQHBhcmFtIGRpcmVjdG9yeVBhdGggdGhlIHBhdGggdG8gdGhlIGxvY2FsIGRpcmVjdG9yeSBjb250YWluaW5nIHRoZSBjb250ZW50cyB0byBpbml0aWFsaXplIHRoZSByZXBvc2l0b3J5IHdpdGhcbiAgICogQHBhcmFtIGJyYW5jaCB0aGUgbmFtZSBvZiB0aGUgYnJhbmNoIHRvIGNyZWF0ZSBpbiB0aGUgcmVwb3NpdG9yeS4gRGVmYXVsdCBpcyBcIm1haW5cIlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRGlyZWN0b3J5KGRpcmVjdG9yeVBhdGg6IHN0cmluZywgYnJhbmNoPzogc3RyaW5nKTogQ29kZSB7XG4gICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gcGF0aC5yZXNvbHZlKGRpcmVjdG9yeVBhdGgpO1xuXG4gICAgY29uc3Qgc3RhdFJlc3VsdCA9IGZzLnN0YXRTeW5jKHJlc29sdmVkUGF0aCk7XG4gICAgaWYgKCFzdGF0UmVzdWx0IHx8ICFzdGF0UmVzdWx0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJyR7ZGlyZWN0b3J5UGF0aH0nIG5lZWRzIHRvIGJlIGEgcGF0aCB0byBhIGRpcmVjdG9yeSAocmVzb2x2ZWQgdG86ICcke3Jlc29sdmVkUGF0aCB9JylgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBhdGhSZXNvbHZlZENvZGUocmVzb2x2ZWRQYXRoLCBicmFuY2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvZGUgZnJvbSBwcmVleGlzdGluZyBaSVAgZmlsZS5cbiAgICogQHBhcmFtIGZpbGVQYXRoIHRoZSBwYXRoIHRvIHRoZSBsb2NhbCBaSVAgZmlsZSBjb250YWluaW5nIHRoZSBjb250ZW50cyB0byBpbml0aWFsaXplIHRoZSByZXBvc2l0b3J5IHdpdGhcbiAgICogQHBhcmFtIGJyYW5jaCB0aGUgbmFtZSBvZiB0aGUgYnJhbmNoIHRvIGNyZWF0ZSBpbiB0aGUgcmVwb3NpdG9yeS4gRGVmYXVsdCBpcyBcIm1haW5cIlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tWmlwRmlsZShmaWxlUGF0aDogc3RyaW5nLCBicmFuY2g/OiBzdHJpbmcpOiBDb2RlIHtcbiAgICBjb25zdCByZXNvbHZlZFBhdGggPSBwYXRoLnJlc29sdmUoZmlsZVBhdGgpO1xuXG4gICAgY29uc3Qgc3RhdFJlc3VsdCA9IGZzLnN0YXRTeW5jKHJlc29sdmVkUGF0aCk7XG4gICAgaWYgKCFzdGF0UmVzdWx0IHx8ICFzdGF0UmVzdWx0LmlzRmlsZSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke2ZpbGVQYXRofScgbmVlZHMgdG8gYmUgYSBwYXRoIHRvIGEgWklQIGZpbGUgKHJlc29sdmVkIHRvOiAnJHtyZXNvbHZlZFBhdGggfScpYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQYXRoUmVzb2x2ZWRDb2RlKHJlc29sdmVkUGF0aCwgYnJhbmNoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb2RlIGZyb20gdXNlci1zdXBwbGllZCBhc3NldC5cbiAgICogQHBhcmFtIGFzc2V0IHByZS1leGlzdGluZyBhc3NldFxuICAgKiBAcGFyYW0gYnJhbmNoIHRoZSBuYW1lIG9mIHRoZSBicmFuY2ggdG8gY3JlYXRlIGluIHRoZSByZXBvc2l0b3J5LiBEZWZhdWx0IGlzIFwibWFpblwiXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bc3NldChhc3NldDogYXNzZXRzLkFzc2V0LCBicmFuY2g/OiBzdHJpbmcpOiBDb2RlIHtcbiAgICByZXR1cm4gbmV3IEFzc2V0Q29kZShhc3NldCwgYnJhbmNoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYWZ0ZXIgYSByZXBvc2l0b3J5IGlzIHBhc3NlZCB0aGlzIGluc3RhbmNlIG9mIENvZGUgaW4gaXRzICdjb2RlJyBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIHRoZSBiaW5kaW5nIHNjb3BlXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgYmluZChzY29wZTogQ29uc3RydWN0KTogQ29kZUNvbmZpZztcbn1cblxuY2xhc3MgUGF0aFJlc29sdmVkQ29kZSBleHRlbmRzIENvZGUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHJlc29sdmVkUGF0aDogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IGJyYW5jaD86IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgYmluZChzY29wZTogQ29uc3RydWN0KTogQ29kZUNvbmZpZyB7XG4gICAgY29uc3QgYXNzZXQgPSBuZXcgYXNzZXRzLkFzc2V0KHNjb3BlLCAnUGF0aFJlc29sdmVkQ29kZUFzc2V0Jywge1xuICAgICAgcGF0aDogdGhpcy5yZXNvbHZlZFBhdGgsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKG5ldyBBc3NldENvZGUoYXNzZXQsIHRoaXMuYnJhbmNoKSkuYmluZChzY29wZSk7XG4gIH1cbn1cblxuY2xhc3MgQXNzZXRDb2RlIGV4dGVuZHMgQ29kZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYXNzZXQ6IGFzc2V0cy5Bc3NldCwgcHJpdmF0ZSByZWFkb25seSBicmFuY2g/OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QpOiBDb2RlQ29uZmlnIHtcbiAgICBpZiAoIXRoaXMuYXNzZXQuaXNaaXBBcmNoaXZlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fzc2V0IG11c3QgYmUgYSAuemlwIGZpbGUgb3IgYSBkaXJlY3RvcnkgKHJlc29sdmVkIHRvOiAnICsgdGhpcy5hc3NldC5hc3NldFBhdGggKyAnICknKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29kZToge1xuICAgICAgICBicmFuY2hOYW1lOiB0aGlzLmJyYW5jaCxcbiAgICAgICAgczM6IHtcbiAgICAgICAgICBidWNrZXQ6IHRoaXMuYXNzZXQuczNCdWNrZXROYW1lLFxuICAgICAgICAgIGtleTogdGhpcy5hc3NldC5zM09iamVjdEtleSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufSJdfQ==