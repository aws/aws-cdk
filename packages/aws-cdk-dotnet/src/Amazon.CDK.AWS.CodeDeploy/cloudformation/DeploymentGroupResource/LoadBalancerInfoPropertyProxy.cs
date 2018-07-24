using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html </remarks>
    [JsiiInterfaceProxy(typeof(ILoadBalancerInfoProperty), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.LoadBalancerInfoProperty")]
    internal class LoadBalancerInfoPropertyProxy : DeputyBase, ILoadBalancerInfoProperty
    {
        private LoadBalancerInfoPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeploymentGroupResource.LoadBalancerInfoProperty.ElbInfoList``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html#cfn-codedeploy-deploymentgroup-loadbalancerinfo-elbinfolist </remarks>
        [JsiiProperty("elbInfoList", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.ELBInfoProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object ElbInfoList
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeploymentGroupResource.LoadBalancerInfoProperty.TargetGroupInfoList``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html#cfn-codedeploy-deploymentgroup-loadbalancerinfo-targetgroupinfolist </remarks>
        [JsiiProperty("targetGroupInfoList", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.TargetGroupInfoProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object TargetGroupInfoList
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}