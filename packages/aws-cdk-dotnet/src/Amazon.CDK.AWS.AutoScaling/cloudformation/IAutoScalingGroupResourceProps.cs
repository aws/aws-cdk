using Amazon.CDK;
using Amazon.CDK.AWS.AutoScaling.cloudformation.AutoScalingGroupResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html </remarks>
    [JsiiInterface(typeof(IAutoScalingGroupResourceProps), "@aws-cdk/aws-autoscaling.cloudformation.AutoScalingGroupResourceProps")]
    public interface IAutoScalingGroupResourceProps
    {
        /// <summary>``AWS::AutoScaling::AutoScalingGroup.MaxSize``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-maxsize </remarks>
        [JsiiProperty("maxSize", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MaxSize
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.MinSize``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-minsize </remarks>
        [JsiiProperty("minSize", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MinSize
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.AutoScalingGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-autoscaling-autoscalinggroup-autoscalinggroupname </remarks>
        [JsiiProperty("autoScalingGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AutoScalingGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.AvailabilityZones``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-availabilityzones </remarks>
        [JsiiProperty("availabilityZones", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object AvailabilityZones
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.Cooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-cooldown </remarks>
        [JsiiProperty("cooldown", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Cooldown
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.DesiredCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-desiredcapacity </remarks>
        [JsiiProperty("desiredCapacity", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DesiredCapacity
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.HealthCheckGracePeriod``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-healthcheckgraceperiod </remarks>
        [JsiiProperty("healthCheckGracePeriod", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HealthCheckGracePeriod
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.HealthCheckType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-healthchecktype </remarks>
        [JsiiProperty("healthCheckType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HealthCheckType
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.InstanceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-instanceid </remarks>
        [JsiiProperty("instanceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InstanceId
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.LaunchConfigurationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-launchconfigurationname </remarks>
        [JsiiProperty("launchConfigurationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object LaunchConfigurationName
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.LifecycleHookSpecificationList``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-autoscaling-autoscalinggroup-lifecyclehookspecificationlist </remarks>
        [JsiiProperty("lifecycleHookSpecificationList", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscaling.cloudformation.AutoScalingGroupResource.LifecycleHookSpecificationProperty\"}]}}}}]},\"optional\":true}")]
        object LifecycleHookSpecificationList
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.LoadBalancerNames``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-loadbalancernames </remarks>
        [JsiiProperty("loadBalancerNames", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object LoadBalancerNames
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.MetricsCollection``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-metricscollection </remarks>
        [JsiiProperty("metricsCollection", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscaling.cloudformation.AutoScalingGroupResource.MetricsCollectionProperty\"}]}}}}]},\"optional\":true}")]
        object MetricsCollection
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.NotificationConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-notificationconfigurations </remarks>
        [JsiiProperty("notificationConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscaling.cloudformation.AutoScalingGroupResource.NotificationConfigurationProperty\"}]}}}}]},\"optional\":true}")]
        object NotificationConfigurations
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.PlacementGroup``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-placementgroup </remarks>
        [JsiiProperty("placementGroup", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PlacementGroup
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.ServiceLinkedRoleARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-autoscaling-autoscalinggroup-servicelinkedrolearn </remarks>
        [JsiiProperty("serviceLinkedRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ServiceLinkedRoleArn
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscaling.cloudformation.AutoScalingGroupResource.TagPropertyProperty\"}]}}}}]},\"optional\":true}")]
        object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.TargetGroupARNs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-targetgrouparns </remarks>
        [JsiiProperty("targetGroupArns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object TargetGroupArns
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.TerminationPolicies``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-termpolicy </remarks>
        [JsiiProperty("terminationPolicies", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object TerminationPolicies
        {
            get;
            set;
        }

        /// <summary>``AWS::AutoScaling::AutoScalingGroup.VPCZoneIdentifier``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-vpczoneidentifier </remarks>
        [JsiiProperty("vpcZoneIdentifier", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object VpcZoneIdentifier
        {
            get;
            set;
        }
    }
}