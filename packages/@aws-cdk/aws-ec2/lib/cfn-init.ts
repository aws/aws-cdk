import { Construct } from'@aws-cdk/core';
import { InitElement, InitRenderPlatform, InitElementType, InitRenderOptions, InitBindOptions } from './cfn-init-elements';

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