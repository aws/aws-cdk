/* eslint-disable import/no-extraneous-dependencies */
import { ExternalModule, InterfaceType, Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { CdkHandlerClassProps, CdkHandlerFrameworkClass } from './classes';
import { ComponentType, ConfigProps } from './config';
import { CONSTRUCTS_MODULE, CORE_MODULE, LAMBDA_MODULE, PATH_MODULE } from './modules';
import { Runtime } from './runtime';
import { RuntimeDeterminer } from './runtime-determiner';

export class CdkHandlerFrameworkModule extends Module {
  /**
   * The latest nodejs runtime version available across all AWS regions
   */
  private static readonly DEFAULT_RUNTIME = Runtime.NODEJS_18_X;

  private readonly renderer = new TypeScriptRenderer();
  private readonly externalModules = new Map<string, boolean>();
  private readonly _interfaces = new Map<string, InterfaceType>();
  private hasComponents = false;

  public constructor(fqn: string) {
    super(fqn);
  }

  /**
   * Build a framework component inside of this module.
   */
  public build(component: ConfigProps, sourceCodeDirectory: string) {
    const props: CdkHandlerClassProps = {
      codeDirectory: sourceCodeDirectory,
      name: component.name,
      runtime: RuntimeDeterminer.determineLatestRuntime(
        component.compatibleRuntimes,
        CdkHandlerFrameworkModule.DEFAULT_RUNTIME,
      ),
      entrypoint: component.entrypoint,
    };

    if (!this.hasComponents && component.type !== ComponentType.CDK_NO_OP) {
      this.hasComponents = true;
    }

    switch (component.type) {
      case ComponentType.CDK_FUNCTION: {
        CdkHandlerFrameworkClass.buildCdkFunction(this, props);
        break;
      }
      case ComponentType.CDK_SINGLETON_FUNCTION: {
        CdkHandlerFrameworkClass.buildCdkSingletonFunction(this, props);
        break;
      }
      case ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER: {
        CdkHandlerFrameworkClass.buildCdkCustomResourceProvider(this, props);
        break;
      }
    }
  }

  /**
   * Render built framework into an output file.
   */
  public render() {
    if (this.hasComponents) {
      this.importExternalModules();
      fs.outputFileSync(`dist/${this.fqn}.generated.ts`, this.renderer.render(this));
    }
  }

  /**
   * Add an external module to be imported.
   */
  public addExternalModule(module: ExternalModule) {
    if (!this.externalModules.has(module.fqn)) {
      this.externalModules.set(module.fqn, true);
    }
  }

  /**
   * Register an interface with this module.
   */
  public registerInterface(_interface: InterfaceType) {
    this._interfaces.set(_interface.name, _interface);
  }

  /**
   * Retrieve an interface that has been registered with this module.
   */
  public getInterface(name: string) {
    return this._interfaces.get(name);
  }

  private importExternalModules() {
    PATH_MODULE.import(this, 'path');
    for (const fqn of this.externalModules.keys()) {
      switch (fqn) {
        case CONSTRUCTS_MODULE.fqn: {
          CONSTRUCTS_MODULE.importSelective(this, ['Construct']);
          break;
        }
        case CORE_MODULE.fqn: {
          CORE_MODULE.importSelective(this, [
            'Stack',
            'CustomResourceProviderBase',
            'CustomResourceProviderOptions',
          ]);
          break;
        }
        case LAMBDA_MODULE.fqn: {
          LAMBDA_MODULE.import(this, 'lambda');
          break;
        }
      }
    }
  }
}
