import { Construct } from 'constructs';
import { IBaseService } from '../base/base-service';
import { ICluster } from '../cluster';
/**
 * The properties to import from the service.
 */
export interface ServiceAttributes {
    /**
     * The cluster that hosts the service.
     */
    readonly cluster: ICluster;
    /**
     * The service ARN.
     *
     * @default - either this, or `serviceName`, is required
     */
    readonly serviceArn?: string;
    /**
     * The name of the service.
     *
     * @default - either this, or `serviceArn`, is required
     */
    readonly serviceName?: string;
}
export declare function fromServiceAttributes(scope: Construct, id: string, attrs: ServiceAttributes): IBaseService;
export declare function extractServiceNameFromArn(scope: Construct, arn: string): string;
