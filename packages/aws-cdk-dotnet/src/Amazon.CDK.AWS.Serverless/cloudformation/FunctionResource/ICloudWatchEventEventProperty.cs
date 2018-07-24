using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent </remarks>
    [JsiiInterface(typeof(ICloudWatchEventEventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.CloudWatchEventEventProperty")]
    public interface ICloudWatchEventEventProperty
    {
        /// <summary>``FunctionResource.CloudWatchEventEventProperty.Input``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent </remarks>
        [JsiiProperty("input", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Input
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.CloudWatchEventEventProperty.InputPath``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent </remarks>
        [JsiiProperty("inputPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InputPath
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.CloudWatchEventEventProperty.Pattern``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html </remarks>
        [JsiiProperty("pattern", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Pattern
        {
            get;
            set;
        }
    }
}