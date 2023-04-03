import { Construct } from 'constructs';
import { BaseInstanceProps, InstanceBase } from './instance';
import { IService } from './service';
export interface AliasTargetInstanceProps extends BaseInstanceProps {
    /**
     * DNS name of the target
     */
    readonly dnsName: string;
    /**
     * The Cloudmap service this resource is registered to.
     */
    readonly service: IService;
}
/**
 * Instance that uses Route 53 Alias record type. Currently, the only resource types supported are Elastic Load
 * Balancers.
 *
 * @resource AWS::ServiceDiscovery::Instance
 */
export declare class AliasTargetInstance extends InstanceBase {
    /**
     * The Id of the instance
     */
    readonly instanceId: string;
    /**
     * The Cloudmap service to which the instance is registered.
     */
    readonly service: IService;
    /**
     * The Route53 DNS name of the alias target
     */
    readonly dnsName: string;
    constructor(scope: Construct, id: string, props: AliasTargetInstanceProps);
}
