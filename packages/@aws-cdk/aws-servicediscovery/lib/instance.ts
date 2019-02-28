import cdk = require('@aws-cdk/cdk');
import { IService } from './service';

export interface IInstance extends cdk.IConstruct {
  /**
   * The id of the instance resource
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
   */
  instanceId: string;

  /**
   * Custom attributes of the instance.
   *
   * @default none
   */
  customAttributes?: object;

}

/**
 * Properties to define ServiceDiscovery Instance
 */
export interface InstanceProps extends BaseInstanceProps {
  /**
   * The Cloudmap service this resource is registered to.
   */
  service: IService;
}

export abstract class InstanceBase extends cdk.Construct implements IInstance {
  /**
   * The Id of the instance
   */
  public abstract readonly instanceId: string;

  /**
   * The Cloudmap service to which the instance is registered.
   */
  public abstract readonly service: IService;
}
