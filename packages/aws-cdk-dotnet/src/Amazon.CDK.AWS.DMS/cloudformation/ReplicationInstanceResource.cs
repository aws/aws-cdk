using Amazon.CDK;
using Amazon.CDK.AWS.DMS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.DMS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html </remarks>
    [JsiiClass(typeof(ReplicationInstanceResource), "@aws-cdk/aws-dms.cloudformation.ReplicationInstanceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-dms.cloudformation.ReplicationInstanceResourceProps\"}}]")]
    public class ReplicationInstanceResource : Resource
    {
        public ReplicationInstanceResource(Construct parent, string name, IReplicationInstanceResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ReplicationInstanceResource(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationInstanceResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ReplicationInstanceResource));
        /// <remarks>cloudformation_attribute: ReplicationInstancePrivateIpAddresses</remarks>
        [JsiiProperty("replicationInstancePrivateIpAddresses", "{\"fqn\":\"@aws-cdk/aws-dms.ReplicationInstancePrivateIpAddresses\"}")]
        public virtual ReplicationInstancePrivateIpAddresses ReplicationInstancePrivateIpAddresses
        {
            get => GetInstanceProperty<ReplicationInstancePrivateIpAddresses>();
        }

        /// <remarks>cloudformation_attribute: ReplicationInstancePublicIpAddresses</remarks>
        [JsiiProperty("replicationInstancePublicIpAddresses", "{\"fqn\":\"@aws-cdk/aws-dms.ReplicationInstancePublicIpAddresses\"}")]
        public virtual ReplicationInstancePublicIpAddresses ReplicationInstancePublicIpAddresses
        {
            get => GetInstanceProperty<ReplicationInstancePublicIpAddresses>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}