using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-triggerconfig.html </remarks>
    [JsiiInterface(typeof(ITriggerConfigProperty), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.TriggerConfigProperty")]
    public interface ITriggerConfigProperty
    {
        /// <summary>``DeploymentGroupResource.TriggerConfigProperty.TriggerEvents``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-triggerconfig.html#cfn-codedeploy-deploymentgroup-triggerconfig-triggerevents </remarks>
        [JsiiProperty("triggerEvents", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object TriggerEvents
        {
            get;
            set;
        }

        /// <summary>``DeploymentGroupResource.TriggerConfigProperty.TriggerName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-triggerconfig.html#cfn-codedeploy-deploymentgroup-triggerconfig-triggername </remarks>
        [JsiiProperty("triggerName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TriggerName
        {
            get;
            set;
        }

        /// <summary>``DeploymentGroupResource.TriggerConfigProperty.TriggerTargetArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-triggerconfig.html#cfn-codedeploy-deploymentgroup-triggerconfig-triggertargetarn </remarks>
        [JsiiProperty("triggerTargetArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TriggerTargetArn
        {
            get;
            set;
        }
    }
}