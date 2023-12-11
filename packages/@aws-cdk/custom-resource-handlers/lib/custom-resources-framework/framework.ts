/* eslint-disable import/no-extraneous-dependencies */
import { ExternalModule, InterfaceType, Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { CdkCustomResourceClass, CdkCustomResourceClassProps } from './classes';
import { ComponentType, ConfigProps } from './config';
import { Runtime } from './runtime';
import { RuntimeDeterminer } from './utils/runtime-determiner';

export class CdkCustomResourceModule extends Module {
  /**
   * The latest nodejs runtime version available across all AWS regions
   */
  private static readonly DEFAULT_RUNTIME = Runtime.NODEJS_18_X;

  private readonly renderer = new TypeScriptRenderer();
  private readonly externalModules = new Map<string, boolean>();
  private readonly _interfaces = new Map<string, InterfaceType>();
  private _hasComponents = false;

  /**
   * Whether the module being generated will live inside of aws-cdk-lib/core
   */
  public readonly coreInternal: boolean;

  /**
   * Whether the module contains framework components
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
  public build(component: ConfigProps, codeDirectory: string) {
    if (component.type === ComponentType.CDK_NO_OP) {
      return;
    }

    this._hasComponents = true;

    const entrypoint = component.entrypoint ?? 'index.handler';
    const name = this.buildComponentName(entrypoint);

    const props: CdkCustomResourceClassProps = {
      name,
      entrypoint,
      codeDirectory,
      runtime: RuntimeDeterminer.determineLatestRuntime(
        component.compatibleRuntimes,
        CdkCustomResourceModule.DEFAULT_RUNTIME,
      ),
    };

    switch (component.type) {
      case ComponentType.CDK_FUNCTION: {
        CdkCustomResourceClass.buildCdkFunction(this, props);
        break;
      }
      case ComponentType.CDK_SINGLETON_FUNCTION: {
        CdkCustomResourceClass.buildCdkSingletonFunction(this, props);
        break;
      }
      case ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER: {
        CdkCustomResourceClass.buildCdkCustomResourceProvider(this, props);
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
    if (!this.externalModules.has(module.fqn)) {
      this.externalModules.set(module.fqn, true);
    }
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

  private buildComponentName(entrypoint: string) {
    const id = this.fqn.split('/').at(-1)?.replace('-provider', '') ?? '';
    const handler = entrypoint.split('.').at(-1)?.replace(/[_Hh]andler/g, '') ?? '';
    const name = (id.replace(
      /-([a-z])/g, (s) => { return s[1].toUpperCase(); },
    )) + (handler.charAt(0).toUpperCase() + handler.slice(1));
    return name.charAt(0).toUpperCase() + name.slice(1) + 'Provider';
  }
}
