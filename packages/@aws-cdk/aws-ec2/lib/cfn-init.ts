import * as iam from '@aws-cdk/aws-iam';
import { Aws, CfnResource, Construct } from '@aws-cdk/core';
import * as crypto from 'crypto';
import { InitBindOptions, InitElement, InitElementType, InitRenderOptions, InitRenderPlatform } from './cfn-init-elements';
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
  public attach(definingResource: CfnResource, attachOptions: AttachInitOptions): AttachedCloudFormationInit {
    // Note: This this eagerly renders and will not reflect mutations made after attaching.
    const configData = this.renderInit(definingResource.stack, attachOptions.platform);
    definingResource.addMetadata('AWS::CloudFormation::Init', configData);
    const fingerprint = contentHash(JSON.stringify(configData)).substr(0, 16);

    const self = this;

    // Anonymous subclass of an abstract class because I don't want users to be able to
    // instantiate this. It is a type that represents an action you took.
    return new class extends AttachedCloudFormationInit {
      public apply(consumingResource: CfnResource, useOptions: ApplyInitOptions): void {
        const authData = self.bind({ instanceRole: useOptions.instanceRole });
        consumingResource.addMetadata('AWS::CloudFormation::Authentication', authData);
        useOptions.instanceRole.addToPolicy(new iam.PolicyStatement({
          actions: ['cloudformation:DescribeStackResource', 'cloudformation:SignalResource'],
          resources: [Aws.STACK_ID],
        }));

        // To identify the resources that (a) have the metadata and (b) where the signal needs to be sent
        // (may be different), we need { region, stackName, logicalId }
        const initLocator = `--region ${Aws.REGION} --stack ${Aws.STACK_NAME} --resource ${definingResource.logicalId}`;
        const signalLocator = `--region ${Aws.REGION} --stack ${Aws.STACK_NAME} --resource ${consumingResource.logicalId}`;
        const configSets = (useOptions.configSets ?? ['default']).join(',');

        if (useOptions.embedFingerprint ?? true) {
          // It just so happens that the comment char is '#' for both bash and PowerShell
          useOptions.userData.addCommands(`# fingerprint: ${fingerprint}`);
        }

        const printLog = useOptions.printLog ?? true;

        if (attachOptions.platform === InitRenderPlatform.WINDOWS) {
          const errCode = useOptions.ignoreFailures ? '0' : '%ERRORLEVEL%';
          useOptions.userData.addCommands(...[
            `cfn-init.exe -v ${initLocator} -c ${configSets}`,
            `cfn-signal.exe -e ${errCode} ${signalLocator}`,
            ...printLog ? ['type C:\\cfn\\log\\cfn-init.log'] : [],
          ]);
        } else {
          const errCode = useOptions.ignoreFailures ? '0' : '$?';
          useOptions.userData.addCommands(...[
            // Run a subshell without 'errexit', so we can signal using the exit code of cfn-init
            '(',
            '  set +e',
            `  /opt/aws/bin/cfn-init -v ${initLocator} -c ${configSets}`,
            `  /opt/aws/bin/cfn-signal -e ${errCode} ${signalLocator}`,
            ...printLog ? ['  cat /var/log/cfn-init.log >&2'] : [],
            ')',
          ]);
        }
      }
    }();
  }

  private bind(options: InitBindOptions): Record<string, any> {
    // for (const config of Object.values(this._configs)) {
    //   config.bind(options);
    // }

    const ret: Record<string, any> = {};
    Object.values(this._configs).forEach(c => {
      const configAuthData = c.bind(options);
      Object.assign(ret, configAuthData);
    });
    return ret;

    //return Object.values(this._configs).map(c => c.bind(options)).filter(auth => auth);
  }

  private renderInit(scope: Construct, platform: InitRenderPlatform): any {
    const nonEmptyConfigs = mapValues(this._configs, c => c.isEmpty ? undefined : c);

    return {
      configSets: mapValues(this._configSets, configNames => configNames.filter(name => nonEmptyConfigs[name] !== undefined)),
      ...mapValues(nonEmptyConfigs, c => c.renderConfig(scope, platform)),
    };
  }

  // private renderAuth(options: InitBindOptions): any {
  //   const nonEmptyConfigs = mapValues(this._configs, c => c.isEmpty ? undefined : c);

  //   return {
  //     ...mapValues(nonEmptyConfigs, c => c.renderAuth()),
  //   };
  // }
}

/**
 * A CloudFormationInit object that has been attached to a Resource
 *
 * Can be applied to an instance, role and UserData.
 */
export abstract class AttachedCloudFormationInit {
  /**
   * Apply the config to a resource
   */
  public abstract apply(resource: CfnResource, options: ApplyInitOptions): void;
}

/**
 * Options for attach a CloudFormationInit to a resource
 */
export interface AttachInitOptions {
  /**
   * Platform to render for
   */
  readonly platform: InitRenderPlatform;
}

/**
 * Options for applying a CloudFormationInit to an arbitrary resource
 */
export interface ApplyInitOptions {
  /**
   * Instance role of the consuming instance or fleet
   */
  readonly instanceRole: iam.IRole;

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
   * Called when the config is applied to an instance
   */
  public bind(options: InitBindOptions): Record<string, any> {
    const ret: Record<string, any> = {};
    this.elements.forEach(elem => {
      const authData = elem.bind(options);
      Object.assign(ret, authData);
    });
    return ret;
    // for (const element of this.elements) {
    //   element.bind(options);
    // }
  }

  /**
   * Render the config
   */
  public renderConfig(scope: Construct, platform: InitRenderPlatform): any {
    const renderOptions = { scope, platform };

    return {
      packages: this.renderConfigForType(InitElementType.PACKAGE, renderOptions),
      groups: this.renderConfigForType(InitElementType.GROUP, renderOptions),
      users: this.renderConfigForType(InitElementType.USER, renderOptions),
      sources: this.renderConfigForType(InitElementType.SOURCE, renderOptions),
      files: this.renderConfigForType(InitElementType.FILE, renderOptions),
      commands: this.renderConfigForType(InitElementType.COMMAND, renderOptions),
      // Must be last!
      services: this.renderConfigForType(InitElementType.SERVICE, renderOptions),
    };
  }

  /**
   * Render the auth config, if any.
   */
  public renderAuth(): any {
    return this.elements.map(elem => elem.renderAuth());
  }

  private renderConfigForType(elementType: InitElementType, renderOptions: Omit<InitRenderOptions, 'index'>): Record<string, any> | undefined {
    const elements = this.elements.filter(elem => elem.elementType === elementType);
    if (elements.length === 0) { return undefined; }

    const ret: Record<string, any> = {};
    elements.forEach((elem, index) => {
      deepMerge(ret, elem.renderElement({ index, ...renderOptions }));
    });
    return ret;
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