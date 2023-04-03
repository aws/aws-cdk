import { Integration, IntegrationOptions } from '../integration';
export interface HttpIntegrationProps {
    /**
     * Determines whether to use proxy integration or custom integration.
     *
     * @default true
     */
    readonly proxy?: boolean;
    /**
     * HTTP method to use when invoking the backend URL.
     * @default GET
     */
    readonly httpMethod?: string;
    /**
     * Integration options, such as request/resopnse mapping, content handling,
     * etc.
     *
     * @default defaults based on `IntegrationOptions` defaults
     */
    readonly options?: IntegrationOptions;
}
/**
 * You can integrate an API method with an HTTP endpoint using the HTTP proxy
 * integration or the HTTP custom integration,.
 *
 * With the proxy integration, the setup is simple. You only need to set the
 * HTTP method and the HTTP endpoint URI, according to the backend requirements,
 * if you are not concerned with content encoding or caching.
 *
 * With the custom integration, the setup is more involved. In addition to the
 * proxy integration setup steps, you need to specify how the incoming request
 * data is mapped to the integration request and how the resulting integration
 * response data is mapped to the method response.
 */
export declare class HttpIntegration extends Integration {
    constructor(url: string, props?: HttpIntegrationProps);
}
