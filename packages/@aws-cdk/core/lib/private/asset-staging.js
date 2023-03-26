"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dockerExec = exports.AssetBundlingVolumeCopy = exports.AssetBundlingBindMount = void 0;
const child_process_1 = require("child_process");
const crypto = require("crypto");
const os = require("os");
const asset_staging_1 = require("../asset-staging");
class AssetBundlingBase {
    constructor(options) {
        this.options = options;
    }
    /**
     * Determines a useful default user if not given otherwise
     */
    determineUser() {
        let user;
        if (this.options.user) {
            user = this.options.user;
        }
        else {
            // Default to current user
            const userInfo = os.userInfo();
            user =
                userInfo.uid !== -1 // uid is -1 on Windows
                    ? `${userInfo.uid}:${userInfo.gid}`
                    : '1000:1000';
        }
        return user;
    }
}
/**
 * Bundles files with bind mount as copy method
 */
class AssetBundlingBindMount extends AssetBundlingBase {
    /**
     * Bundle files with bind mount as copy method
     */
    run() {
        this.options.image.run({
            command: this.options.command,
            user: this.determineUser(),
            environment: this.options.environment,
            entrypoint: this.options.entrypoint,
            workingDirectory: this.options.workingDirectory ?? asset_staging_1.AssetStaging.BUNDLING_INPUT_DIR,
            securityOpt: this.options.securityOpt ?? '',
            volumesFrom: this.options.volumesFrom,
            volumes: [
                {
                    hostPath: this.options.sourcePath,
                    containerPath: asset_staging_1.AssetStaging.BUNDLING_INPUT_DIR,
                },
                {
                    hostPath: this.options.bundleDir,
                    containerPath: asset_staging_1.AssetStaging.BUNDLING_OUTPUT_DIR,
                },
                ...(this.options.volumes ?? []),
            ],
        });
    }
}
exports.AssetBundlingBindMount = AssetBundlingBindMount;
/**
 * Provides a helper container for copying bundling related files to specific input and output volumes
 */
