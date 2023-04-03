import { Construct } from 'constructs';
import { BaseInstanceProps, InstanceBase } from './instance';
import { IService } from './service';
export interface CnameInstanceBaseProps extends BaseInstanceProps {
    /**
     * If the service configuration includes a CNAME record, the domain name that you want Route 53 to
     * return in response to DNS queries, for example, example.com. This value is required if the
     * service specified by ServiceId includes settings for an CNAME record.
     */
    readonly instanceCname: string;
}
export interface CnameInstanceProps extends CnameInstanceBaseProps {
    /**
     * The Cloudmap service this resource is registered to.
     */
    readonly service: IService;
}
/**
 * Instance that is accessible using a domain name (CNAME).
 * @resource AWS::ServiceDiscovery::Instance
 */
export declare class CnameInstance extends InstanceBase {
    /**
     * The Id of the instance
     */
    readonly instanceId: string;
    /**
     * The Cloudmap service to which the instance is registered.
     */
    readonly service: IService;
    /**
     * The domain name returned by DNS queries for the instance
     */
    readonly cname: string;
    constructor(scope: Construct, id: string, props: CnameInstanceProps);
}
