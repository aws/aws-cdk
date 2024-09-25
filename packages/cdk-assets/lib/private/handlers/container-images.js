"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerImageAssetHandler = void 0;
const path = require("path");
const progress_1 = require("../../progress");
const placeholders_1 = require("../placeholders");
const shell_1 = require("../shell");
class ContainerImageAssetHandler {
    constructor(workDir, asset, host, options) {
        this.workDir = workDir;
        this.asset = asset;
        this.host = host;
        this.options = options;
    }
    async build() {
        const initOnce = await this.initOnce();
        if (initOnce.destinationAlreadyExists) {
            return;
        }
        if (this.host.aborted) {
            return;
        }
        const dockerForBuilding = await this.host.dockerFactory.forBuild({
            repoUri: initOnce.repoUri,
            logger: (m) => this.host.emitMessage(progress_1.EventType.DEBUG, m),
            ecr: initOnce.ecr,
        });
        const builder = new ContainerImageBuilder(dockerForBuilding, this.workDir, this.asset, this.host, {
            quiet: this.options.quiet,
        });
        const localTagName = await builder.build();
        if (localTagName === undefined || this.host.aborted) {
            return;
        }
        if (this.host.aborted) {
            return;
        }
        await dockerForBuilding.tag(localTagName, initOnce.imageUri);
    }
    async isPublished() {
        try {
            const initOnce = await this.initOnce({ quiet: true });
            return initOnce.destinationAlreadyExists;
        }
        catch (e) {
            this.host.emitMessage(progress_1.EventType.DEBUG, `${e.message}`);
        }
        return false;
    }
    async publish() {
        const initOnce = await this.initOnce();
        if (initOnce.destinationAlreadyExists) {
            return;
        }
        if (this.host.aborted) {
            return;
        }
        const dockerForPushing = await this.host.dockerFactory.forEcrPush({
            repoUri: initOnce.repoUri,
            logger: (m) => this.host.emitMessage(progress_1.EventType.DEBUG, m),
            ecr: initOnce.ecr,
        });
        if (this.host.aborted) {
            return;
        }
        this.host.emitMessage(progress_1.EventType.UPLOAD, `Push ${initOnce.imageUri}`);
        await dockerForPushing.push({ tag: initOnce.imageUri, quiet: this.options.quiet });
    }
    async initOnce(options = {}) {
        if (this.init) {
            return this.init;
        }
        const destination = await (0, placeholders_1.replaceAwsPlaceholders)(this.asset.destination, this.host.aws);
        const ecr = await this.host.aws.ecrClient({
            ...destination,
            quiet: options.quiet,
        });
        const account = async () => (await this.host.aws.discoverCurrentAccount())?.accountId;
        const repoUri = await repositoryUri(ecr, destination.repositoryName);
        if (!repoUri) {
            throw new Error(`No ECR repository named '${destination.repositoryName}' in account ${await account()}. Is this account bootstrapped?`);
        }
        const imageUri = `${repoUri}:${destination.imageTag}`;
        this.init = {
            imageUri,
            ecr,
            repoUri,
            destinationAlreadyExists: await this.destinationAlreadyExists(ecr, destination, imageUri),
        };
        return this.init;
    }
    /**
     * Check whether the image already exists in the ECR repo
     *
     * Use the fields from the destination to do the actual check. The imageUri
     * should correspond to that, but is only used to print Docker image location
     * for user benefit (the format is slightly different).
     */
    async destinationAlreadyExists(ecr, destination, imageUri) {
        this.host.emitMessage(progress_1.EventType.CHECK, `Check ${imageUri}`);
        if (await imageExists(ecr, destination.repositoryName, destination.imageTag)) {
            this.host.emitMessage(progress_1.EventType.FOUND, `Found ${imageUri}`);
            return true;
        }
        return false;
    }
}
exports.ContainerImageAssetHandler = ContainerImageAssetHandler;
class ContainerImageBuilder {
    constructor(docker, workDir, asset, host, options) {
        this.docker = docker;
        this.workDir = workDir;
        this.asset = asset;
        this.host = host;
        this.options = options;
    }
    async build() {
        return this.asset.source.executable
            ? this.buildExternalAsset(this.asset.source.executable)
            : this.buildDirectoryAsset();
    }
    /**
     * Build a (local) Docker asset from a directory with a Dockerfile
     *
     * Tags under a deterministic, unique, local identifier wich will skip
     * the build if it already exists.
     */
    async buildDirectoryAsset() {
        const localTagName = `cdkasset-${this.asset.id.assetId.toLowerCase()}`;
        if (!(await this.isImageCached(localTagName))) {
            if (this.host.aborted) {
                return undefined;
            }
            await this.buildImage(localTagName);
        }
        return localTagName;
    }
    /**
     * Build a (local) Docker asset by running an external command
     *
     * External command is responsible for deduplicating the build if possible,
     * and is expected to return the generated image identifier on stdout.
     */
    async buildExternalAsset(executable, cwd) {
        const assetPath = cwd ?? this.workDir;
        this.host.emitMessage(progress_1.EventType.BUILD, `Building Docker image using command '${executable}'`);
        if (this.host.aborted) {
            return undefined;
        }
        return (await (0, shell_1.shell)(executable, { cwd: assetPath, quiet: true })).trim();
    }
    async buildImage(localTagName) {
        const source = this.asset.source;
        if (!source.directory) {
            throw new Error(`'directory' is expected in the DockerImage asset source, got: ${JSON.stringify(source)}`);
        }
        const fullPath = path.resolve(this.workDir, source.directory);
        this.host.emitMessage(progress_1.EventType.BUILD, `Building Docker image at ${fullPath}`);
        await this.docker.build({
            directory: fullPath,
            tag: localTagName,
            buildArgs: source.dockerBuildArgs,
            buildSecrets: source.dockerBuildSecrets,
            buildSsh: source.dockerBuildSsh,
            target: source.dockerBuildTarget,
            file: source.dockerFile,
            networkMode: source.networkMode,
            platform: source.platform,
            outputs: source.dockerOutputs,
            cacheFrom: source.cacheFrom,
            cacheTo: source.cacheTo,
            cacheDisabled: source.cacheDisabled,
            quiet: this.options.quiet,
        });
    }
    async isImageCached(localTagName) {
        if (await this.docker.exists(localTagName)) {
            this.host.emitMessage(progress_1.EventType.CACHED, `Cached ${localTagName}`);
            return true;
        }
        return false;
    }
}
async function imageExists(ecr, repositoryName, imageTag) {
    try {
        await ecr.describeImages({ repositoryName, imageIds: [{ imageTag }] }).promise();
        return true;
    }
    catch (e) {
        if (e.code !== 'ImageNotFoundException') {
            throw e;
        }
        return false;
    }
}
/**
 * Return the URI for the repository with the given name
 *
 * Returns undefined if the repository does not exist.
 */
