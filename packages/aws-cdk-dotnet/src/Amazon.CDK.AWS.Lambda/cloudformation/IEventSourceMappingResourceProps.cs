using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html </remarks>
    [JsiiInterface(typeof(IEventSourceMappingResourceProps), "@aws-cdk/aws-lambda.cloudformation.EventSourceMappingResourceProps")]
    public interface IEventSourceMappingResourceProps
    {
        /// <summary>``AWS::Lambda::EventSourceMapping.EventSourceArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-eventsourcearn </remarks>
        [JsiiProperty("eventSourceArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object EventSourceArn
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::EventSourceMapping.FunctionName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-functionname </remarks>
        [JsiiProperty("functionName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object FunctionName
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::EventSourceMapping.BatchSize``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-batchsize </remarks>
        [JsiiProperty("batchSize", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object BatchSize
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::EventSourceMapping.Enabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-enabled </remarks>
        [JsiiProperty("enabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Enabled
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::EventSourceMapping.StartingPosition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-startingposition </remarks>
        [JsiiProperty("startingPosition", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object StartingPosition
        {
            get;
            set;
        }
    }
}