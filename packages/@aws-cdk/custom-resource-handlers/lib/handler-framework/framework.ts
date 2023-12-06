/* eslint-disable import/no-extraneous-dependencies */
import { ExternalModule, InterfaceType, Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { CdkHandlerClassProps, CdkHandlerFrameworkClass } from './classes';
import { CDK_HANDLER_MODULE, CONSTRUCTS_MODULE, CORE_MODULE, LAMBDA_MODULE, PATH_MODULE } from './modules';

/**
 * Handler framework component types.
 */
export enum ComponentType {
  /**
   * `CdkFunction`
   */
  CDK_FUNCTION = 'CdkFunction',

  /**
   * `CdkSingletonFunction`
   */
  CDK_SINGLETON_FUNCTION = 'CdkSingletonFunction',

  /**
   * `CdkCustomResourceProvider`
   */
  CDK_CUSTOM_RESOURCE_PROVIDER = 'CdkCustomResourceProvider',
}

/**
 * Properties used to generate a specific handler framework component
 */
export interface ComponentDefinition extends CdkHandlerClassProps {
  /**
   * The component type to generate.
   */
  readonly type: ComponentType;
}

export class CdkHandlerFrameworkModule extends Module {
  /**
   * Build a framework module with specified components.
   */
  public static build(components: ComponentDefinition[]) {
    return new CdkHandlerFrameworkModule(components);
  }

  private readonly renderer = new TypeScriptRenderer();
  private readonly externalModules = new Map<string, boolean>();
  private readonly _interfaces = new Map<string, InterfaceType>();

  private constructor(components: ComponentDefinition[]) {
    super('cdk-handler-framework');

    for (let component of components) {
      const props: CdkHandlerClassProps = {
        codeDirectory: component.codeDirectory,
        className: component.className,
        compatibleRuntimes: component.compatibleRuntimes,
        entrypoint: component.entrypoint,
      };

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

    this.importExternalModules();
  }

  /**
   * Render built framework into an output file.
   */
  public render(outputFileLocation: string) {
    fs.outputFileSync(`dist/${outputFileLocation}.generated.ts`, this.renderer.render(this));
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
          CONSTRUCTS_MODULE.import(this, 'constructs');
          break;
        }
        case CORE_MODULE.fqn: {
          CORE_MODULE.import(this, 'cdk');
          break;
        }
        case LAMBDA_MODULE.fqn: {
          LAMBDA_MODULE.import(this, 'lambda');
          break;
        }
        case CDK_HANDLER_MODULE.fqn: {
          CDK_HANDLER_MODULE.import(this, 'handler');
          break;
        }
      }
    }
  }
}
