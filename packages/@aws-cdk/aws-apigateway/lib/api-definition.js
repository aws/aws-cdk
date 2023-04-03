"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetApiDefinition = exports.InlineApiDefinition = exports.S3ApiDefinition = exports.ApiDefinition = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const s3_assets = require("@aws-cdk/aws-s3-assets");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
/**
 * Represents an OpenAPI definition asset.
 */
class ApiDefinition {
    /**
     * Creates an API definition from a specification file in an S3 bucket
     */
    static fromBucket(bucket, key, objectVersion) {
        return new S3ApiDefinition(bucket, key, objectVersion);
    }
    /**
     * Create an API definition from an inline object. The inline object must follow the
     * schema of OpenAPI 2.0 or OpenAPI 3.0
     *
     * @example
     *
     *   apigateway.ApiDefinition.fromInline({
     *     openapi: '3.0.2',
     *     paths: {
     *       '/pets': {
     *         get: {
     *           'responses': {
     *             200: {
     *               content: {
     *                 'application/json': {
     *                   schema: {
     *                     $ref: '#/components/schemas/Empty',
     *                   },
     *                 },
     *               },
     *             },
     *           },
     *           'x-amazon-apigateway-integration': {
     *             responses: {
     *               default: {
     *                 statusCode: '200',
     *               },
     *             },
     *             requestTemplates: {
     *               'application/json': '{"statusCode": 200}',
     *             },
     *             passthroughBehavior: 'when_no_match',
     *             type: 'mock',
     *           },
     *         },
     *       },
     *     },
     *     components: {
     *       schemas: {
     *         Empty: {
     *           title: 'Empty Schema',
     *           type: 'object',
     *         },
     *       },
     *     },
     *   });
     */
    static fromInline(definition) {
        return new InlineApiDefinition(definition);
    }
    /**
     * Loads the API specification from a local disk asset.
     */
    static fromAsset(file, options) {
        return new AssetApiDefinition(file, options);
    }
    /**
     * Called after the CFN RestApi resource has been created to allow the Api
     * Definition to bind to it. Specifically it's required to allow assets to add
     * metadata for tooling like SAM CLI to be able to find their origins.
     */
    bindAfterCreate(_scope, _restApi) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IRestApi(_restApi);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bindAfterCreate);
            }
            throw error;
        }
        return;
    }
}
exports.ApiDefinition = ApiDefinition;
_a = JSII_RTTI_SYMBOL_1;
ApiDefinition[_a] = { fqn: "@aws-cdk/aws-apigateway.ApiDefinition", version: "0.0.0" };
/**
 * OpenAPI specification from an S3 archive.
 */
class S3ApiDefinition extends ApiDefinition {
    constructor(bucket, key, objectVersion) {
        super();
        this.key = key;
        this.objectVersion = objectVersion;
        if (!bucket.bucketName) {
            throw new Error('bucketName is undefined for the provided bucket');
        }
        this.bucketName = bucket.bucketName;
    }
    bind(_scope) {
        return {
            s3Location: {
                bucket: this.bucketName,
                key: this.key,
                version: this.objectVersion,
            },
        };
    }
}
exports.S3ApiDefinition = S3ApiDefinition;
_b = JSII_RTTI_SYMBOL_1;
S3ApiDefinition[_b] = { fqn: "@aws-cdk/aws-apigateway.S3ApiDefinition", version: "0.0.0" };
/**
 * OpenAPI specification from an inline JSON object.
 */
class InlineApiDefinition extends ApiDefinition {
    constructor(definition) {
        super();
        this.definition = definition;
        if (typeof (definition) !== 'object') {
            throw new Error('definition should be of type object');
        }
        if (Object.keys(definition).length === 0) {
            throw new Error('JSON definition cannot be empty');
        }
    }
    bind(_scope) {
        return {
            inlineDefinition: this.definition,
        };
    }
}
exports.InlineApiDefinition = InlineApiDefinition;
_c = JSII_RTTI_SYMBOL_1;
InlineApiDefinition[_c] = { fqn: "@aws-cdk/aws-apigateway.InlineApiDefinition", version: "0.0.0" };
/**
 * OpenAPI specification from a local file.
 */
