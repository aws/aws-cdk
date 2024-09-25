"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerFactory = exports.Docker = void 0;
const fs = require("fs");
const os = require("os");
const path = require("path");
const docker_credentials_1 = require("./docker-credentials");
const shell_1 = require("./shell");
const util_1 = require("./util");
var InspectImageErrorCode;
(function (InspectImageErrorCode) {
    InspectImageErrorCode[InspectImageErrorCode["Docker"] = 1] = "Docker";
    InspectImageErrorCode[InspectImageErrorCode["Podman"] = 125] = "Podman";
})(InspectImageErrorCode || (InspectImageErrorCode = {}));
class Docker {
    constructor(logger) {
        this.logger = logger;
        this.configDir = undefined;
    }
    /**
     * Whether an image with the given tag exists
     */
    async exists(tag) {
        try {
            await this.execute(['inspect', tag], { quiet: true });
            return true;
        }
        catch (e) {
            const error = e;
            /**
             * The only error we expect to be thrown will have this property and value.
             * If it doesn't, it's unrecognized so re-throw it.
             */
            if (error.code !== 'PROCESS_FAILED') {
                throw error;
            }
            /**
             * If we know the shell command above returned an error, check to see
             * if the exit code is one we know to actually mean that the image doesn't
             * exist.
             */
            switch (error.exitCode) {
                case InspectImageErrorCode.Docker:
                case InspectImageErrorCode.Podman:
                    // Docker and Podman will return this exit code when an image doesn't exist, return false
                    // context: https://github.com/aws/aws-cdk/issues/16209
                    return false;
                default:
                    // This is an error but it's not an exit code we recognize, throw.
                    throw error;
            }
        }
    }
    async build(options) {
        const buildCommand = [
            'build',
            ...flatten(Object.entries(options.buildArgs || {}).map(([k, v]) => ['--build-arg', `${k}=${v}`])),
            ...flatten(Object.entries(options.buildSecrets || {}).map(([k, v]) => ['--secret', `id=${k},${v}`])),
            ...options.buildSsh ? ['--ssh', options.buildSsh] : [],
            '--tag', options.tag,
            ...options.target ? ['--target', options.target] : [],
            ...options.file ? ['--file', options.file] : [],
            ...options.networkMode ? ['--network', options.networkMode] : [],
            ...options.platform ? ['--platform', options.platform] : [],
            ...options.outputs ? options.outputs.map(output => [`--output=${output}`]) : [],
            ...options.cacheFrom ? [...options.cacheFrom.map(cacheFrom => ['--cache-from', this.cacheOptionToFlag(cacheFrom)]).flat()] : [],
            ...options.cacheTo ? ['--cache-to', this.cacheOptionToFlag(options.cacheTo)] : [],
            ...options.cacheDisabled ? ['--no-cache'] : [],
            '.',
        ];
        await this.execute(buildCommand, {
            cwd: options.directory,
            quiet: options.quiet,
        });
    }
    /**
     * Get credentials from ECR and run docker login
     */
    async login(ecr) {
        const credentials = await (0, docker_credentials_1.obtainEcrCredentials)(ecr);
        // Use --password-stdin otherwise docker will complain. Loudly.
        await this.execute(['login',
            '--username', credentials.username,
            '--password-stdin',
            credentials.endpoint], {
            input: credentials.password,
            // Need to quiet otherwise Docker will complain
            // 'WARNING! Your password will be stored unencrypted'
            // doesn't really matter since it's a token.
            quiet: true,
        });
    }
    async tag(sourceTag, targetTag) {
        await this.execute(['tag', sourceTag, targetTag]);
    }
    async push(options) {
        await this.execute(['push', options.tag], { quiet: options.quiet });
    }
    /**
     * If a CDK Docker Credentials file exists, creates a new Docker config directory.
     * Sets up `docker-credential-cdk-assets` to be the credential helper for each domain in the CDK config.
     * All future commands (e.g., `build`, `push`) will use this config.
     *
     * See https://docs.docker.com/engine/reference/commandline/login/#credential-helpers for more details on cred helpers.
     *
     * @returns true if CDK config was found and configured, false otherwise
     */
    configureCdkCredentials() {
        const config = (0, docker_credentials_1.cdkCredentialsConfig)();
        if (!config) {
            return false;
        }
        this.configDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdkDockerConfig'));
        const domains = Object.keys(config.domainCredentials);
        const credHelpers = domains.reduce((map, domain) => {
            map[domain] = 'cdk-assets'; // Use docker-credential-cdk-assets for this domain
            return map;
        }, {});
        fs.writeFileSync(path.join(this.configDir, 'config.json'), JSON.stringify({ credHelpers }), { encoding: 'utf-8' });
        return true;
    }
    /**
     * Removes any configured Docker config directory.
     * All future commands (e.g., `build`, `push`) will use the default config.
     *
     * This is useful after calling `configureCdkCredentials` to reset to default credentials.
     */
    resetAuthPlugins() {
        this.configDir = undefined;
    }
    async execute(args, options = {}) {
        const configArgs = this.configDir ? ['--config', this.configDir] : [];
        const pathToCdkAssets = path.resolve(__dirname, '..', '..', 'bin');
        try {
            await (0, shell_1.shell)([getDockerCmd(), ...configArgs, ...args], {
                logger: this.logger,
                ...options,
                env: {
                    ...process.env,
                    ...options.env,
                    PATH: `${pathToCdkAssets}${path.delimiter}${options.env?.PATH ?? process.env.PATH}`,
                },
            });
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                throw new Error('Unable to execute \'docker\' in order to build a container asset. Please install \'docker\' and try again.');
            }
            throw e;
        }
    }
    cacheOptionToFlag(option) {
        let flag = `type=${option.type}`;
        if (option.params) {
            flag += ',' + Object.entries(option.params).map(([k, v]) => `${k}=${v}`).join(',');
        }
        return flag;
    }
}
exports.Docker = Docker;
/**
 * Helps get appropriately configured Docker instances during the container
 * image publishing process.
 */
