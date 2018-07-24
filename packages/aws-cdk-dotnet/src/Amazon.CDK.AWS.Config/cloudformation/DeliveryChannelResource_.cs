using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Config.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html </remarks>
    [JsiiClass(typeof(DeliveryChannelResource_), "@aws-cdk/aws-config.cloudformation.DeliveryChannelResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-config.cloudformation.DeliveryChannelResourceProps\"}}]")]
    public class DeliveryChannelResource_ : Resource
    {
        public DeliveryChannelResource_(Construct parent, string name, IDeliveryChannelResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DeliveryChannelResource_(ByRefValue reference): base(reference)
        {
        }

        protected DeliveryChannelResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DeliveryChannelResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}