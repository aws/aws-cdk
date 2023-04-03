"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerImageFunction = exports.DockerImageCode = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_ecr_assets_1 = require("@aws-cdk/aws-ecr-assets");
const code_1 = require("./code");
const function_1 = require("./function");
const handler_1 = require("./handler");
const runtime_1 = require("./runtime");
/**
 * Code property for the DockerImageFunction construct
 */
class DockerImageCode {
    /**
     * Use an existing ECR image as the Lambda code.
     * @param repository the ECR repository that the image is in
     * @param props properties to further configure the selected image
     */
    static fromEcr(repository, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EcrImageCodeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromEcr);
            }
            throw error;
        }
        return {
            _bind() {
                return new code_1.EcrImageCode(repository, props);
            },
        };
    }
    /**
     * Create an ECR image from the specified asset and bind it as the Lambda code.
     * @param directory the directory from which the asset must be created
     * @param props properties to further configure the selected image
     */
    static fromImageAsset(directory, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AssetImageCodeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromImageAsset);
            }
            throw error;
        }
        return {
            _bind(architecture) {
                return new code_1.AssetImageCode(directory, {
                    // determine the platform from `architecture`.
                    ...architecture?.dockerPlatform ? { platform: aws_ecr_assets_1.Platform.custom(architecture.dockerPlatform) } : {},
                    ...props,
                });
            },
        };
    }
}
exports.DockerImageCode = DockerImageCode;
_a = JSII_RTTI_SYMBOL_1;
DockerImageCode[_a] = { fqn: "@aws-cdk/aws-lambda.DockerImageCode", version: "0.0.0" };
/**
 * Create a lambda function where the handler is a docker image
 */
