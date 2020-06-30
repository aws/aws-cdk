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

  public addConfigToSet(configSetName: string) {
  }
}

export class InitConfig {
  constructor(private readonly elements: InitElement[]) {
  }

  public add(...elements: InitElement[]) {
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
