using Amazon.CDK;
using Amazon.CDK.AWS.Logs.cloudformation.MetricFilterResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html </remarks>
    [JsiiInterfaceProxy(typeof(IMetricFilterResourceProps), "@aws-cdk/aws-logs.cloudformation.MetricFilterResourceProps")]
    internal class MetricFilterResourcePropsProxy : DeputyBase, IMetricFilterResourceProps
    {
        private MetricFilterResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::Logs::MetricFilter.FilterPattern``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-cwl-metricfilter-filterpattern </remarks>
        [JsiiProperty("filterPattern", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object FilterPattern
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Logs::MetricFilter.LogGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-cwl-metricfilter-loggroupname </remarks>
        [JsiiProperty("logGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object LogGroupName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Logs::MetricFilter.MetricTransformations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-cwl-metricfilter-metrictransformations </remarks>
        [JsiiProperty("metricTransformations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-logs.cloudformation.MetricFilterResource.MetricTransformationProperty\"}]}}}}]}}")]
        public virtual object MetricTransformations
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}