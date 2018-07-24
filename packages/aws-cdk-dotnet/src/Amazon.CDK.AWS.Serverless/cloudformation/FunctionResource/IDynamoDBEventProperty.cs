using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb </remarks>
    [JsiiInterface(typeof(IDynamoDBEventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.DynamoDBEventProperty")]
    public interface IDynamoDBEventProperty
    {
        /// <summary>``FunctionResource.DynamoDBEventProperty.BatchSize``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb </remarks>
        [JsiiProperty("batchSize", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object BatchSize
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.DynamoDBEventProperty.StartingPosition``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb </remarks>
        [JsiiProperty("startingPosition", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object StartingPosition
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.DynamoDBEventProperty.Stream``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb </remarks>
        [JsiiProperty("stream", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Stream
        {
            get;
            set;
        }
    }
}