using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html </remarks>
    [JsiiInterface(typeof(ICustomizedMetricSpecificationProperty), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.CustomizedMetricSpecificationProperty")]
    public interface ICustomizedMetricSpecificationProperty
    {
        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.Dimensions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-dimensions </remarks>
        [JsiiProperty("dimensions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.MetricDimensionProperty\"}]}}}}]},\"optional\":true}")]
        object Dimensions
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.MetricName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-metricname </remarks>
        [JsiiProperty("metricName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MetricName
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.Namespace``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-namespace </remarks>
        [JsiiProperty("namespace", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Namespace
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.Statistic``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-statistic </remarks>
        [JsiiProperty("statistic", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Statistic
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.CustomizedMetricSpecificationProperty.Unit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-unit </remarks>
        [JsiiProperty("unit", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Unit
        {
            get;
            set;
        }
    }
}