import { Construct } from 'constructs';
import { CfnDistribution, IOrigin, OriginBase, OriginBindConfig, OriginBindOptions, OriginProps } from '../lib';
/** Used for testing common Origin functionality */
export declare class TestOrigin extends OriginBase {
    constructor(domainName: string, props?: OriginProps);
    protected renderCustomOriginConfig(): CfnDistribution.CustomOriginConfigProperty | undefined;
}
export declare class TestOriginGroup implements IOrigin {
    private readonly primaryDomainName;
    private readonly secondaryDomainName;
    constructor(primaryDomainName: string, secondaryDomainName: string);
    bind(scope: Construct, options: OriginBindOptions): OriginBindConfig;
}
export declare function defaultOrigin(domainName?: string, originId?: string): IOrigin;
export declare function defaultOriginGroup(): IOrigin;
