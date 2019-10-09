import { Construct } from '@aws-cdk/core';
import { CfnHealthCheck } from "../route53.generated";
import { AdvancedHealthCheckOptions, HealthCheck } from "./health-check";

export class EndpointHealthCheckProtocol {
    /**
     *
     * @param resourcePath The path you want to request when performing health checks
     */
    public static http(resourcePath = '/', searchString?: string): EndpointHealthCheckProtocol {
        return new EndpointHealthCheckProtocol({
            type: searchString ? EndpointHealthCheckType.HTTP_STR_MATCH : EndpointHealthCheckType.HTTP,
            resourcePath,
            searchString,
        });
    }

    /**
     *
     * @param resourcePath The path you want to request when performing health checks
     */
    public static https(resourcePath = '/', searchString?: string, enableSni = true): EndpointHealthCheckProtocol {
        return new EndpointHealthCheckProtocol({
            type: searchString ? EndpointHealthCheckType.HTTPS_STR_MATCH : EndpointHealthCheckType.HTTPS,
            resourcePath,
            searchString,
            enableSni,
        });
    }

    public static tcp(): EndpointHealthCheckProtocol {
        return new EndpointHealthCheckProtocol({ type: EndpointHealthCheckType.TCP });
    }

    private constructor(public readonly options: CfnHealthCheck.HealthCheckConfigProperty) {
    }
}

export interface AdvancedEndpointHealthCheckOptions extends AdvancedHealthCheckOptions {
    /**
     * @default EndpointHealthCheckRequestInterval.STANDARD
     */
    readonly requestInterval?: EndpointHealthCheckRequestInterval;
    /**
     * @default 3
     */
    readonly failureThreshold?: number;
    /**
     * @default false
     */
    readonly measureLatency?: boolean;
    /**
     * @default - all valid regions
     */
    readonly regions?: string[];
}

export interface IPAddressHealthCheckOptions {
    readonly ipAddress: string;
    readonly hostname?: string;
}

export class EndpointHealthCheck extends HealthCheck {
    public static ipAddress(
        scope: Construct,
        id: string,
        endpointProps: IPAddressHealthCheckOptions,
        protocol: EndpointHealthCheckProtocol, options: AdvancedEndpointHealthCheckOptions = {},
    ) {
        return new EndpointHealthCheck(scope, id, { ...endpointProps, ...protocol.options, ...options });
    }

    public static domainName(
        scope: Construct,
        id: string,
        fullyQualifiedDomainName: string,
        protocol: EndpointHealthCheckProtocol,
        options: AdvancedEndpointHealthCheckOptions = {},
    ) {
        return new EndpointHealthCheck(scope, id, { fullyQualifiedDomainName, ...protocol.options, ...options });
    }

    protected constructor(scope: Construct, id: string, props: CfnHealthCheck.HealthCheckConfigProperty) {
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

export enum EndpointHealthCheckRequestInterval {
    STANDARD = 30,
    FAST = 10,
}