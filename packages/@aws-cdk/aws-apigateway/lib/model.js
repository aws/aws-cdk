"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = exports.ErrorModel = exports.EmptyModel = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const apigateway_generated_1 = require("./apigateway.generated");
const restapi_1 = require("./restapi");
const util = require("./util");
/**
 * Represents a reference to a REST API's Empty model, which is available
 * as part of the model collection by default. This can be used for mapping
 * JSON responses from an integration to what is returned to a client,
 * where strong typing is not required. In the absence of any defined
 * model, the Empty model will be used to return the response payload
 * unmapped.
 *
 * Definition
 * {
 *   "$schema" : "http://json-schema.org/draft-04/schema#",
 *   "title" : "Empty Schema",
 *   "type" : "object"
 * }
 *
 * @see https://docs.amazonaws.cn/en_us/apigateway/latest/developerguide/models-mappings.html#models-mappings-models
 * @deprecated You should use Model.EMPTY_MODEL
 */
class EmptyModel {
    constructor() {
        this.modelId = 'Empty';
    }
}
exports.EmptyModel = EmptyModel;
_a = JSII_RTTI_SYMBOL_1;
EmptyModel[_a] = { fqn: "@aws-cdk/aws-apigateway.EmptyModel", version: "0.0.0" };
/**
 * Represents a reference to a REST API's Error model, which is available
 * as part of the model collection by default. This can be used for mapping
 * error JSON responses from an integration to a client, where a simple
 * generic message field is sufficient to map and return an error payload.
 *
 * Definition
 * {
 *   "$schema" : "http://json-schema.org/draft-04/schema#",
 *   "title" : "Error Schema",
 *   "type" : "object",
 *   "properties" : {
 *     "message" : { "type" : "string" }
 *   }
 * }
 * @deprecated You should use Model.ERROR_MODEL
 */
class ErrorModel {
    constructor() {
        this.modelId = 'Error';
    }
}
exports.ErrorModel = ErrorModel;
_b = JSII_RTTI_SYMBOL_1;
ErrorModel[_b] = { fqn: "@aws-cdk/aws-apigateway.ErrorModel", version: "0.0.0" };
class Model extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.modelName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ModelProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Model);
            }
            throw error;
        }
        const modelProps = {
            name: this.physicalName,
            restApiId: props.restApi.restApiId,
            contentType: props.contentType ?? 'application/json',
            description: props.description,
            schema: util.JsonSchemaMapper.toCfnJsonSchema(props.schema),
        };
        const resource = new apigateway_generated_1.CfnModel(this, 'Resource', modelProps);
        this.modelId = this.getResourceNameAttribute(resource.ref);
        const deployment = (props.restApi instanceof restapi_1.RestApi) ? props.restApi.latestDeployment : undefined;
        if (deployment) {
            deployment.node.addDependency(resource);
            deployment.addToLogicalId({ model: modelProps });
        }
    }
    static fromModelName(scope, id, modelName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.modelId = modelName;
            }
        }
        return new Import(scope, id);
    }
}
exports.Model = Model;
_c = JSII_RTTI_SYMBOL_1;
Model[_c] = { fqn: "@aws-cdk/aws-apigateway.Model", version: "0.0.0" };
/**
 * Represents a reference to a REST API's Error model, which is available
 * as part of the model collection by default. This can be used for mapping
 * error JSON responses from an integration to a client, where a simple
 * generic message field is sufficient to map and return an error payload.
 *
 * Definition
 * {
 *   "$schema" : "http://json-schema.org/draft-04/schema#",
 *   "title" : "Error Schema",
 *   "type" : "object",
 *   "properties" : {
 *     "message" : { "type" : "string" }
 *   }
 * }
 */
Model.ERROR_MODEL = new ErrorModel();
/**
 * Represents a reference to a REST API's Empty model, which is available
 * as part of the model collection by default. This can be used for mapping
 * JSON responses from an integration to what is returned to a client,
 * where strong typing is not required. In the absence of any defined
 * model, the Empty model will be used to return the response payload
 * unmapped.
 *
 * Definition
 * {
 *   "$schema" : "http://json-schema.org/draft-04/schema#",
 *   "title" : "Empty Schema",
 *   "type" : "object"
 * }
 *
 * @see https://docs.amazonaws.cn/en_us/apigateway/latest/developerguide/models-mappings.html#models-mappings-models
 */
