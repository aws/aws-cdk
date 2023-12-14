/* eslint-disable import/no-extraneous-dependencies */
import { ExternalModule, InterfaceType, Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { HandlerFrameworkClass, HandlerFrameworkClassProps } from './classes';
import { ComponentType, ComponentProps, Runtime } from './config';
import { buildComponentName } from './utils/framework-utils';

export class HandlerFrameworkModule extends Module {
  /**
   * The latest nodejs runtime version available across all AWS regions.
   */
  private static readonly DEFAULT_RUNTIME = Runtime.NODEJS_18_X;

  private readonly renderer = new TypeScriptRenderer();
  private readonly externalModules = new Map<string, boolean>();
  private readonly _interfaces = new Map<string, InterfaceType>();
  private _hasComponents = false;

  /**
   * Whether the module being generated will live inside of aws-cdk-lib/core.
   */
  public readonly coreInternal: boolean;

  /**
   * Whether the module contains handler framework components.
   */
  public get hasComponents() {
    return this._hasComponents;
  }

  public constructor(fqn: string) {
    super(fqn);
    this.coreInternal = fqn.includes('core');
  }

  /**
   * Build a framework component inside of this module.
   */
  public build(component: ComponentProps, codeDirectory: string) {
    if (component.type === ComponentType.NO_OP) {
      return;
    }

    this._hasComponents = true;

    const handler = component.handler ?? 'index.handler';
    const name = buildComponentName(this.fqn, component.type, handler);

    const props: HandlerFrameworkClassProps = {
      name,
      handler,
      codeDirectory,
      runtime: component.runtime ?? HandlerFrameworkModule.DEFAULT_RUNTIME,
    };

    switch (component.type) {
      case ComponentType.FUNCTION: {
        HandlerFrameworkClass.buildFunction(this, props);
        break;
      }
      case ComponentType.SINGLETON_FUNCTION: {
        HandlerFrameworkClass.buildSingletonFunction(this, props);
        break;
      }
      case ComponentType.CUSTOM_RESOURCE_PROVIDER: {
        HandlerFrameworkClass.buildCustomResourceProvider(this, props);
        break;
      }
    }
  }

  /**
   * Render module with components into an output file.
   */
  public renderTo(file: string) {
    fs.outputFileSync(file, this.renderer.render(this));
  }

  /**
   * Add an external module to be imported.
   */
  public addExternalModule(module: ExternalModule) {
    this.externalModules.set(module.fqn, true);
  }

  /**
   * If an external module has been added as an import to this module.
   */
  public hasExternalModule(module: ExternalModule) {
    return this.externalModules.has(module.fqn);
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
}
