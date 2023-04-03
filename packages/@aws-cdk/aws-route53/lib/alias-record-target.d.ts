import { IHostedZone } from './hosted-zone-ref';
import { IRecordSet } from './record-set';
/**
 * Classes that are valid alias record targets, like CloudFront distributions and load
 * balancers, should implement this interface.
 */
export interface IAliasRecordTarget {
    /**
     * Return hosted zone ID and DNS name, usable for Route53 alias targets
     */
    bind(record: IRecordSet, zone?: IHostedZone): AliasRecordTargetConfig;
}
/**
 * Represents the properties of an alias target destination.
 */
export interface AliasRecordTargetConfig {
    /**
     * Hosted zone ID of the target
     */
    readonly hostedZoneId: string;
    /**
     * DNS name of the target
     */
    readonly dnsName: string;
}
