using Amazon.CDK;
using Amazon.CDK.AWS.Kinesis;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Kinesis.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html </remarks>
    [JsiiClass(typeof(StreamResource_), "@aws-cdk/aws-kinesis.cloudformation.StreamResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-kinesis.cloudformation.StreamResourceProps\"}}]")]
    public class StreamResource_ : Resource
    {
        public StreamResource_(Construct parent, string name, IStreamResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected StreamResource_(ByRefValue reference): base(reference)
        {
        }

        protected StreamResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(StreamResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("streamArn", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamArn\"}")]
        public virtual StreamArn StreamArn
        {
            get => GetInstanceProperty<StreamArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}