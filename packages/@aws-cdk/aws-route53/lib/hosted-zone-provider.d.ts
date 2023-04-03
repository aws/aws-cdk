/**
 * Zone properties for looking up the Hosted Zone
 */
export interface HostedZoneProviderProps {
    /**
     * The zone domain e.g. example.com
     */
    readonly domainName: string;
    /**
     * Whether the zone that is being looked up is a private hosted zone
     *
     * @default false
     */
    readonly privateZone?: boolean;
    /**
     * Specifies the ID of the VPC associated with a private hosted zone.
     *
     * If a VPC ID is provided and privateZone is false, no results will be returned
     * and an error will be raised
     *
     * @default - No VPC ID
     */
    readonly vpcId?: string;
}