class AssetBundlingVolumeCopy extends AssetBundlingBase {
    constructor(options) {
        super(options);
        const copySuffix = crypto.randomBytes(12).toString('hex');
        this.inputVolumeName = `assetInput${copySuffix}`;
        this.outputVolumeName = `assetOutput${copySuffix}`;
        this.copyContainerName = `copyContainer${copySuffix}`;
    }
    /**
     * Creates volumes for asset input and output
     */
    prepareVolumes() {
        dockerExec(['volume', 'create', this.inputVolumeName]);
        dockerExec(['volume', 'create', this.outputVolumeName]);
    }
    /**
     * Removes volumes for asset input and output
     */
    cleanVolumes() {
        dockerExec(['volume', 'rm', this.inputVolumeName]);
        dockerExec(['volume', 'rm', this.outputVolumeName]);
    }
    /**
     * runs a helper container that holds volumes and does some preparation tasks
     * @param user The user that will later access these files and needs permissions to do so
     */
    startHelperContainer(user) {
        dockerExec([
            'run',
            '--name',
            this.copyContainerName,
            '-v',
            `${this.inputVolumeName}:${asset_staging_1.AssetStaging.BUNDLING_INPUT_DIR}`,
            '-v',
            `${this.outputVolumeName}:${asset_staging_1.AssetStaging.BUNDLING_OUTPUT_DIR}`,
            'alpine',
            'sh',
            '-c',
            `mkdir -p ${asset_staging_1.AssetStaging.BUNDLING_INPUT_DIR} && chown -R ${user} ${asset_staging_1.AssetStaging.BUNDLING_OUTPUT_DIR} && chown -R ${user} ${asset_staging_1.AssetStaging.BUNDLING_INPUT_DIR}`,
        ]);
    }
    /**
     * removes the Docker helper container
     */
    cleanHelperContainer() {
        dockerExec(['rm', this.copyContainerName]);
    }
    /**
     * copy files from the host where this is executed into the input volume
     * @param sourcePath - path to folder where files should be copied from - without trailing slash
     */
    copyInputFrom(sourcePath) {
        dockerExec([
            'cp',
            `${sourcePath}/.`,
            `${this.copyContainerName}:${asset_staging_1.AssetStaging.BUNDLING_INPUT_DIR}`,
        ]);
    }
    /**
     * copy files from the the output volume to the host where this is executed
     * @param outputPath - path to folder where files should be copied to - without trailing slash
     */
    copyOutputTo(outputPath) {
        dockerExec([
            'cp',
            `${this.copyContainerName}:${asset_staging_1.AssetStaging.BUNDLING_OUTPUT_DIR}/.`,
            outputPath,
        ]);
    }
    /**
     * Bundle files with VOLUME_COPY method
     */
    run() {
        const user = this.determineUser();
        this.prepareVolumes();
        this.startHelperContainer(user); // TODO handle user properly
        this.copyInputFrom(this.options.sourcePath);
        this.options.image.run({
            command: this.options.command,
            user: user,
            environment: this.options.environment,
            entrypoint: this.options.entrypoint,
            workingDirectory: this.options.workingDirectory ?? asset_staging_1.AssetStaging.BUNDLING_INPUT_DIR,
            securityOpt: this.options.securityOpt ?? '',
            volumes: this.options.volumes,
            volumesFrom: [
                this.copyContainerName,
                ...(this.options.volumesFrom ?? []),
            ],
        });
        this.copyOutputTo(this.options.bundleDir);
        this.cleanHelperContainer();
        this.cleanVolumes();
    }
}
exports.AssetBundlingVolumeCopy = AssetBundlingVolumeCopy;
function dockerExec(args, options) {
    const prog = process.env.CDK_DOCKER ?? 'docker';
    const proc = (0, child_process_1.spawnSync)(prog, args, options ?? {
        encoding: 'utf-8',
        stdio: [
            'ignore',
            process.stderr,
            'inherit', // inherit stderr
        ],
    });
    if (proc.error) {
        throw proc.error;
    }
    if (proc.status !== 0) {
        const reason = proc.signal != null
            ? `signal ${proc.signal}`
            : `status ${proc.status}`;
        const command = [prog, ...args.map((arg) => /[^a-z0-9_-]/i.test(arg) ? JSON.stringify(arg) : arg)].join(' ');
        function prependLines(firstLine, text) {
            if (!text || text.length === 0) {
                return [];
            }
            const padding = ' '.repeat(firstLine.length);
            return text.toString('utf-8').split('\n').map((line, idx) => `${idx === 0 ? firstLine : padding}${line}`);
        }
        throw new Error([
            `${prog} exited with ${reason}`,
            ...prependLines('--> STDOUT:  ', proc.stdout) ?? [],
            ...prependLines('--> STDERR:  ', proc.stderr) ?? [],
            `--> Command: ${command}`,
        ].join('\n'));
    }
    return proc;
}
exports.dockerExec = dockerExec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtc3RhZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFzc2V0LXN0YWdpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQTREO0FBQzVELGlDQUFpQztBQUNqQyx5QkFBeUI7QUFDekIsb0RBQWdEO0FBaUJoRCxNQUFlLGlCQUFpQjtJQUU5QixZQUFZLE9BQTZCO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0tBQ3hCO0lBQ0Q7O09BRUc7SUFDTyxhQUFhO1FBQ3JCLElBQUksSUFBWSxDQUFDO1FBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDckIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1NBQzFCO2FBQU07WUFDTCwwQkFBMEI7WUFDMUIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQy9CLElBQUk7Z0JBQ0YsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyx1QkFBdUI7b0JBQ3pDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRTtvQkFDbkMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztTQUNuQjtRQUNELE9BQU8sSUFBSSxDQUFDO0tBQ2I7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxpQkFBaUI7SUFDM0Q7O09BRUc7SUFDSSxHQUFHO1FBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQ3JCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87WUFDN0IsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDMUIsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNyQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ25DLGdCQUFn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LENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUM7UUFDNUcsQ0FBQztRQUVELE1BQU0sSUFBSSxLQUFLLENBQUM7WUFDZCxHQUFHLElBQUksZ0JBQWdCLE1BQU0sRUFBRTtZQUMvQixHQUFHLFlBQVksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxJQUFJLEVBQUU7WUFDcEQsR0FBRyxZQUFZLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUUsSUFBSSxFQUFFO1lBQ3BELGdCQUFnQixPQUFPLEVBQUU7U0FDMUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNmO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBdENELGdDQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNwYXduU3luYywgU3Bhd25TeW5jT3B0aW9ucyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XG5pbXBvcnQgeyBBc3NldFN0YWdpbmcgfSBmcm9tICcuLi9hc3NldC1zdGFnaW5nJztcbmltcG9ydCB7IEJ1bmRsaW5nT3B0aW9ucyB9IGZyb20gJy4uL2J1bmRsaW5nJztcblxuLyoqXG4gKiBPcHRpb25zIGZvciBEb2NrZXIgYmFzZWQgYnVuZGxpbmcgb2YgYXNzZXRzXG4gKi9cbmludGVyZmFjZSBBc3NldEJ1bmRsaW5nT3B0aW9ucyBleHRlbmRzIEJ1bmRsaW5nT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBQYXRoIHdoZXJlIHRoZSBzb3VyY2UgZmlsZXMgYXJlIGxvY2F0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHNvdXJjZVBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFBhdGggd2hlcmUgdGhlIG91dHB1dCBmaWxlcyBzaG91bGQgYmUgc3RvcmVkXG4gICAqL1xuICByZWFkb25seSBidW5kbGVEaXI6IHN0cmluZztcbn1cblxuYWJzdHJhY3QgY2xhc3MgQXNzZXRCdW5kbGluZ0Jhc2Uge1xuICBwcm90ZWN0ZWQgb3B0aW9uczogQXNzZXRCdW5kbGluZ09wdGlvbnM7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFzc2V0QnVuZGxpbmdPcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBhIHVzZWZ1bCBkZWZhdWx0IHVzZXIgaWYgbm90IGdpdmVuIG90aGVyd2lzZVxuICAgKi9cbiAgcHJvdGVjdGVkIGRldGVybWluZVVzZXIoKSB7XG4gICAgbGV0IHVzZXI6IHN0cmluZztcbiAgICBpZiAodGhpcy5vcHRpb25zLnVzZXIpIHtcbiAgICAgIHVzZXIgPSB0aGlzLm9wdGlvbnMudXNlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IHVzZXJcbiAgICAgIGNvbnN0IHVzZXJJbmZvID0gb3MudXNlckluZm8oKTtcbiAgICAgIHVzZXIgPVxuICAgICAgICB1c2VySW5mby51aWQgIT09IC0xIC8vIHVpZCBpcyAtMSBvbiBXaW5kb3dzXG4gICAgICAgICAgPyBgJHt1c2VySW5mby51aWR9OiR7dXNlckluZm8uZ2lkfWBcbiAgICAgICAgICA6ICcxMDAwOjEwMDAnO1xuICAgIH1cbiAgICByZXR1cm4gdXNlcjtcbiAgfVxufVxuXG4vKipcbiAqIEJ1bmRsZXMgZmlsZXMgd2l0aCBiaW5kIG1vdW50IGFzIGNvcHkgbWV0aG9kXG4gKi9cbmV4cG9ydCBjbGFzcyBBc3NldEJ1bmRsaW5nQmluZE1vdW50IGV4dGVuZHMgQXNzZXRCdW5kbGluZ0Jhc2Uge1xuICAvKipcbiAgICogQnVuZGxlIGZpbGVzIHdpdGggYmluZCBtb3VudCBhcyBjb3B5IG1ldGhvZFxuICAgKi9cbiAgcHVibGljIHJ1bigpIHtcbiAgICB0aGlzLm9wdGlvbnMuaW1hZ2UucnVuKHtcbiAgICAgIGNvbW1hbmQ6IHRoaXMub3B0aW9ucy5jb21tYW5kLFxuICAgICAgdXNlcjogdGhpcy5kZXRlcm1pbmVVc2VyKCksXG4gICAgICBlbnZpcm9ubWVudDogdGhpcy5vcHRpb25zLmVudmlyb25tZW50LFxuICAgICAgZW50cnlwb2ludDogdGhpcy5vcHRpb25zLmVudHJ5cG9pbnQsXG4gICAgICB3b3JraW5nRGlyZWN0b3J5OlxuICAgICAgICB0aGlzLm9wdGlvbnMud29ya2luZ0RpcmVjdG9yeSA/PyBBc3NldFN0YWdpbmcuQlVORExJTkdfSU5QVVRfRElSLFxuICAgICAgc2VjdXJpdHlPcHQ6IHRoaXMub3B0aW9ucy5zZWN1cml0eU9wdCA/PyAnJyxcbiAgICAgIHZvbHVtZXNGcm9tOiB0aGlzLm9wdGlvbnMudm9sdW1lc0Zyb20sXG4gICAgICB2b2x1bWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBob3N0UGF0aDogdGhpcy5vcHRpb25zLnNvdXJjZVBhdGgsXG4gICAgICAgICAgY29udGFpbmVyUGF0aDogQXNzZXRTdGFnaW5nLkJVTkRMSU5HX0lOUFVUX0RJUixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGhvc3RQYXRoOiB0aGlzLm9wdGlvbnMuYnVuZGxlRGlyLFxuICAgICAgICAgIGNvbnRhaW5lclBhdGg6IEFzc2V0U3RhZ2luZy5CVU5ETElOR19PVVRQVVRfRElSLFxuICAgICAgICB9LFxuICAgICAgICAuLi4odGhpcy5vcHRpb25zLnZvbHVtZXMgPz8gW10pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3ZpZGVzIGEgaGVscGVyIGNvbnRhaW5lciBmb3IgY29weWluZyBidW5kbGluZyByZWxhdGVkIGZpbGVzIHRvIHNwZWNpZmljIGlucHV0IGFuZCBvdXRwdXQgdm9sdW1lc1xuICovXG5leHBvcnQgY2xhc3MgQXNzZXRCdW5kbGluZ1ZvbHVtZUNvcHkgZXh0ZW5kcyBBc3NldEJ1bmRsaW5nQmFzZSB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBEb2NrZXIgdm9sdW1lIHRoYXQgaXMgdXNlZCBmb3IgdGhlIGFzc2V0IGlucHV0XG4gICAqL1xuICBwcml2YXRlIGlucHV0Vm9sdW1lTmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgRG9ja2VyIHZvbHVtZSB0aGF0IGlzIHVzZWQgZm9yIHRoZSBhc3NldCBvdXRwdXRcbiAgICovXG4gIHByaXZhdGUgb3V0cHV0Vm9sdW1lTmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgRG9ja2VyIGhlbHBlciBjb250YWluZXIgdG8gY29weSBmaWxlcyBpbnRvIHRoZSB2b2x1bWVcbiAgICovXG4gIHB1YmxpYyBjb3B5Q29udGFpbmVyTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFzc2V0QnVuZGxpbmdPcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgY29uc3QgY29weVN1ZmZpeCA9IGNyeXB0by5yYW5kb21CeXRlcygxMikudG9TdHJpbmcoJ2hleCcpO1xuICAgIHRoaXMuaW5wdXRWb2x1bWVOYW1lID0gYGFzc2V0SW5wdXQke2NvcHlTdWZmaXh9YDtcbiAgICB0aGlzLm91dHB1dFZvbHVtZU5hbWUgPSBgYXNzZXRPdXRwdXQke2NvcHlTdWZmaXh9YDtcbiAgICB0aGlzLmNvcHlDb250YWluZXJOYW1lID0gYGNvcHlDb250YWluZXIke2NvcHlTdWZmaXh9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHZvbHVtZXMgZm9yIGFzc2V0IGlucHV0IGFuZCBvdXRwdXRcbiAgICovXG4gIHByaXZhdGUgcHJlcGFyZVZvbHVtZXMoKSB7XG4gICAgZG9ja2VyRXhlYyhbJ3ZvbHVtZScsICdjcmVhdGUnLCB0aGlzLmlucHV0Vm9sdW1lTmFtZV0pO1xuICAgIGRvY2tlckV4ZWMoWyd2b2x1bWUnLCAnY3JlYXRlJywgdGhpcy5vdXRwdXRWb2x1bWVOYW1lXSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB2b2x1bWVzIGZvciBhc3NldCBpbnB1dCBhbmQgb3V0cHV0XG4gICAqL1xuICBwcml2YXRlIGNsZWFuVm9sdW1lcygpIHtcbiAgICBkb2NrZXJFeGVjKFsndm9sdW1lJywgJ3JtJywgdGhpcy5pbnB1dFZvbHVtZU5hbWVdKTtcbiAgICBkb2NrZXJFeGVjKFsndm9sdW1lJywgJ3JtJywgdGhpcy5vdXRwdXRWb2x1bWVOYW1lXSk7XG4gIH1cblxuICAvKipcbiAgICogcnVucyBhIGhlbHBlciBjb250YWluZXIgdGhhdCBob2xkcyB2b2x1bWVzIGFuZCBkb2VzIHNvbWUgcHJlcGFyYXRpb24gdGFza3NcbiAgICogQHBhcmFtIHVzZXIgVGhlIHVzZXIgdGhhdCB3aWxsIGxhdGVyIGFjY2VzcyB0aGVzZSBmaWxlcyBhbmQgbmVlZHMgcGVybWlzc2lvbnMgdG8gZG8gc29cbiAgICovXG4gIHByaXZhdGUgc3RhcnRIZWxwZXJDb250YWluZXIodXNlcjogc3RyaW5nKSB7XG4gICAgZG9ja2VyRXhlYyhbXG4gICAgICAncnVuJyxcbiAgICAgICctLW5hbWUnLFxuICAgICAgdGhpcy5jb3B5Q29udGFpbmVyTmFtZSxcbiAgICAgICctdicsXG4gICAgICBgJHt0aGlzLmlucHV0Vm9sdW1lTmFtZX06JHtBc3NldFN0YWdpbmcuQlVORExJTkdfSU5QVVRfRElSfWAsXG4gICAgICAnLXYnLFxuICAgICAgYCR7dGhpcy5vdXRwdXRWb2x1bWVOYW1lfToke0Fzc2V0U3RhZ2luZy5CVU5ETElOR19PVVRQVVRfRElSfWAsXG4gICAgICAnYWxwaW5lJyxcbiAgICAgICdzaCcsXG4gICAgICAnLWMnLFxuICAgICAgYG1rZGlyIC1wICR7QXNzZXRTdGFnaW5nLkJVTkRMSU5HX0lOUFVUX0RJUn0gJiYgY2hvd24gLVIgJHt1c2VyfSAke0Fzc2V0U3RhZ2luZy5CVU5ETElOR19PVVRQVVRfRElSfSAmJiBjaG93biAtUiAke3VzZXJ9ICR7QXNzZXRTdGFnaW5nLkJVTkRMSU5HX0lOUFVUX0RJUn1gLFxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlbW92ZXMgdGhlIERvY2tlciBoZWxwZXIgY29udGFpbmVyXG4gICAqL1xuICBwcml2YXRlIGNsZWFuSGVscGVyQ29udGFpbmVyKCkge1xuICAgIGRvY2tlckV4ZWMoWydybScsIHRoaXMuY29weUNvbnRhaW5lck5hbWVdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb3B5IGZpbGVzIGZyb20gdGhlIGhvc3Qgd2hlcmUgdGhpcyBpcyBleGVjdXRlZCBpbnRvIHRoZSBpbnB1dCB2b2x1bWVcbiAgICogQHBhcmFtIHNvdXJjZVBhdGggLSBwYXRoIHRvIGZvbGRlciB3aGVyZSBmaWxlcyBzaG91bGQgYmUgY29waWVkIGZyb20gLSB3aXRob3V0IHRyYWlsaW5nIHNsYXNoXG4gICAqL1xuICBwcml2YXRlIGNvcHlJbnB1dEZyb20oc291cmNlUGF0aDogc3RyaW5nKSB7XG4gICAgZG9ja2VyRXhlYyhbXG4gICAgICAnY3AnLFxuICAgICAgYCR7c291cmNlUGF0aH0vLmAsXG4gICAgICBgJHt0aGlzLmNvcHlDb250YWluZXJOYW1lfToke0Fzc2V0U3RhZ2luZy5CVU5ETElOR19JTlBVVF9ESVJ9YCxcbiAgICBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb3B5IGZpbGVzIGZyb20gdGhlIHRoZSBvdXRwdXQgdm9sdW1lIHRvIHRoZSBob3N0IHdoZXJlIHRoaXMgaXMgZXhlY3V0ZWRcbiAgICogQHBhcmFtIG91dHB1dFBhdGggLSBwYXRoIHRvIGZvbGRlciB3aGVyZSBmaWxlcyBzaG91bGQgYmUgY29waWVkIHRvIC0gd2l0aG91dCB0cmFpbGluZyBzbGFzaFxuICAgKi9cbiAgcHJpdmF0ZSBjb3B5T3V0cHV0VG8ob3V0cHV0UGF0aDogc3RyaW5nKSB7XG4gICAgZG9ja2VyRXhlYyhbXG4gICAgICAnY3AnLFxuICAgICAgYCR7dGhpcy5jb3B5Q29udGFpbmVyTmFtZX06JHtBc3NldFN0YWdpbmcuQlVORExJTkdfT1VUUFVUX0RJUn0vLmAsXG4gICAgICBvdXRwdXRQYXRoLFxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1bmRsZSBmaWxlcyB3aXRoIFZPTFVNRV9DT1BZIG1ldGhvZFxuICAgKi9cbiAgcHVibGljIHJ1bigpIHtcbiAgICBjb25zdCB1c2VyID0gdGhpcy5kZXRlcm1pbmVVc2VyKCk7XG4gICAgdGhpcy5wcmVwYXJlVm9sdW1lcygpO1xuICAgIHRoaXMuc3RhcnRIZWxwZXJDb250YWluZXIodXNlcik7IC8vIFRPRE8gaGFuZGxlIHVzZXIgcHJvcGVybHlcbiAgICB0aGlzLmNvcHlJbnB1dEZyb20odGhpcy5vcHRpb25zLnNvdXJjZVBhdGgpO1xuXG4gICAgdGhpcy5vcHRpb25zLmltYWdlLnJ1bih7XG4gICAgICBjb21tYW5kOiB0aGlzLm9wdGlvbnMuY29tbWFuZCxcbiAgICAgIHVzZXI6IHVzZXIsXG4gICAgICBlbnZpcm9ubWVudDogdGhpcy5vcHRpb25zLmVudmlyb25tZW50LFxuICAgICAgZW50cnlwb2ludDogdGhpcy5vcHRpb25zLmVudHJ5cG9pbnQsXG4gICAgICB3b3JraW5nRGlyZWN0b3J5OlxuICAgICAgICB0aGlzLm9wdGlvbnMud29ya2luZ0RpcmVjdG9yeSA/PyBBc3NldFN0YWdpbmcuQlVORExJTkdfSU5QVVRfRElSLFxuICAgICAgc2VjdXJpdHlPcHQ6IHRoaXMub3B0aW9ucy5zZWN1cml0eU9wdCA/PyAnJyxcbiAgICAgIHZvbHVtZXM6IHRoaXMub3B0aW9ucy52b2x1bWVzLFxuICAgICAgdm9sdW1lc0Zyb206IFtcbiAgICAgICAgdGhpcy5jb3B5Q29udGFpbmVyTmFtZSxcbiAgICAgICAgLi4uKHRoaXMub3B0aW9ucy52b2x1bWVzRnJvbSA/PyBbXSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jb3B5T3V0cHV0VG8odGhpcy5vcHRpb25zLmJ1bmRsZURpcik7XG4gICAgdGhpcy5jbGVhbkhlbHBlckNvbnRhaW5lcigpO1xuICAgIHRoaXMuY2xlYW5Wb2x1bWVzKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvY2tlckV4ZWMoYXJnczogc3RyaW5nW10sIG9wdGlvbnM/OiBTcGF3blN5bmNPcHRpb25zKSB7XG4gIGNvbnN0IHByb2cgPSBwcm9jZXNzLmVudi5DREtfRE9DS0VSID8/ICdkb2NrZXInO1xuICBjb25zdCBwcm9jID0gc3Bhd25TeW5jKHByb2csIGFyZ3MsIG9wdGlvbnMgPz8ge1xuICAgIGVuY29kaW5nOiAndXRmLTgnLFxuICAgIHN0ZGlvOiBbIC8vIHNob3cgRG9ja2VyIG91dHB1dFxuICAgICAgJ2lnbm9yZScsIC8vIGlnbm9yZSBzdGRpb1xuICAgICAgcHJvY2Vzcy5zdGRlcnIsIC8vIHJlZGlyZWN0IHN0ZG91dCB0byBzdGRlcnJcbiAgICAgICdpbmhlcml0JywgLy8gaW5oZXJpdCBzdGRlcnJcbiAgICBdLFxuICB9KTtcblxuICBpZiAocHJvYy5lcnJvcikge1xuICAgIHRocm93IHByb2MuZXJyb3I7XG4gIH1cblxuICBpZiAocHJvYy5zdGF0dXMgIT09IDApIHtcbiAgICBjb25zdCByZWFzb24gPSBwcm9jLnNpZ25hbCAhPSBudWxsXG4gICAgICA/IGBzaWduYWwgJHtwcm9jLnNpZ25hbH1gXG4gICAgICA6IGBzdGF0dXMgJHtwcm9jLnN0YXR1c31gO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBbcHJvZywgLi4uYXJncy5tYXAoKGFyZykgPT4gL1teYS16MC05Xy1dL2kudGVzdChhcmcpID8gSlNPTi5zdHJpbmdpZnkoYXJnKSA6IGFyZyldLmpvaW4oJyAnKTtcblxuICAgIGZ1bmN0aW9uIHByZXBlbmRMaW5lcyhmaXJzdExpbmU6IHN0cmluZywgdGV4dDogQnVmZmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nW10ge1xuICAgICAgaWYgKCF0ZXh0IHx8IHRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhZGRpbmcgPSAnICcucmVwZWF0KGZpcnN0TGluZS5sZW5ndGgpO1xuICAgICAgcmV0dXJuIHRleHQudG9TdHJpbmcoJ3V0Zi04Jykuc3BsaXQoJ1xcbicpLm1hcCgobGluZSwgaWR4KSA9PiBgJHtpZHggPT09IDAgPyBmaXJzdExpbmUgOiBwYWRkaW5nfSR7bGluZX1gKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoW1xuICAgICAgYCR7cHJvZ30gZXhpdGVkIHdpdGggJHtyZWFzb259YCxcbiAgICAgIC4uLnByZXBlbmRMaW5lcygnLS0+IFNURE9VVDogICcsIHByb2Muc3Rkb3V0ICkgPz8gW10sXG4gICAgICAuLi5wcmVwZW5kTGluZXMoJy0tPiBTVERFUlI6ICAnLCBwcm9jLnN0ZGVyciApID8/IFtdLFxuICAgICAgYC0tPiBDb21tYW5kOiAke2NvbW1hbmR9YCxcbiAgICBdLmpvaW4oJ1xcbicpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9jO1xufVxuIl19