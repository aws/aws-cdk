using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html </remarks>
    public class JobFlowInstancesConfigProperty : DeputyBase, IJobFlowInstancesConfigProperty
    {
        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.AdditionalMasterSecurityGroups``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-additionalmastersecuritygroups </remarks>
        [JsiiProperty("additionalMasterSecurityGroups", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object AdditionalMasterSecurityGroups
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.AdditionalSlaveSecurityGroups``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-additionalslavesecuritygroups </remarks>
        [JsiiProperty("additionalSlaveSecurityGroups", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object AdditionalSlaveSecurityGroups
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.CoreInstanceFleet``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-coreinstancefleet </remarks>
        [JsiiProperty("coreInstanceFleet", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.InstanceFleetConfigProperty\"}]},\"optional\":true}", true)]
        public object CoreInstanceFleet
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.CoreInstanceGroup``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-coreinstancegroup </remarks>
        [JsiiProperty("coreInstanceGroup", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.InstanceGroupConfigProperty\"}]},\"optional\":true}", true)]
        public object CoreInstanceGroup
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.Ec2KeyName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-ec2keyname </remarks>
        [JsiiProperty("ec2KeyName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ec2KeyName
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.Ec2SubnetId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-ec2subnetid </remarks>
        [JsiiProperty("ec2SubnetId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ec2SubnetId
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.EmrManagedMasterSecurityGroup``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-emrmanagedmastersecuritygroup </remarks>
        [JsiiProperty("emrManagedMasterSecurityGroup", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EmrManagedMasterSecurityGroup
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.EmrManagedSlaveSecurityGroup``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-emrmanagedslavesecuritygroup </remarks>
        [JsiiProperty("emrManagedSlaveSecurityGroup", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EmrManagedSlaveSecurityGroup
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.HadoopVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-hadoopversion </remarks>
        [JsiiProperty("hadoopVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object HadoopVersion
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.MasterInstanceFleet``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-masterinstancefleet </remarks>
        [JsiiProperty("masterInstanceFleet", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.InstanceFleetConfigProperty\"}]},\"optional\":true}", true)]
        public object MasterInstanceFleet
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.MasterInstanceGroup``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-masterinstancegroup </remarks>
        [JsiiProperty("masterInstanceGroup", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.InstanceGroupConfigProperty\"}]},\"optional\":true}", true)]
        public object MasterInstanceGroup
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.Placement``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-placement </remarks>
        [JsiiProperty("placement", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.PlacementTypeProperty\"}]},\"optional\":true}", true)]
        public object Placement
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.ServiceAccessSecurityGroup``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-serviceaccesssecuritygroup </remarks>
        [JsiiProperty("serviceAccessSecurityGroup", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ServiceAccessSecurityGroup
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.JobFlowInstancesConfigProperty.TerminationProtected``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html#cfn-elasticmapreduce-cluster-jobflowinstancesconfig-terminationprotected </remarks>
        [JsiiProperty("terminationProtected", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object TerminationProtected
        {
            get;
            set;
        }
    }
}