using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache.cloudformation.ReplicationGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html </remarks>
    [JsiiInterface(typeof(INodeGroupConfigurationProperty), "@aws-cdk/aws-elasticache.cloudformation.ReplicationGroupResource.NodeGroupConfigurationProperty")]
    public interface INodeGroupConfigurationProperty
    {
        /// <summary>``ReplicationGroupResource.NodeGroupConfigurationProperty.PrimaryAvailabilityZone``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html#cfn-elasticache-replicationgroup-nodegroupconfiguration-primaryavailabilityzone </remarks>
        [JsiiProperty("primaryAvailabilityZone", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PrimaryAvailabilityZone
        {
            get;
            set;
        }

        /// <summary>``ReplicationGroupResource.NodeGroupConfigurationProperty.ReplicaAvailabilityZones``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html#cfn-elasticache-replicationgroup-nodegroupconfiguration-replicaavailabilityzones </remarks>
        [JsiiProperty("replicaAvailabilityZones", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object ReplicaAvailabilityZones
        {
            get;
            set;
        }

        /// <summary>``ReplicationGroupResource.NodeGroupConfigurationProperty.ReplicaCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html#cfn-elasticache-replicationgroup-nodegroupconfiguration-replicacount </remarks>
        [JsiiProperty("replicaCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReplicaCount
        {
            get;
            set;
        }

        /// <summary>``ReplicationGroupResource.NodeGroupConfigurationProperty.Slots``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html#cfn-elasticache-replicationgroup-nodegroupconfiguration-slots </remarks>
        [JsiiProperty("slots", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Slots
        {
            get;
            set;
        }
    }
}