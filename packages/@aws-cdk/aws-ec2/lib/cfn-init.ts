import * as iam from '@aws-cdk/aws-iam';
import { Construct, CfnResource, Aws, Duration } from'@aws-cdk/core';
import { InitElement, InitRenderPlatform, InitElementType, InitRenderOptions, InitBindOptions } from './cfn-init-elements';
import { UserData } from './user-data';

/**
 * A CloudFormation-init configuration
 */
export class CloudFormationInit {
  /**
   * Build a new config from a set of Init Elements
   */
  public static fromElements(...elements: InitElement[]) {
    return CloudFormationInit.fromConfig(new InitConfig(elements));
  }

  /**
   * Use an existing InitConfig object as the default and only config
   */
  public static fromConfig(config: InitConfig) {
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
  public static fromConfigSets(config: ConfigSetProps) {
  }

  protected constructor() {
  }

  private readonly _configSets: Record<string, string[]> = {};
  private readonly _configs: Record<string, InitConfig> = {};

  public addConfig(configName: string, config: InitConfig) {
  }

  public addConfigSet(configSetName: string) {
  }

  public addConfigToSet(configSetName: string, ...configNames: string[]) {
  }

  /**
   * Attach the CloudFormation Init config to the given resource
   *
   * This returns an `AttachedCloudFormationInit` object, which can be used to apply
   * the init to one or more instances and/or autoscaling groups.
   *
   * You only need to use this API if want to reuse the same init config for
   * multiple resources. If not, `instance.applyCloudFormationInit()` or
   * `autoScalingGroup.applyCloudFormationInit()` achieve the same result in a
   * simpler way.
   */
  public attach(definingResource: CfnResource, attachOptions: AttachInitOptions): AttachedCloudFormationInit {
    // FIXME: This this eagerly renders, it will not reflect mutations made after attaching.
    // Is that okay?
    definingResource.addMetadata('AWS::CloudFormation::Init', this.renderInit(attachOptions.platform));

    const self = this;
    return new class extends AttachedCloudFormationInit {
      public apply(consumingResource: CfnResource, useOptions: ApplyInitOptions): void {
        self.bind(consumingResource, { instanceRole: useOptions.instanceRole });

        // To identify the resources that (a) have the metadata and (b) where the signal needs to be sent
        // (may be different), we need { region, stackName, logicalId }
        const initLocator = `--region ${Aws.REGION} -s ${Aws.STACK_NAME} -r ${definingResource.logicalId}`;
        const signalLocator = `--region ${Aws.REGION} -s ${Aws.STACK_NAME} -r ${consumingResource.logicalId}`;
        const configSets = (useOptions.configSets ?? ['default']).join(',');

        if (attachOptions.platform === InitRenderPlatform.WINDOWS) {
          useOptions.userData.addCommands(
            `cfn-init.exe -v ${initLocator} -c ${configSets}`,
            `cfn-signal.exe -e %ERRORLEVEL% ${signalLocator}`,
          );
        } else {
          useOptions.userData.addCommands(
            // Run a subshell without 'errexit', so we can signal using the exit code of cfn-init
            '(',
            '  set +e',
            `  cfn-init -v ${initLocator} -c ${configSets}`,
            `  cfn-signal -e $? ${signalLocator}`,
            ')',
          );
        }

        consumingResource.addCreationPolicySignalWait(useOptions.timeout ?? Duration.minutes(5));
      }
    };

  }

  private bind(scope: Construct, options: InitBindOptions) {
    for (const config of Object.values(this._configs)) {
      config.bind(scope, options);
    }
  }

  private renderInit(platform: InitRenderPlatform): any {
    return {
      configSets: this._configSets,
      ...mapValues(this._configs, c => c.renderConfig(platform)),
    };
  }
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
 * Options for applying a CloudFormationInit to a resource
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
   * Resource to send the wait signal to
   *
   * @default Duration.minutes(5)
   */
  readonly timeout?: Duration;
}

export interface InitBindRenderResult {
  /**
   * Commands to add to UserData to activate CloudFormation Init config
   */
  readonly userDataCommands: string[];
}

export class InitConfig {
  private readonly elements = new Array<InitElement>();

  constructor(elements: InitElement[]) {
    this.add(...elements);
  }

  public get isEmpty() {
    return this.elements.length === 0;
  }

  public add(...elements: InitElement[]) {
    this.elements.push(...elements);
  }

  public bind(scope: Construct, options: InitBindOptions) {
    for (const element of this.elements) {
      element.bind(scope, options);
    }
  }

  public renderConfig(platform: InitRenderPlatform): any {
    const renderOptions = { platform };

    return {
      packages: this.renderConfigForType(InitElementType.PACKAGE, renderOptions),
      groups: this.renderConfigForType(InitElementType.GROUP, renderOptions),
      users: this.renderConfigForType(InitElementType.USER, renderOptions),
      sources: this.renderConfigForType(InitElementType.SOURCE, renderOptions),
      files: this.renderConfigForType(InitElementType.FILE, renderOptions),
      commands: this.renderConfigForType(InitElementType.COMMAND, renderOptions),
      services: this.renderConfigForType(InitElementType.SERVICE, renderOptions),
    }
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
  configSets: Record<string, string[]>;

  /**
   * The sets of configs to pick from
   */
  configs: Record<string, InitConfig>;
}

function deepMerge(target: Record<string, any>, src: Record<string, any>) {
  for (const [key, value] of Object.entries(src)) {
    if (typeof value === 'object' && value) {
      target[key] = {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

function mapValues<A, B>(xs: Record<string, A>, fn: (x: A) => B): Record<string, B> {
  const ret: Record<string, B> = {};
  for (const [k, v] of Object.entries(xs)) {
    ret[k] = fn(v);
  }
  return ret;
}