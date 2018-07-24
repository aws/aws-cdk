using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis </remarks>
    public class KinesisEventProperty : DeputyBase, IKinesisEventProperty
    {
        /// <summary>``FunctionResource.KinesisEventProperty.BatchSize``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis </remarks>
        [JsiiProperty("batchSize", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object BatchSize
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.KinesisEventProperty.StartingPosition``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis </remarks>
        [JsiiProperty("startingPosition", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object StartingPosition
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.KinesisEventProperty.Stream``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis </remarks>
        [JsiiProperty("stream", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Stream
        {
            get;
            set;
        }
    }
}