using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3 </remarks>
    [JsiiInterfaceProxy(typeof(IS3EventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.S3EventProperty")]
    internal class S3EventPropertyProxy : DeputyBase, IS3EventProperty
    {
        private S3EventPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.S3EventProperty.Bucket``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3 </remarks>
        [JsiiProperty("bucket", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Bucket
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FunctionResource.S3EventProperty.Events``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3 </remarks>
        [JsiiProperty("events", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object Events
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FunctionResource.S3EventProperty.Filter``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3 </remarks>
        [JsiiProperty("filter", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.S3NotificationFilterProperty\"}]},\"optional\":true}")]
        public virtual object Filter
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}