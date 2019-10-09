import { Construct } from '@aws-cdk/core';
import { CfnHealthCheck } from "../route53.generated";
import { AdvancedHealthCheckOptions, HealthCheck } from "./health-check";

/**
 * Endpoint health check protocol construct
 * @experimental
 */
export class EndpointHealthCheckProtocol {
    /**
     * Generate an HTTP monitoring protocol
     *
     * @param resourcePath The path you want to request when performing health checks
     * @param searchString The string that you want Route 53 to search for in the body of the response from your endpoint.
     *                     Route 53 considers case when searching for SearchString in the response body.
     * @param port The port on the endpoint that you want Amazon Route 53 to perform health checks on
     */
    public static http(resourcePath = '/', searchString?: string, port = 80): EndpointHealthCheckProtocol {
        return new EndpointHealthCheckProtocol({
            type: searchString ? EndpointHealthCheckType.HTTP_STR_MATCH : EndpointHealthCheckType.HTTP,
            resourcePath,
            searchString,
            port,
        });
    }

    /**
     * Generate an HTTPS monitoring protocol
     *
     * @param resourcePath The path you want to request when performing health checks
     * @param searchString The string that you want Route 53 to search for in the body of the response from your endpoint.
     *                     Route 53 considers case when searching for SearchString in the response body.
     * @param enableSni If true, Route 53 will send the host name to the endpoint in the "client_hello" message during TLS negotiation.
     *                  This allows the endpoint to respond to the HTTPS request with the applicable SSL/TLS certificate.
     * @param port The port on the endpoint that you want Amazon Route 53 to perform health checks on
     */
    public static https(resourcePath = '/', searchString?: string, port = 443, enableSni = true): EndpointHealthCheckProtocol {
        return new EndpointHealthCheckProtocol({
            type: searchString ? EndpointHealthCheckType.HTTPS_STR_MATCH : EndpointHealthCheckType.HTTPS,
            resourcePath,
            searchString,
            port,
            enableSni,
        });
    }

    /**
     * Generatea TCP monitoring protocol
     *
     * @param port The port on the endpoint that you want Amazon Route 53 to perform health checks on
     */
    public static tcp(port: number): EndpointHealthCheckProtocol {
        return new EndpointHealthCheckProtocol({ type: EndpointHealthCheckType.TCP, port });
    }

    private constructor(public readonly options: CfnHealthCheck.HealthCheckConfigProperty) {
        if (options.searchString && options.searchString.length > 255) {
            throw new Error('too long');
        }
    }
}

/**
 * Advanced endpoint health check options
 * @experimental
 */
export interface AdvancedEndpointHealthCheckOptions extends AdvancedHealthCheckOptions {
    /**
     * The number of seconds between the time that each Route 53 health checker gets a response from your endpoint
     * and the time that it sends the next health check request.
     *
     * {@link EndpointHealthCheckRequestInterval.FAST} incurs an additional charge
     *
     * @default EndpointHealthCheckRequestInterval.STANDARD
     */
    readonly requestInterval?: EndpointHealthCheckRequestInterval;
    /**
     * The number of consecutive health checks that an endpoint must pass or fail for Route 53
     * to change the current status of the endpoint from unhealthy to healthy or vice versa
     *
     * @default 3
     */
    readonly failureThreshold?: number;
    /**
     * If true, Route 53 will measure the latency between health checkers in multiple AWS Regions and your endpoint.
     * CloudWatch latency graphs will appear on the Latency tab on the Health checks page in the Route 53 console.
     *
     * @default false
     */
    readonly measureLatency?: boolean;
    /**
     * List of regions from which you want Amazon Route 53 health checkers to check the specified endpoint
     * You must specify at least three regions.
     *
     * @default - all valid regions
     */
    readonly regions?: string[];
}

/**
 * Base endpoint health check properties
 * @experimental
 */
export interface EndpointHealthCheckProps extends AdvancedEndpointHealthCheckOptions {
    /**
     * Protocol to be used to check the health of the endpoint
     */
    readonly protocol: EndpointHealthCheckProtocol;
}

/**
 * IP address health check properties
 * @experimental
 */
