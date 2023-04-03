"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitConfig = exports.CloudFormationInit = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const crypto = require("crypto");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const machine_image_1 = require("./machine-image");
const cfn_init_internal_1 = require("./private/cfn-init-internal");
/**
 * A CloudFormation-init configuration
 */
class CloudFormationInit {
    /**
     * Build a new config from a set of Init Elements
     */
    static fromElements(...elements) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitElement(elements);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromElements);
            }
            throw error;
        }
        return CloudFormationInit.fromConfig(new InitConfig(elements));
    }
    /**
     * Use an existing InitConfig object as the default and only config
     */
    static fromConfig(config) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitConfig(config);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromConfig);
            }
            throw error;
        }
        return CloudFormationInit.fromConfigSets({
            configSets: {
                default: ['config'],
            },
            configs: { config },
        });
    }
    /**
     * Build a CloudFormationInit from config sets
     */
    static fromConfigSets(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ConfigSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromConfigSets);
            }
            throw error;
        }
        return new CloudFormationInit(props.configSets, props.configs);
    }
    constructor(configSets, configs) {
        this._configSets = {};
        this._configs = {};
        Object.assign(this._configSets, configSets);
        Object.assign(this._configs, configs);
    }
    /**
     * Add a config with the given name to this CloudFormationInit object
     */
    addConfig(configName, config) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitConfig(config);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addConfig);
            }
            throw error;
        }
        if (this._configs[configName]) {
            throw new Error(`CloudFormationInit already contains a config named '${configName}'`);
        }
        this._configs[configName] = config;
    }
    /**
     * Add a config set with the given name to this CloudFormationInit object
     *
     * The new configset will reference the given configs in the given order.
     */
    addConfigSet(configSetName, configNames = []) {
        if (this._configSets[configSetName]) {
            throw new Error(`CloudFormationInit already contains a configSet named '${configSetName}'`);
        }
        const unk = configNames.filter(c => !this._configs[c]);
        if (unk.length > 0) {
            throw new Error(`Unknown configs referenced in definition of '${configSetName}': ${unk}`);
        }
        this._configSets[configSetName] = [...configNames];
    }
    /**
     * Attach the CloudFormation Init config to the given resource
     *
     * As an app builder, use `instance.applyCloudFormationInit()` or
     * `autoScalingGroup.applyCloudFormationInit()` to trigger this method.
     *
     * This method does the following:
     *
     * - Renders the `AWS::CloudFormation::Init` object to the given resource's
     *   metadata, potentially adding a `AWS::CloudFormation::Authentication` object
     *   next to it if required.
     * - Updates the instance role policy to be able to call the APIs required for
     *   `cfn-init` and `cfn-signal` to work, and potentially add permissions to download
     *   referenced asset and bucket resources.
     * - Updates the given UserData with commands to execute the `cfn-init` script.
     */
    attach(attachedResource, attachOptions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_AttachInitOptions(attachOptions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.attach);
            }
            throw error;
        }
        if (attachOptions.platform === machine_image_1.OperatingSystemType.UNKNOWN) {
            throw new Error('Cannot attach CloudFormationInit to an unknown OS type');
        }
        const CFN_INIT_METADATA_KEY = 'AWS::CloudFormation::Init';
        if (attachedResource.getMetadata(CFN_INIT_METADATA_KEY) !== undefined) {
            throw new Error(`Cannot bind CfnInit: resource '${attachedResource.node.path}' already has '${CFN_INIT_METADATA_KEY}' attached`);
        }
        // Note: This will not reflect mutations made after attaching.
        const bindResult = this.bind(attachedResource.stack, attachOptions);
        attachedResource.addMetadata(CFN_INIT_METADATA_KEY, bindResult.configData);
        // Need to resolve the various tokens from assets in the config,
        // as well as include any asset hashes provided so the fingerprint is accurate.
        const resolvedConfig = attachedResource.stack.resolve(bindResult.configData);
        const fingerprintInput = { config: resolvedConfig, assetHash: bindResult.assetHash };
        const fingerprint = contentHash(JSON.stringify(fingerprintInput)).slice(0, 16);
        attachOptions.instanceRole.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['cloudformation:DescribeStackResource', 'cloudformation:SignalResource'],
            resources: [core_1.Aws.STACK_ID],
        }));
        if (bindResult.authData) {
            attachedResource.addMetadata('AWS::CloudFormation::Authentication', bindResult.authData);
        }
        // To identify the resources that have the metadata and where the signal
        // needs to be sent, we need { region, stackName, logicalId }
        let resourceLocator = `--region ${core_1.Aws.REGION} --stack ${core_1.Aws.STACK_NAME} --resource ${attachedResource.logicalId}`;
        const signalResource = attachOptions.signalResource?.logicalId ?? attachedResource.logicalId;
        let notifyResourceLocator = `--region ${core_1.Aws.REGION} --stack ${core_1.Aws.STACK_NAME} --resource ${signalResource}`;
        // If specified in attachOptions, include arguments in cfn-init/cfn-signal commands
        if (attachOptions.includeUrl) {
            resourceLocator = `${resourceLocator} --url https://cloudformation.${core_1.Aws.REGION}.${core_1.Aws.URL_SUFFIX}`;
            notifyResourceLocator = `${notifyResourceLocator} --url https://cloudformation.${core_1.Aws.REGION}.${core_1.Aws.URL_SUFFIX}`;
        }
        if (attachOptions.includeRole) {
            resourceLocator = `${resourceLocator} --role ${attachOptions.instanceRole.roleName}`;
            notifyResourceLocator = `${notifyResourceLocator} --role ${attachOptions.instanceRole.roleName}`;
        }
        const configSets = (attachOptions.configSets ?? ['default']).join(',');
        const printLog = attachOptions.printLog ?? true;
        if (attachOptions.embedFingerprint ?? true) {
            // It just so happens that the comment char is '#' for both bash and PowerShell
            attachOptions.userData.addCommands(`# fingerprint: ${fingerprint}`);
        }
        if (attachOptions.platform === machine_image_1.OperatingSystemType.WINDOWS) {
            const errCode = attachOptions.ignoreFailures ? '0' : '$LASTEXITCODE';
            attachOptions.userData.addCommands(...[
                `cfn-init.exe -v ${resourceLocator} -c ${configSets}`,
                `cfn-signal.exe -e ${errCode} ${notifyResourceLocator}`,
                ...(printLog ? ['type C:\\cfn\\log\\cfn-init.log'] : []),
            ]);
        }
        else {
            const errCode = attachOptions.ignoreFailures ? '0' : '$?';
            attachOptions.userData.addCommands(...[
                // Run a subshell without 'errexit', so we can signal using the exit code of cfn-init
                '(',
                '  set +e',
                `  /opt/aws/bin/cfn-init -v ${resourceLocator} -c ${configSets}`,
                `  /opt/aws/bin/cfn-signal -e ${errCode} ${notifyResourceLocator}`,
                ...(printLog ? ['  cat /var/log/cfn-init.log >&2'] : []),
                ')',
            ]);
        }
    }
    bind(scope, options) {
        const nonEmptyConfigs = mapValues(this._configs, c => c.isEmpty() ? undefined : c);
        const configNameToBindResult = mapValues(nonEmptyConfigs, c => c._bind(scope, options));
        return {
            configData: {
                configSets: mapValues(this._configSets, configNames => configNames.filter(name => nonEmptyConfigs[name] !== undefined)),
                ...mapValues(configNameToBindResult, c => c.config),
            },
            authData: Object.values(configNameToBindResult).map(c => c.authentication).reduce(deepMerge, undefined),
            assetHash: combineAssetHashesOrUndefined(Object.values(configNameToBindResult).map(c => c.assetHash)),
        };
    }
}
_a = JSII_RTTI_SYMBOL_1;
CloudFormationInit[_a] = { fqn: "@aws-cdk/aws-ec2.CloudFormationInit", version: "0.0.0" };
exports.CloudFormationInit = CloudFormationInit;
/**
 * A collection of configuration elements
 */
