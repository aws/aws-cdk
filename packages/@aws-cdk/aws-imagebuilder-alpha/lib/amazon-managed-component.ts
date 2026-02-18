import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import type { IComponent } from './component';
import { Component } from './component';
import { Platform } from './os-version';
import { LATEST_VERSION } from './private/constants';

/**
 * Properties for an EC2 Image Builder Amazon-managed component
 */
export interface AmazonManagedComponentAttributes {
  /**
   * The name of the Amazon-managed component
   */
  readonly componentName: string;

  /**
   * The version of the Amazon-managed component
   *
   * @default - the latest version of the component, x.x.x
   */
  readonly componentVersion?: string;
}

/**
 * Options for selecting a predefined Amazon-managed image
 */
export interface AmazonManagedComponentOptions {
  /**
   * The platform of the Amazon-managed component
   */
  readonly platform: Platform;

  /**
   * The version of the Amazon-managed component
   *
   * @default - the latest version of the component, x.x.x
   */
  readonly componentVersion?: string;
}

interface AmazonManagedComponentConfig {
  readonly component: string;
  readonly supportedPlatforms: { [platform in Platform]?: string };
}

/**
 * Helper class for working with Amazon-managed components
 */
export abstract class AmazonManagedComponent {
  /**
   * Imports the AWS CLI v2 Amazon-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed component options
   */
  public static awsCliV2(scope: Construct, id: string, opts: AmazonManagedComponentOptions): IComponent {
    return this.predefinedManagedComponent(scope, id, opts, this.AWS_CLI_V2_CONFIG);
  }

  /**
   * Imports the hello world Amazon-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed component options
   */
  public static helloWorld(scope: Construct, id: string, opts: AmazonManagedComponentOptions): IComponent {
    return this.predefinedManagedComponent(scope, id, opts, this.HELLO_WORLD_CONFIG);
  }

  /**
   * Imports the Python 3 Amazon-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed component options
   */
  public static python3(scope: Construct, id: string, opts: AmazonManagedComponentOptions): IComponent {
    return this.predefinedManagedComponent(scope, id, opts, this.PYTHON_3_CONFIG);
  }

  /**
   * Imports the reboot Amazon-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed component options
   */
  public static reboot(scope: Construct, id: string, opts: AmazonManagedComponentOptions): IComponent {
    return this.predefinedManagedComponent(scope, id, opts, this.REBOOT_CONFIG);
  }

  /**
   * Imports the STIG hardening Amazon-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed component options
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/ib-stig.html
   */
  public static stigBuild(scope: Construct, id: string, opts: AmazonManagedComponentOptions): IComponent {
    return this.predefinedManagedComponent(scope, id, opts, this.STIG_BUILD_CONFIG);
  }

  /**
   * Imports the OS update Amazon-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed component attributes
   */
  public static updateOs(scope: Construct, id: string, opts: AmazonManagedComponentOptions): IComponent {
    return this.predefinedManagedComponent(scope, id, opts, this.UPDATE_OS_CONFIG);
  }

  /**
   * Imports an Amazon-managed component from its attributes
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The Amazon-managed component attributes
   */
  public static fromAmazonManagedComponentAttributes(
    scope: Construct,
    id: string,
    attrs: AmazonManagedComponentAttributes,
  ): IComponent {
    return Component.fromComponentArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        account: 'aws',
        resource: 'component',
        resourceName: `${attrs.componentName}/${attrs.componentVersion ?? LATEST_VERSION}`,
      }),
    );
  }
  /**
   * Imports an Amazon-managed component from its name
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param amazonManagedComponentName - The name of the Amazon-managed component
   */
  public static fromAmazonManagedComponentName(
    scope: Construct,
    id: string,
    amazonManagedComponentName: string,
  ): IComponent {
    return this.fromAmazonManagedComponentAttributes(scope, id, { componentName: amazonManagedComponentName });
  }

  private static readonly AWS_CLI_V2_CONFIG: AmazonManagedComponentConfig = {
    component: 'awsCliV2',
    supportedPlatforms: {
      [Platform.LINUX]: 'aws-cli-version-2-linux',
      [Platform.WINDOWS]: 'aws-cli-version-2-windows',
    },
  };

  private static readonly HELLO_WORLD_CONFIG: AmazonManagedComponentConfig = {
    component: 'helloWorld',
    supportedPlatforms: {
      [Platform.LINUX]: 'hello-world-linux',
      [Platform.WINDOWS]: 'hello-world-windows',
    },
  };

  private static readonly PYTHON_3_CONFIG: AmazonManagedComponentConfig = {
    component: 'python3',
    supportedPlatforms: {
      [Platform.LINUX]: 'python-3-linux',
      [Platform.WINDOWS]: 'python-3-windows',
    },
  };

  private static readonly REBOOT_CONFIG: AmazonManagedComponentConfig = {
    component: 'reboot',
    supportedPlatforms: {
      [Platform.LINUX]: 'reboot-linux',
      [Platform.WINDOWS]: 'reboot-windows',
    },
  };

  private static readonly STIG_BUILD_CONFIG: AmazonManagedComponentConfig = {
    component: 'stigBuild',
    supportedPlatforms: {
      [Platform.LINUX]: 'stig-build-linux',
      [Platform.WINDOWS]: 'stig-build-windows',
    },
  };

  private static readonly UPDATE_OS_CONFIG: AmazonManagedComponentConfig = {
    component: 'updateOS',
    supportedPlatforms: {
      [Platform.LINUX]: 'update-linux',
      [Platform.WINDOWS]: 'update-windows',
    },
  };

  private static validatePredefinedManagedComponentOptions(
    scope: Construct,
    opts: AmazonManagedComponentOptions,
    component: string,
  ) {
    if (opts.platform === undefined) {
      throw new cdk.ValidationError(`a platform is required for ${component}`, scope);
    }

    if (cdk.Token.isUnresolved(opts.platform)) {
      throw new cdk.ValidationError(`platform cannot be a token for ${component}`, scope);
    }
  }

  private static predefinedManagedComponent(
    scope: Construct,
    id: string,
    opts: AmazonManagedComponentOptions,
    config: AmazonManagedComponentConfig,
  ): IComponent {
    this.validatePredefinedManagedComponentOptions(scope, opts, config.component);

    const componentName = config.supportedPlatforms[opts.platform];

    if (!componentName) {
      throw new cdk.ValidationError(`${opts.platform} is not a supported platform for ${config.component}`, scope);
    }

    return this.fromAmazonManagedComponentAttributes(scope, id, {
      componentName,
      componentVersion: opts.componentVersion,
    });
  }
}
