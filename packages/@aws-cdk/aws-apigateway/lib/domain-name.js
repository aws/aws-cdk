"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainName = exports.SecurityPolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const apigwv2 = require("@aws-cdk/aws-apigatewayv2");
const core_1 = require("@aws-cdk/core");
const apigateway_generated_1 = require("./apigateway.generated");
const base_path_mapping_1 = require("./base-path-mapping");
const restapi_1 = require("./restapi");
/**
 * The minimum version of the SSL protocol that you want API Gateway to use for HTTPS connections.
 */
var SecurityPolicy;
(function (SecurityPolicy) {
    /** Cipher suite TLS 1.0 */
    SecurityPolicy["TLS_1_0"] = "TLS_1_0";
    /** Cipher suite TLS 1.2 */
    SecurityPolicy["TLS_1_2"] = "TLS_1_2";
})(SecurityPolicy = exports.SecurityPolicy || (exports.SecurityPolicy = {}));
class DomainName extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.basePaths = new Set();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_DomainNameProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, DomainName);
            }
            throw error;
        }
        this.endpointType = props.endpointType || restapi_1.EndpointType.REGIONAL;
        const edge = this.endpointType === restapi_1.EndpointType.EDGE;
        this.securityPolicy = props.securityPolicy;
        if (!core_1.Token.isUnresolved(props.domainName) && /[A-Z]/.test(props.domainName)) {
            throw new Error(`Domain name does not support uppercase letters. Got: ${props.domainName}`);
        }
        const mtlsConfig = this.configureMTLS(props.mtls);
        const resource = new apigateway_generated_1.CfnDomainName(this, 'Resource', {
            domainName: props.domainName,
            certificateArn: edge ? props.certificate.certificateArn : undefined,
            regionalCertificateArn: edge ? undefined : props.certificate.certificateArn,
            endpointConfiguration: { types: [this.endpointType] },
            mutualTlsAuthentication: mtlsConfig,
            securityPolicy: props.securityPolicy,
        });
        this.domainName = resource.ref;
        this.domainNameAliasDomainName = edge
            ? resource.attrDistributionDomainName
            : resource.attrRegionalDomainName;
        this.domainNameAliasHostedZoneId = edge
            ? resource.attrDistributionHostedZoneId
            : resource.attrRegionalHostedZoneId;
        const multiLevel = this.validateBasePath(props.basePath);
        if (props.mapping && !multiLevel) {
            this.addBasePathMapping(props.mapping, {
                basePath: props.basePath,
            });
        }
        else if (props.mapping && multiLevel) {
            this.addApiMapping(props.mapping.deploymentStage, {
                basePath: props.basePath,
            });
        }
    }
    /**
     * Imports an existing domain name.
     */
    static fromDomainNameAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_DomainNameAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromDomainNameAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.domainName = attrs.domainName;
                this.domainNameAliasDomainName = attrs.domainNameAliasTarget;
                this.domainNameAliasHostedZoneId = attrs.domainNameAliasHostedZoneId;
            }
        }
        return new Import(scope, id);
    }
    validateBasePath(path) {
        if (this.isMultiLevel(path)) {
            if (this.endpointType === restapi_1.EndpointType.EDGE) {
                throw new Error('multi-level basePath is only supported when endpointType is EndpointType.REGIONAL');
            }
            if (this.securityPolicy && this.securityPolicy !== SecurityPolicy.TLS_1_2) {
                throw new Error('securityPolicy must be set to TLS_1_2 if multi-level basePath is provided');
            }
            return true;
        }
        return false;
    }
    isMultiLevel(path) {
        return (path?.split('/').filter(x => !!x) ?? []).length >= 2;
    }
    /**
     * Maps this domain to an API endpoint.
     *
     * This uses the BasePathMapping from ApiGateway v1 which does not support multi-level paths.
     *
     * If you need to create a mapping for a multi-level path use `addApiMapping` instead.
     *
     * @param targetApi That target API endpoint, requests will be mapped to the deployment stage.
     * @param options Options for mapping to base path with or without a stage
     */
    addBasePathMapping(targetApi, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IRestApi(targetApi);
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_BasePathMappingOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addBasePathMapping);
            }
            throw error;
        }
        if (this.basePaths.has(options.basePath)) {
            throw new Error(`DomainName ${this.node.id} already has a mapping for path ${options.basePath}`);
        }
        if (this.isMultiLevel(options.basePath)) {
            throw new Error('BasePathMapping does not support multi-level paths. Use "addApiMapping instead.');
        }
        this.basePaths.add(options.basePath);
        const basePath = options.basePath || '/';
        const id = `Map:${basePath}=>${core_1.Names.nodeUniqueId(targetApi.node)}`;
        return new base_path_mapping_1.BasePathMapping(this, id, {
            domainName: this,
            restApi: targetApi,
            ...options,
        });
    }
    /**
     * Maps this domain to an API endpoint.
     *
     * This uses the ApiMapping from ApiGatewayV2 which supports multi-level paths, but
     * also only supports:
     * - SecurityPolicy.TLS_1_2
     * - EndpointType.REGIONAL
     *
     * @param targetStage the target API stage.
     * @param options Options for mapping to a stage
     */
    addApiMapping(targetStage, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(targetStage);
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ApiMappingOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addApiMapping);
            }
            throw error;
        }
        if (this.basePaths.has(options.basePath)) {
            throw new Error(`DomainName ${this.node.id} already has a mapping for path ${options.basePath}`);
        }
        this.validateBasePath(options.basePath);
        this.basePaths.add(options.basePath);
        const id = `Map:${options.basePath ?? 'none'}=>${core_1.Names.nodeUniqueId(targetStage.node)}`;
        new apigwv2.CfnApiMapping(this, id, {
            apiId: targetStage.restApi.restApiId,
            stage: targetStage.stageName,
            domainName: this.domainName,
            apiMappingKey: options.basePath,
        });
    }
    configureMTLS(mtlsConfig) {
        if (!mtlsConfig)
            return undefined;
        return {
            truststoreUri: mtlsConfig.bucket.s3UrlForObject(mtlsConfig.key),
            truststoreVersion: mtlsConfig.version,
        };
    }
}
exports.DomainName = DomainName;
_a = JSII_RTTI_SYMBOL_1;
DomainName[_a] = { fqn: "@aws-cdk/aws-apigateway.DomainName", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb21haW4tbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxREFBcUQ7QUFHckQsd0NBQWtFO0FBRWxFLGlFQUF1RDtBQUN2RCwyREFBOEU7QUFDOUUsdUNBQW1EO0FBcUJuRDs7R0FFRztBQUNILElBQVksY0FNWDtBQU5ELFdBQVksY0FBYztJQUN4QiwyQkFBMkI7SUFDM0IscUNBQW1CLENBQUE7SUFFbkIsMkJBQTJCO0lBQzNCLHFDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFOVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQU16QjtBQStFRCxNQUFhLFVBQVcsU0FBUSxlQUFRO0lBc0J0QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFMRixjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7Ozs7OzsrQ0FsQmhELFVBQVU7Ozs7UUF5Qm5CLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksSUFBSSxzQkFBWSxDQUFDLFFBQVEsQ0FBQztRQUNoRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxLQUFLLHNCQUFZLENBQUMsSUFBSSxDQUFDO1FBQ3JELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztRQUUzQyxJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDM0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx3REFBd0QsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDN0Y7UUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENB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Q0FBQztTQUNsRztRQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sRUFBRSxHQUFHLE9BQU8sT0FBTyxDQUFDLFFBQVEsSUFBSSxNQUFNLEtBQUssWUFBSyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN4RixJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUNsQyxLQUFLLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTO1lBQ3BDLEtBQUssRUFBRSxXQUFXLENBQUMsU0FBUztZQUM1QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsYUFBYSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1NBQ2hDLENBQUMsQ0FBQztLQUNKO0lBRU8sYUFBYSxDQUFDLFVBQXVCO1FBQzNDLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFDbEMsT0FBTztZQUNMLGFBQWEsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQy9ELGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxPQUFPO1NBQ3RDLENBQUM7S0FDSDs7QUEvSUgsZ0NBZ0pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBpZ3d2MiBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheXYyJztcbmltcG9ydCAqIGFzIGFjbSBmcm9tICdAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcbmltcG9ydCB7IElCdWNrZXQgfSBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgSVJlc291cmNlLCBOYW1lcywgUmVzb3VyY2UsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkRvbWFpbk5hbWUgfSBmcm9tICcuL2FwaWdhdGV3YXkuZ2VuZXJhdGVkJztcbmltcG9ydCB7IEJhc2VQYXRoTWFwcGluZywgQmFzZVBhdGhNYXBwaW5nT3B0aW9ucyB9IGZyb20gJy4vYmFzZS1wYXRoLW1hcHBpbmcnO1xuaW1wb3J0IHsgRW5kcG9pbnRUeXBlLCBJUmVzdEFwaSB9IGZyb20gJy4vcmVzdGFwaSc7XG5pbXBvcnQgeyBJU3RhZ2UgfSBmcm9tICcuL3N0YWdlJztcblxuLyoqXG4gKiBPcHRpb25zIGZvciBjcmVhdGluZyBhbiBhcGkgbWFwcGluZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwaU1hcHBpbmdPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBhcGkgcGF0aCBuYW1lIHRoYXQgY2FsbGVycyBvZiB0aGUgQVBJIG11c3QgcHJvdmlkZSBpbiB0aGUgVVJMIGFmdGVyXG4gICAqIHRoZSBkb21haW4gbmFtZSAoZS5nLiBgZXhhbXBsZS5jb20vYmFzZS1wYXRoYCkuIElmIHlvdSBzcGVjaWZ5IHRoaXNcbiAgICogcHJvcGVydHksIGl0IGNhbid0IGJlIGFuIGVtcHR5IHN0cmluZy5cbiAgICpcbiAgICogSWYgdGhpcyBpcyB1bmRlZmluZWQsIGEgbWFwcGluZyB3aWxsIGJlIGFkZGVkIGZvciB0aGUgZW1wdHkgcGF0aC4gQW55IHJlcXVlc3RcbiAgICogdGhhdCBkb2VzIG5vdCBtYXRjaCBhIG1hcHBpbmcgd2lsbCBnZXQgc2VudCB0byB0aGUgQVBJIHRoYXQgaGFzIGJlZW4gbWFwcGVkXG4gICAqIHRvIHRoZSBlbXB0eSBwYXRoLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG1hcCByZXF1ZXN0cyBmcm9tIHRoZSBkb21haW4gcm9vdCAoZS5nLiBgZXhhbXBsZS5jb21gKS5cbiAgICovXG4gIHJlYWRvbmx5IGJhc2VQYXRoPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBtaW5pbXVtIHZlcnNpb24gb2YgdGhlIFNTTCBwcm90b2NvbCB0aGF0IHlvdSB3YW50IEFQSSBHYXRld2F5IHRvIHVzZSBmb3IgSFRUUFMgY29ubmVjdGlvbnMuXG4gKi9cbmV4cG9ydCBlbnVtIFNlY3VyaXR5UG9saWN5IHtcbiAgLyoqIENpcGhlciBzdWl0ZSBUTFMgMS4wICovXG4gIFRMU18xXzAgPSAnVExTXzFfMCcsXG5cbiAgLyoqIENpcGhlciBzdWl0ZSBUTFMgMS4yICovXG4gIFRMU18xXzIgPSAnVExTXzFfMicsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRG9tYWluTmFtZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGN1c3RvbSBkb21haW4gbmFtZSBmb3IgeW91ciBBUEkuIFVwcGVyY2FzZSBsZXR0ZXJzIGFyZSBub3Qgc3VwcG9ydGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVmZXJlbmNlIHRvIGFuIEFXUy1tYW5hZ2VkIGNlcnRpZmljYXRlIGZvciB1c2UgYnkgdGhlIGVkZ2Utb3B0aW1pemVkXG4gICAqIGVuZHBvaW50IGZvciB0aGUgZG9tYWluIG5hbWUuIEZvciBcIkVER0VcIiBkb21haW4gbmFtZXMsIHRoZSBjZXJ0aWZpY2F0ZVxuICAgKiBuZWVkcyB0byBiZSBpbiB0aGUgVVMgRWFzdCAoTi4gVmlyZ2luaWEpIHJlZ2lvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNlcnRpZmljYXRlOiBhY20uSUNlcnRpZmljYXRlO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBlbmRwb2ludCBmb3IgdGhpcyBEb21haW5OYW1lLlxuICAgKiBAZGVmYXVsdCBSRUdJT05BTFxuICAgKi9cbiAgcmVhZG9ubHkgZW5kcG9pbnRUeXBlPzogRW5kcG9pbnRUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgVHJhbnNwb3J0IExheWVyIFNlY3VyaXR5IChUTFMpIHZlcnNpb24gKyBjaXBoZXIgc3VpdGUgZm9yIHRoaXMgZG9tYWluIG5hbWUuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXktZG9tYWlubmFtZS5odG1sXG4gICAqIEBkZWZhdWx0IFNlY3VyaXR5UG9saWN5LlRMU18xXzJcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5UG9saWN5PzogU2VjdXJpdHlQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFRoZSBtdXR1YWwgVExTIGF1dGhlbnRpY2F0aW9uIGNvbmZpZ3VyYXRpb24gZm9yIGEgY3VzdG9tIGRvbWFpbiBuYW1lLlxuICAgKiBAZGVmYXVsdCAtIG1UTFMgaXMgbm90IGNvbmZpZ3VyZWQuXG4gICAqL1xuICByZWFkb25seSBtdGxzPzogTVRMU0NvbmZpZztcblxuICAvKipcbiAgICogVGhlIGJhc2UgcGF0aCBuYW1lIHRoYXQgY2FsbGVycyBvZiB0aGUgQVBJIG11c3QgcHJvdmlkZSBpbiB0aGUgVVJMIGFmdGVyXG4gICAqIHRoZSBkb21haW4gbmFtZSAoZS5nLiBgZXhhbXBsZS5jb20vYmFzZS1wYXRoYCkuIElmIHlvdSBzcGVjaWZ5IHRoaXNcbiAgICogcHJvcGVydHksIGl0IGNhbid0IGJlIGFuIGVtcHR5IHN0cmluZy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBtYXAgcmVxdWVzdHMgZnJvbSB0aGUgZG9tYWluIHJvb3QgKGUuZy4gYGV4YW1wbGUuY29tYCkuXG4gICAqL1xuICByZWFkb25seSBiYXNlUGF0aD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEb21haW5OYW1lUHJvcHMgZXh0ZW5kcyBEb21haW5OYW1lT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBJZiBzcGVjaWZpZWQsIGFsbCByZXF1ZXN0cyB0byB0aGlzIGRvbWFpbiB3aWxsIGJlIG1hcHBlZCB0byB0aGUgcHJvZHVjdGlvblxuICAgKiBkZXBsb3ltZW50IG9mIHRoaXMgQVBJLiBJZiB5b3Ugd2lzaCB0byBtYXAgdGhpcyBkb21haW4gdG8gbXVsdGlwbGUgQVBJc1xuICAgKiB3aXRoIGRpZmZlcmVudCBiYXNlIHBhdGhzLCB1c2UgYGFkZEJhc2VQYXRoTWFwcGluZ2Agb3IgYGFkZEFwaU1hcHBpbmdgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHlvdSB3aWxsIGhhdmUgdG8gY2FsbCBgYWRkQmFzZVBhdGhNYXBwaW5nYCB0byBtYXAgdGhpcyBkb21haW4gdG9cbiAgICogQVBJIGVuZHBvaW50cy5cbiAgICovXG4gIHJlYWRvbmx5IG1hcHBpbmc/OiBJUmVzdEFwaTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJRG9tYWluTmFtZSBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgZG9tYWluIG5hbWUgKGUuZy4gYGV4YW1wbGUuY29tYClcbiAgICpcbiAgICogQGF0dHJpYnV0ZSBEb21haW5OYW1lXG4gICAqL1xuICByZWFkb25seSBkb21haW5OYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBSb3V0ZTUzIGFsaWFzIHRhcmdldCB0byB1c2UgaW4gb3JkZXIgdG8gY29ubmVjdCBhIHJlY29yZCBzZXQgdG8gdGhpcyBkb21haW4gdGhyb3VnaCBhbiBhbGlhcy5cbiAgICpcbiAgICogQGF0dHJpYnV0ZSBEaXN0cmlidXRpb25Eb21haW5OYW1lLFJlZ2lvbmFsRG9tYWluTmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZUFsaWFzRG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgUm91dGU1MyBob3N0ZWQgem9uZSBJRCB0byB1c2UgaW4gb3JkZXIgdG8gY29ubmVjdCBhIHJlY29yZCBzZXQgdG8gdGhpcyBkb21haW4gdGhyb3VnaCBhbiBhbGlhcy5cbiAgICpcbiAgICogQGF0dHJpYnV0ZSBEaXN0cmlidXRpb25Ib3N0ZWRab25lSWQsUmVnaW9uYWxIb3N0ZWRab25lSWRcbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpbk5hbWVBbGlhc0hvc3RlZFpvbmVJZDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgRG9tYWluTmFtZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSURvbWFpbk5hbWUge1xuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGFuIGV4aXN0aW5nIGRvbWFpbiBuYW1lLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRG9tYWluTmFtZUF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IERvbWFpbk5hbWVBdHRyaWJ1dGVzKTogSURvbWFpbk5hbWUge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSURvbWFpbk5hbWUge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGRvbWFpbk5hbWUgPSBhdHRycy5kb21haW5OYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGRvbWFpbk5hbWVBbGlhc0RvbWFpbk5hbWUgPSBhdHRycy5kb21haW5OYW1lQWxpYXNUYXJnZXQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZG9tYWluTmFtZUFsaWFzSG9zdGVkWm9uZUlkID0gYXR0cnMuZG9tYWluTmFtZUFsaWFzSG9zdGVkWm9uZUlkO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZG9tYWluTmFtZUFsaWFzRG9tYWluTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZG9tYWluTmFtZUFsaWFzSG9zdGVkWm9uZUlkOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgYmFzZVBhdGhzID0gbmV3IFNldDxzdHJpbmcgfCB1bmRlZmluZWQ+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2VjdXJpdHlQb2xpY3k/OiBTZWN1cml0eVBvbGljeTtcbiAgcHJpdmF0ZSByZWFkb25seSBlbmRwb2ludFR5cGU6IEVuZHBvaW50VHlwZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRG9tYWluTmFtZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuZW5kcG9pbnRUeXBlID0gcHJvcHMuZW5kcG9pbnRUeXBlIHx8IEVuZHBvaW50VHlwZS5SRUdJT05BTDtcbiAgICBjb25zdCBlZGdlID0gdGhpcy5lbmRwb2ludFR5cGUgPT09IEVuZHBvaW50VHlwZS5FREdFO1xuICAgIHRoaXMuc2VjdXJpdHlQb2xpY3kgPSBwcm9wcy5zZWN1cml0eVBvbGljeTtcblxuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLmRvbWFpbk5hbWUpICYmIC9bQS1aXS8udGVzdChwcm9wcy5kb21haW5OYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEb21haW4gbmFtZSBkb2VzIG5vdCBzdXBwb3J0IHVwcGVyY2FzZSBsZXR0ZXJzLiBHb3Q6ICR7cHJvcHMuZG9tYWluTmFtZX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBtdGxzQ29uZmlnID0gdGhpcy5jb25maWd1cmVNVExTKHByb3BzLm10bHMpO1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkRvbWFpbk5hbWUodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZG9tYWluTmFtZTogcHJvcHMuZG9tYWluTmFtZSxcbiAgICAgIGNlcnRpZmljYXRlQXJuOiBlZGdlID8gcHJvcHMuY2VydGlmaWNhdGUuY2VydGlmaWNhdGVBcm4gOiB1bmRlZmluZWQsXG4gICAgICByZWdpb25hbENlcnRpZmljYXRlQXJuOiBlZGdlID8gdW5kZWZpbmVkIDogcHJvcHMuY2VydGlmaWNhdGUuY2VydGlmaWNhdGVBcm4sXG4gICAgICBlbmRwb2ludENvbmZpZ3VyYXRpb246IHsgdHlwZXM6IFt0aGlzLmVuZHBvaW50VHlwZV0gfSxcbiAgICAgIG11dHVhbFRsc0F1dGhlbnRpY2F0aW9uOiBtdGxzQ29uZmlnLFxuICAgICAgc2VjdXJpdHlQb2xpY3k6IHByb3BzLnNlY3VyaXR5UG9saWN5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5kb21haW5OYW1lID0gcmVzb3VyY2UucmVmO1xuXG4gICAgdGhpcy5kb21haW5OYW1lQWxpYXNEb21haW5OYW1lID0gZWRnZVxuICAgICAgPyByZXNvdXJjZS5hdHRyRGlzdHJpYnV0aW9uRG9tYWluTmFtZVxuICAgICAgOiByZXNvdXJjZS5hdHRyUmVnaW9uYWxEb21haW5OYW1lO1xuXG4gICAgdGhpcy5kb21haW5OYW1lQWxpYXNIb3N0ZWRab25lSWQgPSBlZGdlXG4gICAgICA/IHJlc291cmNlLmF0dHJEaXN0cmlidXRpb25Ib3N0ZWRab25lSWRcbiAgICAgIDogcmVzb3VyY2UuYXR0clJlZ2lvbmFsSG9zdGVkWm9uZUlkO1xuXG5cbiAgICBjb25zdCBtdWx0aUxldmVsID0gdGhpcy52YWxpZGF0ZUJhc2VQYXRoKHByb3BzLmJhc2VQYXRoKTtcbiAgICBpZiAocHJvcHMubWFwcGluZyAmJiAhbXVsdGlMZXZlbCkge1xuICAgICAgdGhpcy5hZGRCYXNlUGF0aE1hcHBpbmcocHJvcHMubWFwcGluZywge1xuICAgICAgICBiYXNlUGF0aDogcHJvcHMuYmFzZVBhdGgsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHByb3BzLm1hcHBpbmcgJiYgbXVsdGlMZXZlbCkge1xuICAgICAgdGhpcy5hZGRBcGlNYXBwaW5nKHByb3BzLm1hcHBpbmcuZGVwbG95bWVudFN0YWdlLCB7XG4gICAgICAgIGJhc2VQYXRoOiBwcm9wcy5iYXNlUGF0aCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVCYXNlUGF0aChwYXRoPzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuaXNNdWx0aUxldmVsKHBhdGgpKSB7XG4gICAgICBpZiAodGhpcy5lbmRwb2ludFR5cGUgPT09IEVuZHBvaW50VHlwZS5FREdFKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbXVsdGktbGV2ZWwgYmFzZVBhdGggaXMgb25seSBzdXBwb3J0ZWQgd2hlbiBlbmRwb2ludFR5cGUgaXMgRW5kcG9pbnRUeXBlLlJFR0lPTkFMJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zZWN1cml0eVBvbGljeSAmJiB0aGlzLnNlY3VyaXR5UG9saWN5ICE9PSBTZWN1cml0eVBvbGljeS5UTFNfMV8yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc2VjdXJpdHlQb2xpY3kgbXVzdCBiZSBzZXQgdG8gVExTXzFfMiBpZiBtdWx0aS1sZXZlbCBiYXNlUGF0aCBpcyBwcm92aWRlZCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNNdWx0aUxldmVsKHBhdGg/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHBhdGg/LnNwbGl0KCcvJykuZmlsdGVyKHggPT4gISF4KSA/PyBbXSkubGVuZ3RoID49IDI7XG4gIH1cblxuICAvKipcbiAgICogTWFwcyB0aGlzIGRvbWFpbiB0byBhbiBBUEkgZW5kcG9pbnQuXG4gICAqXG4gICAqIFRoaXMgdXNlcyB0aGUgQmFzZVBhdGhNYXBwaW5nIGZyb20gQXBpR2F0ZXdheSB2MSB3aGljaCBkb2VzIG5vdCBzdXBwb3J0IG11bHRpLWxldmVsIHBhdGhzLlxuICAgKlxuICAgKiBJZiB5b3UgbmVlZCB0byBjcmVhdGUgYSBtYXBwaW5nIGZvciBhIG11bHRpLWxldmVsIHBhdGggdXNlIGBhZGRBcGlNYXBwaW5nYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gdGFyZ2V0QXBpIFRoYXQgdGFyZ2V0IEFQSSBlbmRwb2ludCwgcmVxdWVzdHMgd2lsbCBiZSBtYXBwZWQgdG8gdGhlIGRlcGxveW1lbnQgc3RhZ2UuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG1hcHBpbmcgdG8gYmFzZSBwYXRoIHdpdGggb3Igd2l0aG91dCBhIHN0YWdlXG4gICAqL1xuICBwdWJsaWMgYWRkQmFzZVBhdGhNYXBwaW5nKHRhcmdldEFwaTogSVJlc3RBcGksIG9wdGlvbnM6IEJhc2VQYXRoTWFwcGluZ09wdGlvbnMgPSB7IH0pOiBCYXNlUGF0aE1hcHBpbmcge1xuICAgIGlmICh0aGlzLmJhc2VQYXRocy5oYXMob3B0aW9ucy5iYXNlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRG9tYWluTmFtZSAke3RoaXMubm9kZS5pZH0gYWxyZWFkeSBoYXMgYSBtYXBwaW5nIGZvciBwYXRoICR7b3B0aW9ucy5iYXNlUGF0aH1gKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNNdWx0aUxldmVsKG9wdGlvbnMuYmFzZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jhc2VQYXRoTWFwcGluZyBkb2VzIG5vdCBzdXBwb3J0IG11bHRpLWxldmVsIHBhdGhzLiBVc2UgXCJhZGRBcGlNYXBwaW5nIGluc3RlYWQuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5iYXNlUGF0aHMuYWRkKG9wdGlvbnMuYmFzZVBhdGgpO1xuICAgIGNvbnN0IGJhc2VQYXRoID0gb3B0aW9ucy5iYXNlUGF0aCB8fCAnLyc7XG4gICAgY29uc3QgaWQgPSBgTWFwOiR7YmFzZVBhdGh9PT4ke05hbWVzLm5vZGVVbmlxdWVJZCh0YXJnZXRBcGkubm9kZSl9YDtcbiAgICByZXR1cm4gbmV3IEJhc2VQYXRoTWFwcGluZyh0aGlzLCBpZCwge1xuICAgICAgZG9tYWluTmFtZTogdGhpcyxcbiAgICAgIHJlc3RBcGk6IHRhcmdldEFwaSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWFwcyB0aGlzIGRvbWFpbiB0byBhbiBBUEkgZW5kcG9pbnQuXG4gICAqXG4gICAqIFRoaXMgdXNlcyB0aGUgQXBpTWFwcGluZyBmcm9tIEFwaUdhdGV3YXlWMiB3aGljaCBzdXBwb3J0cyBtdWx0aS1sZXZlbCBwYXRocywgYnV0XG4gICAqIGFsc28gb25seSBzdXBwb3J0czpcbiAgICogLSBTZWN1cml0eVBvbGljeS5UTFNfMV8yXG4gICAqIC0gRW5kcG9pbnRUeXBlLlJFR0lPTkFMXG4gICAqXG4gICAqIEBwYXJhbSB0YXJnZXRTdGFnZSB0aGUgdGFyZ2V0IEFQSSBzdGFnZS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbWFwcGluZyB0byBhIHN0YWdlXG4gICAqL1xuICBwdWJsaWMgYWRkQXBpTWFwcGluZyh0YXJnZXRTdGFnZTogSVN0YWdlLCBvcHRpb25zOiBBcGlNYXBwaW5nT3B0aW9ucyA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYmFzZVBhdGhzLmhhcyhvcHRpb25zLmJhc2VQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEb21haW5OYW1lICR7dGhpcy5ub2RlLmlkfSBhbHJlYWR5IGhhcyBhIG1hcHBpbmcgZm9yIHBhdGggJHtvcHRpb25zLmJhc2VQYXRofWApO1xuICAgIH1cbiAgICB0aGlzLnZhbGlkYXRlQmFzZVBhdGgob3B0aW9ucy5iYXNlUGF0aCk7XG4gICAgdGhpcy5iYXNlUGF0aHMuYWRkKG9wdGlvbnMuYmFzZVBhdGgpO1xuICAgIGNvbnN0IGlkID0gYE1hcDoke29wdGlvbnMuYmFzZVBhdGggPz8gJ25vbmUnfT0+JHtOYW1lcy5ub2RlVW5pcXVlSWQodGFyZ2V0U3RhZ2Uubm9kZSl9YDtcbiAgICBuZXcgYXBpZ3d2Mi5DZm5BcGlNYXBwaW5nKHRoaXMsIGlkLCB7XG4gICAgICBhcGlJZDogdGFyZ2V0U3RhZ2UucmVzdEFwaS5yZXN0QXBpSWQsXG4gICAgICBzdGFnZTogdGFyZ2V0U3RhZ2Uuc3RhZ2VOYW1lLFxuICAgICAgZG9tYWluTmFtZTogdGhpcy5kb21haW5OYW1lLFxuICAgICAgYXBpTWFwcGluZ0tleTogb3B0aW9ucy5iYXNlUGF0aCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlTVRMUyhtdGxzQ29uZmlnPzogTVRMU0NvbmZpZyk6IENmbkRvbWFpbk5hbWUuTXV0dWFsVGxzQXV0aGVudGljYXRpb25Qcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFtdGxzQ29uZmlnKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiB7XG4gICAgICB0cnVzdHN0b3JlVXJpOiBtdGxzQ29uZmlnLmJ1Y2tldC5zM1VybEZvck9iamVjdChtdGxzQ29uZmlnLmtleSksXG4gICAgICB0cnVzdHN0b3JlVmVyc2lvbjogbXRsc0NvbmZpZy52ZXJzaW9uLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBEb21haW5OYW1lQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgZG9tYWluIG5hbWUgKGUuZy4gYGV4YW1wbGUuY29tYClcbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFJvdXRlNTMgYWxpYXMgdGFyZ2V0IHRvIHVzZSBpbiBvcmRlciB0byBjb25uZWN0IGEgcmVjb3JkIHNldCB0byB0aGlzIGRvbWFpbiB0aHJvdWdoIGFuIGFsaWFzLlxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZUFsaWFzVGFyZ2V0OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBSb3V0ZTUzIGhvc3RlZCB6b25lIElEIHRvIHVzZSBpbiBvcmRlciB0byBjb25uZWN0IGEgcmVjb3JkIHNldCB0byB0aGlzIGRvbWFpbiB0aHJvdWdoIGFuIGFsaWFzLlxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZUFsaWFzSG9zdGVkWm9uZUlkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIG1UTFMgYXV0aGVudGljYXRpb24gY29uZmlndXJhdGlvbiBmb3IgYSBjdXN0b20gZG9tYWluIG5hbWUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTVRMU0NvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgYnVja2V0IHRoYXQgdGhlIHRydXN0IHN0b3JlIGlzIGhvc3RlZCBpbi5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogSUJ1Y2tldDtcblxuICAvKipcbiAgICogVGhlIGtleSBpbiBTMyB0byBsb29rIGF0IGZvciB0aGUgdHJ1c3Qgc3RvcmUuXG4gICAqL1xuICByZWFkb25seSBrZXk6IHN0cmluZztcblxuICAvKipcbiAgICogIFRoZSB2ZXJzaW9uIG9mIHRoZSBTMyBvYmplY3QgdGhhdCBjb250YWlucyB5b3VyIHRydXN0c3RvcmUuXG4gICAqICBUbyBzcGVjaWZ5IGEgdmVyc2lvbiwgeW91IG11c3QgaGF2ZSB2ZXJzaW9uaW5nIGVuYWJsZWQgZm9yIHRoZSBTMyBidWNrZXQuXG4gICAqICBAZGVmYXVsdCAtIGxhdGVzdCB2ZXJzaW9uXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uPzogc3RyaW5nO1xufVxuIl19