using Amazon.CDK;
using Amazon.CDK.AWS.KinesisFirehose;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html </remarks>
    [JsiiClass(typeof(DeliveryStreamResource_), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResourceProps\",\"optional\":true}}]")]
    public class DeliveryStreamResource_ : Resource
    {
        public DeliveryStreamResource_(Construct parent, string name, IDeliveryStreamResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DeliveryStreamResource_(ByRefValue reference): base(reference)
        {
        }

        protected DeliveryStreamResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DeliveryStreamResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("deliveryStreamArn", "{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.DeliveryStreamArn\"}")]
        public virtual DeliveryStreamArn DeliveryStreamArn
        {
            get => GetInstanceProperty<DeliveryStreamArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}