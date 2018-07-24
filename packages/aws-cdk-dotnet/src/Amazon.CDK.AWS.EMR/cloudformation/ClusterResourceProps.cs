using Amazon.CDK;
using Amazon.CDK.AWS.EMR.cloudformation.ClusterResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.EMR.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html </remarks>
    public class ClusterResourceProps : DeputyBase, IClusterResourceProps
    {
        /// <summary>``AWS::EMR::Cluster.Instances``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-instances </remarks>
        [JsiiProperty("instances", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.JobFlowInstancesConfigProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Instances
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.JobFlowRole``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-jobflowrole </remarks>
        [JsiiProperty("jobFlowRole", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object JobFlowRole
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-name </remarks>
        [JsiiProperty("clusterName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ClusterName
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.ServiceRole``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-servicerole </remarks>
        [JsiiProperty("serviceRole", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ServiceRole
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.AdditionalInfo``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-additionalinfo </remarks>
        [JsiiProperty("additionalInfo", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AdditionalInfo
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.Applications``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-applications </remarks>
        [JsiiProperty("applications", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.ApplicationProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Applications
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.AutoScalingRole``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-autoscalingrole </remarks>
        [JsiiProperty("autoScalingRole", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AutoScalingRole
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.BootstrapActions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-bootstrapactions </remarks>
        [JsiiProperty("bootstrapActions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.BootstrapActionConfigProperty\"}]}}}}]},\"optional\":true}", true)]
        public object BootstrapActions
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.Configurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-configurations </remarks>
        [JsiiProperty("configurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.ConfigurationProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Configurations
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.CustomAmiId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-customamiid </remarks>
        [JsiiProperty("customAmiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CustomAmiId
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.EbsRootVolumeSize``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-ebsrootvolumesize </remarks>
        [JsiiProperty("ebsRootVolumeSize", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EbsRootVolumeSize
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.LogUri``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-loguri </remarks>
        [JsiiProperty("logUri", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object LogUri
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.ReleaseLabel``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-releaselabel </remarks>
        [JsiiProperty("releaseLabel", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ReleaseLabel
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.ScaleDownBehavior``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-scaledownbehavior </remarks>
        [JsiiProperty("scaleDownBehavior", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ScaleDownBehavior
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.SecurityConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-securityconfiguration </remarks>
        [JsiiProperty("securityConfiguration", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SecurityConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}", true)]
        public object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::Cluster.VisibleToAllUsers``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html#cfn-elasticmapreduce-cluster-visibletoallusers </remarks>
        [JsiiProperty("visibleToAllUsers", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object VisibleToAllUsers
        {
            get;
            set;
        }
    }
}