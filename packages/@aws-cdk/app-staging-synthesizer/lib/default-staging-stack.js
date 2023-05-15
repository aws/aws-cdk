"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStagingStack = void 0;
const fs = require("fs");
const path = require("path");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ecr = require("aws-cdk-lib/aws-ecr");
const iam = require("aws-cdk-lib/aws-iam");
const kms = require("aws-cdk-lib/aws-kms");
const s3 = require("aws-cdk-lib/aws-s3");
const helpers_internal_1 = require("aws-cdk-lib/core/lib/helpers-internal");
const EPHEMERAL_PREFIX = 'handoff/';
/**
 * A default Staging Stack that implements IStagingResources.
 */
class DefaultStagingStack extends aws_cdk_lib_1.Stack {
    /**
     * Return a factory that will create DefaultStagingStacks
     */
    static factory(options) {
        const appId = options.appId.toLocaleLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 20);
        return {
            obtainStagingResources(stack, context) {
                const app = aws_cdk_lib_1.App.of(stack);
                if (!aws_cdk_lib_1.App.isApp(app)) {
                    throw new Error(`Stack ${stack.stackName} must be part of an App`);
                }
                const stackId = `StagingStack-${appId}-${context.environmentString}`;
                return new DefaultStagingStack(app, stackId, {
                    ...options,
                    // Does not need to contain environment because stack names are unique inside an env anyway
                    stackName: `StagingStack-${appId}`,
                    env: {
                        account: stack.account,
                        region: stack.region,
                    },
                    appId,
                    qualifier: context.qualifier,
                    deployRoleArn: context.deployRoleArn,
                });
            },
        };
    }
    /**
     * Default asset publishing role name for file (S3) assets.
     */
    get fileRoleName() {
        // This role name can be a maximum of 64 letters. The reason why
        // we slice the appId and not the entire name is because this.region
        // can be a token and we don't want to accidentally cut it off.
        return `cdk-${this.appId}-file-role-${this.region}`;
    }
    /**
     * Default asset publishing role name for docker (ECR) assets.
     */
    get imageRoleName() {
        // This role name can be a maximum of 64 letters. The reason why
        // we slice the appId and not the entire name is because this.region
        // can be a token and we don't want to accidentally cut it off.
        return `cdk-${this.appId}-asset-role-${this.region}`;
    }
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            synthesizer: new aws_cdk_lib_1.BootstraplessSynthesizer(),
        });
        this.props = props;
        this.didImageRole = false;
        this.appId = this.validateAppId(props.appId);
        this.dependencyStack = this;
        this.deployRoleArn = props.deployRoleArn;
        this.stagingBucketName = props.stagingBucketName;
        const specializer = new helpers_internal_1.StringSpecializer(this, props.qualifier);
        this.providedFileRole = props.fileAssetPublishingRole?._specialize(specializer);
        this.providedImageRole = props.imageAssetPublishingRole?._specialize(specializer);
        this.stagingRepos = {};
    }
    validateAppId(id) {
        const errors = [];
        if (id.length > 20) {
            errors.push(`appId expected no more than 20 characters but got ${id.length} characters.`);
        }
        if (id !== id.toLocaleLowerCase()) {
            errors.push('appId only accepts lowercase characters.');
        }
        if (!/^[a-z0-9-]*$/.test(id)) {
            errors.push('appId expects only letters, numbers, and dashes (\'-\')');
        }
        if (errors.length > 0) {
            throw new Error([
                `appId ${id} has errors:`,
                ...errors,
            ].join('\n'));
        }
        return id;
    }
    ensureFileRole() {
        if (this.providedFileRole) {
            // Override
            this.fileRoleManifestArn = this.providedFileRole._arnForCloudAssembly();
            const cfnArn = this.providedFileRole._arnForCloudFormation();
            this.fileRole = cfnArn ? iam.Role.fromRoleArn(this, 'CdkFileRole', cfnArn) : undefined;
            return;
        }
        const roleName = this.fileRoleName;
        this.fileRole = new iam.Role(this, 'CdkFileRole', {
            roleName,
            assumedBy: new iam.AccountPrincipal(this.account),
        });
        this.fileRoleManifestArn = aws_cdk_lib_1.Stack.of(this).formatArn({
            partition: '${AWS::Partition}',
            region: '',
            service: 'iam',
            resource: 'role',
            resourceName: roleName,
            arnFormat: aws_cdk_lib_1.ArnFormat.SLASH_RESOURCE_NAME,
        });
    }
    ensureImageRole() {
        // It may end up setting imageRole to undefined, but at least we tried
        if (this.didImageRole) {
            return;
        }
        this.didImageRole = true;
        if (this.providedImageRole) {
            // Override
            this.imageRoleManifestArn = this.providedImageRole._arnForCloudAssembly();
            const cfnArn = this.providedImageRole._arnForCloudFormation();
            this.imageRole = cfnArn ? iam.Role.fromRoleArn(this, 'CdkImageRole', cfnArn) : undefined;
            return;
        }
        const roleName = this.imageRoleName;
        this.imageRole = new iam.Role(this, 'CdkImageRole', {
            roleName,
            assumedBy: new iam.AccountPrincipal(this.account),
        });
        this.imageRoleManifestArn = aws_cdk_lib_1.Stack.of(this).formatArn({
            partition: '${AWS::Partition}',
            region: '',
            service: 'iam',
            resource: 'role',
            resourceName: roleName,
            arnFormat: aws_cdk_lib_1.ArnFormat.SLASH_RESOURCE_NAME,
        });
    }
    createBucketKey() {
        return new kms.Key(this, 'BucketKey', {
            alias: `alias/cdk-${this.appId}-staging`,
            admins: [new iam.AccountPrincipal(this.account)],
        });
    }
    getCreateBucket() {
        const stagingBucketName = this.stagingBucketName ?? `cdk-${this.appId}-staging-${this.account}-${this.region}`;
        const bucketId = 'CdkStagingBucket';
        const createdBucket = this.node.tryFindChild(bucketId);
        if (createdBucket) {
            return stagingBucketName;
        }
        this.ensureFileRole();
        const key = this.createBucketKey();
        // Create the bucket once the dependencies have been created
        const bucket = new s3.Bucket(this, bucketId, {
            bucketName: stagingBucketName,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.RETAIN,
            encryption: s3.BucketEncryption.KMS,
            encryptionKey: key,
            // Many AWS account safety checkers will complain when buckets aren't versioned
            versioned: true,
            // Many AWS account safety checkers will complain when SSL isn't enforced
            enforceSSL: true,
        });
        if (this.fileRole) {
            bucket.grantReadWrite(this.fileRole);
        }
        if (this.deployRoleArn) {
            bucket.addToResourcePolicy(new iam.PolicyStatement({
                actions: [
                    's3:GetObject*',
                    's3:GetBucket*',
                    's3:List*',
                ],
                resources: [bucket.bucketArn, bucket.arnForObjects('*')],
                principals: [new iam.ArnPrincipal(this.deployRoleArn)],
            }));
        }
        // Objects should never be overwritten, but let's make sure we have a lifecycle policy
        // for it anyway.
        bucket.addLifecycleRule({
            noncurrentVersionExpiration: aws_cdk_lib_1.Duration.days(365),
        });
        bucket.addLifecycleRule({
            prefix: EPHEMERAL_PREFIX,
            expiration: this.props.handoffFileAssetLifetime ?? aws_cdk_lib_1.Duration.days(30),
        });
        return stagingBucketName;
    }
    /**
     * Returns the well-known name of the repo
     */
    getCreateRepo(asset) {
        if (!asset.assetName) {
            throw new Error('Assets synthesized with AppScopedStagingSynthesizer must include an \'assetName\' in the asset source definition.');
        }
        // Create image publishing role if it doesn't exist
        this.ensureImageRole();
        const repoName = generateRepoName(`${this.appId}/${asset.assetName}`);
        if (this.stagingRepos[asset.assetName] === undefined) {
            this.stagingRepos[asset.assetName] = new ecr.Repository(this, repoName, {
                repositoryName: repoName,
                lifecycleRules: [{
                        description: 'Garbage collect old image versions and keep the specified number of latest versions',
                        maxImageCount: this.props.imageAssetVersionCount ?? 3,
                    }],
            });
            if (this.imageRole) {
                this.stagingRepos[asset.assetName].grantPullPush(this.imageRole);
                this.stagingRepos[asset.assetName].grantRead(this.imageRole);
            }
        }
        return repoName;
        function generateRepoName(name) {
            return name.toLocaleLowerCase().replace('.', '-');
        }
    }
    addFile(asset) {
        // Has side effects so must go first
        const bucketName = this.getCreateBucket();
        return {
            bucketName,
            assumeRoleArn: this.fileRoleManifestArn,
            prefix: asset.ephemeral ? EPHEMERAL_PREFIX : undefined,
            dependencyStack: this,
        };
    }
    addDockerImage(asset) {
        // Has side effects so must go first
        const repoName = this.getCreateRepo(asset);
        return {
            repoName,
            assumeRoleArn: this.imageRoleManifestArn,
            dependencyStack: this,
        };
    }
    /**
     * Synthesizes the cloudformation template into a cloud assembly.
     * @internal
     */
    _synthesizeTemplate(session, lookupRoleArn) {
        super._synthesizeTemplate(session, lookupRoleArn);
        const builder = session.assembly;
        const outPath = path.join(builder.outdir, this.templateFile);
        const size = fs.statSync(outPath).size;
        if (size > 51200) {
            throw new Error(`Staging resource template cannot be greater than 51200 bytes, but got ${size} bytes`);
        }
    }
}
exports.DefaultStagingStack = DefaultStagingStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1zdGFnaW5nLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVmYXVsdC1zdGFnaW5nLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsNkNBV3FCO0FBQ3JCLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6Qyw0RUFBMEU7QUFJMUUsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUM7QUF5RnBDOztHQUVHO0FBQ0gsTUFBYSxtQkFBb0IsU0FBUSxtQkFBSztJQUM1Qzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBbUM7UUFDdkQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6RixPQUFPO1lBQ0wsc0JBQXNCLENBQUMsS0FBSyxFQUFFLE9BQU87Z0JBQ25DLE1BQU0sR0FBRyxHQUFHLGlCQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsaUJBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLENBQUMsU0FBUyx5QkFBeUIsQ0FBQyxDQUFDO2lCQUNwRTtnQkFFRCxNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsS0FBSyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUNyRSxPQUFPLElBQUksbUJBQW1CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtvQkFDM0MsR0FBRyxPQUFPO29CQUVWLDJGQUEyRjtvQkFDM0YsU0FBUyxFQUFFLGdCQUFnQixLQUFLLEVBQUU7b0JBQ2xDLEdBQUcsRUFBRTt3QkFD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LENBQUM7UUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3RCxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN2QyxJQUFJLElBQUksR0FBRyxLQUFLLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsSUFBSSxRQUFRLENBQUMsQ0FBQztTQUN4RztJQUNILENBQUM7Q0FDRjtBQXRURCxrREFzVEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtcbiAgQXBwLFxuICBBcm5Gb3JtYXQsXG4gIEJvb3RzdHJhcGxlc3NTeW50aGVzaXplcixcbiAgRG9ja2VySW1hZ2VBc3NldFNvdXJjZSxcbiAgRHVyYXRpb24sXG4gIEZpbGVBc3NldFNvdXJjZSxcbiAgSVN5bnRoZXNpc1Nlc3Npb24sXG4gIFJlbW92YWxQb2xpY3ksXG4gIFN0YWNrLFxuICBTdGFja1Byb3BzLFxufSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0IHsgU3RyaW5nU3BlY2lhbGl6ZXIgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcbmltcG9ydCB7IEJvb3RzdHJhcFJvbGUgfSBmcm9tICcuL2Jvb3RzdHJhcC1yb2xlcyc7XG5pbXBvcnQgeyBGaWxlU3RhZ2luZ0xvY2F0aW9uLCBJU3RhZ2luZ1Jlc291cmNlcywgSVN0YWdpbmdSZXNvdXJjZXNGYWN0b3J5LCBJbWFnZVN0YWdpbmdMb2NhdGlvbiB9IGZyb20gJy4vc3RhZ2luZy1zdGFjayc7XG5cbmNvbnN0IEVQSEVNRVJBTF9QUkVGSVggPSAnaGFuZG9mZi8nO1xuXG4vKipcbiAqIFVzZXIgY29uZmlndXJhYmxlIG9wdGlvbnMgdG8gdGhlIERlZmF1bHRTdGFnaW5nU3RhY2suXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVmYXVsdFN0YWdpbmdTdGFja09wdGlvbnMge1xuICAvKipcbiAgICogQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGFwcGxpY2F0aW9uIHRoYXQgdGhlIHN0YWdpbmcgc3RhY2sgYmVsb25ncyB0by5cbiAgICpcbiAgICogVGhpcyBpZGVudGlmaWVyIHdpbGwgYmUgdXNlZCBpbiB0aGUgbmFtZSBvZiBzdGFnaW5nIHJlc291cmNlc1xuICAgKiBjcmVhdGVkIGZvciB0aGlzIGFwcGxpY2F0aW9uLCBhbmQgc2hvdWxkIGJlIHVuaXF1ZSBhY3Jvc3MgQ0RLIGFwcHMuXG4gICAqXG4gICAqIFRoZSBpZGVudGlmaWVyIHNob3VsZCBpbmNsdWRlIGxvd2VyY2FzZSBjaGFyYWN0ZXJzIGFuZCBkYXNoZXMgKCctJykgb25seVxuICAgKiBhbmQgaGF2ZSBhIG1heGltdW0gb2YgMjAgY2hhcmFjdGVycy5cbiAgICovXG4gIHJlYWRvbmx5IGFwcElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEV4cGxpY2l0IG5hbWUgZm9yIHRoZSBzdGFnaW5nIGJ1Y2tldFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgd2VsbC1rbm93biBuYW1lIHVuaXF1ZSB0byB0aGlzIGFwcC9lbnYuXG4gICAqL1xuICByZWFkb25seSBzdGFnaW5nQnVja2V0TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogUGFzcyBpbiBhbiBleGlzdGluZyByb2xlIHRvIGJlIHVzZWQgYXMgdGhlIGZpbGUgcHVibGlzaGluZyByb2xlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgbmV3IHJvbGUgd2lsbCBiZSBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSBmaWxlQXNzZXRQdWJsaXNoaW5nUm9sZT86IEJvb3RzdHJhcFJvbGU7XG5cbiAgLyoqXG4gICAqIFBhc3MgaW4gYW4gZXhpc3Rpbmcgcm9sZSB0byBiZSB1c2VkIGFzIHRoZSBpbWFnZSBwdWJsaXNoaW5nIHJvbGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBuZXcgcm9sZSB3aWxsIGJlIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGltYWdlQXNzZXRQdWJsaXNoaW5nUm9sZT86IEJvb3RzdHJhcFJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBsaWZldGltZSBmb3IgaGFuZG9mZiBmaWxlIGFzc2V0cy5cbiAgICpcbiAgICogQXNzZXRzIHRoYXQgYXJlIG9ubHkgbmVjZXNzYXJ5IGF0IGRlcGxveW1lbnQgdGltZSAoZm9yIGluc3RhbmNlLFxuICAgKiBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZXMgYW5kIExhbWJkYSBzb3VyY2UgY29kZSBidW5kbGVzKSB3aWxsIGJlXG4gICAqIGF1dG9tYXRpY2FsbHkgZGVsZXRlZCBhZnRlciB0aGlzIG1hbnkgZGF5cy4gQXNzZXRzIHRoYXQgbWF5IGJlXG4gICAqIHJlYWQgZnJvbSB0aGUgc3RhZ2luZyBidWNrZXQgZHVyaW5nIHlvdXIgYXBwbGljYXRpb24ncyBydW4gdGltZVxuICAgKiB3aWxsIG5vdCBiZSBkZWxldGVkLlxuICAgKlxuICAgKiBTZXQgdGhpcyB0byB0aGUgbGVuZ3RoIG9mIHRpbWUgeW91IHdpc2ggdG8gYmUgYWJsZSB0byByb2xsIGJhY2sgdG9cbiAgICogcHJldmlvdXMgdmVyc2lvbnMgb2YgeW91ciBhcHBsaWNhdGlvbiB3aXRob3V0IGhhdmluZyB0byBkbyBhIG5ld1xuICAgKiBgY2RrIHN5bnRoYCBhbmQgcmUtdXBsb2FkIG9mIGFzc2V0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEdXJhdGlvbi5kYXlzKDMwKVxuICAgKi9cbiAgcmVhZG9ubHkgaGFuZG9mZkZpbGVBc3NldExpZmV0aW1lPzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBpbWFnZSB2ZXJzaW9ucyB0byBzdG9yZSBpbiBhIHJlcG9zaXRvcnkuXG4gICAqXG4gICAqIFByZXZpb3VzIHZlcnNpb25zIG9mIGFuIGltYWdlIGNhbiBiZSBzdG9yZWQgZm9yIHJvbGxiYWNrIHB1cnBvc2VzLlxuICAgKiBPbmNlIGEgcmVwb3NpdG9yeSBoYXMgbW9yZSB0aGFuIDMgaW1hZ2UgdmVyc2lvbnMgc3RvcmVkLCB0aGUgb2xkZXN0XG4gICAqIHZlcnNpb24gd2lsbCBiZSBkaXNjYXJkZWQuIFRoaXMgYWxsb3dzIGZvciBzZW5zaWJsZSBnYXJiYWdlIGNvbGxlY3Rpb25cbiAgICogd2hpbGUgbWFpbnRhaW5pbmcgYSBmZXcgcHJldmlvdXMgdmVyc2lvbnMgZm9yIHJvbGxiYWNrIHNjZW5hcmlvcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB1cCB0byAzIHZlcnNpb25zIHN0b3JlZFxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VBc3NldFZlcnNpb25Db3VudD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IFN0YWdpbmcgU3RhY2sgUHJvcGVydGllc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIERlZmF1bHRTdGFnaW5nU3RhY2tQcm9wcyBleHRlbmRzIERlZmF1bHRTdGFnaW5nU3RhY2tPcHRpb25zLCBTdGFja1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGRlcGxveSBhY3Rpb24gcm9sZSwgaWYgZ2l2ZW5cbiAgICpcbiAgICogVGhpcyByb2xlIHdpbGwgbmVlZCBwZXJtaXNzaW9ucyB0byByZWFkIGZyb20gdG8gdGhlIHN0YWdpbmcgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBDTEkgY3JlZGVudGlhbHMgYXJlIGFzc3VtZWQsIG5vIGFkZGl0aW9uYWwgcGVybWlzc2lvbnMgYXJlIGdyYW50ZWQuXG4gICAqL1xuICByZWFkb25seSBkZXBsb3lSb2xlQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcXVhbGlmaWVyIHVzZWQgdG8gc3BlY2lhbGl6ZSBzdHJpbmdzXG4gICAqXG4gICAqIFNob3VsZG4ndCBiZSBuZWNlc3NhcnkgYnV0IHdobyBrbm93cyB3aGF0IHBlb3BsZSBtaWdodCBkby5cbiAgICovXG4gIHJlYWRvbmx5IHF1YWxpZmllcjogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgZGVmYXVsdCBTdGFnaW5nIFN0YWNrIHRoYXQgaW1wbGVtZW50cyBJU3RhZ2luZ1Jlc291cmNlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHRTdGFnaW5nU3RhY2sgZXh0ZW5kcyBTdGFjayBpbXBsZW1lbnRzIElTdGFnaW5nUmVzb3VyY2VzIHtcbiAgLyoqXG4gICAqIFJldHVybiBhIGZhY3RvcnkgdGhhdCB3aWxsIGNyZWF0ZSBEZWZhdWx0U3RhZ2luZ1N0YWNrc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmYWN0b3J5KG9wdGlvbnM6IERlZmF1bHRTdGFnaW5nU3RhY2tPcHRpb25zKTogSVN0YWdpbmdSZXNvdXJjZXNGYWN0b3J5IHtcbiAgICBjb25zdCBhcHBJZCA9IG9wdGlvbnMuYXBwSWQudG9Mb2NhbGVMb3dlckNhc2UoKS5yZXBsYWNlKC9bXmEtejAtOS1dL2csICctJykuc2xpY2UoMCwgMjApO1xuICAgIHJldHVybiB7XG4gICAgICBvYnRhaW5TdGFnaW5nUmVzb3VyY2VzKHN0YWNrLCBjb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IGFwcCA9IEFwcC5vZihzdGFjayk7XG4gICAgICAgIGlmICghQXBwLmlzQXBwKGFwcCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0YWNrICR7c3RhY2suc3RhY2tOYW1lfSBtdXN0IGJlIHBhcnQgb2YgYW4gQXBwYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGFja0lkID0gYFN0YWdpbmdTdGFjay0ke2FwcElkfS0ke2NvbnRleHQuZW52aXJvbm1lbnRTdHJpbmd9YDtcbiAgICAgICAgcmV0dXJuIG5ldyBEZWZhdWx0U3RhZ2luZ1N0YWNrKGFwcCwgc3RhY2tJZCwge1xuICAgICAgICAgIC4uLm9wdGlvbnMsXG5cbiAgICAgICAgICAvLyBEb2VzIG5vdCBuZWVkIHRvIGNvbnRhaW4gZW52aXJvbm1lbnQgYmVjYXVzZSBzdGFjayBuYW1lcyBhcmUgdW5pcXVlIGluc2lkZSBhbiBlbnYgYW55d2F5XG4gICAgICAgICAgc3RhY2tOYW1lOiBgU3RhZ2luZ1N0YWNrLSR7YXBwSWR9YCxcbiAgICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgIGFjY291bnQ6IHN0YWNrLmFjY291bnQsXG4gICAgICAgICAgICByZWdpb246IHN0YWNrLnJlZ2lvbixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFwcElkLFxuICAgICAgICAgIHF1YWxpZmllcjogY29udGV4dC5xdWFsaWZpZXIsXG4gICAgICAgICAgZGVwbG95Um9sZUFybjogY29udGV4dC5kZXBsb3lSb2xlQXJuLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGFzc2V0IHB1Ymxpc2hpbmcgcm9sZSBuYW1lIGZvciBmaWxlIChTMykgYXNzZXRzLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgZmlsZVJvbGVOYW1lKCkge1xuICAgIC8vIFRoaXMgcm9sZSBuYW1lIGNhbiBiZSBhIG1heGltdW0gb2YgNjQgbGV0dGVycy4gVGhlIHJlYXNvbiB3aHlcbiAgICAvLyB3ZSBzbGljZSB0aGUgYXBwSWQgYW5kIG5vdCB0aGUgZW50aXJlIG5hbWUgaXMgYmVjYXVzZSB0aGlzLnJlZ2lvblxuICAgIC8vIGNhbiBiZSBhIHRva2VuIGFuZCB3ZSBkb24ndCB3YW50IHRvIGFjY2lkZW50YWxseSBjdXQgaXQgb2ZmLlxuICAgIHJldHVybiBgY2RrLSR7dGhpcy5hcHBJZH0tZmlsZS1yb2xlLSR7dGhpcy5yZWdpb259YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGFzc2V0IHB1Ymxpc2hpbmcgcm9sZSBuYW1lIGZvciBkb2NrZXIgKEVDUikgYXNzZXRzLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgaW1hZ2VSb2xlTmFtZSgpIHtcbiAgICAvLyBUaGlzIHJvbGUgbmFtZSBjYW4gYmUgYSBtYXhpbXVtIG9mIDY0IGxldHRlcnMuIFRoZSByZWFzb24gd2h5XG4gICAgLy8gd2Ugc2xpY2UgdGhlIGFwcElkIGFuZCBub3QgdGhlIGVudGlyZSBuYW1lIGlzIGJlY2F1c2UgdGhpcy5yZWdpb25cbiAgICAvLyBjYW4gYmUgYSB0b2tlbiBhbmQgd2UgZG9uJ3Qgd2FudCB0byBhY2NpZGVudGFsbHkgY3V0IGl0IG9mZi5cbiAgICByZXR1cm4gYGNkay0ke3RoaXMuYXBwSWR9LWFzc2V0LXJvbGUtJHt0aGlzLnJlZ2lvbn1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhcHAtc2NvcGVkLCBldmlyb25tZW50LWtleWVkIHN0YWdpbmcgYnVja2V0LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YWdpbmdCdWNrZXQ/OiBzMy5CdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFRoZSBhcHAtc2NvcGVkLCBlbnZpcm9ubWVudC1rZXllZCBlY3IgcmVwb3NpdG9yaWVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGFwcC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdGFnaW5nUmVwb3M6IFJlY29yZDxzdHJpbmcsIGVjci5SZXBvc2l0b3J5PjtcblxuICAvKipcbiAgICogVGhlIHN0YWNrIHRvIGFkZCBkZXBlbmRlbmNpZXMgdG8uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVwZW5kZW5jeVN0YWNrOiBTdGFjaztcblxuICBwcml2YXRlIHJlYWRvbmx5IGFwcElkOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhZ2luZ0J1Y2tldE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEZpbGUgcHVibGlzaCByb2xlIEFSTiBpbiBhc3NldCBtYW5pZmVzdCBmb3JtYXRcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvdmlkZWRGaWxlUm9sZT86IEJvb3RzdHJhcFJvbGU7XG4gIHByaXZhdGUgZmlsZVJvbGU/OiBpYW0uSVJvbGU7XG4gIHByaXZhdGUgZmlsZVJvbGVNYW5pZmVzdEFybj86IHN0cmluZztcblxuICAvKipcbiAgICogSW1hZ2UgcHVibGlzaGluZyByb2xlIEFSTiBpbiBhc3NldCBtYW5pZmVzdCBmb3JtYXRcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvdmlkZWRJbWFnZVJvbGU/OiBCb290c3RyYXBSb2xlO1xuICBwcml2YXRlIGltYWdlUm9sZT86IGlhbS5JUm9sZTtcbiAgcHJpdmF0ZSBkaWRJbWFnZVJvbGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBpbWFnZVJvbGVNYW5pZmVzdEFybj86IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IGRlcGxveVJvbGVBcm4/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBwcm9wczogRGVmYXVsdFN0YWdpbmdTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgQm9vdHN0cmFwbGVzc1N5bnRoZXNpemVyKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFwcElkID0gdGhpcy52YWxpZGF0ZUFwcElkKHByb3BzLmFwcElkKTtcbiAgICB0aGlzLmRlcGVuZGVuY3lTdGFjayA9IHRoaXM7XG5cbiAgICB0aGlzLmRlcGxveVJvbGVBcm4gPSBwcm9wcy5kZXBsb3lSb2xlQXJuO1xuICAgIHRoaXMuc3RhZ2luZ0J1Y2tldE5hbWUgPSBwcm9wcy5zdGFnaW5nQnVja2V0TmFtZTtcbiAgICBjb25zdCBzcGVjaWFsaXplciA9IG5ldyBTdHJpbmdTcGVjaWFsaXplcih0aGlzLCBwcm9wcy5xdWFsaWZpZXIpO1xuXG4gICAgdGhpcy5wcm92aWRlZEZpbGVSb2xlID0gcHJvcHMuZmlsZUFzc2V0UHVibGlzaGluZ1JvbGU/Ll9zcGVjaWFsaXplKHNwZWNpYWxpemVyKTtcbiAgICB0aGlzLnByb3ZpZGVkSW1hZ2VSb2xlID0gcHJvcHMuaW1hZ2VBc3NldFB1Ymxpc2hpbmdSb2xlPy5fc3BlY2lhbGl6ZShzcGVjaWFsaXplcik7XG4gICAgdGhpcy5zdGFnaW5nUmVwb3MgPSB7fTtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVBcHBJZChpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgaWYgKGlkLmxlbmd0aCA+IDIwKSB7XG4gICAgICBlcnJvcnMucHVzaChgYXBwSWQgZXhwZWN0ZWQgbm8gbW9yZSB0aGFuIDIwIGNoYXJhY3RlcnMgYnV0IGdvdCAke2lkLmxlbmd0aH0gY2hhcmFjdGVycy5gKTtcbiAgICB9XG4gICAgaWYgKGlkICE9PSBpZC50b0xvY2FsZUxvd2VyQ2FzZSgpKSB7XG4gICAgICBlcnJvcnMucHVzaCgnYXBwSWQgb25seSBhY2NlcHRzIGxvd2VyY2FzZSBjaGFyYWN0ZXJzLicpO1xuICAgIH1cbiAgICBpZiAoIS9eW2EtejAtOS1dKiQvLnRlc3QoaWQpKSB7XG4gICAgICBlcnJvcnMucHVzaCgnYXBwSWQgZXhwZWN0cyBvbmx5IGxldHRlcnMsIG51bWJlcnMsIGFuZCBkYXNoZXMgKFxcJy1cXCcpJyk7XG4gICAgfVxuXG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoW1xuICAgICAgICBgYXBwSWQgJHtpZH0gaGFzIGVycm9yczpgLFxuICAgICAgICAuLi5lcnJvcnMsXG4gICAgICBdLmpvaW4oJ1xcbicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgcHJpdmF0ZSBlbnN1cmVGaWxlUm9sZSgpIHtcbiAgICBpZiAodGhpcy5wcm92aWRlZEZpbGVSb2xlKSB7XG4gICAgICAvLyBPdmVycmlkZVxuICAgICAgdGhpcy5maWxlUm9sZU1hbmlmZXN0QXJuID0gdGhpcy5wcm92aWRlZEZpbGVSb2xlLl9hcm5Gb3JDbG91ZEFzc2VtYmx5KCk7XG4gICAgICBjb25zdCBjZm5Bcm4gPSB0aGlzLnByb3ZpZGVkRmlsZVJvbGUuX2FybkZvckNsb3VkRm9ybWF0aW9uKCk7XG4gICAgICB0aGlzLmZpbGVSb2xlID0gY2ZuQXJuID8gaWFtLlJvbGUuZnJvbVJvbGVBcm4odGhpcywgJ0Nka0ZpbGVSb2xlJywgY2ZuQXJuKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb2xlTmFtZSA9IHRoaXMuZmlsZVJvbGVOYW1lO1xuICAgIHRoaXMuZmlsZVJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0Nka0ZpbGVSb2xlJywge1xuICAgICAgcm9sZU5hbWUsXG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCh0aGlzLmFjY291bnQpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5maWxlUm9sZU1hbmlmZXN0QXJuID0gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgIHBhcnRpdGlvbjogJyR7QVdTOjpQYXJ0aXRpb259JyxcbiAgICAgIHJlZ2lvbjogJycsIC8vIGlhbSBpcyBnbG9iYWxcbiAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgcmVzb3VyY2U6ICdyb2xlJyxcbiAgICAgIHJlc291cmNlTmFtZTogcm9sZU5hbWUsXG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBlbnN1cmVJbWFnZVJvbGUoKSB7XG4gICAgLy8gSXQgbWF5IGVuZCB1cCBzZXR0aW5nIGltYWdlUm9sZSB0byB1bmRlZmluZWQsIGJ1dCBhdCBsZWFzdCB3ZSB0cmllZFxuICAgIGlmICh0aGlzLmRpZEltYWdlUm9sZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRpZEltYWdlUm9sZSA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5wcm92aWRlZEltYWdlUm9sZSkge1xuICAgICAgLy8gT3ZlcnJpZGVcbiAgICAgIHRoaXMuaW1hZ2VSb2xlTWFuaWZlc3RBcm4gPSB0aGlzLnByb3ZpZGVkSW1hZ2VSb2xlLl9hcm5Gb3JDbG91ZEFzc2VtYmx5KCk7XG4gICAgICBjb25zdCBjZm5Bcm4gPSB0aGlzLnByb3ZpZGVkSW1hZ2VSb2xlLl9hcm5Gb3JDbG91ZEZvcm1hdGlvbigpO1xuICAgICAgdGhpcy5pbWFnZVJvbGUgPSBjZm5Bcm4gPyBpYW0uUm9sZS5mcm9tUm9sZUFybih0aGlzLCAnQ2RrSW1hZ2VSb2xlJywgY2ZuQXJuKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb2xlTmFtZSA9IHRoaXMuaW1hZ2VSb2xlTmFtZTtcbiAgICB0aGlzLmltYWdlUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ2RrSW1hZ2VSb2xlJywge1xuICAgICAgcm9sZU5hbWUsXG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCh0aGlzLmFjY291bnQpLFxuICAgIH0pO1xuICAgIHRoaXMuaW1hZ2VSb2xlTWFuaWZlc3RBcm4gPSBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgcGFydGl0aW9uOiAnJHtBV1M6OlBhcnRpdGlvbn0nLFxuICAgICAgcmVnaW9uOiAnJywgLy8gaWFtIGlzIGdsb2JhbFxuICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICByZXNvdXJjZTogJ3JvbGUnLFxuICAgICAgcmVzb3VyY2VOYW1lOiByb2xlTmFtZSxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUJ1Y2tldEtleSgpOiBrbXMuSUtleSB7XG4gICAgcmV0dXJuIG5ldyBrbXMuS2V5KHRoaXMsICdCdWNrZXRLZXknLCB7XG4gICAgICBhbGlhczogYGFsaWFzL2Nkay0ke3RoaXMuYXBwSWR9LXN0YWdpbmdgLFxuICAgICAgYWRtaW5zOiBbbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKHRoaXMuYWNjb3VudCldLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDcmVhdGVCdWNrZXQoKSB7XG4gICAgY29uc3Qgc3RhZ2luZ0J1Y2tldE5hbWUgPSB0aGlzLnN0YWdpbmdCdWNrZXROYW1lID8/IGBjZGstJHt0aGlzLmFwcElkfS1zdGFnaW5nLSR7dGhpcy5hY2NvdW50fS0ke3RoaXMucmVnaW9ufWA7XG4gICAgY29uc3QgYnVja2V0SWQgPSAnQ2RrU3RhZ2luZ0J1Y2tldCc7XG4gICAgY29uc3QgY3JlYXRlZEJ1Y2tldCA9IHRoaXMubm9kZS50cnlGaW5kQ2hpbGQoYnVja2V0SWQpIGFzIHMzLkJ1Y2tldDtcbiAgICBpZiAoY3JlYXRlZEJ1Y2tldCkge1xuICAgICAgcmV0dXJuIHN0YWdpbmdCdWNrZXROYW1lO1xuICAgIH1cblxuICAgIHRoaXMuZW5zdXJlRmlsZVJvbGUoKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmNyZWF0ZUJ1Y2tldEtleSgpO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBidWNrZXQgb25jZSB0aGUgZGVwZW5kZW5jaWVzIGhhdmUgYmVlbiBjcmVhdGVkXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBidWNrZXRJZCwge1xuICAgICAgYnVja2V0TmFtZTogc3RhZ2luZ0J1Y2tldE5hbWUsXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TLFxuICAgICAgZW5jcnlwdGlvbktleToga2V5LFxuXG4gICAgICAvLyBNYW55IEFXUyBhY2NvdW50IHNhZmV0eSBjaGVja2VycyB3aWxsIGNvbXBsYWluIHdoZW4gYnVja2V0cyBhcmVuJ3QgdmVyc2lvbmVkXG4gICAgICB2ZXJzaW9uZWQ6IHRydWUsXG4gICAgICAvLyBNYW55IEFXUyBhY2NvdW50IHNhZmV0eSBjaGVja2VycyB3aWxsIGNvbXBsYWluIHdoZW4gU1NMIGlzbid0IGVuZm9yY2VkXG4gICAgICBlbmZvcmNlU1NMOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZmlsZVJvbGUpIHtcbiAgICAgIGJ1Y2tldC5ncmFudFJlYWRXcml0ZSh0aGlzLmZpbGVSb2xlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZXBsb3lSb2xlQXJuKSB7XG4gICAgICBidWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogW2J1Y2tldC5idWNrZXRBcm4sIGJ1Y2tldC5hcm5Gb3JPYmplY3RzKCcqJyldLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5Bcm5QcmluY2lwYWwodGhpcy5kZXBsb3lSb2xlQXJuKV0sXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgLy8gT2JqZWN0cyBzaG91bGQgbmV2ZXIgYmUgb3ZlcndyaXR0ZW4sIGJ1dCBsZXQncyBtYWtlIHN1cmUgd2UgaGF2ZSBhIGxpZmVjeWNsZSBwb2xpY3lcbiAgICAvLyBmb3IgaXQgYW55d2F5LlxuICAgIGJ1Y2tldC5hZGRMaWZlY3ljbGVSdWxlKHtcbiAgICAgIG5vbmN1cnJlbnRWZXJzaW9uRXhwaXJhdGlvbjogRHVyYXRpb24uZGF5cygzNjUpLFxuICAgIH0pO1xuXG4gICAgYnVja2V0LmFkZExpZmVjeWNsZVJ1bGUoe1xuICAgICAgcHJlZml4OiBFUEhFTUVSQUxfUFJFRklYLFxuICAgICAgZXhwaXJhdGlvbjogdGhpcy5wcm9wcy5oYW5kb2ZmRmlsZUFzc2V0TGlmZXRpbWUgPz8gRHVyYXRpb24uZGF5cygzMCksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3RhZ2luZ0J1Y2tldE5hbWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2VsbC1rbm93biBuYW1lIG9mIHRoZSByZXBvXG4gICAqL1xuICBwcml2YXRlIGdldENyZWF0ZVJlcG8oYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBzdHJpbmcge1xuICAgIGlmICghYXNzZXQuYXNzZXROYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fzc2V0cyBzeW50aGVzaXplZCB3aXRoIEFwcFNjb3BlZFN0YWdpbmdTeW50aGVzaXplciBtdXN0IGluY2x1ZGUgYW4gXFwnYXNzZXROYW1lXFwnIGluIHRoZSBhc3NldCBzb3VyY2UgZGVmaW5pdGlvbi4nKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgaW1hZ2UgcHVibGlzaGluZyByb2xlIGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICB0aGlzLmVuc3VyZUltYWdlUm9sZSgpO1xuXG4gICAgY29uc3QgcmVwb05hbWUgPSBnZW5lcmF0ZVJlcG9OYW1lKGAke3RoaXMuYXBwSWR9LyR7YXNzZXQuYXNzZXROYW1lfWApO1xuICAgIGlmICh0aGlzLnN0YWdpbmdSZXBvc1thc3NldC5hc3NldE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc3RhZ2luZ1JlcG9zW2Fzc2V0LmFzc2V0TmFtZV0gPSBuZXcgZWNyLlJlcG9zaXRvcnkodGhpcywgcmVwb05hbWUsIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6IHJlcG9OYW1lLFxuICAgICAgICBsaWZlY3ljbGVSdWxlczogW3tcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dhcmJhZ2UgY29sbGVjdCBvbGQgaW1hZ2UgdmVyc2lvbnMgYW5kIGtlZXAgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbGF0ZXN0IHZlcnNpb25zJyxcbiAgICAgICAgICBtYXhJbWFnZUNvdW50OiB0aGlzLnByb3BzLmltYWdlQXNzZXRWZXJzaW9uQ291bnQgPz8gMyxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLmltYWdlUm9sZSkge1xuICAgICAgICB0aGlzLnN0YWdpbmdSZXBvc1thc3NldC5hc3NldE5hbWVdLmdyYW50UHVsbFB1c2godGhpcy5pbWFnZVJvbGUpO1xuICAgICAgICB0aGlzLnN0YWdpbmdSZXBvc1thc3NldC5hc3NldE5hbWVdLmdyYW50UmVhZCh0aGlzLmltYWdlUm9sZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXBvTmFtZTtcblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlUmVwb05hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBuYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCkucmVwbGFjZSgnLicsICctJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZEZpbGUoYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSk6IEZpbGVTdGFnaW5nTG9jYXRpb24ge1xuICAgIC8vIEhhcyBzaWRlIGVmZmVjdHMgc28gbXVzdCBnbyBmaXJzdFxuICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSB0aGlzLmdldENyZWF0ZUJ1Y2tldCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGJ1Y2tldE5hbWUsXG4gICAgICBhc3N1bWVSb2xlQXJuOiB0aGlzLmZpbGVSb2xlTWFuaWZlc3RBcm4sXG4gICAgICBwcmVmaXg6IGFzc2V0LmVwaGVtZXJhbCA/IEVQSEVNRVJBTF9QUkVGSVggOiB1bmRlZmluZWQsXG4gICAgICBkZXBlbmRlbmN5U3RhY2s6IHRoaXMsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhZGREb2NrZXJJbWFnZShhc3NldDogRG9ja2VySW1hZ2VBc3NldFNvdXJjZSk6IEltYWdlU3RhZ2luZ0xvY2F0aW9uIHtcbiAgICAvLyBIYXMgc2lkZSBlZmZlY3RzIHNvIG11c3QgZ28gZmlyc3RcbiAgICBjb25zdCByZXBvTmFtZSA9IHRoaXMuZ2V0Q3JlYXRlUmVwbyhhc3NldCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmVwb05hbWUsXG4gICAgICBhc3N1bWVSb2xlQXJuOiB0aGlzLmltYWdlUm9sZU1hbmlmZXN0QXJuLFxuICAgICAgZGVwZW5kZW5jeVN0YWNrOiB0aGlzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZXMgdGhlIGNsb3VkZm9ybWF0aW9uIHRlbXBsYXRlIGludG8gYSBjbG91ZCBhc3NlbWJseS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3N5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbiwgbG9va3VwUm9sZUFybj86IHN0cmluZyB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIHN1cGVyLl9zeW50aGVzaXplVGVtcGxhdGUoc2Vzc2lvbiwgbG9va3VwUm9sZUFybik7XG5cbiAgICBjb25zdCBidWlsZGVyID0gc2Vzc2lvbi5hc3NlbWJseTtcbiAgICBjb25zdCBvdXRQYXRoID0gcGF0aC5qb2luKGJ1aWxkZXIub3V0ZGlyLCB0aGlzLnRlbXBsYXRlRmlsZSk7XG4gICAgY29uc3Qgc2l6ZSA9IGZzLnN0YXRTeW5jKG91dFBhdGgpLnNpemU7XG4gICAgaWYgKHNpemUgPiA1MTIwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTdGFnaW5nIHJlc291cmNlIHRlbXBsYXRlIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gNTEyMDAgYnl0ZXMsIGJ1dCBnb3QgJHtzaXplfSBieXRlc2ApO1xuICAgIH1cbiAgfVxufVxuIl19