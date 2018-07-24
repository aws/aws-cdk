using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html </remarks>
    [JsiiClass(typeof(NetworkAclEntryResource_), "@aws-cdk/aws-ec2.cloudformation.NetworkAclEntryResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.NetworkAclEntryResourceProps\"}}]")]
    public class NetworkAclEntryResource_ : Resource
    {
        public NetworkAclEntryResource_(Construct parent, string name, INetworkAclEntryResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected NetworkAclEntryResource_(ByRefValue reference): base(reference)
        {
        }

        protected NetworkAclEntryResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(NetworkAclEntryResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}