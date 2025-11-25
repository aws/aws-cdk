import * as path from 'node:path';
import { Service } from '@aws-cdk/service-spec-types';
import { Module, TypeDeclaration } from '@cdklabs/typewriter';

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
 * Represents a selective import statement for cross-module type references.
 * Used to import specific types from other CDK modules when relationships
 * are between different modules.
 */
export interface SelectiveImport {
  /** The module name to import from */
  readonly moduleName: string;
  /** Array of types that need to be imported */
  readonly types: {
    /** The original type name in the source module */
    originalType: string;
    /** The aliased name to avoid naming conflicts */
    aliasedType: string;
  }[];
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

  public get imports(): SelectiveImport[] {
    return this.selectiveImports.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
  }

  public get locatedModules(): LocatedModule<Module>[] {
    return this.modules;
  }

  private selectiveImports: SelectiveImport[] = [];
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

  public registerSelectiveImports(...selectiveImports: SelectiveImport[]) {
    for (const theImport of selectiveImports) {
      const existingModuleImport = this.findSelectiveImport(theImport);
      if (!existingModuleImport) {
        this.selectiveImports.push(theImport);
        continue;
      }

      // We need to avoid importing the same reference multiple times
      for (const type of theImport.types) {
        if (!existingModuleImport.types.find((t) =>
          t.originalType === type.originalType && t.aliasedType === type.aliasedType,
        )) {
          existingModuleImport.types.push(type);
        }
      }
    }
  }

  private findSelectiveImport(selectiveImport: SelectiveImport): SelectiveImport | undefined {
    return this.selectiveImports.find(
      (imp) => imp.moduleName === selectiveImport.moduleName,
    );
  }
}
