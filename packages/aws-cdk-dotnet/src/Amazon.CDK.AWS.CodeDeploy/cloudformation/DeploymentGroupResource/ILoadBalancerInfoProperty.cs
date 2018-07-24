using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html </remarks>
    [JsiiInterface(typeof(ILoadBalancerInfoProperty), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.LoadBalancerInfoProperty")]
    public interface ILoadBalancerInfoProperty
    {
        /// <summary>``DeploymentGroupResource.LoadBalancerInfoProperty.ElbInfoList``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html#cfn-codedeploy-deploymentgroup-loadbalancerinfo-elbinfolist </remarks>
        [JsiiProperty("elbInfoList", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.ELBInfoProperty\"}]}}}}]},\"optional\":true}")]
        object ElbInfoList
        {
            get;
            set;
        }

        /// <summary>``DeploymentGroupResource.LoadBalancerInfoProperty.TargetGroupInfoList``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html#cfn-codedeploy-deploymentgroup-loadbalancerinfo-targetgroupinfolist </remarks>
        [JsiiProperty("targetGroupInfoList", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.TargetGroupInfoProperty\"}]}}}}]},\"optional\":true}")]
        object TargetGroupInfoList
        {
            get;
            set;
        }
    }
}