import { Construct } from 'constructs';
import { BaseInstanceProps, InstanceBase } from './instance';
import { IService } from './service';
export interface NonIpInstanceBaseProps extends BaseInstanceProps {
}
export interface NonIpInstanceProps extends NonIpInstanceBaseProps {
    /**
     * The Cloudmap service this resource is registered to.
     */
    readonly service: IService;
}
/**
 * Instance accessible using values other than an IP address or a domain name (CNAME).
 * Specify the other values in Custom attributes.
 *
 * @resource AWS::ServiceDiscovery::Instance
 */
export declare class NonIpInstance extends InstanceBase {
    /**
     * The Id of the instance
     */
    readonly instanceId: string;
    /**
     * The Cloudmap service to which the instance is registered.
     */
    readonly service: IService;
    constructor(scope: Construct, id: string, props: NonIpInstanceProps);
}
