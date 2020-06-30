import { Construct } from'@aws-cdk/core';
import { InitElement } from './cfn-init-elements';

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
    for (const element of elements) {
      element.renderInto(this);
    }
    this.elements.push(...elements);
  }

  public bind(scope: Construct) {
    for (const element of this.elements) {
      element.bind(scope);
    }
  }

  public addCommand() {
  }

  public addPackage() {
  }

  public renderConfig(): any {
    for (const element of this.elements) {
      const rendered = element.renderInto(configJson);

      {
        common: {
          'key_001': {
          },
          'mycommand': {
          },
        },
        service: {
          sysvinit: {
            nginx: { ... }
          },
        },
      }
    }
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
