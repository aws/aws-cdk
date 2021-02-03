import { ServiceExtension } from './extensions/extension-interfaces';

/**
 * A description of a service to construct. This construct collects
 * all of the extensions that a user wants to add to their Service.
 * It is used as a shared collection of all the extensions, allowing
 * extensions to query the full list of extensions to determine
 * information about how to self configure.
 */
export class ServiceDescription {
  /**
   * The list of extensions that have been registered to run when
   * preparing this service.
   */
  public extensions: Record<string, ServiceExtension> = {};

  /**
   * Adds a new extension to the service. The extensions mutate a service
   * to add resources or features to the service
   * @param extension - The extension that you wish to add
   */
  public add(extension: ServiceExtension) {
    if (this.extensions[extension.name]) {
      throw new Error(`An extension called ${extension.name} has already been added`);
    }

    this.extensions[extension.name] = extension;

    return this;
  }

  /**
   * Get the extension with a specific name. This is generally used for
   * extensions to discover each other's existence.
   * @param name
   */
  public get(name: string) {
    return this.extensions[name];
  }
};