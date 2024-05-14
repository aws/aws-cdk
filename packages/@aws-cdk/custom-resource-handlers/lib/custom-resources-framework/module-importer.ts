/* eslint-disable import/no-extraneous-dependencies */
import { Module, Type } from '@cdklabs/typewriter';
import { CallableExpr } from './callable-expr';
import { ImportableModule } from './modules';

type Target = CallableExpr | Type;
type ModuleImport = { [fqn: string]: { module: ImportableModule; targets: Set<Target>; fromLocation?: string } };

/**
 * Options used to import an external module.
 */
export interface ModuleImportOptions {
  /**
   * Targets to import from the external module. Specifying targets for a module will
   * result in a selective import.
   *
   * @default - all targets will be imported from the external module
   */
  readonly targets?: Target[];

  /**
   * Override the location the module is imported from.
   *
   * @default - the module will be imported from its default location
   */
  readonly fromLocation?: string;
}

/**
 * A class used to manage external module imports for a target module.
 */
export class ModuleImporter {
  private readonly imports: ModuleImport = {};

  /**
   * Add an external module to be imported.
   */
  public registerImport(module: ImportableModule, options: ModuleImportOptions = {}) {
    const fqn = options.fromLocation ?? module.fqn;
    if (this.imports.hasOwnProperty(fqn)) {
      const _targets = new Set([...this.imports[fqn].targets, ...(options.targets ?? [])]);
      this.imports[fqn].targets = _targets;
      return;
    }
    this.imports[fqn] = { module, targets: new Set([...(options.targets ?? [])]), fromLocation: options.fromLocation };
  }

  /**
   * Import all registered modules into the target module.
   */
  public importModulesInto(scope: Module) {
    for (const { module, targets, fromLocation } of Object.values(this.imports)) {
      this.importModuleInto(scope, module, targets, fromLocation);
    }
  }

  private importModuleInto(scope: Module, module: ImportableModule, targets: Set<Target>, fromLocation?: string) {
    if (targets.size > 0) {
      const _targets = Array.from(targets).map(target => {
        if (target instanceof Type) {
          return target.toString();
        }

        if (target instanceof CallableExpr) {
          return target.name;
        }

        throw new Error(`${target} for ImportableModule ${module.importName} is neither an instance of a CallableExpr nor Type`);
      });
      module.importSelective(scope, _targets, { fromLocation });
      return;
    }
    module.import(scope, module.importAs, { fromLocation });
  }
}
