using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-gatewayrouteprop.html </remarks>
    [JsiiClass(typeof(VPNGatewayRoutePropagationResource), "@aws-cdk/aws-ec2.cloudformation.VPNGatewayRoutePropagationResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.VPNGatewayRoutePropagationResourceProps\"}}]")]
    public class VPNGatewayRoutePropagationResource : Resource
    {
        public VPNGatewayRoutePropagationResource(Construct parent, string name, IVPNGatewayRoutePropagationResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected VPNGatewayRoutePropagationResource(ByRefValue reference): base(reference)
        {
        }

        protected VPNGatewayRoutePropagationResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(VPNGatewayRoutePropagationResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}