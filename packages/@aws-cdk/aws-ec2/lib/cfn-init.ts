import * as iam from '@aws-cdk/aws-iam';
import { Aws, CfnResource, Construct } from '@aws-cdk/core';
import * as crypto from 'crypto';
import { InitBindOptions, InitElement, InitElementType, InitPlatform, InitElementConfig } from './cfn-init-elements';
import { UserData } from './user-data';

/**
 * A CloudFormation-init configuration
 */
export class CloudFormationInit {
  /**
   * Build a new config from a set of Init Elements
   */
  public static fromElements(...elements: InitElement[]): CloudFormationInit {
    return CloudFormationInit.fromConfig(new InitConfig(elements));
  }

  /**
   * Use an existing InitConfig object as the default and only config
   */
  public static fromConfig(config: InitConfig): CloudFormationInit {
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
  public static fromConfigSets(props: ConfigSetProps): CloudFormationInit {
    return new CloudFormationInit(props.configSets, props.configs);
  }

  private readonly _configSets: Record<string, string[]> = {};
  private readonly _configs: Record<string, InitConfig> = {};

  protected constructor(configSets: Record<string, string[]>, configs: Record<string, InitConfig>) {
    Object.assign(this._configSets, configSets);
    Object.assign(this._configs, configs);
  }

  /**
   * Add a config with the given name to this CloudFormationInit object
   */
  public addConfig(configName: string, config: InitConfig) {
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
  public addConfigSet(configSetName: string, configNames: string[] = []) {
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
   * This returns an `AttachedCloudFormationInit` object, which can be used to apply
   * the init to one or more instances and/or autoscaling groups. Applying the
   * `AttachedCloudFormationInit` does NOT increase the ResourceSignalCount for
   * the attached resource, you have to do that separately.
   *
   * You only need to use this API if want to reuse the same init config for
   * multiple resources. If not, `instance.applyCloudFormationInit()` or
   * `autoScalingGroup.applyCloudFormationInit()` achieve the same result in a
   * simpler way.
   */
  public attach(attachedResource: CfnResource, attachOptions: AttachInitOptions) {
    // Note: This will not reflect mutations made after attaching.
    const bindResult = this.bind(attachedResource.stack, attachOptions);
    attachedResource.addMetadata('AWS::CloudFormation::Init', bindResult.configData);
    const fingerprint = contentHash(JSON.stringify(bindResult.configData)).substr(0, 16);

    attachOptions.instanceRole.addToPolicy(new iam.PolicyStatement({
      actions: ['cloudformation:DescribeStackResource', 'cloudformation:SignalResource'],
      resources: [Aws.STACK_ID],
    }));

    if (bindResult.authBucketNames && bindResult.authBucketNames.length > 0) {
      const s3AuthConfig = {
        S3AccessCreds: {
          type: 'S3',
          roleName: attachOptions.instanceRole.roleName,
          buckets: bindResult.authBucketNames,
        },
      }
      attachedResource.addMetadata('AWS::CloudFormation::Authentication', s3AuthConfig);
    }

    // To identify the resources that have the metadata and where the signal
    // needs to be sent, we need { region, stackName, logicalId }
    const resourceLocator = `--region ${Aws.REGION} --stack ${Aws.STACK_NAME} --resource ${attachedResource.logicalId}`;
    const configSets = (attachOptions.configSets ?? ['default']).join(',');

    if (attachOptions.embedFingerprint ?? true) {
      // It just so happens that the comment char is '#' for both bash and PowerShell
      attachOptions.userData.addCommands(`# fingerprint: ${fingerprint}`);
    }

    const printLog = attachOptions.printLog ?? true;

    if (attachOptions.platform === InitPlatform.WINDOWS) {
      const errCode = attachOptions.ignoreFailures ? '0' : '%ERRORLEVEL%';
      attachOptions.userData.addCommands(...[
        `cfn-init.exe -v ${resourceLocator} -c ${configSets}`,
        `cfn-signal.exe -e ${errCode} ${resourceLocator}`,
        ...printLog ? ['type C:\\cfn\\log\\cfn-init.log'] : [],
      ]);
    } else {
      const errCode = attachOptions.ignoreFailures ? '0' : '$?';
      attachOptions.userData.addCommands(...[
        // Run a subshell without 'errexit', so we can signal using the exit code of cfn-init
        '(',
        '  set +e',
        `  /opt/aws/bin/cfn-init -v ${resourceLocator} -c ${configSets}`,
        `  /opt/aws/bin/cfn-signal -e ${errCode} ${resourceLocator}`,
        ...printLog ? ['  cat /var/log/cfn-init.log >&2'] : [],
        ')',
      ]);
    }
  }

  private bind(scope: Construct, options: AttachInitOptions): any {
    const nonEmptyConfigs = mapValues(this._configs, c => c.isEmpty ? undefined : c);

    const configNameToBindResult = mapValues(nonEmptyConfigs, c => c.bind(scope, options));
    const authBucketNames = Object.values(configNameToBindResult)
      .map(c => c.authBucketNames)
      .reduce((allBuckets, buckets) => (buckets && buckets.length > 0) ? allBuckets?.concat(buckets) : allBuckets, []);

    return {
      configData: {
        configSets: mapValues(this._configSets, configNames => configNames.filter(name => nonEmptyConfigs[name] !== undefined)),
        ...mapValues(configNameToBindResult, c => c.config),
      },
      authBucketNames,
    };
  }

}

/**
 * Options for attach a CloudFormationInit to a resource
 */
export interface AttachInitOptions {
  /**
   * Instance role of the consuming instance or fleet
   */
  readonly instanceRole: iam.IRole;

  /**
   * Platform to render for
   */
  readonly platform: InitPlatform;

  /**
   * UserData to add commands to
   */
  readonly userData: UserData;

  /**
   * ConfigSet to activate
   *
   * @default ['default']
   */
  readonly configSets?: string[];

  /**
   * Whether to embed a hash into the userData
   *
   * If `true` (the default), a hash of the config will be embedded into the
   * UserData, so that if the config changes, the UserData changes and
   * the instance will be replaced.
   *
   * If `false`, no such hash will be embedded, and if the CloudFormation Init
   * config changes nothing will happen to the running instance.
   *
   * @default true
   */
  readonly embedFingerprint?: boolean;

  /**
   * Print the results of running cfn-init to the Instance System Log
   *
   * By default, the output of running cfn-init is written to a log file
   * on the instance. Set this to `true` to print it to the System Log
   * (visible from the EC2 Console), `false` to not print it.
   *
   * @default true
   */
  readonly printLog?: boolean;

  /**
   * Don't fail the instance creation when cfn-init fails
   *
   * You can use this to prevent CloudFormation from rolling back when
   * instances fail to start up, to help in debugging.
   *
   * @default false
   */
  readonly ignoreFailures?: boolean;
}

/**
 * A collection of configuration elements
 */
export class InitConfig {
  private readonly elements = new Array<InitElement>();

  constructor(elements: InitElement[]) {
    this.add(...elements);
  }

  /**
   * Whether this configset has elements or not
   */
  public get isEmpty() {
    return this.elements.length === 0;
  }

  /**
   * Add one or more elements to the config
   */
  public add(...elements: InitElement[]) {
    this.elements.push(...elements);
  }

  /**
   * Called when the config is applied to an instance.
   * Creates the CloudFormation representation of the Init config and handles any permissions and assets.
   */
  public bind(scope: Construct, options: AttachInitOptions): InitElementConfig {
    const bindOptions = {
      instanceRole: options.instanceRole,
      platform: options.platform,
      scope,
    };

    const packageConfig = this.bindForType(InitElementType.PACKAGE, bindOptions);
    const groupsConfig = this.bindForType(InitElementType.GROUP, bindOptions);
    const usersConfig = this.bindForType(InitElementType.USER, bindOptions);
    const sourcesConfig = this.bindForType(InitElementType.SOURCE, bindOptions);
    const filesConfig = this.bindForType(InitElementType.FILE, bindOptions);
    const commandsConfig = this.bindForType(InitElementType.COMMAND, bindOptions);
    // Must be last!
    const servicesConfig = this.bindForType(InitElementType.SERVICE, bindOptions);

    const authBucketNames = [ packageConfig, groupsConfig, usersConfig, sourcesConfig, filesConfig, commandsConfig, servicesConfig ]
      .map(c => c?.authBucketNames)
      .reduce((allBuckets, buckets) => (buckets && buckets.length > 0) ? allBuckets?.concat(buckets) : allBuckets, []);

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
      authBucketNames,
    };
  }

  private bindForType(elementType: InitElementType, renderOptions: Omit<InitBindOptions, 'index'>): InitElementConfig | undefined {
    const elements = this.elements.filter(elem => elem.elementType === elementType);
    if (elements.length === 0) { return undefined; }

    const aggregatedConfig: Record<string, any> = {};
    let authBucketNames: string[] = [];
    elements.forEach((elem, index) => {
      const elementConfig = elem.bind({ index, ...renderOptions });
      deepMerge(aggregatedConfig, elementConfig.config);
      if (elementConfig.authBucketNames) {
        authBucketNames = authBucketNames.concat(elementConfig.authBucketNames);
      }
    });

    return {
      config: aggregatedConfig,
      authBucketNames,
    };
  }
}

/**
 * Options for CloudFormationInit.withConfigSets
 */
export interface ConfigSetProps {
  /**
   * The definitions of each config set
   */
  readonly configSets: Record<string, string[]>;

  /**
   * The sets of configs to pick from
   */
  readonly configs: Record<string, InitConfig>;
}

function deepMerge(target: Record<string, any>, src: Record<string, any>) {
  for (const [key, value] of Object.entries(src)) {
    if (typeof value === 'object' && value && !Array.isArray(value)) {
      target[key] = {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

/**
 * Map a function over values of an object
 *
 * If the mapping function returns undefined, remove the key
 */
function mapValues<A, B>(xs: Record<string, A>, fn: (x: A) => B | undefined): Record<string, B> {
  const ret: Record<string, B> = {};
  for (const [k, v] of Object.entries(xs)) {
    const mapped = fn(v);
    if (mapped !== undefined) {
      ret[k] = mapped;
    }
  }
  return ret;
}

function contentHash(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex');
}