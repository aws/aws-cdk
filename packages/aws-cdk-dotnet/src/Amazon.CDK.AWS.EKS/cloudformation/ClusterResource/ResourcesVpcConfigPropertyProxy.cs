using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EKS.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IResourcesVpcConfigProperty), "@aws-cdk/aws-eks.cloudformation.ClusterResource.ResourcesVpcConfigProperty")]
    internal class ResourcesVpcConfigPropertyProxy : DeputyBase, IResourcesVpcConfigProperty
    {
        private ResourcesVpcConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ClusterResource.ResourcesVpcConfigProperty.SecurityGroupIds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-securitygroupids </remarks>
        [JsiiProperty("securityGroupIds", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object SecurityGroupIds
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ClusterResource.ResourcesVpcConfigProperty.SubnetIds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-subnetids </remarks>
        [JsiiProperty("subnetIds", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object SubnetIds
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}