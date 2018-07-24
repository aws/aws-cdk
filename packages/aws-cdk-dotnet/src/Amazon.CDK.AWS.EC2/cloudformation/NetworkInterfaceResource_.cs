using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-interface.html </remarks>
    [JsiiClass(typeof(NetworkInterfaceResource_), "@aws-cdk/aws-ec2.cloudformation.NetworkInterfaceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.NetworkInterfaceResourceProps\"}}]")]
    public class NetworkInterfaceResource_ : Resource
    {
        public NetworkInterfaceResource_(Construct parent, string name, INetworkInterfaceResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected NetworkInterfaceResource_(ByRefValue reference): base(reference)
        {
        }

        protected NetworkInterfaceResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(NetworkInterfaceResource_));
        /// <remarks>cloudformation_attribute: PrimaryPrivateIpAddress</remarks>
        [JsiiProperty("networkInterfacePrimaryPrivateIpAddress", "{\"fqn\":\"@aws-cdk/aws-ec2.NetworkInterfacePrimaryPrivateIpAddress\"}")]
        public virtual NetworkInterfacePrimaryPrivateIpAddress NetworkInterfacePrimaryPrivateIpAddress
        {
            get => GetInstanceProperty<NetworkInterfacePrimaryPrivateIpAddress>();
        }

        /// <remarks>cloudformation_attribute: SecondaryPrivateIpAddresses</remarks>
        [JsiiProperty("networkInterfaceSecondaryPrivateIpAddresses", "{\"fqn\":\"@aws-cdk/aws-ec2.NetworkInterfaceSecondaryPrivateIpAddresses\"}")]
        public virtual NetworkInterfaceSecondaryPrivateIpAddresses NetworkInterfaceSecondaryPrivateIpAddresses
        {
            get => GetInstanceProperty<NetworkInterfaceSecondaryPrivateIpAddresses>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}