async function repositoryUri(ecr, repositoryName) {
    try {
        const response = await ecr.describeRepositories({ repositoryNames: [repositoryName] }).promise();
        return (response.repositories || [])[0]?.repositoryUri;
    }
    catch (e) {
        if (e.code !== 'RepositoryNotFoundException') {
            throw e;
        }
        return undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLWltYWdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRhaW5lci1pbWFnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBSTdCLDZDQUEyQztBQUczQyxrREFBeUQ7QUFDekQsb0NBQWlDO0FBU2pDLE1BQWEsMEJBQTBCO0lBR3JDLFlBQ21CLE9BQWUsRUFDZixLQUErQixFQUMvQixJQUFrQixFQUNsQixPQUF3QjtRQUh4QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsVUFBSyxHQUFMLEtBQUssQ0FBMEI7UUFDL0IsU0FBSSxHQUFKLElBQUksQ0FBYztRQUNsQixZQUFPLEdBQVAsT0FBTyxDQUFpQjtJQUMzQyxDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQUs7UUFDaEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFdkMsSUFBSSxRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUFDLE9BQU87UUFBQyxDQUFDO1FBQ2xELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUFDLE9BQU87UUFBQyxDQUFDO1FBRWxDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7WUFDL0QsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO1lBQ3pCLE1BQU0sRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRztTQUNsQixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFB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SUFBSSxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsb0JBQW9CLENBQUMsRUFBRSxlQUFlLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDO0lBQ3pELENBQUM7SUFBQyxPQUFPLENBQU0sRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyw2QkFBNkIsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLENBQUM7UUFBQyxDQUFDO1FBQzFELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IERvY2tlckltYWdlRGVzdGluYXRpb24gfSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHR5cGUgKiBhcyBBV1MgZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQgeyBEb2NrZXJJbWFnZU1hbmlmZXN0RW50cnkgfSBmcm9tICcuLi8uLi9hc3NldC1tYW5pZmVzdCc7XG5pbXBvcnQgeyBFdmVudFR5cGUgfSBmcm9tICcuLi8uLi9wcm9ncmVzcyc7XG5pbXBvcnQgeyBJQXNzZXRIYW5kbGVyLCBJSGFuZGxlckhvc3QsIElIYW5kbGVyT3B0aW9ucyB9IGZyb20gJy4uL2Fzc2V0LWhhbmRsZXInO1xuaW1wb3J0IHsgRG9ja2VyIH0gZnJvbSAnLi4vZG9ja2VyJztcbmltcG9ydCB7IHJlcGxhY2VBd3NQbGFjZWhvbGRlcnMgfSBmcm9tICcuLi9wbGFjZWhvbGRlcnMnO1xuaW1wb3J0IHsgc2hlbGwgfSBmcm9tICcuLi9zaGVsbCc7XG5cbmludGVyZmFjZSBDb250YWluZXJJbWFnZUFzc2V0SGFuZGxlckluaXQge1xuICByZWFkb25seSBlY3I6IEFXUy5FQ1I7XG4gIHJlYWRvbmx5IHJlcG9Vcmk6IHN0cmluZztcbiAgcmVhZG9ubHkgaW1hZ2VVcmk6IHN0cmluZztcbiAgcmVhZG9ubHkgZGVzdGluYXRpb25BbHJlYWR5RXhpc3RzOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVySW1hZ2VBc3NldEhhbmRsZXIgaW1wbGVtZW50cyBJQXNzZXRIYW5kbGVyIHtcbiAgcHJpdmF0ZSBpbml0PzogQ29udGFpbmVySW1hZ2VBc3NldEhhbmRsZXJJbml0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgd29ya0Rpcjogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXNzZXQ6IERvY2tlckltYWdlTWFuaWZlc3RFbnRyeSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGhvc3Q6IElIYW5kbGVySG9zdCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IElIYW5kbGVyT3B0aW9ucykge1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGJ1aWxkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGluaXRPbmNlID0gYXdhaXQgdGhpcy5pbml0T25jZSgpO1xuXG4gICAgaWYgKGluaXRPbmNlLmRlc3RpbmF0aW9uQWxyZWFkeUV4aXN0cykgeyByZXR1cm47IH1cbiAgICBpZiAodGhpcy5ob3N0LmFib3J0ZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBkb2NrZXJGb3JCdWlsZGluZyA9IGF3YWl0IHRoaXMuaG9zdC5kb2NrZXJGYWN0b3J5LmZvckJ1aWxkKHtcbiAgICAgIHJlcG9Vcmk6IGluaXRPbmNlLnJlcG9VcmksXG4gICAgICBsb2dnZXI6IChtOiBzdHJpbmcpID0+IHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuREVCVUcsIG0pLFxuICAgICAgZWNyOiBpbml0T25jZS5lY3IsXG4gICAgfSk7XG5cbiAgICBjb25zdCBidWlsZGVyID0gbmV3IENvbnRhaW5lckltYWdlQnVpbGRlcihkb2NrZXJGb3JCdWlsZGluZywgdGhpcy53b3JrRGlyLCB0aGlzLmFzc2V0LCB0aGlzLmhvc3QsIHtcbiAgICAgIHF1aWV0OiB0aGlzLm9wdGlvbnMucXVpZXQsXG4gICAgfSk7XG4gICAgY29uc3QgbG9jYWxUYWdOYW1lID0gYXdhaXQgYnVpbGRlci5idWlsZCgpO1xuXG4gICAgaWYgKGxvY2FsVGFnTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuaG9zdC5hYm9ydGVkKSB7IHJldHVybjsgfVxuICAgIGlmICh0aGlzLmhvc3QuYWJvcnRlZCkgeyByZXR1cm47IH1cblxuICAgIGF3YWl0IGRvY2tlckZvckJ1aWxkaW5nLnRhZyhsb2NhbFRhZ05hbWUsIGluaXRPbmNlLmltYWdlVXJpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpc1B1Ymxpc2hlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaW5pdE9uY2UgPSBhd2FpdCB0aGlzLmluaXRPbmNlKHsgcXVpZXQ6IHRydWUgfSk7XG4gICAgICByZXR1cm4gaW5pdE9uY2UuZGVzdGluYXRpb25BbHJlYWR5RXhpc3RzO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgdGhpcy5ob3N0LmVtaXRNZXNzYWdlKEV2ZW50VHlwZS5ERUJVRywgYCR7ZS5tZXNzYWdlfWApO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcHVibGlzaCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpbml0T25jZSA9IGF3YWl0IHRoaXMuaW5pdE9uY2UoKTtcblxuICAgIGlmIChpbml0T25jZS5kZXN0aW5hdGlvbkFscmVhZHlFeGlzdHMpIHsgcmV0dXJuOyB9XG4gICAgaWYgKHRoaXMuaG9zdC5hYm9ydGVkKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgZG9ja2VyRm9yUHVzaGluZyA9IGF3YWl0IHRoaXMuaG9zdC5kb2NrZXJGYWN0b3J5LmZvckVjclB1c2goe1xuICAgICAgcmVwb1VyaTogaW5pdE9uY2UucmVwb1VyaSxcbiAgICAgIGxvZ2dlcjogKG06IHN0cmluZykgPT4gdGhpcy5ob3N0LmVtaXRNZXNzYWdlKEV2ZW50VHlwZS5ERUJVRywgbSksXG4gICAgICBlY3I6IGluaXRPbmNlLmVjcixcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmhvc3QuYWJvcnRlZCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuVVBMT0FELCBgUHVzaCAke2luaXRPbmNlLmltYWdlVXJpfWApO1xuICAgIGF3YWl0IGRvY2tlckZvclB1c2hpbmcucHVzaCh7IHRhZzogaW5pdE9uY2UuaW1hZ2VVcmksIHF1aWV0OiB0aGlzLm9wdGlvbnMucXVpZXQgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluaXRPbmNlKG9wdGlvbnM6IHsgcXVpZXQ/OiBib29sZWFuIH0gPSB7fSk6IFByb21pc2U8Q29udGFpbmVySW1hZ2VBc3NldEhhbmRsZXJJbml0PiB7XG4gICAgaWYgKHRoaXMuaW5pdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdDtcbiAgICB9XG5cbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IGF3YWl0IHJlcGxhY2VBd3NQbGFjZWhvbGRlcnModGhpcy5hc3NldC5kZXN0aW5hdGlvbiwgdGhpcy5ob3N0LmF3cyk7XG4gICAgY29uc3QgZWNyID0gYXdhaXQgdGhpcy5ob3N0LmF3cy5lY3JDbGllbnQoe1xuICAgICAgLi4uZGVzdGluYXRpb24sXG4gICAgICBxdWlldDogb3B0aW9ucy5xdWlldCxcbiAgICB9KTtcbiAgICBjb25zdCBhY2NvdW50ID0gYXN5bmMgKCkgPT4gKGF3YWl0IHRoaXMuaG9zdC5hd3MuZGlzY292ZXJDdXJyZW50QWNjb3VudCgpKT8uYWNjb3VudElkO1xuXG4gICAgY29uc3QgcmVwb1VyaSA9IGF3YWl0IHJlcG9zaXRvcnlVcmkoZWNyLCBkZXN0aW5hdGlvbi5yZXBvc2l0b3J5TmFtZSk7XG4gICAgaWYgKCFyZXBvVXJpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIEVDUiByZXBvc2l0b3J5IG5hbWVkICcke2Rlc3RpbmF0aW9uLnJlcG9zaXRvcnlOYW1lfScgaW4gYWNjb3VudCAke2F3YWl0IGFjY291bnQoKX0uIElzIHRoaXMgYWNjb3VudCBib290c3RyYXBwZWQ/YCk7XG4gICAgfVxuXG4gICAgY29uc3QgaW1hZ2VVcmkgPSBgJHtyZXBvVXJpfToke2Rlc3RpbmF0aW9uLmltYWdlVGFnfWA7XG5cbiAgICB0aGlzLmluaXQgPSB7XG4gICAgICBpbWFnZVVyaSxcbiAgICAgIGVjcixcbiAgICAgIHJlcG9VcmksXG4gICAgICBkZXN0aW5hdGlvbkFscmVhZHlFeGlzdHM6IGF3YWl0IHRoaXMuZGVzdGluYXRpb25BbHJlYWR5RXhpc3RzKGVjciwgZGVzdGluYXRpb24sIGltYWdlVXJpKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuaW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBpbWFnZSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgRUNSIHJlcG9cbiAgICpcbiAgICogVXNlIHRoZSBmaWVsZHMgZnJvbSB0aGUgZGVzdGluYXRpb24gdG8gZG8gdGhlIGFjdHVhbCBjaGVjay4gVGhlIGltYWdlVXJpXG4gICAqIHNob3VsZCBjb3JyZXNwb25kIHRvIHRoYXQsIGJ1dCBpcyBvbmx5IHVzZWQgdG8gcHJpbnQgRG9ja2VyIGltYWdlIGxvY2F0aW9uXG4gICAqIGZvciB1c2VyIGJlbmVmaXQgKHRoZSBmb3JtYXQgaXMgc2xpZ2h0bHkgZGlmZmVyZW50KS5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgZGVzdGluYXRpb25BbHJlYWR5RXhpc3RzKGVjcjogQVdTLkVDUiwgZGVzdGluYXRpb246IERvY2tlckltYWdlRGVzdGluYXRpb24sIGltYWdlVXJpOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0aGlzLmhvc3QuZW1pdE1lc3NhZ2UoRXZlbnRUeXBlLkNIRUNLLCBgQ2hlY2sgJHtpbWFnZVVyaX1gKTtcbiAgICBpZiAoYXdhaXQgaW1hZ2VFeGlzdHMoZWNyLCBkZXN0aW5hdGlvbi5yZXBvc2l0b3J5TmFtZSwgZGVzdGluYXRpb24uaW1hZ2VUYWcpKSB7XG4gICAgICB0aGlzLmhvc3QuZW1pdE1lc3NhZ2UoRXZlbnRUeXBlLkZPVU5ELCBgRm91bmQgJHtpbWFnZVVyaX1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgQ29udGFpbmVySW1hZ2VCdWlsZGVyT3B0aW9ucyB7XG4gIHJlYWRvbmx5IHF1aWV0PzogYm9vbGVhbjtcbn1cblxuY2xhc3MgQ29udGFpbmVySW1hZ2VCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBkb2NrZXI6IERvY2tlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHdvcmtEaXI6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFzc2V0OiBEb2NrZXJJbWFnZU1hbmlmZXN0RW50cnksXG4gICAgcHJpdmF0ZSByZWFkb25seSBob3N0OiBJSGFuZGxlckhvc3QsXG4gICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBDb250YWluZXJJbWFnZUJ1aWxkZXJPcHRpb25zKSB7XG4gIH1cblxuICBhc3luYyBidWlsZCgpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLmFzc2V0LnNvdXJjZS5leGVjdXRhYmxlXG4gICAgICA/IHRoaXMuYnVpbGRFeHRlcm5hbEFzc2V0KHRoaXMuYXNzZXQuc291cmNlLmV4ZWN1dGFibGUpXG4gICAgICA6IHRoaXMuYnVpbGREaXJlY3RvcnlBc3NldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkIGEgKGxvY2FsKSBEb2NrZXIgYXNzZXQgZnJvbSBhIGRpcmVjdG9yeSB3aXRoIGEgRG9ja2VyZmlsZVxuICAgKlxuICAgKiBUYWdzIHVuZGVyIGEgZGV0ZXJtaW5pc3RpYywgdW5pcXVlLCBsb2NhbCBpZGVudGlmaWVyIHdpY2ggd2lsbCBza2lwXG4gICAqIHRoZSBidWlsZCBpZiBpdCBhbHJlYWR5IGV4aXN0cy5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgYnVpbGREaXJlY3RvcnlBc3NldCgpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGxvY2FsVGFnTmFtZSA9IGBjZGthc3NldC0ke3RoaXMuYXNzZXQuaWQuYXNzZXRJZC50b0xvd2VyQ2FzZSgpfWA7XG5cbiAgICBpZiAoIShhd2FpdCB0aGlzLmlzSW1hZ2VDYWNoZWQobG9jYWxUYWdOYW1lKSkpIHtcbiAgICAgIGlmICh0aGlzLmhvc3QuYWJvcnRlZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICAgIGF3YWl0IHRoaXMuYnVpbGRJbWFnZShsb2NhbFRhZ05hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBsb2NhbFRhZ05hbWU7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgYSAobG9jYWwpIERvY2tlciBhc3NldCBieSBydW5uaW5nIGFuIGV4dGVybmFsIGNvbW1hbmRcbiAgICpcbiAgICogRXh0ZXJuYWwgY29tbWFuZCBpcyByZXNwb25zaWJsZSBmb3IgZGVkdXBsaWNhdGluZyB0aGUgYnVpbGQgaWYgcG9zc2libGUsXG4gICAqIGFuZCBpcyBleHBlY3RlZCB0byByZXR1cm4gdGhlIGdlbmVyYXRlZCBpbWFnZSBpZGVudGlmaWVyIG9uIHN0ZG91dC5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgYnVpbGRFeHRlcm5hbEFzc2V0KGV4ZWN1dGFibGU6IHN0cmluZ1tdLCBjd2Q/OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGFzc2V0UGF0aCA9IGN3ZCA/PyB0aGlzLndvcmtEaXI7XG5cbiAgICB0aGlzLmhvc3QuZW1pdE1lc3NhZ2UoRXZlbnRUeXBlLkJVSUxELCBgQnVpbGRpbmcgRG9ja2VyIGltYWdlIHVzaW5nIGNvbW1hbmQgJyR7ZXhlY3V0YWJsZX0nYCk7XG4gICAgaWYgKHRoaXMuaG9zdC5hYm9ydGVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICAgIHJldHVybiAoYXdhaXQgc2hlbGwoZXhlY3V0YWJsZSwgeyBjd2Q6IGFzc2V0UGF0aCwgcXVpZXQ6IHRydWUgfSkpLnRyaW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYnVpbGRJbWFnZShsb2NhbFRhZ05hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuYXNzZXQuc291cmNlO1xuICAgIGlmICghc291cmNlLmRpcmVjdG9yeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAnZGlyZWN0b3J5JyBpcyBleHBlY3RlZCBpbiB0aGUgRG9ja2VySW1hZ2UgYXNzZXQgc291cmNlLCBnb3Q6ICR7SlNPTi5zdHJpbmdpZnkoc291cmNlKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGgucmVzb2x2ZSh0aGlzLndvcmtEaXIsIHNvdXJjZS5kaXJlY3RvcnkpO1xuICAgIHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuQlVJTEQsIGBCdWlsZGluZyBEb2NrZXIgaW1hZ2UgYXQgJHtmdWxsUGF0aH1gKTtcblxuICAgIGF3YWl0IHRoaXMuZG9ja2VyLmJ1aWxkKHtcbiAgICAgIGRpcmVjdG9yeTogZnVsbFBhdGgsXG4gICAgICB0YWc6IGxvY2FsVGFnTmFtZSxcbiAgICAgIGJ1aWxkQXJnczogc291cmNlLmRvY2tlckJ1aWxkQXJncyxcbiAgICAgIGJ1aWxkU2VjcmV0czogc291cmNlLmRvY2tlckJ1aWxkU2VjcmV0cyxcbiAgICAgIGJ1aWxkU3NoOiBzb3VyY2UuZG9ja2VyQnVpbGRTc2gsXG4gICAgICB0YXJnZXQ6IHNvdXJjZS5kb2NrZXJCdWlsZFRhcmdldCxcbiAgICAgIGZpbGU6IHNvdXJjZS5kb2NrZXJGaWxlLFxuICAgICAgbmV0d29ya01vZGU6IHNvdXJjZS5uZXR3b3JrTW9kZSxcbiAgICAgIHBsYXRmb3JtOiBzb3VyY2UucGxhdGZvcm0sXG4gICAgICBvdXRwdXRzOiBzb3VyY2UuZG9ja2VyT3V0cHV0cyxcbiAgICAgIGNhY2hlRnJvbTogc291cmNlLmNhY2hlRnJvbSxcbiAgICAgIGNhY2hlVG86IHNvdXJjZS5jYWNoZVRvLFxuICAgICAgY2FjaGVEaXNhYmxlZDogc291cmNlLmNhY2hlRGlzYWJsZWQsXG4gICAgICBxdWlldDogdGhpcy5vcHRpb25zLnF1aWV0LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpc0ltYWdlQ2FjaGVkKGxvY2FsVGFnTmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuZG9ja2VyLmV4aXN0cyhsb2NhbFRhZ05hbWUpKSB7XG4gICAgICB0aGlzLmhvc3QuZW1pdE1lc3NhZ2UoRXZlbnRUeXBlLkNBQ0hFRCwgYENhY2hlZCAke2xvY2FsVGFnTmFtZX1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBpbWFnZUV4aXN0cyhlY3I6IEFXUy5FQ1IsIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmcsIGltYWdlVGFnOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBlY3IuZGVzY3JpYmVJbWFnZXMoeyByZXBvc2l0b3J5TmFtZSwgaW1hZ2VJZHM6IFt7IGltYWdlVGFnIH1dIH0pLnByb21pc2UoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgaWYgKGUuY29kZSAhPT0gJ0ltYWdlTm90Rm91bmRFeGNlcHRpb24nKSB7IHRocm93IGU7IH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIFVSSSBmb3IgdGhlIHJlcG9zaXRvcnkgd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICpcbiAqIFJldHVybnMgdW5kZWZpbmVkIGlmIHRoZSByZXBvc2l0b3J5IGRvZXMgbm90IGV4aXN0LlxuICovXG5hc3luYyBmdW5jdGlvbiByZXBvc2l0b3J5VXJpKGVjcjogQVdTLkVDUiwgcmVwb3NpdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBlY3IuZGVzY3JpYmVSZXBvc2l0b3JpZXMoeyByZXBvc2l0b3J5TmFtZXM6IFtyZXBvc2l0b3J5TmFtZV0gfSkucHJvbWlzZSgpO1xuICAgIHJldHVybiAocmVzcG9uc2UucmVwb3NpdG9yaWVzIHx8IFtdKVswXT8ucmVwb3NpdG9yeVVyaTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgaWYgKGUuY29kZSAhPT0gJ1JlcG9zaXRvcnlOb3RGb3VuZEV4Y2VwdGlvbicpIHsgdGhyb3cgZTsgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==