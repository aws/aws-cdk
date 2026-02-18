import * as path from 'node:path';
import type { Service } from '@aws-cdk/service-spec-types';
import type { Module, TypeDeclaration } from '@cdklabs/typewriter';

/**
 * A Module located in a file
 */
export interface LocatedModule<T extends Module> {
  readonly module: T;
  readonly filePath: string;
}

export function relativeImportPath(source: LocatedModule<any> | string, target: LocatedModule<any> | string) {
  const src = typeof source === 'string' ? source : source.filePath;
  const dst = typeof target === 'string' ? target : target.filePath;

  const ret = path.posix.relative(path.dirname(src), dst.replace(/\.ts$/, ''));
  // Apparently something we have to worry about for directories
  if (!ret) {
    return '.';
  }

  // Make sure we always start with `./` or `../` or it's accidentally a package name instead of a file name.
  return ret.startsWith('.') ? ret : './' + ret;
}

/**
 * Create a service submodule.
 */
export interface ServiceSubmoduleProps {
  /**
   * The name of the submodule of aws-cdk-lib where these service resources got written
   */
  readonly submoduleName: string;

  /**
   * The service itself
   */
  readonly service: Service;
}

/**
 * A service that got generated into a submodule.
 *
 * (This will be used by cfn2ts later to generate all kinds of codegen metadata)
 */
export class BaseServiceSubmodule {
  /**
   * The name of the submodule of aws-cdk-lib where these service resources got written
   */
  public readonly submoduleName: string;

  /**
   * The service this submodule is for
   */
  public readonly service: Service;

  /**
   * Map of CloudFormation resource name to generated type declaration
   */
  public readonly resources: Map<string, TypeDeclaration> = new Map();

  public get locatedModules(): LocatedModule<Module>[] {
    return this.modules;
  }

  private modules: LocatedModule<Module>[] = [];

  public constructor(props: ServiceSubmoduleProps) {
    this.submoduleName = props.submoduleName;
    this.service = props.service;
  }

  public registerModule(mod: LocatedModule<Module>) {
    this.modules.push(mod);
  }

  public registerResource(cfnResourceName: string, type: TypeDeclaration) {
    this.resources.set(cfnResourceName, type);
  }
}
