export declare const ENDPOINT_SERVICE_AVAILABILITY_ZONE_PROVIDER = "endpoint-service-availability-zones";
/**
 * Query to hosted zone context provider
 */
export interface EndpointServiceAvailabilityZonesContextQuery {
    /**
     * Query account
     */
    readonly account?: string;
    /**
     * Query region
     */
    readonly region?: string;
    /**
     * Query service name
     */
    readonly serviceName?: string;
}
/**
 * Response of the AZ provider looks like this
 */
export type EndpointServiceAvailabilityZonesContextResponse = string[];
