
import * as path from 'path';
import type { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import type { Module } from '@cdklabs/typewriter';
import type { IWriter } from '../util';
import { substituteFilePattern } from '../util';
import type { GrantsProps } from './aws-cdk-lib';
import type { BaseServiceSubmodule, LocatedModule } from './service-submodule';

export interface AddServiceProps {
  /**
   * Append a suffix at the end of generated names.
   */
  readonly nameSuffix?: string;

  /**
   * Mark everything in the service as deprecated using the provided deprecation message.
   *
   * @default - not deprecated
   */
  readonly deprecated?: string;

  /**
   * The target submodule we want to generate these resources into
   *
   * Practically, only used to render CloudFormation resources into the `core` module, and as a failed
   * experiment to emit `aws-kinesisanalyticsv2` into `aws-kinesisanalytics`.
   */
  readonly destinationSubmodule?: string;

  /**
   * Properties used to create the grants module for the service
   */
  readonly grantsProps?: GrantsProps;
}

export interface LibraryBuilderProps {
  readonly db: SpecDatabase;
}

/**
 * A service library builder
 *
 * Builds a service library for given services and resources.
 * This is used for `aws-cdk-lib` but also preview packages.
 *
 * Note that the concept of "submodule" and `Module` look similar but are different.
 *
 * - `Module` is a `@cdklabs/typewriter` concept, which in TypeScript corresponds to a
 *   source file.
 * - "submodule" is a `spec2cdk` concept that refers to a subdirectory, which at the
 *   same time represents a jsii submodule (except for `core`, which IS a subdirectory
 *   but will NOT be treated as a jsii submodule).
 *s
 * Most submodules this class keeps track of correspond to "service" submodules, which
 * means submodules that represent an AWS service.
 */
export abstract class LibraryBuilder<ServiceSubmodule extends BaseServiceSubmodule = BaseServiceSubmodule> {
  public readonly db: SpecDatabase;
  public readonly modules = new Map<string, Module>();

  public readonly serviceSubmodules = new Map<string, ServiceSubmodule>();

  public constructor(props: LibraryBuilderProps) {
    this.db = props.db;
  }

  /**
   * Add all resources in a service
   */
  public addService(service: Service, props?: AddServiceProps) {
    const resources = this.db.follow('hasResource', service).map(e => e.entity);
    const submod = this.obtainServiceSubmodule(service, props?.destinationSubmodule, props?.grantsProps);

    for (const resource of resources) {
      this.addResourceToSubmodule(submod, resource, props);
    }

    this.postprocessSubmodule(submod, props);

    return submod;
  }

  /**
   * Build an module for a single resource (only used for testing)
   */
  public addResource(resource: Resource, props?: AddServiceProps): ServiceSubmodule {
    const service = this.db.incoming('hasResource', resource).only().entity;
    const submod = this.obtainServiceSubmodule(service, props?.destinationSubmodule);

    this.addResourceToSubmodule(submod, resource, props);

    this.postprocessSubmodule(submod);

    return submod;
  }

  /**
   * Write all files to disk using the provided writer
   */
  public writeAll(writer: IWriter) {
    for (const [fileName, module] of this.modules.entries()) {
      if (!module.isEmpty()) {
        writer.write(module, fileName);
      }
    }
  }

  /**
   * Return (relative) filenames, grouped by submodule
   *
   * Submodule means subdirectory; this does not exclusively return service submodules,
   * it returns files from all `Module`s that have been registered.
   */
  public filesBySubmodule(): Record<string, string[]> {
    const ret: Record<string, string[]> = {};
    for (const [fileName, module] of this.modules.entries()) {
      if (module.isEmpty()) {
        continue;
      }

      // Group by the first path component
      const parts = fileName.split(path.posix.sep);
      if (parts.length === 1) {
        continue;
      }
      const submoduleName = parts[0];
      ret[submoduleName] ??= [];
      ret[submoduleName].push(fileName);
    }
    return ret;
  }

  /**
   * The implementation of this method must register certain things with the submodule:
   *
   *  - submodule.registerResource(resource.cloudFormationType, ...)
   *  - submodule.registerSelectiveImports(..)
   */
  protected abstract addResourceToSubmodule(submodule: ServiceSubmodule, resource: Resource, props?: AddServiceProps): void;

  /**
   * Do whatever we need to do after a service has been rendered to a submodule
   */
  protected postprocessSubmodule(_submodule: ServiceSubmodule, _props?: AddServiceProps): void {
    // does nothing, this is a hook for implementations
  }

  private obtainServiceSubmodule(service: Service, targetSubmodule?: string, grantsProps?: GrantsProps): ServiceSubmodule {
    const submoduleName = targetSubmodule ?? service.name;
    const key = `${submoduleName}/${service.name}`;

    const existingSubmod = this.serviceSubmodules.get(key);
    if (existingSubmod) {
      return existingSubmod;
    }

    const createdSubmod = this.createServiceSubmodule(service, submoduleName, grantsProps);
    this.serviceSubmodules.set(key, createdSubmod);
    return createdSubmod;
  }

  /**
   * Implement this to create an instance of a service module.
   */
  protected abstract createServiceSubmodule(service: Service, submoduleName: string, grantsProps?: GrantsProps): ServiceSubmodule;

  public module(key: string) {
    const ret = this.modules.get(key);
    if (!ret) {
      throw new Error(`No such module: ${key}`);
    }
    return ret;
  }

  protected rememberModule<M extends Module>(
    module: LocatedModule<M>,
  ): LocatedModule<M> {
    if (this.modules.has(module.filePath)) {
      throw new Error(`Duplicate module key: ${module.filePath}`);
    }
    this.modules.set(module.filePath, module.module);

    return module;
  }

  protected pathFor(pattern: string, submoduleName: string, service: Service) {
    return substituteFilePattern(pattern, { moduleName: submoduleName, serviceName: service.name, serviceShortName: service.shortName });
  }
}