class AssetApiDefinition extends ApiDefinition {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.options = options;
    }
    bind(scope) {
        // If the same AssetAPIDefinition is used multiple times, retain only the first instantiation.
        if (this.asset === undefined) {
            this.asset = new s3_assets.Asset(scope, 'APIDefinition', {
                path: this.path,
                ...this.options,
            });
        }
        if (this.asset.isZipArchive) {
            throw new Error(`Asset cannot be a .zip file or a directory (${this.path})`);
        }
        return {
            s3Location: {
                bucket: this.asset.s3BucketName,
                key: this.asset.s3ObjectKey,
            },
        };
    }
    bindAfterCreate(scope, restApi) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IRestApi(restApi);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bindAfterCreate);
            }
            throw error;
        }
        if (!scope.node.tryGetContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT)) {
            return; // not enabled
        }
        if (!this.asset) {
            throw new Error('bindToResource() must be called after bind()');
        }
        const child = constructs_1.Node.of(restApi).defaultChild;
        child.addMetadata(cxapi.ASSET_RESOURCE_METADATA_PATH_KEY, this.asset.assetPath);
        child.addMetadata(cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY, 'BodyS3Location');
    }
}
exports.AssetApiDefinition = AssetApiDefinition;
_d = JSII_RTTI_SYMBOL_1;
AssetApiDefinition[_d] = { fqn: "@aws-cdk/aws-apigateway.AssetApiDefinition", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGktZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxvREFBb0Q7QUFDcEQseUNBQXlDO0FBQ3pDLDJDQUE2QztBQUk3Qzs7R0FFRztBQUNILE1BQXNCLGFBQWE7SUFDakM7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQWtCLEVBQUUsR0FBVyxFQUFFLGFBQXNCO1FBQzlFLE9BQU8sSUFBSSxlQUFlLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztLQUN4RDtJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BOENHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFlO1FBQ3RDLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM1QztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFZLEVBQUUsT0FBZ0M7UUFDcEUsT0FBTyxJQUFJLGtCQUFrQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztLQUM5QztJQVdEOzs7O09BSUc7SUFDSSxlQUFlLENBQUMsTUFBaUIsRUFBRSxRQUFrQjs7Ozs7Ozs7OztRQUMxRCxPQUFPO0tBQ1I7O0FBbEZILHNDQW1GQzs7O0FBb0NEOztHQUVHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLGFBQWE7SUFHaEQsWUFBWSxNQUFrQixFQUFVLEdBQVcsRUFBVSxhQUFzQjtRQUNqRixLQUFLLEVBQUUsQ0FBQztRQUQ4QixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQVM7UUFHakYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1NBQ3BFO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0tBQ3JDO0lBRU0sSUFBSSxDQUFDLE1BQWlCO1FBQzNCLE9BQU87WUFDTCxVQUFVLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUN2QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhO2FBQzVCO1NBQ0YsQ0FBQztLQUNIOztBQXJCSCwwQ0FzQkM7OztBQUVEOztHQUVHO0FBQ0gsTUFBYSxtQkFBb0IsU0FBUSxhQUFhO0lBQ3BELFlBQW9CLFVBQWU7UUFDakMsS0FBSyxFQUFFLENBQUM7UUFEVSxlQUFVLEdBQVYsVUFBVSxDQUFLO1FBR2pDLElBQUksT0FBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7U0FDeEQ7UUFFRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN4QyxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7U0FDcEQ7S0FDRjtJQUVNLElBQUksQ0FBQyxNQUFpQjtRQUMzQixPQUFPO1lBQ0wsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDbEMsQ0FBQztLQUNIOztBQWpCSCxrREFrQkM7OztBQUVEOztHQUVHO0FBQ0gsTUFBYSxrQkFBbUIsU0FBUSxhQUFhO0lBR25ELFlBQTZCLElBQVksRUFBbUIsVUFBa0MsRUFBRztRQUMvRixLQUFLLEVBQUUsQ0FBQztRQURtQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQW1CLFlBQU8sR0FBUCxPQUFPLENBQThCO0tBRWhHO0lBRU0sSUFBSSxDQUFDLEtBQWdCO1FBQzFCLDhGQUE4RjtRQUM5RixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7Z0JBQ3ZELElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixHQUFHLElBQUksQ0FBQyxPQUFPO2FBQ2hCLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUM5RTtRQUVELE9BQU87WUFDTCxVQUFVLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtnQkFDL0IsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVzthQUM1QjtTQUNGLENBQUM7S0FDSDtJQUVNLGVBQWUsQ0FBQyxLQUFnQixFQUFFLE9BQWlCOzs7Ozs7Ozs7O1FBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsdUNBQXVDLENBQUMsRUFBRTtZQUM1RSxPQUFPLENBQUMsY0FBYztTQUN2QjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsTUFBTSxLQUFLLEdBQUcsaUJBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBMEIsQ0FBQztRQUMxRCxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hGLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7S0FDakY7O0FBeENILGdEQXlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzM19hc3NldHMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5SZXN0QXBpIH0gZnJvbSAnLi9hcGlnYXRld2F5LmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJUmVzdEFwaSB9IGZyb20gJy4vcmVzdGFwaSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBPcGVuQVBJIGRlZmluaXRpb24gYXNzZXQuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBcGlEZWZpbml0aW9uIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gQVBJIGRlZmluaXRpb24gZnJvbSBhIHNwZWNpZmljYXRpb24gZmlsZSBpbiBhbiBTMyBidWNrZXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUJ1Y2tldChidWNrZXQ6IHMzLklCdWNrZXQsIGtleTogc3RyaW5nLCBvYmplY3RWZXJzaW9uPzogc3RyaW5nKTogUzNBcGlEZWZpbml0aW9uIHtcbiAgICByZXR1cm4gbmV3IFMzQXBpRGVmaW5pdGlvbihidWNrZXQsIGtleSwgb2JqZWN0VmVyc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEFQSSBkZWZpbml0aW9uIGZyb20gYW4gaW5saW5lIG9iamVjdC4gVGhlIGlubGluZSBvYmplY3QgbXVzdCBmb2xsb3cgdGhlXG4gICAqIHNjaGVtYSBvZiBPcGVuQVBJIDIuMCBvciBPcGVuQVBJIDMuMFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgIGFwaWdhdGV3YXkuQXBpRGVmaW5pdGlvbi5mcm9tSW5saW5lKHtcbiAgICogICAgIG9wZW5hcGk6ICczLjAuMicsXG4gICAqICAgICBwYXRoczoge1xuICAgKiAgICAgICAnL3BldHMnOiB7XG4gICAqICAgICAgICAgZ2V0OiB7XG4gICAqICAgICAgICAgICAncmVzcG9uc2VzJzoge1xuICAgKiAgICAgICAgICAgICAyMDA6IHtcbiAgICogICAgICAgICAgICAgICBjb250ZW50OiB7XG4gICAqICAgICAgICAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IHtcbiAgICogICAgICAgICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAqICAgICAgICAgICAgICAgICAgICAgJHJlZjogJyMvY29tcG9uZW50cy9zY2hlbWFzL0VtcHR5JyxcbiAgICogICAgICAgICAgICAgICAgICAgfSxcbiAgICogICAgICAgICAgICAgICAgIH0sXG4gICAqICAgICAgICAgICAgICAgfSxcbiAgICogICAgICAgICAgICAgfSxcbiAgICogICAgICAgICAgIH0sXG4gICAqICAgICAgICAgICAneC1hbWF6b24tYXBpZ2F0ZXdheS1pbnRlZ3JhdGlvbic6IHtcbiAgICogICAgICAgICAgICAgcmVzcG9uc2VzOiB7XG4gICAqICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgKiAgICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXG4gICAqICAgICAgICAgICAgICAgfSxcbiAgICogICAgICAgICAgICAgfSxcbiAgICogICAgICAgICAgICAgcmVxdWVzdFRlbXBsYXRlczoge1xuICAgKiAgICAgICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3tcInN0YXR1c0NvZGVcIjogMjAwfScsXG4gICAqICAgICAgICAgICAgIH0sXG4gICAqICAgICAgICAgICAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6ICd3aGVuX25vX21hdGNoJyxcbiAgICogICAgICAgICAgICAgdHlwZTogJ21vY2snLFxuICAgKiAgICAgICAgICAgfSxcbiAgICogICAgICAgICB9LFxuICAgKiAgICAgICB9LFxuICAgKiAgICAgfSxcbiAgICogICAgIGNvbXBvbmVudHM6IHtcbiAgICogICAgICAgc2NoZW1hczoge1xuICAgKiAgICAgICAgIEVtcHR5OiB7XG4gICAqICAgICAgICAgICB0aXRsZTogJ0VtcHR5IFNjaGVtYScsXG4gICAqICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICogICAgICAgICB9LFxuICAgKiAgICAgICB9LFxuICAgKiAgICAgfSxcbiAgICogICB9KTtcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUlubGluZShkZWZpbml0aW9uOiBhbnkpOiBJbmxpbmVBcGlEZWZpbml0aW9uIHtcbiAgICByZXR1cm4gbmV3IElubGluZUFwaURlZmluaXRpb24oZGVmaW5pdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdGhlIEFQSSBzcGVjaWZpY2F0aW9uIGZyb20gYSBsb2NhbCBkaXNrIGFzc2V0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXNzZXQoZmlsZTogc3RyaW5nLCBvcHRpb25zPzogczNfYXNzZXRzLkFzc2V0T3B0aW9ucyk6IEFzc2V0QXBpRGVmaW5pdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBBc3NldEFwaURlZmluaXRpb24oZmlsZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHNwZWNpZmljYXRpb24gaXMgaW5pdGlhbGl6ZWQgdG8gYWxsb3cgdGhpcyBvYmplY3QgdG8gYmluZFxuICAgKiB0byB0aGUgc3RhY2ssIGFkZCByZXNvdXJjZXMgYW5kIGhhdmUgZnVuLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIGJpbmRpbmcgc2NvcGUuIERvbid0IGJlIHNtYXJ0IGFib3V0IHRyeWluZyB0byBkb3duLWNhc3Qgb3JcbiAgICogYXNzdW1lIGl0J3MgaW5pdGlhbGl6ZWQuIFlvdSBtYXkganVzdCB1c2UgaXQgYXMgYSBjb25zdHJ1Y3Qgc2NvcGUuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgYmluZChzY29wZTogQ29uc3RydWN0KTogQXBpRGVmaW5pdGlvbkNvbmZpZztcblxuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSBDRk4gUmVzdEFwaSByZXNvdXJjZSBoYXMgYmVlbiBjcmVhdGVkIHRvIGFsbG93IHRoZSBBcGlcbiAgICogRGVmaW5pdGlvbiB0byBiaW5kIHRvIGl0LiBTcGVjaWZpY2FsbHkgaXQncyByZXF1aXJlZCB0byBhbGxvdyBhc3NldHMgdG8gYWRkXG4gICAqIG1ldGFkYXRhIGZvciB0b29saW5nIGxpa2UgU0FNIENMSSB0byBiZSBhYmxlIHRvIGZpbmQgdGhlaXIgb3JpZ2lucy5cbiAgICovXG4gIHB1YmxpYyBiaW5kQWZ0ZXJDcmVhdGUoX3Njb3BlOiBDb25zdHJ1Y3QsIF9yZXN0QXBpOiBJUmVzdEFwaSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG4vKipcbiAqIFMzIGxvY2F0aW9uIG9mIHRoZSBBUEkgZGVmaW5pdGlvbiBmaWxlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXBpRGVmaW5pdGlvblMzTG9jYXRpb24ge1xuICAvKiogVGhlIFMzIGJ1Y2tldCAqL1xuICByZWFkb25seSBidWNrZXQ6IHN0cmluZztcbiAgLyoqIFRoZSBTMyBrZXkgKi9cbiAgcmVhZG9ubHkga2V5OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCB2ZXJzaW9uXG4gICAqIEBkZWZhdWx0IC0gbGF0ZXN0IHZlcnNpb25cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUG9zdC1CaW5kaW5nIENvbmZpZ3VyYXRpb24gZm9yIGEgQ0RLIGNvbnN0cnVjdFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwaURlZmluaXRpb25Db25maWcge1xuICAvKipcbiAgICogVGhlIGxvY2F0aW9uIG9mIHRoZSBzcGVjaWZpY2F0aW9uIGluIFMzIChtdXR1YWxseSBleGNsdXNpdmUgd2l0aCBgaW5saW5lRGVmaW5pdGlvbmApLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFQSSBkZWZpbml0aW9uIGlzIG5vdCBhbiBTMyBsb2NhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgczNMb2NhdGlvbj86IEFwaURlZmluaXRpb25TM0xvY2F0aW9uO1xuXG4gIC8qKlxuICAgKiBJbmxpbmUgc3BlY2lmaWNhdGlvbiAobXV0dWFsbHkgZXhjbHVzaXZlIHdpdGggYHMzTG9jYXRpb25gKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBUEkgZGVmaW5pdGlvbiBpcyBub3QgZGVmaW5lZCBpbmxpbmVcbiAgICovXG4gIHJlYWRvbmx5IGlubGluZURlZmluaXRpb24/OiBhbnk7XG59XG5cbi8qKlxuICogT3BlbkFQSSBzcGVjaWZpY2F0aW9uIGZyb20gYW4gUzMgYXJjaGl2ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFMzQXBpRGVmaW5pdGlvbiBleHRlbmRzIEFwaURlZmluaXRpb24ge1xuICBwcml2YXRlIGJ1Y2tldE5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihidWNrZXQ6IHMzLklCdWNrZXQsIHByaXZhdGUga2V5OiBzdHJpbmcsIHByaXZhdGUgb2JqZWN0VmVyc2lvbj86IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoIWJ1Y2tldC5idWNrZXROYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2J1Y2tldE5hbWUgaXMgdW5kZWZpbmVkIGZvciB0aGUgcHJvdmlkZWQgYnVja2V0Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5idWNrZXROYW1lID0gYnVja2V0LmJ1Y2tldE5hbWU7XG4gIH1cblxuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCk6IEFwaURlZmluaXRpb25Db25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBzM0xvY2F0aW9uOiB7XG4gICAgICAgIGJ1Y2tldDogdGhpcy5idWNrZXROYW1lLFxuICAgICAgICBrZXk6IHRoaXMua2V5LFxuICAgICAgICB2ZXJzaW9uOiB0aGlzLm9iamVjdFZlcnNpb24sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBPcGVuQVBJIHNwZWNpZmljYXRpb24gZnJvbSBhbiBpbmxpbmUgSlNPTiBvYmplY3QuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbmxpbmVBcGlEZWZpbml0aW9uIGV4dGVuZHMgQXBpRGVmaW5pdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGVmaW5pdGlvbjogYW55KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICh0eXBlb2YoZGVmaW5pdGlvbikgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2RlZmluaXRpb24gc2hvdWxkIGJlIG9mIHR5cGUgb2JqZWN0Jyk7XG4gICAgfVxuXG4gICAgaWYgKE9iamVjdC5rZXlzKGRlZmluaXRpb24pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdKU09OIGRlZmluaXRpb24gY2Fubm90IGJlIGVtcHR5Jyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QpOiBBcGlEZWZpbml0aW9uQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5saW5lRGVmaW5pdGlvbjogdGhpcy5kZWZpbml0aW9uLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBPcGVuQVBJIHNwZWNpZmljYXRpb24gZnJvbSBhIGxvY2FsIGZpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBBc3NldEFwaURlZmluaXRpb24gZXh0ZW5kcyBBcGlEZWZpbml0aW9uIHtcbiAgcHJpdmF0ZSBhc3NldD86IHMzX2Fzc2V0cy5Bc3NldDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBhdGg6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBzM19hc3NldHMuQXNzZXRPcHRpb25zID0geyB9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiBBcGlEZWZpbml0aW9uQ29uZmlnIHtcbiAgICAvLyBJZiB0aGUgc2FtZSBBc3NldEFQSURlZmluaXRpb24gaXMgdXNlZCBtdWx0aXBsZSB0aW1lcywgcmV0YWluIG9ubHkgdGhlIGZpcnN0IGluc3RhbnRpYXRpb24uXG4gICAgaWYgKHRoaXMuYXNzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5hc3NldCA9IG5ldyBzM19hc3NldHMuQXNzZXQoc2NvcGUsICdBUElEZWZpbml0aW9uJywge1xuICAgICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFzc2V0LmlzWmlwQXJjaGl2ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NldCBjYW5ub3QgYmUgYSAuemlwIGZpbGUgb3IgYSBkaXJlY3RvcnkgKCR7dGhpcy5wYXRofSlgKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgczNMb2NhdGlvbjoge1xuICAgICAgICBidWNrZXQ6IHRoaXMuYXNzZXQuczNCdWNrZXROYW1lLFxuICAgICAgICBrZXk6IHRoaXMuYXNzZXQuczNPYmplY3RLZXksXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYmluZEFmdGVyQ3JlYXRlKHNjb3BlOiBDb25zdHJ1Y3QsIHJlc3RBcGk6IElSZXN0QXBpKSB7XG4gICAgaWYgKCFzY29wZS5ub2RlLnRyeUdldENvbnRleHQoY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRU5BQkxFRF9DT05URVhUKSkge1xuICAgICAgcmV0dXJuOyAvLyBub3QgZW5hYmxlZFxuICAgIH1cblxuICAgIGlmICghdGhpcy5hc3NldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdiaW5kVG9SZXNvdXJjZSgpIG11c3QgYmUgY2FsbGVkIGFmdGVyIGJpbmQoKScpO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkID0gTm9kZS5vZihyZXN0QXBpKS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuUmVzdEFwaTtcbiAgICBjaGlsZC5hZGRNZXRhZGF0YShjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QQVRIX0tFWSwgdGhpcy5hc3NldC5hc3NldFBhdGgpO1xuICAgIGNoaWxkLmFkZE1ldGFkYXRhKGN4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX1BST1BFUlRZX0tFWSwgJ0JvZHlTM0xvY2F0aW9uJyk7XG4gIH1cbn1cbiJdfQ==