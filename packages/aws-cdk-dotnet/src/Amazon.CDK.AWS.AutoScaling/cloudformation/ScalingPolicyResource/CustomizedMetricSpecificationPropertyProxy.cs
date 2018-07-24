using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(ICustomizedMetricSpecificationProperty), "@aws-cdk/aws-autoscaling.cloudformation.ScalingPolicyResource.CustomizedMetricSpecificationProperty")]
    internal class CustomizedMetricSpecificationPropertyProxy : DeputyBase, ICustomizedMetricSpecificationProperty
    {
        private CustomizedMetricSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.Dimensions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-dimensions </remarks>
        [JsiiProperty("dimensions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscaling.cloudformation.ScalingPolicyResource.MetricDimensionProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object Dimensions
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.MetricName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-metricname </remarks>
        [JsiiProperty("metricName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object MetricName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.Namespace``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-namespace </remarks>
        [JsiiProperty("namespace", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Namespace
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.Statistic``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-statistic </remarks>
        [JsiiProperty("statistic", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Statistic
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.Unit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-customizedmetricspecification.html#cfn-autoscaling-scalingpolicy-customizedmetricspecification-unit </remarks>
        [JsiiProperty("unit", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Unit
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}