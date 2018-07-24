using Amazon.CDK;
using Amazon.CDK.AWS.APIGateway.cloudformation.MethodResource;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html </remarks>
    [JsiiInterface(typeof(IMethodResourceProps), "@aws-cdk/aws-apigateway.cloudformation.MethodResourceProps")]
    public interface IMethodResourceProps
    {
        /// <summary>``AWS::ApiGateway::Method.HttpMethod``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-httpmethod </remarks>
        [JsiiProperty("httpMethod", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object HttpMethod
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.ResourceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-resourceid </remarks>
        [JsiiProperty("resourceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ResourceId
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.RestApiId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-restapiid </remarks>
        [JsiiProperty("restApiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RestApiId
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.ApiKeyRequired``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-apikeyrequired </remarks>
        [JsiiProperty("apiKeyRequired", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ApiKeyRequired
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.AuthorizationType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-authorizationtype </remarks>
        [JsiiProperty("authorizationType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AuthorizationType
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.AuthorizerId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-authorizerid </remarks>
        [JsiiProperty("authorizerId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AuthorizerId
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.Integration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-integration </remarks>
        [JsiiProperty("integration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.MethodResource.IntegrationProperty\"}]},\"optional\":true}")]
        object Integration
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.MethodResponses``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-methodresponses </remarks>
        [JsiiProperty("methodResponses", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.MethodResource.MethodResponseProperty\"}]}}}}]},\"optional\":true}")]
        object MethodResponses
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.OperationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-operationname </remarks>
        [JsiiProperty("operationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OperationName
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.RequestModels``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-requestmodels </remarks>
        [JsiiProperty("requestModels", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object RequestModels
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.RequestParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-requestparameters </remarks>
        [JsiiProperty("requestParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object RequestParameters
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::Method.RequestValidatorId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-requestvalidatorid </remarks>
        [JsiiProperty("requestValidatorId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RequestValidatorId
        {
            get;
            set;
        }
    }
}