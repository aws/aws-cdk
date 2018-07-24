using Amazon.CDK;
using Amazon.CDK.AWS.EKS.cloudformation.ClusterResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EKS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html </remarks>
    public class ClusterResourceProps : DeputyBase, IClusterResourceProps
    {
        /// <summary>``AWS::EKS::Cluster.ResourcesVpcConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig </remarks>
        [JsiiProperty("resourcesVpcConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-eks.cloudformation.ClusterResource.ResourcesVpcConfigProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ResourcesVpcConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::EKS::Cluster.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RoleArn
        {
            get;
            set;
        }

        /// <summary>``AWS::EKS::Cluster.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name </remarks>
        [JsiiProperty("clusterName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ClusterName
        {
            get;
            set;
        }

        /// <summary>``AWS::EKS::Cluster.Version``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version </remarks>
        [JsiiProperty("version", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Version
        {
            get;
            set;
        }
    }
}