using Amazon.CDK;
using Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html </remarks>
    [JsiiInterface(typeof(IDeploymentGroupResourceProps), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResourceProps")]
    public interface IDeploymentGroupResourceProps
    {
        /// <summary>``AWS::CodeDeploy::DeploymentGroup.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-applicationname </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ApplicationName
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.ServiceRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-servicerolearn </remarks>
        [JsiiProperty("serviceRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ServiceRoleArn
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.AlarmConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-alarmconfiguration </remarks>
        [JsiiProperty("alarmConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.AlarmConfigurationProperty\"}]},\"optional\":true}")]
        object AlarmConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.AutoRollbackConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-autorollbackconfiguration </remarks>
        [JsiiProperty("autoRollbackConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.AutoRollbackConfigurationProperty\"}]},\"optional\":true}")]
        object AutoRollbackConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.AutoScalingGroups``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-autoscalinggroups </remarks>
        [JsiiProperty("autoScalingGroups", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object AutoScalingGroups
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.Deployment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-deployment </remarks>
        [JsiiProperty("deployment", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.DeploymentProperty\"}]},\"optional\":true}")]
        object Deployment
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.DeploymentConfigName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-deploymentconfigname </remarks>
        [JsiiProperty("deploymentConfigName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeploymentConfigName
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.DeploymentGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-deploymentgroupname </remarks>
        [JsiiProperty("deploymentGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeploymentGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.DeploymentStyle``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-deploymentstyle </remarks>
        [JsiiProperty("deploymentStyle", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.DeploymentStyleProperty\"}]},\"optional\":true}")]
        object DeploymentStyle
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.Ec2TagFilters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-ec2tagfilters </remarks>
        [JsiiProperty("ec2TagFilters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.EC2TagFilterProperty\"}]}}}}]},\"optional\":true}")]
        object Ec2TagFilters
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.LoadBalancerInfo``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-loadbalancerinfo </remarks>
        [JsiiProperty("loadBalancerInfo", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.LoadBalancerInfoProperty\"}]},\"optional\":true}")]
        object LoadBalancerInfo
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.OnPremisesInstanceTagFilters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-onpremisesinstancetagfilters </remarks>
        [JsiiProperty("onPremisesInstanceTagFilters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.TagFilterProperty\"}]}}}}]},\"optional\":true}")]
        object OnPremisesInstanceTagFilters
        {
            get;
            set;
        }

        /// <summary>``AWS::CodeDeploy::DeploymentGroup.TriggerConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-triggerconfigurations </remarks>
        [JsiiProperty("triggerConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.TriggerConfigProperty\"}]}}}}]},\"optional\":true}")]
        object TriggerConfigurations
        {
            get;
            set;
        }
    }
}