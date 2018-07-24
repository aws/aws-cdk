using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html </remarks>
    [JsiiInterface(typeof(ICacheClusterResourceProps), "@aws-cdk/aws-elasticache.cloudformation.CacheClusterResourceProps")]
    public interface ICacheClusterResourceProps
    {
        /// <summary>``AWS::ElastiCache::CacheCluster.CacheNodeType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cachenodetype </remarks>
        [JsiiProperty("cacheNodeType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object CacheNodeType
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.Engine``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-engine </remarks>
        [JsiiProperty("engine", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Engine
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.NumCacheNodes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-numcachenodes </remarks>
        [JsiiProperty("numCacheNodes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object NumCacheNodes
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.AutoMinorVersionUpgrade``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-autominorversionupgrade </remarks>
        [JsiiProperty("autoMinorVersionUpgrade", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AutoMinorVersionUpgrade
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.AZMode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-azmode </remarks>
        [JsiiProperty("azMode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AzMode
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.CacheParameterGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cacheparametergroupname </remarks>
        [JsiiProperty("cacheParameterGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CacheParameterGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.CacheSecurityGroupNames``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cachesecuritygroupnames </remarks>
        [JsiiProperty("cacheSecurityGroupNames", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object CacheSecurityGroupNames
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.CacheSubnetGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cachesubnetgroupname </remarks>
        [JsiiProperty("cacheSubnetGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CacheSubnetGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.ClusterName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-clustername </remarks>
        [JsiiProperty("clusterName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ClusterName
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.EngineVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-engineversion </remarks>
        [JsiiProperty("engineVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EngineVersion
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.NotificationTopicArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-notificationtopicarn </remarks>
        [JsiiProperty("notificationTopicArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object NotificationTopicArn
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.Port``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-port </remarks>
        [JsiiProperty("port", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Port
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.PreferredAvailabilityZone``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-preferredavailabilityzone </remarks>
        [JsiiProperty("preferredAvailabilityZone", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PreferredAvailabilityZone
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.PreferredAvailabilityZones``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-preferredavailabilityzones </remarks>
        [JsiiProperty("preferredAvailabilityZones", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object PreferredAvailabilityZones
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.PreferredMaintenanceWindow``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-preferredmaintenancewindow </remarks>
        [JsiiProperty("preferredMaintenanceWindow", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PreferredMaintenanceWindow
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.SnapshotArns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotarns </remarks>
        [JsiiProperty("snapshotArns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object SnapshotArns
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.SnapshotName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotname </remarks>
        [JsiiProperty("snapshotName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SnapshotName
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.SnapshotRetentionLimit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotretentionlimit </remarks>
        [JsiiProperty("snapshotRetentionLimit", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SnapshotRetentionLimit
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.SnapshotWindow``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotwindow </remarks>
        [JsiiProperty("snapshotWindow", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SnapshotWindow
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::ElastiCache::CacheCluster.VpcSecurityGroupIds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-vpcsecuritygroupids </remarks>
        [JsiiProperty("vpcSecurityGroupIds", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object VpcSecurityGroupIds
        {
            get;
            set;
        }
    }
}