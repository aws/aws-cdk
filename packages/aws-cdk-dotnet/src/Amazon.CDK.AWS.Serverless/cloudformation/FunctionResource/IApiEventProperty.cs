using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api </remarks>
    [JsiiInterface(typeof(IApiEventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.ApiEventProperty")]
    public interface IApiEventProperty
    {
        /// <summary>``FunctionResource.ApiEventProperty.Method``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api </remarks>
        [JsiiProperty("method", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Method
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.ApiEventProperty.Path``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api </remarks>
        [JsiiProperty("path", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Path
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.ApiEventProperty.RestApiId``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api </remarks>
        [JsiiProperty("restApiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RestApiId
        {
            get;
            set;
        }
    }
}