class InitConfig {
    constructor(elements) {
        this.elements = new Array();
        this.add(...elements);
    }
    /**
     * Whether this configset has elements or not
     */
    isEmpty() {
        return this.elements.length === 0;
    }
    /**
     * Add one or more elements to the config
     */
    add(...elements) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitElement(elements);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.add);
            }
            throw error;
        }
        this.elements.push(...elements);
    }
    /**
     * Called when the config is applied to an instance.
     * Creates the CloudFormation representation of the Init config and handles any permissions and assets.
     * @internal
     */
    _bind(scope, options) {
        const bindOptions = {
            instanceRole: options.instanceRole,
            platform: this.initPlatformFromOSType(options.platform),
            scope,
        };
        const packageConfig = this.bindForType(cfn_init_internal_1.InitElementType.PACKAGE, bindOptions);
        const groupsConfig = this.bindForType(cfn_init_internal_1.InitElementType.GROUP, bindOptions);
        const usersConfig = this.bindForType(cfn_init_internal_1.InitElementType.USER, bindOptions);
        const sourcesConfig = this.bindForType(cfn_init_internal_1.InitElementType.SOURCE, bindOptions);
        const filesConfig = this.bindForType(cfn_init_internal_1.InitElementType.FILE, bindOptions);
        const commandsConfig = this.bindForType(cfn_init_internal_1.InitElementType.COMMAND, bindOptions);
        // Must be last!
        const servicesConfig = this.bindForType(cfn_init_internal_1.InitElementType.SERVICE, bindOptions);
        const allConfig = [packageConfig, groupsConfig, usersConfig, sourcesConfig, filesConfig, commandsConfig, servicesConfig];
        const authentication = allConfig.map(c => c?.authentication).reduce(deepMerge, undefined);
        const assetHash = combineAssetHashesOrUndefined(allConfig.map(c => c?.assetHash));
        return {
            config: {
                packages: packageConfig?.config,
                groups: groupsConfig?.config,
                users: usersConfig?.config,
                sources: sourcesConfig?.config,
                files: filesConfig?.config,
                commands: commandsConfig?.config,
                services: servicesConfig?.config,
            },
            authentication,
            assetHash,
        };
    }
    bindForType(elementType, renderOptions) {
        const elements = this.elements.filter(elem => elem.elementType === elementType);
        if (elements.length === 0) {
            return undefined;
        }
        const bindResults = elements.map((e, index) => e._bind({ index, ...renderOptions }));
        return {
            config: bindResults.map(r => r.config).reduce(deepMerge, undefined) ?? {},
            authentication: bindResults.map(r => r.authentication).reduce(deepMerge, undefined),
            assetHash: combineAssetHashesOrUndefined(bindResults.map(r => r.assetHash)),
        };
    }
    initPlatformFromOSType(osType) {
        switch (osType) {
            case machine_image_1.OperatingSystemType.LINUX: {
                return cfn_init_internal_1.InitPlatform.LINUX;
            }
            case machine_image_1.OperatingSystemType.WINDOWS: {
                return cfn_init_internal_1.InitPlatform.WINDOWS;
            }
            default: {
                throw new Error('Cannot attach CloudFormationInit to an unknown OS type');
            }
        }
    }
}
_b = JSII_RTTI_SYMBOL_1;
InitConfig[_b] = { fqn: "@aws-cdk/aws-ec2.InitConfig", version: "0.0.0" };
exports.InitConfig = InitConfig;
/**
 * Deep-merge objects and arrays
 *
 * Treat arrays as sets, removing duplicates. This is acceptable for rendering
 * cfn-inits, not applicable elsewhere.
 */
function deepMerge(target, src) {
    if (target == null) {
        return src;
    }
    if (src == null) {
        return target;
    }
    for (const [key, value] of Object.entries(src)) {
        if (Array.isArray(value)) {
            if (target[key] && !Array.isArray(target[key])) {
                throw new Error(`Trying to merge array [${value}] into a non-array '${target[key]}'`);
            }
            target[key] = Array.from(new Set([
                ...target[key] ?? [],
                ...value,
            ]));
            continue;
        }
        if (typeof value === 'object' && value) {
            target[key] = deepMerge(target[key] ?? {}, value);
            continue;
        }
        if (value !== undefined) {
            target[key] = value;
        }
    }
    return target;
}
/**
 * Map a function over values of an object
 *
 * If the mapping function returns undefined, remove the key
 */