export interface IpAddressHealthCheckProps extends EndpointHealthCheckProps {
    /**
     * The IPv4 or IPv6 address of the endpoint that you want Amazon Route 53 to perform health checks on
     */
    readonly ipAddress: string;
    /**
     * The domain used to construct the HTTP "Host" header
     * for all {@link EndpointHealthCheckProtocol.http} and {@link EndpointHealthCheckProtocol.https} health checks
     *
     * * For the default port values (80 for HTTP, 443 for HTTPS), the "fullyQualifiedDomainName" will be passed
     * * For any other port value, "fullyQualifiedDomainName:port" will be passed
     */
    readonly fullyQualifiedDomainName?: string;
}

/**
 * Domain name health check properties
 * @experimental
 */
export interface DomainNameHealthCheckProps extends EndpointHealthCheckProps {
    /**
     * The domain name that Route 53 will send a DNS request to.
     * Route 53 will retrieve the IPv4 address, and check the health of that endpoint.
     *
     * Used with {@link EndpointHealthCheckProtocol.http} and {@link EndpointHealthCheckProtocol.https},
     * the domain name will also be passed in the HTTP "Host" header
     */
    readonly fullyQualifiedDomainName: string;
}

/**
 * Endpoint health check construct
 *
 * @resource AWS::Route53::HealthCheck
 * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/health-checks-creating-values.html#health-checks-creating-values-endpoint
 * @experimental
 */
export class EndpointHealthCheck extends HealthCheck {
    /**
     * Generate an IP address health check
     *
     * @param scope the parent Construct for this Construct
     * @param id the logical name of this Construct
     * @param props IP Address health check properties
     */
    public static ipAddress(
        scope: Construct,
        id: string,
        props: IpAddressHealthCheckProps
    ) {
        const { protocol, ...basicProps } = props;

        // TODO check IPv4/v6 address
        if (protocol.options.type === EndpointHealthCheckType.TCP && props.ipAddress && props.fullyQualifiedDomainName) {
            throw new Error('Cannot use domainName');
        }

        return new EndpointHealthCheck(scope, id, { ...basicProps, ...protocol.options });
    }

    /**
     * Generate an domain name health check
     *
     * @param scope the parent Construct for this Construct
     * @param id the logical name of this Construct
     * @param props Domain name health check properties
     */
    public static domainName(
        scope: Construct,
        id: string,
        props: DomainNameHealthCheckProps
    ) {
        const { protocol, ...basicProps } = props;
        return new EndpointHealthCheck(scope, id, { ...basicProps, ...protocol.options });
    }

    protected constructor(scope: Construct, id: string, props: CfnHealthCheck.HealthCheckConfigProperty) {
        if (props.regions && props.regions.length < 3) {
            throw new Error('not enough');
        }

        super(scope, id, props);
    }
}

/**
 * The type of Route 53 health check
 */
export enum EndpointHealthCheckType {
    /**
     * Route 53 tries to establish a TCP connection.
     * If successful, Route 53 submits an HTTP request and waits for an HTTP status code of 200 or greater and less than 400.
     */
    HTTP = 'HTTP',
    /**
     * Route 53 tries to establish a TCP connection.
     * If successful, Route 53 submits an HTTP request and searches the first 5,120 bytes of the response body
     * for the string that you specify in SearchString.
     */
    HTTP_STR_MATCH = 'HTTP_STR_MATCH',
    /**
     * Route 53 tries to establish a TCP connection.
     * If successful, Route 53 submits an HTTPS request and waits for an HTTP status code of 200 or greater and less than 400.
     * **Important**: If you specify HTTPS for the value of Type, the endpoint must support TLS v1.0 or later.
     */
    HTTPS = 'HTTPS',
    /**
     * Route 53 tries to establish a TCP connection.
     * If successful, Route 53 submits an HTTPS request and searches the first 5,120 bytes of the response body
     * for the string that you specify in SearchString.
     */
    HTTPS_STR_MATCH = 'HTTPS_STR_MATCH',
    /**
     * Route 53 tries to establish a TCP connection.
     */
    TCP = 'TCP',
}

/**
 * Request interval frequency
 */
export enum EndpointHealthCheckRequestInterval {
    /**
     * Standard (30 seconds)
     */
    STANDARD = 30,
    /**
     * Fast (10 seconds)
     */
    FAST = 10,
}