class DockerFactory {
    constructor() {
        this.enterLoggedInDestinationsCriticalSection = (0, util_1.createCriticalSection)();
        this.loggedInDestinations = new Set();
    }
    /**
     * Gets a Docker instance for building images.
     */
    async forBuild(options) {
        const docker = new Docker(options.logger);
        // Default behavior is to login before build so that the Dockerfile can reference images in the ECR repo
        // However, if we're in a pipelines environment (for example),
        // we may have alternative credentials to the default ones to use for the build itself.
        // If the special config file is present, delay the login to the default credentials until the push.
        // If the config file is present, we will configure and use those credentials for the build.
        let cdkDockerCredentialsConfigured = docker.configureCdkCredentials();
        if (!cdkDockerCredentialsConfigured) {
            await this.loginOncePerDestination(docker, options);
        }
        return docker;
    }
    /**
     * Gets a Docker instance for pushing images to ECR.
     */
    async forEcrPush(options) {
        const docker = new Docker(options.logger);
        await this.loginOncePerDestination(docker, options);
        return docker;
    }
    async loginOncePerDestination(docker, options) {
        // Changes: 012345678910.dkr.ecr.us-west-2.amazonaws.com/tagging-test
        // To this: 012345678910.dkr.ecr.us-west-2.amazonaws.com
        const repositoryDomain = options.repoUri.split('/')[0];
        // Ensure one-at-a-time access to loggedInDestinations.
        await this.enterLoggedInDestinationsCriticalSection(async () => {
            if (this.loggedInDestinations.has(repositoryDomain)) {
                return;
            }
            await docker.login(options.ecr);
            this.loggedInDestinations.add(repositoryDomain);
        });
    }
}
exports.DockerFactory = DockerFactory;
function getDockerCmd() {
    return process.env.CDK_DOCKER ?? 'docker';
}
function flatten(x) {
    return Array.prototype.concat([], ...x);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG9ja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDZEQUFrRjtBQUNsRixtQ0FBMEU7QUFDMUUsaUNBQStDO0FBc0MvQyxJQUFLLHFCQUdKO0FBSEQsV0FBSyxxQkFBcUI7SUFDeEIscUVBQVUsQ0FBQTtJQUNWLHVFQUFZLENBQUE7QUFDZCxDQUFDLEVBSEkscUJBQXFCLEtBQXJCLHFCQUFxQixRQUd6QjtBQU9ELE1BQWEsTUFBTTtJQUlqQixZQUE2QixNQUFlO1FBQWYsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUZwQyxjQUFTLEdBQXVCLFNBQVMsQ0FBQztJQUdsRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQVc7UUFDN0IsSUFBSSxDQUFDO1lBQ0gsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDdEQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQUMsT0FBTyxDQUFNLEVBQUUsQ0FBQztZQUNoQixNQUFNLEtBQUssR0FBdUIsQ0FBQyxDQUFDO1lBRXBDOzs7ZUFHRztZQUNILElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNwQyxNQUFNLEtBQUssQ0FBQztZQUNkLENBQUM7WUFFRDs7OztlQUlHO1lBQ0gsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3ZCLEtBQUsscUJBQXFCLENBQUMsTUFBTSxDQUFDO2dCQUNsQyxLQUFLLHFCQUFxQixDQUFDLE1BQU07b0JBQy9CLHlGQUF5RjtvQkFDekYsdURBQXVEO29CQUN2RCxPQUFPLEtBQUssQ0FBQztnQkFDZjtvQkFDRSxrRUFBa0U7b0JBQ2xFLE1B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QUFDLENBQWE7SUFDNUIsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGNka0NyZWRlbnRpYWxzQ29uZmlnLCBvYnRhaW5FY3JDcmVkZW50aWFscyB9IGZyb20gJy4vZG9ja2VyLWNyZWRlbnRpYWxzJztcbmltcG9ydCB7IExvZ2dlciwgc2hlbGwsIFNoZWxsT3B0aW9ucywgUHJvY2Vzc0ZhaWxlZEVycm9yIH0gZnJvbSAnLi9zaGVsbCc7XG5pbXBvcnQgeyBjcmVhdGVDcml0aWNhbFNlY3Rpb24gfSBmcm9tICcuL3V0aWwnO1xuXG5pbnRlcmZhY2UgQnVpbGRPcHRpb25zIHtcbiAgcmVhZG9ubHkgZGlyZWN0b3J5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRhZyB0aGUgaW1hZ2Ugd2l0aCBhIGdpdmVuIHJlcG9OYW1lOnRhZyBjb21iaW5hdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgdGFnOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHRhcmdldD86IHN0cmluZztcbiAgcmVhZG9ubHkgZmlsZT86IHN0cmluZztcbiAgcmVhZG9ubHkgYnVpbGRBcmdzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgcmVhZG9ubHkgYnVpbGRTZWNyZXRzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgcmVhZG9ubHkgYnVpbGRTc2g/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IG5ldHdvcmtNb2RlPzogc3RyaW5nO1xuICByZWFkb25seSBwbGF0Zm9ybT86IHN0cmluZztcbiAgcmVhZG9ubHkgb3V0cHV0cz86IHN0cmluZ1tdO1xuICByZWFkb25seSBjYWNoZUZyb20/OiBEb2NrZXJDYWNoZU9wdGlvbltdO1xuICByZWFkb25seSBjYWNoZVRvPzogRG9ja2VyQ2FjaGVPcHRpb247XG4gIHJlYWRvbmx5IGNhY2hlRGlzYWJsZWQ/OiBib29sZWFuO1xuICByZWFkb25seSBxdWlldD86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBQdXNoT3B0aW9ucyB7XG4gIHJlYWRvbmx5IHRhZzogc3RyaW5nO1xuICByZWFkb25seSBxdWlldD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRG9ja2VyQ3JlZGVudGlhbHNDb25maWcge1xuICByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGRvbWFpbkNyZWRlbnRpYWxzOiBSZWNvcmQ8c3RyaW5nLCBEb2NrZXJEb21haW5DcmVkZW50aWFscz47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRG9ja2VyRG9tYWluQ3JlZGVudGlhbHMge1xuICByZWFkb25seSBzZWNyZXRzTWFuYWdlclNlY3JldElkPzogc3RyaW5nO1xuICByZWFkb25seSBlY3JSZXBvc2l0b3J5Pzogc3RyaW5nO1xufVxuXG5lbnVtIEluc3BlY3RJbWFnZUVycm9yQ29kZSB7XG4gIERvY2tlciA9IDEsXG4gIFBvZG1hbiA9IDEyNSxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEb2NrZXJDYWNoZU9wdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgcmVhZG9ubHkgcGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuZXhwb3J0IGNsYXNzIERvY2tlciB7XG5cbiAgcHJpdmF0ZSBjb25maWdEaXI6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGxvZ2dlcj86IExvZ2dlcikge1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgYW4gaW1hZ2Ugd2l0aCB0aGUgZ2l2ZW4gdGFnIGV4aXN0c1xuICAgKi9cbiAgcHVibGljIGFzeW5jIGV4aXN0cyh0YWc6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmV4ZWN1dGUoWydpbnNwZWN0JywgdGFnXSwgeyBxdWlldDogdHJ1ZSB9KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgY29uc3QgZXJyb3I6IFByb2Nlc3NGYWlsZWRFcnJvciA9IGU7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG9ubHkgZXJyb3Igd2UgZXhwZWN0IHRvIGJlIHRocm93biB3aWxsIGhhdmUgdGhpcyBwcm9wZXJ0eSBhbmQgdmFsdWUuXG4gICAgICAgKiBJZiBpdCBkb2Vzbid0LCBpdCdzIHVucmVjb2duaXplZCBzbyByZS10aHJvdyBpdC5cbiAgICAgICAqL1xuICAgICAgaWYgKGVycm9yLmNvZGUgIT09ICdQUk9DRVNTX0ZBSUxFRCcpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogSWYgd2Uga25vdyB0aGUgc2hlbGwgY29tbWFuZCBhYm92ZSByZXR1cm5lZCBhbiBlcnJvciwgY2hlY2sgdG8gc2VlXG4gICAgICAgKiBpZiB0aGUgZXhpdCBjb2RlIGlzIG9uZSB3ZSBrbm93IHRvIGFjdHVhbGx5IG1lYW4gdGhhdCB0aGUgaW1hZ2UgZG9lc24ndFxuICAgICAgICogZXhpc3QuXG4gICAgICAgKi9cbiAgICAgIHN3aXRjaCAoZXJyb3IuZXhpdENvZGUpIHtcbiAgICAgICAgY2FzZSBJbnNwZWN0SW1hZ2VFcnJvckNvZGUuRG9ja2VyOlxuICAgICAgICBjYXNlIEluc3BlY3RJbWFnZUVycm9yQ29kZS5Qb2RtYW46XG4gICAgICAgICAgLy8gRG9ja2VyIGFuZCBQb2RtYW4gd2lsbCByZXR1cm4gdGhpcyBleGl0IGNvZGUgd2hlbiBhbiBpbWFnZSBkb2Vzbid0IGV4aXN0LCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAvLyBjb250ZXh0OiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzE2MjA5XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIFRoaXMgaXMgYW4gZXJyb3IgYnV0IGl0J3Mgbm90IGFuIGV4aXQgY29kZSB3ZSByZWNvZ25pemUsIHRocm93LlxuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBidWlsZChvcHRpb25zOiBCdWlsZE9wdGlvbnMpIHtcbiAgICBjb25zdCBidWlsZENvbW1hbmQgPSBbXG4gICAgICAnYnVpbGQnLFxuICAgICAgLi4uZmxhdHRlbihPYmplY3QuZW50cmllcyhvcHRpb25zLmJ1aWxkQXJncyB8fCB7fSkubWFwKChbaywgdl0pID0+IFsnLS1idWlsZC1hcmcnLCBgJHtrfT0ke3Z9YF0pKSxcbiAgICAgIC4uLmZsYXR0ZW4oT2JqZWN0LmVudHJpZXMob3B0aW9ucy5idWlsZFNlY3JldHMgfHwge30pLm1hcCgoW2ssIHZdKSA9PiBbJy0tc2VjcmV0JywgYGlkPSR7a30sJHt2fWBdKSksXG4gICAgICAuLi5vcHRpb25zLmJ1aWxkU3NoID8gWyctLXNzaCcsIG9wdGlvbnMuYnVpbGRTc2hdIDogW10sXG4gICAgICAnLS10YWcnLCBvcHRpb25zLnRhZyxcbiAgICAgIC4uLm9wdGlvbnMudGFyZ2V0ID8gWyctLXRhcmdldCcsIG9wdGlvbnMudGFyZ2V0XSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5maWxlID8gWyctLWZpbGUnLCBvcHRpb25zLmZpbGVdIDogW10sXG4gICAgICAuLi5vcHRpb25zLm5ldHdvcmtNb2RlID8gWyctLW5ldHdvcmsnLCBvcHRpb25zLm5ldHdvcmtNb2RlXSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5wbGF0Zm9ybSA/IFsnLS1wbGF0Zm9ybScsIG9wdGlvbnMucGxhdGZvcm1dIDogW10sXG4gICAgICAuLi5vcHRpb25zLm91dHB1dHMgPyBvcHRpb25zLm91dHB1dHMubWFwKG91dHB1dCA9PiBbYC0tb3V0cHV0PSR7b3V0cHV0fWBdKSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5jYWNoZUZyb20gPyBbLi4ub3B0aW9ucy5jYWNoZUZyb20ubWFwKGNhY2hlRnJvbSA9PiBbJy0tY2FjaGUtZnJvbScsIHRoaXMuY2FjaGVPcHRpb25Ub0ZsYWcoY2FjaGVGcm9tKV0pLmZsYXQoKV0gOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMuY2FjaGVUbyA/IFsnLS1jYWNoZS10bycsIHRoaXMuY2FjaGVPcHRpb25Ub0ZsYWcob3B0aW9ucy5jYWNoZVRvKV0gOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMuY2FjaGVEaXNhYmxlZCA/IFsnLS1uby1jYWNoZSddIDogW10sXG4gICAgICAnLicsXG4gICAgXTtcbiAgICBhd2FpdCB0aGlzLmV4ZWN1dGUoYnVpbGRDb21tYW5kLCB7XG4gICAgICBjd2Q6IG9wdGlvbnMuZGlyZWN0b3J5LFxuICAgICAgcXVpZXQ6IG9wdGlvbnMucXVpZXQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGNyZWRlbnRpYWxzIGZyb20gRUNSIGFuZCBydW4gZG9ja2VyIGxvZ2luXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgbG9naW4oZWNyOiBBV1MuRUNSKSB7XG4gICAgY29uc3QgY3JlZGVudGlhbHMgPSBhd2FpdCBvYnRhaW5FY3JDcmVkZW50aWFscyhlY3IpO1xuXG4gICAgLy8gVXNlIC0tcGFzc3dvcmQtc3RkaW4gb3RoZXJ3aXNlIGRvY2tlciB3aWxsIGNvbXBsYWluLiBMb3VkbHkuXG4gICAgYXdhaXQgdGhpcy5leGVjdXRlKFsnbG9naW4nLFxuICAgICAgJy0tdXNlcm5hbWUnLCBjcmVkZW50aWFscy51c2VybmFtZSxcbiAgICAgICctLXBhc3N3b3JkLXN0ZGluJyxcbiAgICAgIGNyZWRlbnRpYWxzLmVuZHBvaW50XSwge1xuICAgICAgaW5wdXQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkLFxuXG4gICAgICAvLyBOZWVkIHRvIHF1aWV0IG90aGVyd2lzZSBEb2NrZXIgd2lsbCBjb21wbGFpblxuICAgICAgLy8gJ1dBUk5JTkchIFlvdXIgcGFzc3dvcmQgd2lsbCBiZSBzdG9yZWQgdW5lbmNyeXB0ZWQnXG4gICAgICAvLyBkb2Vzbid0IHJlYWxseSBtYXR0ZXIgc2luY2UgaXQncyBhIHRva2VuLlxuICAgICAgcXVpZXQ6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdGFnKHNvdXJjZVRhZzogc3RyaW5nLCB0YXJnZXRUYWc6IHN0cmluZykge1xuICAgIGF3YWl0IHRoaXMuZXhlY3V0ZShbJ3RhZycsIHNvdXJjZVRhZywgdGFyZ2V0VGFnXSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcHVzaChvcHRpb25zOiBQdXNoT3B0aW9ucykge1xuICAgIGF3YWl0IHRoaXMuZXhlY3V0ZShbJ3B1c2gnLCBvcHRpb25zLnRhZ10sIHsgcXVpZXQ6IG9wdGlvbnMucXVpZXQgfSk7XG4gIH1cblxuICAvKipcbiAgICogSWYgYSBDREsgRG9ja2VyIENyZWRlbnRpYWxzIGZpbGUgZXhpc3RzLCBjcmVhdGVzIGEgbmV3IERvY2tlciBjb25maWcgZGlyZWN0b3J5LlxuICAgKiBTZXRzIHVwIGBkb2NrZXItY3JlZGVudGlhbC1jZGstYXNzZXRzYCB0byBiZSB0aGUgY3JlZGVudGlhbCBoZWxwZXIgZm9yIGVhY2ggZG9tYWluIGluIHRoZSBDREsgY29uZmlnLlxuICAgKiBBbGwgZnV0dXJlIGNvbW1hbmRzIChlLmcuLCBgYnVpbGRgLCBgcHVzaGApIHdpbGwgdXNlIHRoaXMgY29uZmlnLlxuICAgKlxuICAgKiBTZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9jb21tYW5kbGluZS9sb2dpbi8jY3JlZGVudGlhbC1oZWxwZXJzIGZvciBtb3JlIGRldGFpbHMgb24gY3JlZCBoZWxwZXJzLlxuICAgKlxuICAgKiBAcmV0dXJucyB0cnVlIGlmIENESyBjb25maWcgd2FzIGZvdW5kIGFuZCBjb25maWd1cmVkLCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIHB1YmxpYyBjb25maWd1cmVDZGtDcmVkZW50aWFscygpOiBib29sZWFuIHtcbiAgICBjb25zdCBjb25maWcgPSBjZGtDcmVkZW50aWFsc0NvbmZpZygpO1xuICAgIGlmICghY29uZmlnKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgdGhpcy5jb25maWdEaXIgPSBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4ob3MudG1wZGlyKCksICdjZGtEb2NrZXJDb25maWcnKSk7XG5cbiAgICBjb25zdCBkb21haW5zID0gT2JqZWN0LmtleXMoY29uZmlnLmRvbWFpbkNyZWRlbnRpYWxzKTtcbiAgICBjb25zdCBjcmVkSGVscGVycyA9IGRvbWFpbnMucmVkdWNlKChtYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sIGRvbWFpbikgPT4ge1xuICAgICAgbWFwW2RvbWFpbl0gPSAnY2RrLWFzc2V0cyc7IC8vIFVzZSBkb2NrZXItY3JlZGVudGlhbC1jZGstYXNzZXRzIGZvciB0aGlzIGRvbWFpblxuICAgICAgcmV0dXJuIG1hcDtcbiAgICB9LCB7fSk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4odGhpcy5jb25maWdEaXIsICdjb25maWcuanNvbicpLCBKU09OLnN0cmluZ2lmeSh7IGNyZWRIZWxwZXJzIH0pLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbnkgY29uZmlndXJlZCBEb2NrZXIgY29uZmlnIGRpcmVjdG9yeS5cbiAgICogQWxsIGZ1dHVyZSBjb21tYW5kcyAoZS5nLiwgYGJ1aWxkYCwgYHB1c2hgKSB3aWxsIHVzZSB0aGUgZGVmYXVsdCBjb25maWcuXG4gICAqXG4gICAqIFRoaXMgaXMgdXNlZnVsIGFmdGVyIGNhbGxpbmcgYGNvbmZpZ3VyZUNka0NyZWRlbnRpYWxzYCB0byByZXNldCB0byBkZWZhdWx0IGNyZWRlbnRpYWxzLlxuICAgKi9cbiAgcHVibGljIHJlc2V0QXV0aFBsdWdpbnMoKSB7XG4gICAgdGhpcy5jb25maWdEaXIgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGV4ZWN1dGUoYXJnczogc3RyaW5nW10sIG9wdGlvbnM6IFNoZWxsT3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgY29uZmlnQXJncyA9IHRoaXMuY29uZmlnRGlyID8gWyctLWNvbmZpZycsIHRoaXMuY29uZmlnRGlyXSA6IFtdO1xuXG4gICAgY29uc3QgcGF0aFRvQ2RrQXNzZXRzID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJ2JpbicpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBzaGVsbChbZ2V0RG9ja2VyQ21kKCksIC4uLmNvbmZpZ0FyZ3MsIC4uLmFyZ3NdLCB7XG4gICAgICAgIGxvZ2dlcjogdGhpcy5sb2dnZXIsXG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIGVudjoge1xuICAgICAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgICAgIC4uLm9wdGlvbnMuZW52LFxuICAgICAgICAgIFBBVEg6IGAke3BhdGhUb0Nka0Fzc2V0c30ke3BhdGguZGVsaW1pdGVyfSR7b3B0aW9ucy5lbnY/LlBBVEggPz8gcHJvY2Vzcy5lbnYuUEFUSH1gLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZS5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBleGVjdXRlIFxcJ2RvY2tlclxcJyBpbiBvcmRlciB0byBidWlsZCBhIGNvbnRhaW5lciBhc3NldC4gUGxlYXNlIGluc3RhbGwgXFwnZG9ja2VyXFwnIGFuZCB0cnkgYWdhaW4uJyk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2FjaGVPcHRpb25Ub0ZsYWcob3B0aW9uOiBEb2NrZXJDYWNoZU9wdGlvbik6IHN0cmluZyB7XG4gICAgbGV0IGZsYWcgPSBgdHlwZT0ke29wdGlvbi50eXBlfWA7XG4gICAgaWYgKG9wdGlvbi5wYXJhbXMpIHtcbiAgICAgIGZsYWcgKz0gJywnICsgT2JqZWN0LmVudHJpZXMob3B0aW9uLnBhcmFtcykubWFwKChbaywgdl0pID0+IGAke2t9PSR7dn1gKS5qb2luKCcsJyk7XG4gICAgfVxuICAgIHJldHVybiBmbGFnO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRG9ja2VyRmFjdG9yeU9wdGlvbnMge1xuICByZWFkb25seSByZXBvVXJpOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGVjcjogQVdTLkVDUjtcbiAgcmVhZG9ubHkgbG9nZ2VyOiAobTogc3RyaW5nKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIEhlbHBzIGdldCBhcHByb3ByaWF0ZWx5IGNvbmZpZ3VyZWQgRG9ja2VyIGluc3RhbmNlcyBkdXJpbmcgdGhlIGNvbnRhaW5lclxuICogaW1hZ2UgcHVibGlzaGluZyBwcm9jZXNzLlxuICovXG5leHBvcnQgY2xhc3MgRG9ja2VyRmFjdG9yeSB7XG4gIHByaXZhdGUgZW50ZXJMb2dnZWRJbkRlc3RpbmF0aW9uc0NyaXRpY2FsU2VjdGlvbiA9IGNyZWF0ZUNyaXRpY2FsU2VjdGlvbigpO1xuICBwcml2YXRlIGxvZ2dlZEluRGVzdGluYXRpb25zID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBEb2NrZXIgaW5zdGFuY2UgZm9yIGJ1aWxkaW5nIGltYWdlcy5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBmb3JCdWlsZChvcHRpb25zOiBEb2NrZXJGYWN0b3J5T3B0aW9ucyk6IFByb21pc2U8RG9ja2VyPiB7XG4gICAgY29uc3QgZG9ja2VyID0gbmV3IERvY2tlcihvcHRpb25zLmxvZ2dlcik7XG5cbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIGxvZ2luIGJlZm9yZSBidWlsZCBzbyB0aGF0IHRoZSBEb2NrZXJmaWxlIGNhbiByZWZlcmVuY2UgaW1hZ2VzIGluIHRoZSBFQ1IgcmVwb1xuICAgIC8vIEhvd2V2ZXIsIGlmIHdlJ3JlIGluIGEgcGlwZWxpbmVzIGVudmlyb25tZW50IChmb3IgZXhhbXBsZSksXG4gICAgLy8gd2UgbWF5IGhhdmUgYWx0ZXJuYXRpdmUgY3JlZGVudGlhbHMgdG8gdGhlIGRlZmF1bHQgb25lcyB0byB1c2UgZm9yIHRoZSBidWlsZCBpdHNlbGYuXG4gICAgLy8gSWYgdGhlIHNwZWNpYWwgY29uZmlnIGZpbGUgaXMgcHJlc2VudCwgZGVsYXkgdGhlIGxvZ2luIHRvIHRoZSBkZWZhdWx0IGNyZWRlbnRpYWxzIHVudGlsIHRoZSBwdXNoLlxuICAgIC8vIElmIHRoZSBjb25maWcgZmlsZSBpcyBwcmVzZW50LCB3ZSB3aWxsIGNvbmZpZ3VyZSBhbmQgdXNlIHRob3NlIGNyZWRlbnRpYWxzIGZvciB0aGUgYnVpbGQuXG4gICAgbGV0IGNka0RvY2tlckNyZWRlbnRpYWxzQ29uZmlndXJlZCA9IGRvY2tlci5jb25maWd1cmVDZGtDcmVkZW50aWFscygpO1xuICAgIGlmICghY2RrRG9ja2VyQ3JlZGVudGlhbHNDb25maWd1cmVkKSB7XG4gICAgICBhd2FpdCB0aGlzLmxvZ2luT25jZVBlckRlc3RpbmF0aW9uKGRvY2tlciwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvY2tlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgRG9ja2VyIGluc3RhbmNlIGZvciBwdXNoaW5nIGltYWdlcyB0byBFQ1IuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZm9yRWNyUHVzaChvcHRpb25zOiBEb2NrZXJGYWN0b3J5T3B0aW9ucykge1xuICAgIGNvbnN0IGRvY2tlciA9IG5ldyBEb2NrZXIob3B0aW9ucy5sb2dnZXIpO1xuICAgIGF3YWl0IHRoaXMubG9naW5PbmNlUGVyRGVzdGluYXRpb24oZG9ja2VyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gZG9ja2VyO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2dpbk9uY2VQZXJEZXN0aW5hdGlvbihkb2NrZXI6IERvY2tlciwgb3B0aW9uczogRG9ja2VyRmFjdG9yeU9wdGlvbnMpIHtcbiAgICAvLyBDaGFuZ2VzOiAwMTIzNDU2Nzg5MTAuZGtyLmVjci51cy13ZXN0LTIuYW1hem9uYXdzLmNvbS90YWdnaW5nLXRlc3RcbiAgICAvLyBUbyB0aGlzOiAwMTIzNDU2Nzg5MTAuZGtyLmVjci51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVxuICAgIGNvbnN0IHJlcG9zaXRvcnlEb21haW4gPSBvcHRpb25zLnJlcG9Vcmkuc3BsaXQoJy8nKVswXTtcblxuICAgIC8vIEVuc3VyZSBvbmUtYXQtYS10aW1lIGFjY2VzcyB0byBsb2dnZWRJbkRlc3RpbmF0aW9ucy5cbiAgICBhd2FpdCB0aGlzLmVudGVyTG9nZ2VkSW5EZXN0aW5hdGlvbnNDcml0aWNhbFNlY3Rpb24oYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubG9nZ2VkSW5EZXN0aW5hdGlvbnMuaGFzKHJlcG9zaXRvcnlEb21haW4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgZG9ja2VyLmxvZ2luKG9wdGlvbnMuZWNyKTtcbiAgICAgIHRoaXMubG9nZ2VkSW5EZXN0aW5hdGlvbnMuYWRkKHJlcG9zaXRvcnlEb21haW4pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERvY2tlckNtZCgpOiBzdHJpbmcge1xuICByZXR1cm4gcHJvY2Vzcy5lbnYuQ0RLX0RPQ0tFUiA/PyAnZG9ja2VyJztcbn1cblxuZnVuY3Rpb24gZmxhdHRlbih4OiBzdHJpbmdbXVtdKSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0KFtdLCAuLi54KTtcbn1cbiJdfQ==