function mapValues(xs, fn) {
    const ret = {};
    for (const [k, v] of Object.entries(xs)) {
        const mapped = fn(v);
        if (mapped !== undefined) {
            ret[k] = mapped;
        }
    }
    return ret;
}
// Combines all input asset hashes into one, or if no hashes are present, returns undefined.
function combineAssetHashesOrUndefined(hashes) {
    const hashArray = hashes.filter((x) => x !== undefined);
    return hashArray.length > 0 ? hashArray.join('') : undefined;
}
function contentHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4taW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpQ0FBaUM7QUFDakMsd0NBQXdDO0FBQ3hDLHdDQUFpRDtBQUdqRCxtREFBc0Q7QUFDdEQsbUVBQWdIO0FBR2hIOztHQUVHO0FBQ0gsTUFBYSxrQkFBa0I7SUFDN0I7O09BRUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBdUI7Ozs7Ozs7Ozs7UUFDbkQsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUNoRTtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFrQjs7Ozs7Ozs7OztRQUN6QyxPQUFPLGtCQUFrQixDQUFDLGNBQWMsQ0FBQztZQUN2QyxVQUFVLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO2FBQ3BCO1lBQ0QsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFO1NBQ3BCLENBQUMsQ0FBQztLQUNKO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQXFCOzs7Ozs7Ozs7O1FBQ2hELE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNoRTtJQUtELFlBQW9CLFVBQW9DLEVBQUUsT0FBbUM7UUFINUUsZ0JBQVcsR0FBNkIsRUFBRSxDQUFDO1FBQzNDLGFBQVEsR0FBK0IsRUFBRSxDQUFDO1FBR3pELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdkM7SUFFRDs7T0FFRztJQUNJLFNBQVMsQ0FBQyxVQUFrQixFQUFFLE1BQWtC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Q0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUM7SUFDckUsT0FBTyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQy9ELENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxPQUFlO0lBQ2xDLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25FLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IEF3cywgQ2ZuUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSW5pdEVsZW1lbnQgfSBmcm9tICcuL2Nmbi1pbml0LWVsZW1lbnRzJztcbmltcG9ydCB7IE9wZXJhdGluZ1N5c3RlbVR5cGUgfSBmcm9tICcuL21hY2hpbmUtaW1hZ2UnO1xuaW1wb3J0IHsgSW5pdEJpbmRPcHRpb25zLCBJbml0RWxlbWVudENvbmZpZywgSW5pdEVsZW1lbnRUeXBlLCBJbml0UGxhdGZvcm0gfSBmcm9tICcuL3ByaXZhdGUvY2ZuLWluaXQtaW50ZXJuYWwnO1xuaW1wb3J0IHsgVXNlckRhdGEgfSBmcm9tICcuL3VzZXItZGF0YSc7XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbi1pbml0IGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIENsb3VkRm9ybWF0aW9uSW5pdCB7XG4gIC8qKlxuICAgKiBCdWlsZCBhIG5ldyBjb25maWcgZnJvbSBhIHNldCBvZiBJbml0IEVsZW1lbnRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FbGVtZW50cyguLi5lbGVtZW50czogSW5pdEVsZW1lbnRbXSk6IENsb3VkRm9ybWF0aW9uSW5pdCB7XG4gICAgcmV0dXJuIENsb3VkRm9ybWF0aW9uSW5pdC5mcm9tQ29uZmlnKG5ldyBJbml0Q29uZmlnKGVsZW1lbnRzKSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGFuIGV4aXN0aW5nIEluaXRDb25maWcgb2JqZWN0IGFzIHRoZSBkZWZhdWx0IGFuZCBvbmx5IGNvbmZpZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ29uZmlnKGNvbmZpZzogSW5pdENvbmZpZyk6IENsb3VkRm9ybWF0aW9uSW5pdCB7XG4gICAgcmV0dXJuIENsb3VkRm9ybWF0aW9uSW5pdC5mcm9tQ29uZmlnU2V0cyh7XG4gICAgICBjb25maWdTZXRzOiB7XG4gICAgICAgIGRlZmF1bHQ6IFsnY29uZmlnJ10sXG4gICAgICB9LFxuICAgICAgY29uZmlnczogeyBjb25maWcgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZCBhIENsb3VkRm9ybWF0aW9uSW5pdCBmcm9tIGNvbmZpZyBzZXRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Db25maWdTZXRzKHByb3BzOiBDb25maWdTZXRQcm9wcyk6IENsb3VkRm9ybWF0aW9uSW5pdCB7XG4gICAgcmV0dXJuIG5ldyBDbG91ZEZvcm1hdGlvbkluaXQocHJvcHMuY29uZmlnU2V0cywgcHJvcHMuY29uZmlncyk7XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IF9jb25maWdTZXRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7fTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY29uZmlnczogUmVjb3JkPHN0cmluZywgSW5pdENvbmZpZz4gPSB7fTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGNvbmZpZ1NldHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPiwgY29uZmlnczogUmVjb3JkPHN0cmluZywgSW5pdENvbmZpZz4pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuX2NvbmZpZ1NldHMsIGNvbmZpZ1NldHMpO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5fY29uZmlncywgY29uZmlncyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29uZmlnIHdpdGggdGhlIGdpdmVuIG5hbWUgdG8gdGhpcyBDbG91ZEZvcm1hdGlvbkluaXQgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgYWRkQ29uZmlnKGNvbmZpZ05hbWU6IHN0cmluZywgY29uZmlnOiBJbml0Q29uZmlnKSB7XG4gICAgaWYgKHRoaXMuX2NvbmZpZ3NbY29uZmlnTmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2xvdWRGb3JtYXRpb25Jbml0IGFscmVhZHkgY29udGFpbnMgYSBjb25maWcgbmFtZWQgJyR7Y29uZmlnTmFtZX0nYCk7XG4gICAgfVxuICAgIHRoaXMuX2NvbmZpZ3NbY29uZmlnTmFtZV0gPSBjb25maWc7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29uZmlnIHNldCB3aXRoIHRoZSBnaXZlbiBuYW1lIHRvIHRoaXMgQ2xvdWRGb3JtYXRpb25Jbml0IG9iamVjdFxuICAgKlxuICAgKiBUaGUgbmV3IGNvbmZpZ3NldCB3aWxsIHJlZmVyZW5jZSB0aGUgZ2l2ZW4gY29uZmlncyBpbiB0aGUgZ2l2ZW4gb3JkZXIuXG4gICAqL1xuICBwdWJsaWMgYWRkQ29uZmlnU2V0KGNvbmZpZ1NldE5hbWU6IHN0cmluZywgY29uZmlnTmFtZXM6IHN0cmluZ1tdID0gW10pIHtcbiAgICBpZiAodGhpcy5fY29uZmlnU2V0c1tjb25maWdTZXROYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDbG91ZEZvcm1hdGlvbkluaXQgYWxyZWFkeSBjb250YWlucyBhIGNvbmZpZ1NldCBuYW1lZCAnJHtjb25maWdTZXROYW1lfSdgKTtcbiAgICB9XG5cbiAgICBjb25zdCB1bmsgPSBjb25maWdOYW1lcy5maWx0ZXIoYyA9PiAhdGhpcy5fY29uZmlnc1tjXSk7XG4gICAgaWYgKHVuay5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gY29uZmlncyByZWZlcmVuY2VkIGluIGRlZmluaXRpb24gb2YgJyR7Y29uZmlnU2V0TmFtZX0nOiAke3Vua31gKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb25maWdTZXRzW2NvbmZpZ1NldE5hbWVdID0gWy4uLmNvbmZpZ05hbWVzXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggdGhlIENsb3VkRm9ybWF0aW9uIEluaXQgY29uZmlnIHRvIHRoZSBnaXZlbiByZXNvdXJjZVxuICAgKlxuICAgKiBBcyBhbiBhcHAgYnVpbGRlciwgdXNlIGBpbnN0YW5jZS5hcHBseUNsb3VkRm9ybWF0aW9uSW5pdCgpYCBvclxuICAgKiBgYXV0b1NjYWxpbmdHcm91cC5hcHBseUNsb3VkRm9ybWF0aW9uSW5pdCgpYCB0byB0cmlnZ2VyIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBkb2VzIHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIC0gUmVuZGVycyB0aGUgYEFXUzo6Q2xvdWRGb3JtYXRpb246OkluaXRgIG9iamVjdCB0byB0aGUgZ2l2ZW4gcmVzb3VyY2Unc1xuICAgKiAgIG1ldGFkYXRhLCBwb3RlbnRpYWxseSBhZGRpbmcgYSBgQVdTOjpDbG91ZEZvcm1hdGlvbjo6QXV0aGVudGljYXRpb25gIG9iamVjdFxuICAgKiAgIG5leHQgdG8gaXQgaWYgcmVxdWlyZWQuXG4gICAqIC0gVXBkYXRlcyB0aGUgaW5zdGFuY2Ugcm9sZSBwb2xpY3kgdG8gYmUgYWJsZSB0byBjYWxsIHRoZSBBUElzIHJlcXVpcmVkIGZvclxuICAgKiAgIGBjZm4taW5pdGAgYW5kIGBjZm4tc2lnbmFsYCB0byB3b3JrLCBhbmQgcG90ZW50aWFsbHkgYWRkIHBlcm1pc3Npb25zIHRvIGRvd25sb2FkXG4gICAqICAgcmVmZXJlbmNlZCBhc3NldCBhbmQgYnVja2V0IHJlc291cmNlcy5cbiAgICogLSBVcGRhdGVzIHRoZSBnaXZlbiBVc2VyRGF0YSB3aXRoIGNvbW1hbmRzIHRvIGV4ZWN1dGUgdGhlIGBjZm4taW5pdGAgc2NyaXB0LlxuICAgKi9cbiAgcHVibGljIGF0dGFjaChhdHRhY2hlZFJlc291cmNlOiBDZm5SZXNvdXJjZSwgYXR0YWNoT3B0aW9uczogQXR0YWNoSW5pdE9wdGlvbnMpIHtcbiAgICBpZiAoYXR0YWNoT3B0aW9ucy5wbGF0Zm9ybSA9PT0gT3BlcmF0aW5nU3lzdGVtVHlwZS5VTktOT1dOKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhdHRhY2ggQ2xvdWRGb3JtYXRpb25Jbml0IHRvIGFuIHVua25vd24gT1MgdHlwZScpO1xuICAgIH1cblxuICAgIGNvbnN0IENGTl9JTklUX01FVEFEQVRBX0tFWSA9ICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpJbml0JztcblxuICAgIGlmIChhdHRhY2hlZFJlc291cmNlLmdldE1ldGFkYXRhKENGTl9JTklUX01FVEFEQVRBX0tFWSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgYmluZCBDZm5Jbml0OiByZXNvdXJjZSAnJHthdHRhY2hlZFJlc291cmNlLm5vZGUucGF0aH0nIGFscmVhZHkgaGFzICcke0NGTl9JTklUX01FVEFEQVRBX0tFWX0nIGF0dGFjaGVkYCk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogVGhpcyB3aWxsIG5vdCByZWZsZWN0IG11dGF0aW9ucyBtYWRlIGFmdGVyIGF0dGFjaGluZy5cbiAgICBjb25zdCBiaW5kUmVzdWx0ID0gdGhpcy5iaW5kKGF0dGFjaGVkUmVzb3VyY2Uuc3RhY2ssIGF0dGFjaE9wdGlvbnMpO1xuICAgIGF0dGFjaGVkUmVzb3VyY2UuYWRkTWV0YWRhdGEoQ0ZOX0lOSVRfTUVUQURBVEFfS0VZLCBiaW5kUmVzdWx0LmNvbmZpZ0RhdGEpO1xuXG4gICAgLy8gTmVlZCB0byByZXNvbHZlIHRoZSB2YXJpb3VzIHRva2VucyBmcm9tIGFzc2V0cyBpbiB0aGUgY29uZmlnLFxuICAgIC8vIGFzIHdlbGwgYXMgaW5jbHVkZSBhbnkgYXNzZXQgaGFzaGVzIHByb3ZpZGVkIHNvIHRoZSBmaW5nZXJwcmludCBpcyBhY2N1cmF0ZS5cbiAgICBjb25zdCByZXNvbHZlZENvbmZpZyA9IGF0dGFjaGVkUmVzb3VyY2Uuc3RhY2sucmVzb2x2ZShiaW5kUmVzdWx0LmNvbmZpZ0RhdGEpO1xuICAgIGNvbnN0IGZpbmdlcnByaW50SW5wdXQgPSB7IGNvbmZpZzogcmVzb2x2ZWRDb25maWcsIGFzc2V0SGFzaDogYmluZFJlc3VsdC5hc3NldEhhc2ggfTtcbiAgICBjb25zdCBmaW5nZXJwcmludCA9IGNvbnRlbnRIYXNoKEpTT04uc3RyaW5naWZ5KGZpbmdlcnByaW50SW5wdXQpKS5zbGljZSgwLCAxNik7XG5cbiAgICBhdHRhY2hPcHRpb25zLmluc3RhbmNlUm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2Nsb3VkZm9ybWF0aW9uOkRlc2NyaWJlU3RhY2tSZXNvdXJjZScsICdjbG91ZGZvcm1hdGlvbjpTaWduYWxSZXNvdXJjZSddLFxuICAgICAgcmVzb3VyY2VzOiBbQXdzLlNUQUNLX0lEXSxcbiAgICB9KSk7XG5cbiAgICBpZiAoYmluZFJlc3VsdC5hdXRoRGF0YSkge1xuICAgICAgYXR0YWNoZWRSZXNvdXJjZS5hZGRNZXRhZGF0YSgnQVdTOjpDbG91ZEZvcm1hdGlvbjo6QXV0aGVudGljYXRpb24nLCBiaW5kUmVzdWx0LmF1dGhEYXRhKTtcbiAgICB9XG5cbiAgICAvLyBUbyBpZGVudGlmeSB0aGUgcmVzb3VyY2VzIHRoYXQgaGF2ZSB0aGUgbWV0YWRhdGEgYW5kIHdoZXJlIHRoZSBzaWduYWxcbiAgICAvLyBuZWVkcyB0byBiZSBzZW50LCB3ZSBuZWVkIHsgcmVnaW9uLCBzdGFja05hbWUsIGxvZ2ljYWxJZCB9XG4gICAgbGV0IHJlc291cmNlTG9jYXRvciA9IGAtLXJlZ2lvbiAke0F3cy5SRUdJT059IC0tc3RhY2sgJHtBd3MuU1RBQ0tfTkFNRX0gLS1yZXNvdXJjZSAke2F0dGFjaGVkUmVzb3VyY2UubG9naWNhbElkfWA7XG4gICAgY29uc3Qgc2lnbmFsUmVzb3VyY2UgPSBhdHRhY2hPcHRpb25zLnNpZ25hbFJlc291cmNlPy5sb2dpY2FsSWQgPz8gYXR0YWNoZWRSZXNvdXJjZS5sb2dpY2FsSWQ7XG4gICAgbGV0IG5vdGlmeVJlc291cmNlTG9jYXRvciA9IGAtLXJlZ2lvbiAke0F3cy5SRUdJT059IC0tc3RhY2sgJHtBd3MuU1RBQ0tfTkFNRX0gLS1yZXNvdXJjZSAke3NpZ25hbFJlc291cmNlfWA7XG5cbiAgICAvLyBJZiBzcGVjaWZpZWQgaW4gYXR0YWNoT3B0aW9ucywgaW5jbHVkZSBhcmd1bWVudHMgaW4gY2ZuLWluaXQvY2ZuLXNpZ25hbCBjb21tYW5kc1xuICAgIGlmIChhdHRhY2hPcHRpb25zLmluY2x1ZGVVcmwpIHtcbiAgICAgIHJlc291cmNlTG9jYXRvciA9IGAke3Jlc291cmNlTG9jYXRvcn0gLS11cmwgaHR0cHM6Ly9jbG91ZGZvcm1hdGlvbi4ke0F3cy5SRUdJT059LiR7QXdzLlVSTF9TVUZGSVh9YDtcbiAgICAgIG5vdGlmeVJlc291cmNlTG9jYXRvciA9IGAke25vdGlmeVJlc291cmNlTG9jYXRvcn0gLS11cmwgaHR0cHM6Ly9jbG91ZGZvcm1hdGlvbi4ke0F3cy5SRUdJT059LiR7QXdzLlVSTF9TVUZGSVh9YDtcbiAgICB9XG4gICAgaWYgKGF0dGFjaE9wdGlvbnMuaW5jbHVkZVJvbGUpIHtcbiAgICAgIHJlc291cmNlTG9jYXRvciA9IGAke3Jlc291cmNlTG9jYXRvcn0gLS1yb2xlICR7YXR0YWNoT3B0aW9ucy5pbnN0YW5jZVJvbGUucm9sZU5hbWV9YDtcbiAgICAgIG5vdGlmeVJlc291cmNlTG9jYXRvciA9IGAke25vdGlmeVJlc291cmNlTG9jYXRvcn0gLS1yb2xlICR7YXR0YWNoT3B0aW9ucy5pbnN0YW5jZVJvbGUucm9sZU5hbWV9YDtcbiAgICB9XG5cbiAgICBjb25zdCBjb25maWdTZXRzID0gKGF0dGFjaE9wdGlvbnMuY29uZmlnU2V0cyA/PyBbJ2RlZmF1bHQnXSkuam9pbignLCcpO1xuICAgIGNvbnN0IHByaW50TG9nID0gYXR0YWNoT3B0aW9ucy5wcmludExvZyA/PyB0cnVlO1xuXG4gICAgaWYgKGF0dGFjaE9wdGlvbnMuZW1iZWRGaW5nZXJwcmludCA/PyB0cnVlKSB7XG4gICAgICAvLyBJdCBqdXN0IHNvIGhhcHBlbnMgdGhhdCB0aGUgY29tbWVudCBjaGFyIGlzICcjJyBmb3IgYm90aCBiYXNoIGFuZCBQb3dlclNoZWxsXG4gICAgICBhdHRhY2hPcHRpb25zLnVzZXJEYXRhLmFkZENvbW1hbmRzKGAjIGZpbmdlcnByaW50OiAke2ZpbmdlcnByaW50fWApO1xuICAgIH1cblxuICAgIGlmIChhdHRhY2hPcHRpb25zLnBsYXRmb3JtID09PSBPcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MpIHtcbiAgICAgIGNvbnN0IGVyckNvZGUgPSBhdHRhY2hPcHRpb25zLmlnbm9yZUZhaWx1cmVzID8gJzAnIDogJyRMQVNURVhJVENPREUnO1xuICAgICAgYXR0YWNoT3B0aW9ucy51c2VyRGF0YS5hZGRDb21tYW5kcyhcbiAgICAgICAgLi4uW1xuICAgICAgICAgIGBjZm4taW5pdC5leGUgLXYgJHtyZXNvdXJjZUxvY2F0b3J9IC1jICR7Y29uZmlnU2V0c31gLFxuICAgICAgICAgIGBjZm4tc2lnbmFsLmV4ZSAtZSAke2VyckNvZGV9ICR7bm90aWZ5UmVzb3VyY2VMb2NhdG9yfWAsXG4gICAgICAgICAgLi4uKHByaW50TG9nID8gWyd0eXBlIEM6XFxcXGNmblxcXFxsb2dcXFxcY2ZuLWluaXQubG9nJ10gOiBbXSksXG4gICAgICAgIF0sXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBlcnJDb2RlID0gYXR0YWNoT3B0aW9ucy5pZ25vcmVGYWlsdXJlcyA/ICcwJyA6ICckPyc7XG4gICAgICBhdHRhY2hPcHRpb25zLnVzZXJEYXRhLmFkZENvbW1hbmRzKFxuICAgICAgICAuLi5bXG4gICAgICAgICAgLy8gUnVuIGEgc3Vic2hlbGwgd2l0aG91dCAnZXJyZXhpdCcsIHNvIHdlIGNhbiBzaWduYWwgdXNpbmcgdGhlIGV4aXQgY29kZSBvZiBjZm4taW5pdFxuICAgICAgICAgICcoJyxcbiAgICAgICAgICAnICBzZXQgK2UnLFxuICAgICAgICAgIGAgIC9vcHQvYXdzL2Jpbi9jZm4taW5pdCAtdiAke3Jlc291cmNlTG9jYXRvcn0gLWMgJHtjb25maWdTZXRzfWAsXG4gICAgICAgICAgYCAgL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLWUgJHtlcnJDb2RlfSAke25vdGlmeVJlc291cmNlTG9jYXRvcn1gLFxuICAgICAgICAgIC4uLihwcmludExvZyA/IFsnICBjYXQgL3Zhci9sb2cvY2ZuLWluaXQubG9nID4mMiddIDogW10pLFxuICAgICAgICAgICcpJyxcbiAgICAgICAgXSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIG9wdGlvbnM6IEF0dGFjaEluaXRPcHRpb25zKTogeyBjb25maWdEYXRhOiBhbnksIGF1dGhEYXRhOiBhbnksIGFzc2V0SGFzaD86IGFueSB9IHtcbiAgICBjb25zdCBub25FbXB0eUNvbmZpZ3MgPSBtYXBWYWx1ZXModGhpcy5fY29uZmlncywgYyA9PiBjLmlzRW1wdHkoKSA/IHVuZGVmaW5lZCA6IGMpO1xuXG4gICAgY29uc3QgY29uZmlnTmFtZVRvQmluZFJlc3VsdCA9IG1hcFZhbHVlcyhub25FbXB0eUNvbmZpZ3MsIGMgPT4gYy5fYmluZChzY29wZSwgb3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ0RhdGE6IHtcbiAgICAgICAgY29uZmlnU2V0czogbWFwVmFsdWVzKHRoaXMuX2NvbmZpZ1NldHMsIGNvbmZpZ05hbWVzID0+IGNvbmZpZ05hbWVzLmZpbHRlcihuYW1lID0+IG5vbkVtcHR5Q29uZmlnc1tuYW1lXSAhPT0gdW5kZWZpbmVkKSksXG4gICAgICAgIC4uLm1hcFZhbHVlcyhjb25maWdOYW1lVG9CaW5kUmVzdWx0LCBjID0+IGMuY29uZmlnKSxcbiAgICAgIH0sXG4gICAgICBhdXRoRGF0YTogT2JqZWN0LnZhbHVlcyhjb25maWdOYW1lVG9CaW5kUmVzdWx0KS5tYXAoYyA9PiBjLmF1dGhlbnRpY2F0aW9uKS5yZWR1Y2UoZGVlcE1lcmdlLCB1bmRlZmluZWQpLFxuICAgICAgYXNzZXRIYXNoOiBjb21iaW5lQXNzZXRIYXNoZXNPclVuZGVmaW5lZChPYmplY3QudmFsdWVzKGNvbmZpZ05hbWVUb0JpbmRSZXN1bHQpLm1hcChjID0+IGMuYXNzZXRIYXNoKSksXG4gICAgfTtcbiAgfVxuXG59XG5cbi8qKlxuICogQSBjb2xsZWN0aW9uIG9mIGNvbmZpZ3VyYXRpb24gZWxlbWVudHNcbiAqL1xuZXhwb3J0IGNsYXNzIEluaXRDb25maWcge1xuICBwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnRzID0gbmV3IEFycmF5PEluaXRFbGVtZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzOiBJbml0RWxlbWVudFtdKSB7XG4gICAgdGhpcy5hZGQoLi4uZWxlbWVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhpcyBjb25maWdzZXQgaGFzIGVsZW1lbnRzIG9yIG5vdFxuICAgKi9cbiAgcHVibGljIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHMubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvbmUgb3IgbW9yZSBlbGVtZW50cyB0byB0aGUgY29uZmlnXG4gICAqL1xuICBwdWJsaWMgYWRkKC4uLmVsZW1lbnRzOiBJbml0RWxlbWVudFtdKSB7XG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKC4uLmVsZW1lbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY29uZmlnIGlzIGFwcGxpZWQgdG8gYW4gaW5zdGFuY2UuXG4gICAqIENyZWF0ZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBJbml0IGNvbmZpZyBhbmQgaGFuZGxlcyBhbnkgcGVybWlzc2lvbnMgYW5kIGFzc2V0cy5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2JpbmQoc2NvcGU6IENvbnN0cnVjdCwgb3B0aW9uczogQXR0YWNoSW5pdE9wdGlvbnMpOiBJbml0RWxlbWVudENvbmZpZyB7XG4gICAgY29uc3QgYmluZE9wdGlvbnMgPSB7XG4gICAgICBpbnN0YW5jZVJvbGU6IG9wdGlvbnMuaW5zdGFuY2VSb2xlLFxuICAgICAgcGxhdGZvcm06IHRoaXMuaW5pdFBsYXRmb3JtRnJvbU9TVHlwZShvcHRpb25zLnBsYXRmb3JtKSxcbiAgICAgIHNjb3BlLFxuICAgIH07XG5cbiAgICBjb25zdCBwYWNrYWdlQ29uZmlnID0gdGhpcy5iaW5kRm9yVHlwZShJbml0RWxlbWVudFR5cGUuUEFDS0FHRSwgYmluZE9wdGlvbnMpO1xuICAgIGNvbnN0IGdyb3Vwc0NvbmZpZyA9IHRoaXMuYmluZEZvclR5cGUoSW5pdEVsZW1lbnRUeXBlLkdST1VQLCBiaW5kT3B0aW9ucyk7XG4gICAgY29uc3QgdXNlcnNDb25maWcgPSB0aGlzLmJpbmRGb3JUeXBlKEluaXRFbGVtZW50VHlwZS5VU0VSLCBiaW5kT3B0aW9ucyk7XG4gICAgY29uc3Qgc291cmNlc0NvbmZpZyA9IHRoaXMuYmluZEZvclR5cGUoSW5pdEVsZW1lbnRUeXBlLlNPVVJDRSwgYmluZE9wdGlvbnMpO1xuICAgIGNvbnN0IGZpbGVzQ29uZmlnID0gdGhpcy5iaW5kRm9yVHlwZShJbml0RWxlbWVudFR5cGUuRklMRSwgYmluZE9wdGlvbnMpO1xuICAgIGNvbnN0IGNvbW1hbmRzQ29uZmlnID0gdGhpcy5iaW5kRm9yVHlwZShJbml0RWxlbWVudFR5cGUuQ09NTUFORCwgYmluZE9wdGlvbnMpO1xuICAgIC8vIE11c3QgYmUgbGFzdCFcbiAgICBjb25zdCBzZXJ2aWNlc0NvbmZpZyA9IHRoaXMuYmluZEZvclR5cGUoSW5pdEVsZW1lbnRUeXBlLlNFUlZJQ0UsIGJpbmRPcHRpb25zKTtcblxuICAgIGNvbnN0IGFsbENvbmZpZyA9IFtwYWNrYWdlQ29uZmlnLCBncm91cHNDb25maWcsIHVzZXJzQ29uZmlnLCBzb3VyY2VzQ29uZmlnLCBmaWxlc0NvbmZpZywgY29tbWFuZHNDb25maWcsIHNlcnZpY2VzQ29uZmlnXTtcbiAgICBjb25zdCBhdXRoZW50aWNhdGlvbiA9IGFsbENvbmZpZy5tYXAoYyA9PiBjPy5hdXRoZW50aWNhdGlvbikucmVkdWNlKGRlZXBNZXJnZSwgdW5kZWZpbmVkKTtcbiAgICBjb25zdCBhc3NldEhhc2ggPSBjb21iaW5lQXNzZXRIYXNoZXNPclVuZGVmaW5lZChhbGxDb25maWcubWFwKGMgPT4gYz8uYXNzZXRIYXNoKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIHBhY2thZ2VzOiBwYWNrYWdlQ29uZmlnPy5jb25maWcsXG4gICAgICAgIGdyb3VwczogZ3JvdXBzQ29uZmlnPy5jb25maWcsXG4gICAgICAgIHVzZXJzOiB1c2Vyc0NvbmZpZz8uY29uZmlnLFxuICAgICAgICBzb3VyY2VzOiBzb3VyY2VzQ29uZmlnPy5jb25maWcsXG4gICAgICAgIGZpbGVzOiBmaWxlc0NvbmZpZz8uY29uZmlnLFxuICAgICAgICBjb21tYW5kczogY29tbWFuZHNDb25maWc/LmNvbmZpZyxcbiAgICAgICAgc2VydmljZXM6IHNlcnZpY2VzQ29uZmlnPy5jb25maWcsXG4gICAgICB9LFxuICAgICAgYXV0aGVudGljYXRpb24sXG4gICAgICBhc3NldEhhc2gsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYmluZEZvclR5cGUoZWxlbWVudFR5cGU6IEluaXRFbGVtZW50VHlwZSwgcmVuZGVyT3B0aW9uczogT21pdDxJbml0QmluZE9wdGlvbnMsICdpbmRleCc+KTogSW5pdEVsZW1lbnRDb25maWcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5lbGVtZW50cy5maWx0ZXIoZWxlbSA9PiBlbGVtLmVsZW1lbnRUeXBlID09PSBlbGVtZW50VHlwZSk7XG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICBjb25zdCBiaW5kUmVzdWx0cyA9IGVsZW1lbnRzLm1hcCgoZSwgaW5kZXgpID0+IGUuX2JpbmQoeyBpbmRleCwgLi4ucmVuZGVyT3B0aW9ucyB9KSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiBiaW5kUmVzdWx0cy5tYXAociA9PiByLmNvbmZpZykucmVkdWNlKGRlZXBNZXJnZSwgdW5kZWZpbmVkKSA/PyB7fSxcbiAgICAgIGF1dGhlbnRpY2F0aW9uOiBiaW5kUmVzdWx0cy5tYXAociA9PiByLmF1dGhlbnRpY2F0aW9uKS5yZWR1Y2UoZGVlcE1lcmdlLCB1bmRlZmluZWQpLFxuICAgICAgYXNzZXRIYXNoOiBjb21iaW5lQXNzZXRIYXNoZXNPclVuZGVmaW5lZChiaW5kUmVzdWx0cy5tYXAociA9PiByLmFzc2V0SGFzaCkpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGluaXRQbGF0Zm9ybUZyb21PU1R5cGUob3NUeXBlOiBPcGVyYXRpbmdTeXN0ZW1UeXBlKTogSW5pdFBsYXRmb3JtIHtcbiAgICBzd2l0Y2ggKG9zVHlwZSkge1xuICAgICAgY2FzZSBPcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYOiB7XG4gICAgICAgIHJldHVybiBJbml0UGxhdGZvcm0uTElOVVg7XG4gICAgICB9XG4gICAgICBjYXNlIE9wZXJhdGluZ1N5c3RlbVR5cGUuV0lORE9XUzoge1xuICAgICAgICByZXR1cm4gSW5pdFBsYXRmb3JtLldJTkRPV1M7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGF0dGFjaCBDbG91ZEZvcm1hdGlvbkluaXQgdG8gYW4gdW5rbm93biBPUyB0eXBlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgQ2xvdWRGb3JtYXRpb25Jbml0LndpdGhDb25maWdTZXRzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnU2V0UHJvcHMge1xuICAvKipcbiAgICogVGhlIGRlZmluaXRpb25zIG9mIGVhY2ggY29uZmlnIHNldFxuICAgKi9cbiAgcmVhZG9ubHkgY29uZmlnU2V0czogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuXG4gIC8qKlxuICAgKiBUaGUgc2V0cyBvZiBjb25maWdzIHRvIHBpY2sgZnJvbVxuICAgKi9cbiAgcmVhZG9ubHkgY29uZmlnczogUmVjb3JkPHN0cmluZywgSW5pdENvbmZpZz47XG59XG5cbi8qKlxuICogRGVlcC1tZXJnZSBvYmplY3RzIGFuZCBhcnJheXNcbiAqXG4gKiBUcmVhdCBhcnJheXMgYXMgc2V0cywgcmVtb3ZpbmcgZHVwbGljYXRlcy4gVGhpcyBpcyBhY2NlcHRhYmxlIGZvciByZW5kZXJpbmdcbiAqIGNmbi1pbml0cywgbm90IGFwcGxpY2FibGUgZWxzZXdoZXJlLlxuICovXG5mdW5jdGlvbiBkZWVwTWVyZ2UodGFyZ2V0PzogUmVjb3JkPHN0cmluZywgYW55Piwgc3JjPzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICBpZiAodGFyZ2V0ID09IG51bGwpIHsgcmV0dXJuIHNyYzsgfVxuICBpZiAoc3JjID09IG51bGwpIHsgcmV0dXJuIHRhcmdldDsgfVxuXG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHNyYykpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGlmICh0YXJnZXRba2V5XSAmJiAhQXJyYXkuaXNBcnJheSh0YXJnZXRba2V5XSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcnlpbmcgdG8gbWVyZ2UgYXJyYXkgWyR7dmFsdWV9XSBpbnRvIGEgbm9uLWFycmF5ICcke3RhcmdldFtrZXldfSdgKTtcbiAgICAgIH1cbiAgICAgIHRhcmdldFtrZXldID0gQXJyYXkuZnJvbShuZXcgU2V0KFtcbiAgICAgICAgLi4udGFyZ2V0W2tleV0gPz8gW10sXG4gICAgICAgIC4uLnZhbHVlLFxuICAgICAgXSkpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IGRlZXBNZXJnZSh0YXJnZXRba2V5XSA/PyB7fSwgdmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogTWFwIGEgZnVuY3Rpb24gb3ZlciB2YWx1ZXMgb2YgYW4gb2JqZWN0XG4gKlxuICogSWYgdGhlIG1hcHBpbmcgZnVuY3Rpb24gcmV0dXJucyB1bmRlZmluZWQsIHJlbW92ZSB0aGUga2V5XG4gKi9cbmZ1bmN0aW9uIG1hcFZhbHVlczxBLCBCPih4czogUmVjb3JkPHN0cmluZywgQT4sIGZuOiAoeDogQSkgPT4gQiB8IHVuZGVmaW5lZCk6IFJlY29yZDxzdHJpbmcsIEI+IHtcbiAgY29uc3QgcmV0OiBSZWNvcmQ8c3RyaW5nLCBCPiA9IHt9O1xuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyh4cykpIHtcbiAgICBjb25zdCBtYXBwZWQgPSBmbih2KTtcbiAgICBpZiAobWFwcGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldFtrXSA9IG1hcHBlZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLy8gQ29tYmluZXMgYWxsIGlucHV0IGFzc2V0IGhhc2hlcyBpbnRvIG9uZSwgb3IgaWYgbm8gaGFzaGVzIGFyZSBwcmVzZW50LCByZXR1cm5zIHVuZGVmaW5lZC5cbmZ1bmN0aW9uIGNvbWJpbmVBc3NldEhhc2hlc09yVW5kZWZpbmVkKGhhc2hlczogKHN0cmluZyB8IHVuZGVmaW5lZClbXSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGhhc2hBcnJheSA9IGhhc2hlcy5maWx0ZXIoKHgpOiB4IGlzIHN0cmluZyA9PiB4ICE9PSB1bmRlZmluZWQpO1xuICByZXR1cm4gaGFzaEFycmF5Lmxlbmd0aCA+IDAgPyBoYXNoQXJyYXkuam9pbignJykgOiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGNvbnRlbnRIYXNoKGNvbnRlbnQ6IHN0cmluZykge1xuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShjb250ZW50KS5kaWdlc3QoJ2hleCcpO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGF0dGFjaGluZyBhIENsb3VkRm9ybWF0aW9uSW5pdCB0byBhIHJlc291cmNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXR0YWNoSW5pdE9wdGlvbnMge1xuICAvKipcbiAgICogSW5zdGFuY2Ugcm9sZSBvZiB0aGUgY29uc3VtaW5nIGluc3RhbmNlIG9yIGZsZWV0XG4gICAqL1xuICByZWFkb25seSBpbnN0YW5jZVJvbGU6IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogSW5jbHVkZSAtLXVybCBhcmd1bWVudCB3aGVuIHJ1bm5pbmcgY2ZuLWluaXQgYW5kIGNmbi1zaWduYWwgY29tbWFuZHNcbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIHRoZSBjbG91ZGZvcm1hdGlvbiBlbmRwb2ludCBpbiB0aGUgZGVwbG95ZWQgcmVnaW9uXG4gICAqIGUuZy4gaHR0cHM6Ly9jbG91ZGZvcm1hdGlvbi51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZVVybD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluY2x1ZGUgLS1yb2xlIGFyZ3VtZW50IHdoZW4gcnVubmluZyBjZm4taW5pdCBhbmQgY2ZuLXNpZ25hbCBjb21tYW5kc1xuICAgKlxuICAgKiBUaGlzIHdpbGwgYmUgdGhlIElBTSBpbnN0YW5jZSBwcm9maWxlIGF0dGFjaGVkIHRvIHRoZSBFQzIgaW5zdGFuY2VcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGluY2x1ZGVSb2xlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogT1MgUGxhdGZvcm0gdGhlIGluaXQgY29uZmlnIHdpbGwgYmUgdXNlZCBmb3JcbiAgICovXG4gIHJlYWRvbmx5IHBsYXRmb3JtOiBPcGVyYXRpbmdTeXN0ZW1UeXBlO1xuXG4gIC8qKlxuICAgKiBVc2VyRGF0YSB0byBhZGQgY29tbWFuZHMgdG9cbiAgICovXG4gIHJlYWRvbmx5IHVzZXJEYXRhOiBVc2VyRGF0YTtcblxuICAvKipcbiAgICogQ29uZmlnU2V0IHRvIGFjdGl2YXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IFsnZGVmYXVsdCddXG4gICAqL1xuICByZWFkb25seSBjb25maWdTZXRzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW1iZWQgYSBoYXNoIGludG8gdGhlIHVzZXJEYXRhXG4gICAqXG4gICAqIElmIGB0cnVlYCAodGhlIGRlZmF1bHQpLCBhIGhhc2ggb2YgdGhlIGNvbmZpZyB3aWxsIGJlIGVtYmVkZGVkIGludG8gdGhlXG4gICAqIFVzZXJEYXRhLCBzbyB0aGF0IGlmIHRoZSBjb25maWcgY2hhbmdlcywgdGhlIFVzZXJEYXRhIGNoYW5nZXMgYW5kXG4gICAqIHRoZSBpbnN0YW5jZSB3aWxsIGJlIHJlcGxhY2VkLlxuICAgKlxuICAgKiBJZiBgZmFsc2VgLCBubyBzdWNoIGhhc2ggd2lsbCBiZSBlbWJlZGRlZCwgYW5kIGlmIHRoZSBDbG91ZEZvcm1hdGlvbiBJbml0XG4gICAqIGNvbmZpZyBjaGFuZ2VzIG5vdGhpbmcgd2lsbCBoYXBwZW4gdG8gdGhlIHJ1bm5pbmcgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGVtYmVkRmluZ2VycHJpbnQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBQcmludCB0aGUgcmVzdWx0cyBvZiBydW5uaW5nIGNmbi1pbml0IHRvIHRoZSBJbnN0YW5jZSBTeXN0ZW0gTG9nXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBvdXRwdXQgb2YgcnVubmluZyBjZm4taW5pdCBpcyB3cml0dGVuIHRvIGEgbG9nIGZpbGVcbiAgICogb24gdGhlIGluc3RhbmNlLiBTZXQgdGhpcyB0byBgdHJ1ZWAgdG8gcHJpbnQgaXQgdG8gdGhlIFN5c3RlbSBMb2dcbiAgICogKHZpc2libGUgZnJvbSB0aGUgRUMyIENvbnNvbGUpLCBgZmFsc2VgIHRvIG5vdCBwcmludCBpdC5cbiAgICpcbiAgICogKEJlIGF3YXJlIHRoYXQgdGhlIHN5c3RlbSBsb2cgaXMgcmVmcmVzaGVkIGF0IGNlcnRhaW4gcG9pbnRzIGluXG4gICAqIHRpbWUgb2YgdGhlIGluc3RhbmNlIGxpZmUgY3ljbGUsIGFuZCBzdWNjZXNzZnVsIGV4ZWN1dGlvbiBtYXlcbiAgICogbm90IGFsd2F5cyBzaG93IHVwKS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJpbnRMb2c/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBEb24ndCBmYWlsIHRoZSBpbnN0YW5jZSBjcmVhdGlvbiB3aGVuIGNmbi1pbml0IGZhaWxzXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIHRoaXMgdG8gcHJldmVudCBDbG91ZEZvcm1hdGlvbiBmcm9tIHJvbGxpbmcgYmFjayB3aGVuXG4gICAqIGluc3RhbmNlcyBmYWlsIHRvIHN0YXJ0IHVwLCB0byBoZWxwIGluIGRlYnVnZ2luZy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGlnbm9yZUZhaWx1cmVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hlbiBwcm92aWRlZCwgc2lnbmFscyB0aGlzIHJlc291cmNlIGluc3RlYWQgb2YgdGhlIGF0dGFjaGVkIHJlc291cmNlXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIHRoaXMgdG8gc3VwcG9ydCBzaWduYWxpbmcgTGF1bmNoVGVtcGxhdGUgd2hpbGUgYXR0YWNoaW5nIEF1dG9TY2FsaW5nR3JvdXBcbiAgICpcbiAgICogQGRlZmF1bHQgLSBpZiB0aGlzIHByb3BlcnR5IGlzIHVuZGVmaW5lZCBjZm4tc2lnbmFsIHNpZ25hbHMgdGhlIGF0dGFjaGVkIHJlc291cmNlXG4gICAqL1xuICByZWFkb25seSBzaWduYWxSZXNvdXJjZT86IENmblJlc291cmNlO1xufVxuIl19