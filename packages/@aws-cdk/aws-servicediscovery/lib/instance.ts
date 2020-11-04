import { IResource, Names, Resource } from '@aws-cdk/core';
import { IService } from './service';

export interface IInstance extends IResource {
  /**
   * The id of the instance resource
   * @attribute
   */
  readonly instanceId: string;

  /**
   * The Cloudmap service this resource is registered to.
   */
  readonly service: IService;
}

/**
 * Used when the resource that's associated with the service instance is accessible using values other than an IP
 * address or a domain name (CNAME), i.e. for non-ip-instances
 */
export interface BaseInstanceProps {
  /**
   * The id of the instance resource
   *
   * @default Automatically generated name
   */
  readonly instanceId?: string;

  /**
   * Custom attributes of the instance.
   *
   * @default none
   */
  readonly customAttributes?: { [key: string]: string };
}

export abstract class InstanceBase extends Resource implements IInstance {
  /**
   * The Id of the instance
   */
  public abstract readonly instanceId: string;

  /**
   * The Cloudmap service to which the instance is registered.
   */
  public abstract readonly service: IService;

  /**
   * Generate a unique instance Id that is safe to pass to CloudMap
   */
  protected uniqueInstanceId() {
    // Max length of 64 chars, get the last 64 chars
    const id = Names.uniqueId(this);
    return id.substring(Math.max(id.length - 64, 0), id.length);
  }
}
