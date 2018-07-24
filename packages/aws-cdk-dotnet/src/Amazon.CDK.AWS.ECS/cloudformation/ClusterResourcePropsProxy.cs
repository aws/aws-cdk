using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html </remarks>
    [JsiiInterfaceProxy(typeof(IClusterResourceProps), "@aws-cdk/aws-ecs.cloudformation.ClusterResourceProps")]
    internal class ClusterResourcePropsProxy : DeputyBase, IClusterResourceProps
    {
        private ClusterResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::ECS::Cluster.ClusterName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-clustername </remarks>
        [JsiiProperty("clusterName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ClusterName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}