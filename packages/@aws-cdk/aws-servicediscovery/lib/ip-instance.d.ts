import { Construct } from 'constructs';
import { BaseInstanceProps, InstanceBase } from './instance';
import { IService } from './service';
export interface IpInstanceBaseProps extends BaseInstanceProps {
    /**
     * The port on the endpoint that you want AWS Cloud Map to perform health checks on. This value is also used for
     * the port value in an SRV record if the service that you specify includes an SRV record. You can also specify a
     * default port that is applied to all instances in the Service configuration.
     *
     * @default 80
     */
    readonly port?: number;
    /**
     *  If the service that you specify contains a template for an A record, the IPv4 address that you want AWS Cloud
     *  Map to use for the value of the A record.
     *
     * @default none
     */
    readonly ipv4?: string;
    /**
     *  If the service that you specify contains a template for an AAAA record, the IPv6 address that you want AWS Cloud
     *  Map to use for the value of the AAAA record.
     *
     * @default none
     */
    readonly ipv6?: string;
}
export interface IpInstanceProps extends IpInstanceBaseProps {
    /**
     * The Cloudmap service this resource is registered to.
     */
    readonly service: IService;
}
/**
 * Instance that is accessible using an IP address.
 *
 * @resource AWS::ServiceDiscovery::Instance
 */
export declare class IpInstance extends InstanceBase {
    /**
     * The Id of the instance
     */
    readonly instanceId: string;
    /**
     * The Cloudmap service to which the instance is registered.
     */
    readonly service: IService;
    /**
     * The Ipv4 address of the instance, or blank string if none available
     */
    readonly ipv4: string;
    /**
     * The Ipv6 address of the instance, or blank string if none available
     */
    readonly ipv6: string;
    /**
     * The exposed port of the instance
     */
    readonly port: number;
    constructor(scope: Construct, id: string, props: IpInstanceProps);
}
