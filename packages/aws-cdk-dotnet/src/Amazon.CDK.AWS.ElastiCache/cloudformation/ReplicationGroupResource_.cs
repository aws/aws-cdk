using Amazon.CDK;
using Amazon.CDK.AWS.ElastiCache;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ElastiCache.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html </remarks>
    [JsiiClass(typeof(ReplicationGroupResource_), "@aws-cdk/aws-elasticache.cloudformation.ReplicationGroupResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticache.cloudformation.ReplicationGroupResourceProps\"}}]")]
    public class ReplicationGroupResource_ : Resource
    {
        public ReplicationGroupResource_(Construct parent, string name, IReplicationGroupResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ReplicationGroupResource_(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationGroupResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ReplicationGroupResource_));
        /// <remarks>cloudformation_attribute: ConfigurationEndPoint.Address</remarks>
        [JsiiProperty("replicationGroupConfigurationEndPointAddress", "{\"fqn\":\"@aws-cdk/aws-elasticache.ReplicationGroupConfigurationEndPointAddress\"}")]
        public virtual ReplicationGroupConfigurationEndPointAddress ReplicationGroupConfigurationEndPointAddress
        {
            get => GetInstanceProperty<ReplicationGroupConfigurationEndPointAddress>();
        }

        /// <remarks>cloudformation_attribute: ConfigurationEndPoint.Port</remarks>
        [JsiiProperty("replicationGroupConfigurationEndPointPort", "{\"fqn\":\"@aws-cdk/aws-elasticache.ReplicationGroupConfigurationEndPointPort\"}")]
        public virtual ReplicationGroupConfigurationEndPointPort ReplicationGroupConfigurationEndPointPort
        {
            get => GetInstanceProperty<ReplicationGroupConfigurationEndPointPort>();
        }

        /// <remarks>cloudformation_attribute: PrimaryEndPoint.Address</remarks>
        [JsiiProperty("replicationGroupPrimaryEndPointAddress", "{\"fqn\":\"@aws-cdk/aws-elasticache.ReplicationGroupPrimaryEndPointAddress\"}")]
        public virtual ReplicationGroupPrimaryEndPointAddress ReplicationGroupPrimaryEndPointAddress
        {
            get => GetInstanceProperty<ReplicationGroupPrimaryEndPointAddress>();
        }

        /// <remarks>cloudformation_attribute: PrimaryEndPoint.Port</remarks>
        [JsiiProperty("replicationGroupPrimaryEndPointPort", "{\"fqn\":\"@aws-cdk/aws-elasticache.ReplicationGroupPrimaryEndPointPort\"}")]
        public virtual ReplicationGroupPrimaryEndPointPort ReplicationGroupPrimaryEndPointPort
        {
            get => GetInstanceProperty<ReplicationGroupPrimaryEndPointPort>();
        }

        /// <remarks>cloudformation_attribute: ReadEndPoint.Addresses</remarks>
        [JsiiProperty("replicationGroupReadEndPointAddresses", "{\"fqn\":\"@aws-cdk/aws-elasticache.ReplicationGroupReadEndPointAddresses\"}")]
        public virtual ReplicationGroupReadEndPointAddresses ReplicationGroupReadEndPointAddresses
        {
            get => GetInstanceProperty<ReplicationGroupReadEndPointAddresses>();
        }

        /// <remarks>cloudformation_attribute: ReadEndPoint.Addresses.List</remarks>
        [JsiiProperty("replicationGroupReadEndPointAddressesList", "{\"fqn\":\"@aws-cdk/aws-elasticache.ReplicationGroupReadEndPointAddressesList\"}")]
        public virtual ReplicationGroupReadEndPointAddressesList ReplicationGroupReadEndPointAddressesList
        {
            get => GetInstanceProperty<ReplicationGroupReadEndPointAddressesList>();
        }

        /// <remarks>cloudformation_attribute: ReadEndPoint.Ports</remarks>
        [JsiiProperty("replicationGroupReadEndPointPorts", "{\"fqn\":\"@aws-cdk/aws-elasticache.ReplicationGroupReadEndPointPorts\"}")]
        public virtual ReplicationGroupReadEndPointPorts ReplicationGroupReadEndPointPorts
        {
            get => GetInstanceProperty<ReplicationGroupReadEndPointPorts>();
        }

        /// <remarks>cloudformation_attribute: ReadEndPoint.Ports.List</remarks>
        [JsiiProperty("replicationGroupReadEndPointPortsList", "{\"fqn\":\"@aws-cdk/aws-elasticache.ReplicationGroupReadEndPointPortsList\"}")]
        public virtual ReplicationGroupReadEndPointPortsList ReplicationGroupReadEndPointPortsList
        {
            get => GetInstanceProperty<ReplicationGroupReadEndPointPortsList>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}