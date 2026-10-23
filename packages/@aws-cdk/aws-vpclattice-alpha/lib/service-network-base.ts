import { CfnServiceNetworkServiceAssociation } from 'aws-cdk-lib/aws-vpclattice';
import { IService } from './service';
import { IResource, Resource } from 'aws-cdk-lib/core';

/**
 * Interface representing a VPC Lattice service network
 */
export interface IServiceNetwork extends IResource {
  /**
   * The ARN of the service network
   * @attribute
   * @returns a token representing the service network ARN
   */
  readonly serviceNetworkArn: string;

  /**
   * The ID of the service network
   * @attribute
   * @returns a token representing the service network ID
   */
  readonly serviceNetworkId: string;

  /**
   * Associate services with this service network
   *
   * @param services The services to associate with this service network
   */
  associateServices(services: IService[]): void;
}

/**
 * Base class for VPC Lattice service networks
 */
export abstract class ServiceNetworkBase extends Resource implements IServiceNetwork {
  /**
   * The ARN of the service network
   * @attribute
   * @returns a token representing the service network ARN
   */
  public abstract readonly serviceNetworkArn: string;

  /**
   * The ID of the service network
   * @attribute
   * @returns a token representing the service network ID
   */
  public abstract readonly serviceNetworkId: string;

  /**
   * Associate services with this service network
   *
   * @param services The services to associate with this service network
   */
  public associateServices(services: IService[]) {
    services.forEach(service => new CfnServiceNetworkServiceAssociation(this, service.serviceId, {
      serviceNetworkIdentifier: this.serviceNetworkId,
      serviceIdentifier: service.serviceId,
      dnsEntry: service.dnsEntry,
    }));
  }
}