Model.EMPTY_MODEL = new EmptyModel();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBeUM7QUFFekMsaUVBQWlFO0FBRWpFLHVDQUE4QztBQUM5QywrQkFBK0I7QUFXL0I7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsTUFBYSxVQUFVO0lBQXZCO1FBQ2tCLFlBQU8sR0FBRyxPQUFPLENBQUM7S0FDbkM7O0FBRkQsZ0NBRUM7OztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsTUFBYSxVQUFVO0lBQXZCO1FBQ2tCLFlBQU8sR0FBRyxPQUFPLENBQUM7S0FDbkM7O0FBRkQsZ0NBRUM7OztBQW9ERCxNQUFhLEtBQU0sU0FBUSxlQUFRO0lBcURqQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWlCO1FBQ3pELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxTQUFTO1NBQzlCLENBQUMsQ0FBQzs7Ozs7OytDQXhETSxLQUFLOzs7O1FBMERkLE1BQU0sVUFBVSxHQUFrQjtZQUNoQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDdkIsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNsQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsSUFBSSxrQkFBa0I7WUFDcEQsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLE1BQU0sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FDNUQsQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksK0JBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTVELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUzRCxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLFlBQVksaUJBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDbkcsSUFBSSxVQUFVLEVBQUU7WUFDZCxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxVQUFVLENBQUMsY0FBYyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDbEQ7S0FDRjtJQXJDTSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFNBQWlCO1FBQ3pFLE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNrQixZQUFPLEdBQUcsU0FBUyxDQUFDO1lBQ3RDLENBQUM7U0FBQTtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlCOztBQTVDSCxzQkE0RUM7OztBQTNFQzs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDb0IsaUJBQVcsR0FBVyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBRTlEOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ29CLGlCQUFXLEdBQVcsSUFBSSxVQUFVLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbk1vZGVsLCBDZm5Nb2RlbFByb3BzIH0gZnJvbSAnLi9hcGlnYXRld2F5LmdlbmVyYXRlZCc7XG5pbXBvcnQgKiBhcyBqc29uU2NoZW1hIGZyb20gJy4vanNvbi1zY2hlbWEnO1xuaW1wb3J0IHsgSVJlc3RBcGksIFJlc3RBcGkgfSBmcm9tICcuL3Jlc3RhcGknO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbCB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtb2RlbCBuYW1lLCBzdWNoIGFzICdteU1vZGVsJ1xuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBtb2RlbElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHJlZmVyZW5jZSB0byBhIFJFU1QgQVBJJ3MgRW1wdHkgbW9kZWwsIHdoaWNoIGlzIGF2YWlsYWJsZVxuICogYXMgcGFydCBvZiB0aGUgbW9kZWwgY29sbGVjdGlvbiBieSBkZWZhdWx0LiBUaGlzIGNhbiBiZSB1c2VkIGZvciBtYXBwaW5nXG4gKiBKU09OIHJlc3BvbnNlcyBmcm9tIGFuIGludGVncmF0aW9uIHRvIHdoYXQgaXMgcmV0dXJuZWQgdG8gYSBjbGllbnQsXG4gKiB3aGVyZSBzdHJvbmcgdHlwaW5nIGlzIG5vdCByZXF1aXJlZC4gSW4gdGhlIGFic2VuY2Ugb2YgYW55IGRlZmluZWRcbiAqIG1vZGVsLCB0aGUgRW1wdHkgbW9kZWwgd2lsbCBiZSB1c2VkIHRvIHJldHVybiB0aGUgcmVzcG9uc2UgcGF5bG9hZFxuICogdW5tYXBwZWQuXG4gKlxuICogRGVmaW5pdGlvblxuICoge1xuICogICBcIiRzY2hlbWFcIiA6IFwiaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjXCIsXG4gKiAgIFwidGl0bGVcIiA6IFwiRW1wdHkgU2NoZW1hXCIsXG4gKiAgIFwidHlwZVwiIDogXCJvYmplY3RcIlxuICogfVxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmFtYXpvbmF3cy5jbi9lbl91cy9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9tb2RlbHMtbWFwcGluZ3MuaHRtbCNtb2RlbHMtbWFwcGluZ3MtbW9kZWxzXG4gKiBAZGVwcmVjYXRlZCBZb3Ugc2hvdWxkIHVzZSBNb2RlbC5FTVBUWV9NT0RFTFxuICovXG5leHBvcnQgY2xhc3MgRW1wdHlNb2RlbCBpbXBsZW1lbnRzIElNb2RlbCB7XG4gIHB1YmxpYyByZWFkb25seSBtb2RlbElkID0gJ0VtcHR5Jztcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcmVmZXJlbmNlIHRvIGEgUkVTVCBBUEkncyBFcnJvciBtb2RlbCwgd2hpY2ggaXMgYXZhaWxhYmxlXG4gKiBhcyBwYXJ0IG9mIHRoZSBtb2RlbCBjb2xsZWN0aW9uIGJ5IGRlZmF1bHQuIFRoaXMgY2FuIGJlIHVzZWQgZm9yIG1hcHBpbmdcbiAqIGVycm9yIEpTT04gcmVzcG9uc2VzIGZyb20gYW4gaW50ZWdyYXRpb24gdG8gYSBjbGllbnQsIHdoZXJlIGEgc2ltcGxlXG4gKiBnZW5lcmljIG1lc3NhZ2UgZmllbGQgaXMgc3VmZmljaWVudCB0byBtYXAgYW5kIHJldHVybiBhbiBlcnJvciBwYXlsb2FkLlxuICpcbiAqIERlZmluaXRpb25cbiAqIHtcbiAqICAgXCIkc2NoZW1hXCIgOiBcImh0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hI1wiLFxuICogICBcInRpdGxlXCIgOiBcIkVycm9yIFNjaGVtYVwiLFxuICogICBcInR5cGVcIiA6IFwib2JqZWN0XCIsXG4gKiAgIFwicHJvcGVydGllc1wiIDoge1xuICogICAgIFwibWVzc2FnZVwiIDogeyBcInR5cGVcIiA6IFwic3RyaW5nXCIgfVxuICogICB9XG4gKiB9XG4gKiBAZGVwcmVjYXRlZCBZb3Ugc2hvdWxkIHVzZSBNb2RlbC5FUlJPUl9NT0RFTFxuICovXG5leHBvcnQgY2xhc3MgRXJyb3JNb2RlbCBpbXBsZW1lbnRzIElNb2RlbCB7XG4gIHB1YmxpYyByZWFkb25seSBtb2RlbElkID0gJ0Vycm9yJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNb2RlbE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGNvbnRlbnQgdHlwZSBmb3IgdGhlIG1vZGVsLiBZb3UgY2FuIGFsc28gZm9yY2UgYVxuICAgKiBjb250ZW50IHR5cGUgaW4gdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2UgbW9kZWwgbWFwcGluZy5cbiAgICpcbiAgICogQGRlZmF1bHQgJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAqL1xuICByZWFkb25seSBjb250ZW50VHlwZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSBkZXNjcmlwdGlvbiB0aGF0IGlkZW50aWZpZXMgdGhpcyBtb2RlbC5cbiAgICogQGRlZmF1bHQgTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIG1vZGVsLlxuICAgKlxuICAgKiBJbXBvcnRhbnRcbiAgICogIElmIHlvdSBzcGVjaWZ5IGEgbmFtZSwgeW91IGNhbm5vdCBwZXJmb3JtIHVwZGF0ZXMgdGhhdFxuICAgKiAgcmVxdWlyZSByZXBsYWNlbWVudCBvZiB0aGlzIHJlc291cmNlLiBZb3UgY2FuIHBlcmZvcm1cbiAgICogIHVwZGF0ZXMgdGhhdCByZXF1aXJlIG5vIG9yIHNvbWUgaW50ZXJydXB0aW9uLiBJZiB5b3VcbiAgICogIG11c3QgcmVwbGFjZSB0aGUgcmVzb3VyY2UsIHNwZWNpZnkgYSBuZXcgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgPGF1dG8+IElmIHlvdSBkb24ndCBzcGVjaWZ5IGEgbmFtZSxcbiAgICogIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYSB1bmlxdWUgcGh5c2ljYWwgSUQgYW5kXG4gICAqICB1c2VzIHRoYXQgSUQgZm9yIHRoZSBtb2RlbCBuYW1lLiBGb3IgbW9yZSBpbmZvcm1hdGlvbixcbiAgICogIHNlZSBOYW1lIFR5cGUuXG4gICAqL1xuICByZWFkb25seSBtb2RlbE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzY2hlbWEgdG8gdXNlIHRvIHRyYW5zZm9ybSBkYXRhIHRvIG9uZSBvciBtb3JlIG91dHB1dCBmb3JtYXRzLlxuICAgKiBTcGVjaWZ5IG51bGwgKHt9KSBpZiB5b3UgZG9uJ3Qgd2FudCB0byBzcGVjaWZ5IGEgc2NoZW1hLlxuICAgKi9cbiAgcmVhZG9ubHkgc2NoZW1hOiBqc29uU2NoZW1hLkpzb25TY2hlbWE7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW9kZWxQcm9wcyBleHRlbmRzIE1vZGVsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcmVzdCBBUEkgdGhhdCB0aGlzIG1vZGVsIGlzIHBhcnQgb2YuXG4gICAqXG4gICAqIFRoZSByZWFzb24gd2UgbmVlZCB0aGUgUmVzdEFwaSBvYmplY3QgaXRzZWxmIGFuZCBub3QganVzdCB0aGUgSUQgaXMgYmVjYXVzZSB0aGUgbW9kZWxcbiAgICogaXMgYmVpbmcgdHJhY2tlZCBieSB0aGUgdG9wLWxldmVsIFJlc3RBcGkgb2JqZWN0IGZvciB0aGUgcHVycG9zZSBvZiBjYWxjdWxhdGluZyBpdCdzXG4gICAqIGhhc2ggdG8gZGV0ZXJtaW5lIHRoZSBJRCBvZiB0aGUgZGVwbG95bWVudC4gVGhpcyBhbGxvd3MgdXMgdG8gYXV0b21hdGljYWxseSB1cGRhdGVcbiAgICogdGhlIGRlcGxveW1lbnQgd2hlbiB0aGUgbW9kZWwgb2YgdGhlIFJFU1QgQVBJIGNoYW5nZXMuXG4gICAqL1xuICByZWFkb25seSByZXN0QXBpOiBJUmVzdEFwaTtcbn1cblxuZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTW9kZWwge1xuICAvKipcbiAgICogUmVwcmVzZW50cyBhIHJlZmVyZW5jZSB0byBhIFJFU1QgQVBJJ3MgRXJyb3IgbW9kZWwsIHdoaWNoIGlzIGF2YWlsYWJsZVxuICAgKiBhcyBwYXJ0IG9mIHRoZSBtb2RlbCBjb2xsZWN0aW9uIGJ5IGRlZmF1bHQuIFRoaXMgY2FuIGJlIHVzZWQgZm9yIG1hcHBpbmdcbiAgICogZXJyb3IgSlNPTiByZXNwb25zZXMgZnJvbSBhbiBpbnRlZ3JhdGlvbiB0byBhIGNsaWVudCwgd2hlcmUgYSBzaW1wbGVcbiAgICogZ2VuZXJpYyBtZXNzYWdlIGZpZWxkIGlzIHN1ZmZpY2llbnQgdG8gbWFwIGFuZCByZXR1cm4gYW4gZXJyb3IgcGF5bG9hZC5cbiAgICpcbiAgICogRGVmaW5pdGlvblxuICAgKiB7XG4gICAqICAgXCIkc2NoZW1hXCIgOiBcImh0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hI1wiLFxuICAgKiAgIFwidGl0bGVcIiA6IFwiRXJyb3IgU2NoZW1hXCIsXG4gICAqICAgXCJ0eXBlXCIgOiBcIm9iamVjdFwiLFxuICAgKiAgIFwicHJvcGVydGllc1wiIDoge1xuICAgKiAgICAgXCJtZXNzYWdlXCIgOiB7IFwidHlwZVwiIDogXCJzdHJpbmdcIiB9XG4gICAqICAgfVxuICAgKiB9XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVSUk9SX01PREVMOiBJTW9kZWwgPSBuZXcgRXJyb3JNb2RlbCgpO1xuXG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIGEgcmVmZXJlbmNlIHRvIGEgUkVTVCBBUEkncyBFbXB0eSBtb2RlbCwgd2hpY2ggaXMgYXZhaWxhYmxlXG4gICAqIGFzIHBhcnQgb2YgdGhlIG1vZGVsIGNvbGxlY3Rpb24gYnkgZGVmYXVsdC4gVGhpcyBjYW4gYmUgdXNlZCBmb3IgbWFwcGluZ1xuICAgKiBKU09OIHJlc3BvbnNlcyBmcm9tIGFuIGludGVncmF0aW9uIHRvIHdoYXQgaXMgcmV0dXJuZWQgdG8gYSBjbGllbnQsXG4gICAqIHdoZXJlIHN0cm9uZyB0eXBpbmcgaXMgbm90IHJlcXVpcmVkLiBJbiB0aGUgYWJzZW5jZSBvZiBhbnkgZGVmaW5lZFxuICAgKiBtb2RlbCwgdGhlIEVtcHR5IG1vZGVsIHdpbGwgYmUgdXNlZCB0byByZXR1cm4gdGhlIHJlc3BvbnNlIHBheWxvYWRcbiAgICogdW5tYXBwZWQuXG4gICAqXG4gICAqIERlZmluaXRpb25cbiAgICoge1xuICAgKiAgIFwiJHNjaGVtYVwiIDogXCJodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA0L3NjaGVtYSNcIixcbiAgICogICBcInRpdGxlXCIgOiBcIkVtcHR5IFNjaGVtYVwiLFxuICAgKiAgIFwidHlwZVwiIDogXCJvYmplY3RcIlxuICAgKiB9XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmFtYXpvbmF3cy5jbi9lbl91cy9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9tb2RlbHMtbWFwcGluZ3MuaHRtbCNtb2RlbHMtbWFwcGluZ3MtbW9kZWxzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVNUFRZX01PREVMOiBJTW9kZWwgPSBuZXcgRW1wdHlNb2RlbCgpO1xuXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU1vZGVsTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBtb2RlbE5hbWU6IHN0cmluZyk6IElNb2RlbCB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTW9kZWwge1xuICAgICAgcHVibGljIHJlYWRvbmx5IG1vZGVsSWQgPSBtb2RlbE5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtb2RlbCBuYW1lLCBzdWNoIGFzICdteU1vZGVsJ1xuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbW9kZWxJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNb2RlbFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLm1vZGVsTmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1vZGVsUHJvcHM6IENmbk1vZGVsUHJvcHMgPSB7XG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHJlc3RBcGlJZDogcHJvcHMucmVzdEFwaS5yZXN0QXBpSWQsXG4gICAgICBjb250ZW50VHlwZTogcHJvcHMuY29udGVudFR5cGUgPz8gJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgc2NoZW1hOiB1dGlsLkpzb25TY2hlbWFNYXBwZXIudG9DZm5Kc29uU2NoZW1hKHByb3BzLnNjaGVtYSksXG4gICAgfTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbk1vZGVsKHRoaXMsICdSZXNvdXJjZScsIG1vZGVsUHJvcHMpO1xuXG4gICAgdGhpcy5tb2RlbElkID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcblxuICAgIGNvbnN0IGRlcGxveW1lbnQgPSAocHJvcHMucmVzdEFwaSBpbnN0YW5jZW9mIFJlc3RBcGkpID8gcHJvcHMucmVzdEFwaS5sYXRlc3REZXBsb3ltZW50IDogdW5kZWZpbmVkO1xuICAgIGlmIChkZXBsb3ltZW50KSB7XG4gICAgICBkZXBsb3ltZW50Lm5vZGUuYWRkRGVwZW5kZW5jeShyZXNvdXJjZSk7XG4gICAgICBkZXBsb3ltZW50LmFkZFRvTG9naWNhbElkKHsgbW9kZWw6IG1vZGVsUHJvcHMgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=