class DockerImageFunction extends function_1.Function {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            handler: handler_1.Handler.FROM_IMAGE,
            runtime: runtime_1.Runtime.FROM_IMAGE,
            code: props.code._bind(props.architecture),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_DockerImageFunctionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, DockerImageFunction);
            }
            throw error;
        }
    }
}
exports.DockerImageFunction = DockerImageFunction;
_b = JSII_RTTI_SYMBOL_1;
DockerImageFunction[_b] = { fqn: "@aws-cdk/aws-lambda.DockerImageFunction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtZnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbWFnZS1mdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw0REFBbUQ7QUFHbkQsaUNBQW9HO0FBQ3BHLHlDQUF1RDtBQUN2RCx1Q0FBb0M7QUFDcEMsdUNBQW9DO0FBY3BDOztHQUVHO0FBQ0gsTUFBc0IsZUFBZTtJQUNuQzs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUEyQixFQUFFLEtBQXlCOzs7Ozs7Ozs7O1FBQzFFLE9BQU87WUFDTCxLQUFLO2dCQUNILE9BQU8sSUFBSSxtQkFBWSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3QyxDQUFDO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBaUIsRUFBRSxRQUE2QixFQUFFOzs7Ozs7Ozs7O1FBQzdFLE9BQU87WUFDTCxLQUFLLENBQUMsWUFBMkI7Z0JBQy9CLE9BQU8sSUFBSSxxQkFBYyxDQUFDLFNBQVMsRUFBRTtvQkFDbkMsOENBQThDO29CQUM5QyxHQUFHLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLHlCQUFRLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNqRyxHQUFHLEtBQUs7aUJBQ1QsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztTQUNGLENBQUM7S0FDSDs7QUE3QkgsMENBb0NDOzs7QUFFRDs7R0FFRztBQUNILE1BQWEsbUJBQW9CLFNBQVEsbUJBQVE7SUFDL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjtRQUN2RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLEdBQUcsS0FBSztZQUNSLE9BQU8sRUFBRSxpQkFBTyxDQUFDLFVBQVU7WUFDM0IsT0FBTyxFQUFFLGlCQUFPLENBQUMsVUFBVTtZQUMzQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztTQUMzQyxDQUFDLENBQUM7Ozs7OzsrQ0FQTSxtQkFBbUI7Ozs7S0FRN0I7O0FBUkgsa0RBU0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3ItYXNzZXRzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQXJjaGl0ZWN0dXJlIH0gZnJvbSAnLi9hcmNoaXRlY3R1cmUnO1xuaW1wb3J0IHsgQXNzZXRJbWFnZUNvZGUsIEFzc2V0SW1hZ2VDb2RlUHJvcHMsIEVjckltYWdlQ29kZSwgRWNySW1hZ2VDb2RlUHJvcHMsIENvZGUgfSBmcm9tICcuL2NvZGUnO1xuaW1wb3J0IHsgRnVuY3Rpb24sIEZ1bmN0aW9uT3B0aW9ucyB9IGZyb20gJy4vZnVuY3Rpb24nO1xuaW1wb3J0IHsgSGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcic7XG5pbXBvcnQgeyBSdW50aW1lIH0gZnJvbSAnLi9ydW50aW1lJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGNvbmZpZ3VyZSBhIG5ldyBEb2NrZXJJbWFnZUZ1bmN0aW9uIGNvbnN0cnVjdC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEb2NrZXJJbWFnZUZ1bmN0aW9uUHJvcHMgZXh0ZW5kcyBGdW5jdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHNvdXJjZSBjb2RlIG9mIHlvdXIgTGFtYmRhIGZ1bmN0aW9uLiBZb3UgY2FuIHBvaW50IHRvIGEgZmlsZSBpbiBhblxuICAgKiBBbWF6b24gU2ltcGxlIFN0b3JhZ2UgU2VydmljZSAoQW1hem9uIFMzKSBidWNrZXQgb3Igc3BlY2lmeSB5b3VyIHNvdXJjZVxuICAgKiBjb2RlIGFzIGlubGluZSB0ZXh0LlxuICAgKi9cbiAgcmVhZG9ubHkgY29kZTogRG9ja2VySW1hZ2VDb2RlO1xufVxuXG4vKipcbiAqIENvZGUgcHJvcGVydHkgZm9yIHRoZSBEb2NrZXJJbWFnZUZ1bmN0aW9uIGNvbnN0cnVjdFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRG9ja2VySW1hZ2VDb2RlIHtcbiAgLyoqXG4gICAqIFVzZSBhbiBleGlzdGluZyBFQ1IgaW1hZ2UgYXMgdGhlIExhbWJkYSBjb2RlLlxuICAgKiBAcGFyYW0gcmVwb3NpdG9yeSB0aGUgRUNSIHJlcG9zaXRvcnkgdGhhdCB0aGUgaW1hZ2UgaXMgaW5cbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgdG8gZnVydGhlciBjb25maWd1cmUgdGhlIHNlbGVjdGVkIGltYWdlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FY3IocmVwb3NpdG9yeTogZWNyLklSZXBvc2l0b3J5LCBwcm9wcz86IEVjckltYWdlQ29kZVByb3BzKTogRG9ja2VySW1hZ2VDb2RlIHtcbiAgICByZXR1cm4ge1xuICAgICAgX2JpbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRWNySW1hZ2VDb2RlKHJlcG9zaXRvcnksIHByb3BzKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRUNSIGltYWdlIGZyb20gdGhlIHNwZWNpZmllZCBhc3NldCBhbmQgYmluZCBpdCBhcyB0aGUgTGFtYmRhIGNvZGUuXG4gICAqIEBwYXJhbSBkaXJlY3RvcnkgdGhlIGRpcmVjdG9yeSBmcm9tIHdoaWNoIHRoZSBhc3NldCBtdXN0IGJlIGNyZWF0ZWRcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgdG8gZnVydGhlciBjb25maWd1cmUgdGhlIHNlbGVjdGVkIGltYWdlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21JbWFnZUFzc2V0KGRpcmVjdG9yeTogc3RyaW5nLCBwcm9wczogQXNzZXRJbWFnZUNvZGVQcm9wcyA9IHt9KTogRG9ja2VySW1hZ2VDb2RlIHtcbiAgICByZXR1cm4ge1xuICAgICAgX2JpbmQoYXJjaGl0ZWN0dXJlPzogQXJjaGl0ZWN0dXJlKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRJbWFnZUNvZGUoZGlyZWN0b3J5LCB7XG4gICAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBwbGF0Zm9ybSBmcm9tIGBhcmNoaXRlY3R1cmVgLlxuICAgICAgICAgIC4uLmFyY2hpdGVjdHVyZT8uZG9ja2VyUGxhdGZvcm0gPyB7IHBsYXRmb3JtOiBQbGF0Zm9ybS5jdXN0b20oYXJjaGl0ZWN0dXJlLmRvY2tlclBsYXRmb3JtKSB9IDoge30sXG4gICAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgYSBgQ29kZWAgaW5zdGFuY2UgZnJvbSB0aGlzIGBEb2NrZXJJbWFnZUNvZGVgLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBfYmluZChhcmNoaXRlY3R1cmU/OiBBcmNoaXRlY3R1cmUpOiBDb2RlO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGxhbWJkYSBmdW5jdGlvbiB3aGVyZSB0aGUgaGFuZGxlciBpcyBhIGRvY2tlciBpbWFnZVxuICovXG5leHBvcnQgY2xhc3MgRG9ja2VySW1hZ2VGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERvY2tlckltYWdlRnVuY3Rpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICBoYW5kbGVyOiBIYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICBydW50aW1lOiBSdW50aW1lLkZST01fSU1BR0UsXG4gICAgICBjb2RlOiBwcm9wcy5jb2RlLl9iaW5kKHByb3BzLmFyY2hpdGVjdHVyZSksXG4gICAgfSk7XG4gIH1cbn0iXX0=