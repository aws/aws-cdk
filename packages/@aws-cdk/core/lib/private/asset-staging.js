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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtc3RhZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFzc2V0LXN0YWdpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQTREO0FBQzVELGlDQUFpQztBQUNqQyx5QkFBeUI7QUFDekIsb0RBQWdEO0FBaUJoRCxNQUFlLGlCQUFpQjtJQUU5QixZQUFZLE9BQTZCO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFDRDs7T0FFRztJQUNPLGFBQWE7UUFDckIsSUFBSSxJQUFZLENBQUM7UUFDakIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUNyQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7U0FDMUI7YUFBTTtZQUNMLDBCQUEwQjtZQUMxQixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDL0IsSUFBSTtnQkFDRixRQUFRLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLHVCQUF1QjtvQkFDekMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFFO29CQUNuQyxDQUFDLENBQUMsV0FBVyxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQWEsc0JBQXVCLFNBQVEsaUJBQWlCO0lBQzNEOztPQUVHO0lBQ0ksR0FBRztRQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUNyQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPO1lBQzdCLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQzFCLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDckMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTtZ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LENBQUM7YUFDWDtZQUNELE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzVHLENBQUM7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDO1lBQ2QsR0FBRyxJQUFJLGdCQUFnQixNQUFNLEVBQUU7WUFDL0IsR0FBRyxZQUFZLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUUsSUFBSSxFQUFFO1lBQ3BELEdBQUcsWUFBWSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFFLElBQUksRUFBRTtZQUNwRCxnQkFBZ0IsT0FBTyxFQUFFO1NBQzFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDZjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQXRDRCxnQ0FzQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzcGF3blN5bmMsIFNwYXduU3luY09wdGlvbnMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHsgQXNzZXRTdGFnaW5nIH0gZnJvbSAnLi4vYXNzZXQtc3RhZ2luZyc7XG5pbXBvcnQgeyBCdW5kbGluZ09wdGlvbnMgfSBmcm9tICcuLi9idW5kbGluZyc7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgRG9ja2VyIGJhc2VkIGJ1bmRsaW5nIG9mIGFzc2V0c1xuICovXG5pbnRlcmZhY2UgQXNzZXRCdW5kbGluZ09wdGlvbnMgZXh0ZW5kcyBCdW5kbGluZ09wdGlvbnMge1xuICAvKipcbiAgICogUGF0aCB3aGVyZSB0aGUgc291cmNlIGZpbGVzIGFyZSBsb2NhdGVkXG4gICAqL1xuICByZWFkb25seSBzb3VyY2VQYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBQYXRoIHdoZXJlIHRoZSBvdXRwdXQgZmlsZXMgc2hvdWxkIGJlIHN0b3JlZFxuICAgKi9cbiAgcmVhZG9ubHkgYnVuZGxlRGlyOiBzdHJpbmc7XG59XG5cbmFic3RyYWN0IGNsYXNzIEFzc2V0QnVuZGxpbmdCYXNlIHtcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IEFzc2V0QnVuZGxpbmdPcHRpb25zO1xuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBc3NldEJ1bmRsaW5nT3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgLyoqXG4gICAqIERldGVybWluZXMgYSB1c2VmdWwgZGVmYXVsdCB1c2VyIGlmIG5vdCBnaXZlbiBvdGhlcndpc2VcbiAgICovXG4gIHByb3RlY3RlZCBkZXRlcm1pbmVVc2VyKCkge1xuICAgIGxldCB1c2VyOiBzdHJpbmc7XG4gICAgaWYgKHRoaXMub3B0aW9ucy51c2VyKSB7XG4gICAgICB1c2VyID0gdGhpcy5vcHRpb25zLnVzZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCB1c2VyXG4gICAgICBjb25zdCB1c2VySW5mbyA9IG9zLnVzZXJJbmZvKCk7XG4gICAgICB1c2VyID1cbiAgICAgICAgdXNlckluZm8udWlkICE9PSAtMSAvLyB1aWQgaXMgLTEgb24gV2luZG93c1xuICAgICAgICAgID8gYCR7dXNlckluZm8udWlkfToke3VzZXJJbmZvLmdpZH1gXG4gICAgICAgICAgOiAnMTAwMDoxMDAwJztcbiAgICB9XG4gICAgcmV0dXJuIHVzZXI7XG4gIH1cbn1cblxuLyoqXG4gKiBCdW5kbGVzIGZpbGVzIHdpdGggYmluZCBtb3VudCBhcyBjb3B5IG1ldGhvZFxuICovXG5leHBvcnQgY2xhc3MgQXNzZXRCdW5kbGluZ0JpbmRNb3VudCBleHRlbmRzIEFzc2V0QnVuZGxpbmdCYXNlIHtcbiAgLyoqXG4gICAqIEJ1bmRsZSBmaWxlcyB3aXRoIGJpbmQgbW91bnQgYXMgY29weSBtZXRob2RcbiAgICovXG4gIHB1YmxpYyBydW4oKSB7XG4gICAgdGhpcy5vcHRpb25zLmltYWdlLnJ1bih7XG4gICAgICBjb21tYW5kOiB0aGlzLm9wdGlvbnMuY29tbWFuZCxcbiAgICAgIHVzZXI6IHRoaXMuZGV0ZXJtaW5lVXNlcigpLFxuICAgICAgZW52aXJvbm1lbnQ6IHRoaXMub3B0aW9ucy5lbnZpcm9ubWVudCxcbiAgICAgIGVudHJ5cG9pbnQ6IHRoaXMub3B0aW9ucy5lbnRyeXBvaW50LFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTpcbiAgICAgICAgdGhpcy5vcHRpb25zLndvcmtpbmdEaXJlY3RvcnkgPz8gQXNzZXRTdGFnaW5nLkJVTkRMSU5HX0lOUFVUX0RJUixcbiAgICAgIHNlY3VyaXR5T3B0OiB0aGlzLm9wdGlvbnMuc2VjdXJpdHlPcHQgPz8gJycsXG4gICAgICB2b2x1bWVzRnJvbTogdGhpcy5vcHRpb25zLnZvbHVtZXNGcm9tLFxuICAgICAgdm9sdW1lczogW1xuICAgICAgICB7XG4gICAgICAgICAgaG9zdFBhdGg6IHRoaXMub3B0aW9ucy5zb3VyY2VQYXRoLFxuICAgICAgICAgIGNvbnRhaW5lclBhdGg6IEFzc2V0U3RhZ2luZy5CVU5ETElOR19JTlBVVF9ESVIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBob3N0UGF0aDogdGhpcy5vcHRpb25zLmJ1bmRsZURpcixcbiAgICAgICAgICBjb250YWluZXJQYXRoOiBBc3NldFN0YWdpbmcuQlVORExJTkdfT1VUUFVUX0RJUixcbiAgICAgICAgfSxcbiAgICAgICAgLi4uKHRoaXMub3B0aW9ucy52b2x1bWVzID8/IFtdKSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm92aWRlcyBhIGhlbHBlciBjb250YWluZXIgZm9yIGNvcHlpbmcgYnVuZGxpbmcgcmVsYXRlZCBmaWxlcyB0byBzcGVjaWZpYyBpbnB1dCBhbmQgb3V0cHV0IHZvbHVtZXNcbiAqL1xuZXhwb3J0IGNsYXNzIEFzc2V0QnVuZGxpbmdWb2x1bWVDb3B5IGV4dGVuZHMgQXNzZXRCdW5kbGluZ0Jhc2Uge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgRG9ja2VyIHZvbHVtZSB0aGF0IGlzIHVzZWQgZm9yIHRoZSBhc3NldCBpbnB1dFxuICAgKi9cbiAgcHJpdmF0ZSBpbnB1dFZvbHVtZU5hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIERvY2tlciB2b2x1bWUgdGhhdCBpcyB1c2VkIGZvciB0aGUgYXNzZXQgb3V0cHV0XG4gICAqL1xuICBwcml2YXRlIG91dHB1dFZvbHVtZU5hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIERvY2tlciBoZWxwZXIgY29udGFpbmVyIHRvIGNvcHkgZmlsZXMgaW50byB0aGUgdm9sdW1lXG4gICAqL1xuICBwdWJsaWMgY29weUNvbnRhaW5lck5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBc3NldEJ1bmRsaW5nT3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIGNvbnN0IGNvcHlTdWZmaXggPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMTIpLnRvU3RyaW5nKCdoZXgnKTtcbiAgICB0aGlzLmlucHV0Vm9sdW1lTmFtZSA9IGBhc3NldElucHV0JHtjb3B5U3VmZml4fWA7XG4gICAgdGhpcy5vdXRwdXRWb2x1bWVOYW1lID0gYGFzc2V0T3V0cHV0JHtjb3B5U3VmZml4fWA7XG4gICAgdGhpcy5jb3B5Q29udGFpbmVyTmFtZSA9IGBjb3B5Q29udGFpbmVyJHtjb3B5U3VmZml4fWA7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB2b2x1bWVzIGZvciBhc3NldCBpbnB1dCBhbmQgb3V0cHV0XG4gICAqL1xuICBwcml2YXRlIHByZXBhcmVWb2x1bWVzKCkge1xuICAgIGRvY2tlckV4ZWMoWyd2b2x1bWUnLCAnY3JlYXRlJywgdGhpcy5pbnB1dFZvbHVtZU5hbWVdKTtcbiAgICBkb2NrZXJFeGVjKFsndm9sdW1lJywgJ2NyZWF0ZScsIHRoaXMub3V0cHV0Vm9sdW1lTmFtZV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdm9sdW1lcyBmb3IgYXNzZXQgaW5wdXQgYW5kIG91dHB1dFxuICAgKi9cbiAgcHJpdmF0ZSBjbGVhblZvbHVtZXMoKSB7XG4gICAgZG9ja2VyRXhlYyhbJ3ZvbHVtZScsICdybScsIHRoaXMuaW5wdXRWb2x1bWVOYW1lXSk7XG4gICAgZG9ja2VyRXhlYyhbJ3ZvbHVtZScsICdybScsIHRoaXMub3V0cHV0Vm9sdW1lTmFtZV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHJ1bnMgYSBoZWxwZXIgY29udGFpbmVyIHRoYXQgaG9sZHMgdm9sdW1lcyBhbmQgZG9lcyBzb21lIHByZXBhcmF0aW9uIHRhc2tzXG4gICAqIEBwYXJhbSB1c2VyIFRoZSB1c2VyIHRoYXQgd2lsbCBsYXRlciBhY2Nlc3MgdGhlc2UgZmlsZXMgYW5kIG5lZWRzIHBlcm1pc3Npb25zIHRvIGRvIHNvXG4gICAqL1xuICBwcml2YXRlIHN0YXJ0SGVscGVyQ29udGFpbmVyKHVzZXI6IHN0cmluZykge1xuICAgIGRvY2tlckV4ZWMoW1xuICAgICAgJ3J1bicsXG4gICAgICAnLS1uYW1lJyxcbiAgICAgIHRoaXMuY29weUNvbnRhaW5lck5hbWUsXG4gICAgICAnLXYnLFxuICAgICAgYCR7dGhpcy5pbnB1dFZvbHVtZU5hbWV9OiR7QXNzZXRTdGFnaW5nLkJVTkRMSU5HX0lOUFVUX0RJUn1gLFxuICAgICAgJy12JyxcbiAgICAgIGAke3RoaXMub3V0cHV0Vm9sdW1lTmFtZX06JHtBc3NldFN0YWdpbmcuQlVORExJTkdfT1VUUFVUX0RJUn1gLFxuICAgICAgJ2FscGluZScsXG4gICAgICAnc2gnLFxuICAgICAgJy1jJyxcbiAgICAgIGBta2RpciAtcCAke0Fzc2V0U3RhZ2luZy5CVU5ETElOR19JTlBVVF9ESVJ9ICYmIGNob3duIC1SICR7dXNlcn0gJHtBc3NldFN0YWdpbmcuQlVORExJTkdfT1VUUFVUX0RJUn0gJiYgY2hvd24gLVIgJHt1c2VyfSAke0Fzc2V0U3RhZ2luZy5CVU5ETElOR19JTlBVVF9ESVJ9YCxcbiAgICBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZW1vdmVzIHRoZSBEb2NrZXIgaGVscGVyIGNvbnRhaW5lclxuICAgKi9cbiAgcHJpdmF0ZSBjbGVhbkhlbHBlckNvbnRhaW5lcigpIHtcbiAgICBkb2NrZXJFeGVjKFsncm0nLCB0aGlzLmNvcHlDb250YWluZXJOYW1lXSk7XG4gIH1cblxuICAvKipcbiAgICogY29weSBmaWxlcyBmcm9tIHRoZSBob3N0IHdoZXJlIHRoaXMgaXMgZXhlY3V0ZWQgaW50byB0aGUgaW5wdXQgdm9sdW1lXG4gICAqIEBwYXJhbSBzb3VyY2VQYXRoIC0gcGF0aCB0byBmb2xkZXIgd2hlcmUgZmlsZXMgc2hvdWxkIGJlIGNvcGllZCBmcm9tIC0gd2l0aG91dCB0cmFpbGluZyBzbGFzaFxuICAgKi9cbiAgcHJpdmF0ZSBjb3B5SW5wdXRGcm9tKHNvdXJjZVBhdGg6IHN0cmluZykge1xuICAgIGRvY2tlckV4ZWMoW1xuICAgICAgJ2NwJyxcbiAgICAgIGAke3NvdXJjZVBhdGh9Ly5gLFxuICAgICAgYCR7dGhpcy5jb3B5Q29udGFpbmVyTmFtZX06JHtBc3NldFN0YWdpbmcuQlVORExJTkdfSU5QVVRfRElSfWAsXG4gICAgXSk7XG4gIH1cblxuICAvKipcbiAgICogY29weSBmaWxlcyBmcm9tIHRoZSB0aGUgb3V0cHV0IHZvbHVtZSB0byB0aGUgaG9zdCB3aGVyZSB0aGlzIGlzIGV4ZWN1dGVkXG4gICAqIEBwYXJhbSBvdXRwdXRQYXRoIC0gcGF0aCB0byBmb2xkZXIgd2hlcmUgZmlsZXMgc2hvdWxkIGJlIGNvcGllZCB0byAtIHdpdGhvdXQgdHJhaWxpbmcgc2xhc2hcbiAgICovXG4gIHByaXZhdGUgY29weU91dHB1dFRvKG91dHB1dFBhdGg6IHN0cmluZykge1xuICAgIGRvY2tlckV4ZWMoW1xuICAgICAgJ2NwJyxcbiAgICAgIGAke3RoaXMuY29weUNvbnRhaW5lck5hbWV9OiR7QXNzZXRTdGFnaW5nLkJVTkRMSU5HX09VVFBVVF9ESVJ9Ly5gLFxuICAgICAgb3V0cHV0UGF0aCxcbiAgICBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdW5kbGUgZmlsZXMgd2l0aCBWT0xVTUVfQ09QWSBtZXRob2RcbiAgICovXG4gIHB1YmxpYyBydW4oKSB7XG4gICAgY29uc3QgdXNlciA9IHRoaXMuZGV0ZXJtaW5lVXNlcigpO1xuICAgIHRoaXMucHJlcGFyZVZvbHVtZXMoKTtcbiAgICB0aGlzLnN0YXJ0SGVscGVyQ29udGFpbmVyKHVzZXIpOyAvLyBUT0RPIGhhbmRsZSB1c2VyIHByb3Blcmx5XG4gICAgdGhpcy5jb3B5SW5wdXRGcm9tKHRoaXMub3B0aW9ucy5zb3VyY2VQYXRoKTtcblxuICAgIHRoaXMub3B0aW9ucy5pbWFnZS5ydW4oe1xuICAgICAgY29tbWFuZDogdGhpcy5vcHRpb25zLmNvbW1hbmQsXG4gICAgICB1c2VyOiB1c2VyLFxuICAgICAgZW52aXJvbm1lbnQ6IHRoaXMub3B0aW9ucy5lbnZpcm9ubWVudCxcbiAgICAgIGVudHJ5cG9pbnQ6IHRoaXMub3B0aW9ucy5lbnRyeXBvaW50LFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTpcbiAgICAgICAgdGhpcy5vcHRpb25zLndvcmtpbmdEaXJlY3RvcnkgPz8gQXNzZXRTdGFnaW5nLkJVTkRMSU5HX0lOUFVUX0RJUixcbiAgICAgIHNlY3VyaXR5T3B0OiB0aGlzLm9wdGlvbnMuc2VjdXJpdHlPcHQgPz8gJycsXG4gICAgICB2b2x1bWVzOiB0aGlzLm9wdGlvbnMudm9sdW1lcyxcbiAgICAgIHZvbHVtZXNGcm9tOiBbXG4gICAgICAgIHRoaXMuY29weUNvbnRhaW5lck5hbWUsXG4gICAgICAgIC4uLih0aGlzLm9wdGlvbnMudm9sdW1lc0Zyb20gPz8gW10pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMuY29weU91dHB1dFRvKHRoaXMub3B0aW9ucy5idW5kbGVEaXIpO1xuICAgIHRoaXMuY2xlYW5IZWxwZXJDb250YWluZXIoKTtcbiAgICB0aGlzLmNsZWFuVm9sdW1lcygpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb2NrZXJFeGVjKGFyZ3M6IHN0cmluZ1tdLCBvcHRpb25zPzogU3Bhd25TeW5jT3B0aW9ucykge1xuICBjb25zdCBwcm9nID0gcHJvY2Vzcy5lbnYuQ0RLX0RPQ0tFUiA/PyAnZG9ja2VyJztcbiAgY29uc3QgcHJvYyA9IHNwYXduU3luYyhwcm9nLCBhcmdzLCBvcHRpb25zID8/IHtcbiAgICBlbmNvZGluZzogJ3V0Zi04JyxcbiAgICBzdGRpbzogWyAvLyBzaG93IERvY2tlciBvdXRwdXRcbiAgICAgICdpZ25vcmUnLCAvLyBpZ25vcmUgc3RkaW9cbiAgICAgIHByb2Nlc3Muc3RkZXJyLCAvLyByZWRpcmVjdCBzdGRvdXQgdG8gc3RkZXJyXG4gICAgICAnaW5oZXJpdCcsIC8vIGluaGVyaXQgc3RkZXJyXG4gICAgXSxcbiAgfSk7XG5cbiAgaWYgKHByb2MuZXJyb3IpIHtcbiAgICB0aHJvdyBwcm9jLmVycm9yO1xuICB9XG5cbiAgaWYgKHByb2Muc3RhdHVzICE9PSAwKSB7XG4gICAgY29uc3QgcmVhc29uID0gcHJvYy5zaWduYWwgIT0gbnVsbFxuICAgICAgPyBgc2lnbmFsICR7cHJvYy5zaWduYWx9YFxuICAgICAgOiBgc3RhdHVzICR7cHJvYy5zdGF0dXN9YDtcbiAgICBjb25zdCBjb21tYW5kID0gW3Byb2csIC4uLmFyZ3MubWFwKChhcmcpID0+IC9bXmEtejAtOV8tXS9pLnRlc3QoYXJnKSA/IEpTT04uc3RyaW5naWZ5KGFyZykgOiBhcmcpXS5qb2luKCcgJyk7XG5cbiAgICBmdW5jdGlvbiBwcmVwZW5kTGluZXMoZmlyc3RMaW5lOiBzdHJpbmcsIHRleHQ6IEJ1ZmZlciB8IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZ1tdIHtcbiAgICAgIGlmICghdGV4dCB8fCB0ZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBjb25zdCBwYWRkaW5nID0gJyAnLnJlcGVhdChmaXJzdExpbmUubGVuZ3RoKTtcbiAgICAgIHJldHVybiB0ZXh0LnRvU3RyaW5nKCd1dGYtOCcpLnNwbGl0KCdcXG4nKS5tYXAoKGxpbmUsIGlkeCkgPT4gYCR7aWR4ID09PSAwID8gZmlyc3RMaW5lIDogcGFkZGluZ30ke2xpbmV9YCk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKFtcbiAgICAgIGAke3Byb2d9IGV4aXRlZCB3aXRoICR7cmVhc29ufWAsXG4gICAgICAuLi5wcmVwZW5kTGluZXMoJy0tPiBTVERPVVQ6ICAnLCBwcm9jLnN0ZG91dCApID8/IFtdLFxuICAgICAgLi4ucHJlcGVuZExpbmVzKCctLT4gU1RERVJSOiAgJywgcHJvYy5zdGRlcnIgKSA/PyBbXSxcbiAgICAgIGAtLT4gQ29tbWFuZDogJHtjb21tYW5kfWAsXG4gICAgXS5qb2luKCdcXG4nKSk7XG4gIH1cblxuICByZXR1cm4gcHJvYztcbn1cbiJdfQ==