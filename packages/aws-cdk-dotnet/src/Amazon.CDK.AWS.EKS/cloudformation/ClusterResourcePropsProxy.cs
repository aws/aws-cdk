using Amazon.CDK;
using Amazon.CDK.AWS.EKS.cloudformation.ClusterResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EKS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html </remarks>
    [JsiiInterfaceProxy(typeof(IClusterResourceProps), "@aws-cdk/aws-eks.cloudformation.ClusterResourceProps")]
    internal class ClusterResourcePropsProxy : DeputyBase, IClusterResourceProps
    {
        private ClusterResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::EKS::Cluster.ResourcesVpcConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig </remarks>
        [JsiiProperty("resourcesVpcConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-eks.cloudformation.ClusterResource.ResourcesVpcConfigProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ResourcesVpcConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::EKS::Cluster.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::EKS::Cluster.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name </remarks>
        [JsiiProperty("clusterName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ClusterName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::EKS::Cluster.Version``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version </remarks>
        [JsiiProperty("version", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Version
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}