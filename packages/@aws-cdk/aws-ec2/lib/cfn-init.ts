import { Construct } from'@aws-cdk/core';
import { InitElement, InitRenderPlatform, InitElementType } from './cfn-init-elements';

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

  public add(...elements: InitElement[]) {
    this.elements.push(...elements);
  }

  public bind(scope: Construct) {
    for (const element of this.elements) {
      element.bind(scope);
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

  private renderConfigForType(elementType: InitElementType, renderOptions: any): any[] {
    return this.elements.filter(elem => elem.getElementType() === elementType)
      .map((elem, index) => elem.renderElement({index: index, ...renderOptions}));
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
