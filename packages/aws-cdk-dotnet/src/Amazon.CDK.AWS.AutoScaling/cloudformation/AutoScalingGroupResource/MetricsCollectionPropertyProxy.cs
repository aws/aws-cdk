using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation.AutoScalingGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-metricscollection.html </remarks>
    [JsiiInterfaceProxy(typeof(IMetricsCollectionProperty), "@aws-cdk/aws-autoscaling.cloudformation.AutoScalingGroupResource.MetricsCollectionProperty")]
    internal class MetricsCollectionPropertyProxy : DeputyBase, IMetricsCollectionProperty
    {
        private MetricsCollectionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AutoScalingGroupResource.MetricsCollectionProperty.Granularity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-metricscollection.html#cfn-as-metricscollection-granularity </remarks>
        [JsiiProperty("granularity", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Granularity
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AutoScalingGroupResource.MetricsCollectionProperty.Metrics``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-metricscollection.html#cfn-as-metricscollection-metrics </remarks>
        [JsiiProperty("metrics", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object Metrics
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}