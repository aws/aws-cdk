using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs.cloudformation.MetricFilterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html </remarks>
    [JsiiInterface(typeof(IMetricTransformationProperty), "@aws-cdk/aws-logs.cloudformation.MetricFilterResource.MetricTransformationProperty")]
    public interface IMetricTransformationProperty
    {
        /// <summary>``MetricFilterResource.MetricTransformationProperty.DefaultValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-cwl-metricfilter-metrictransformation-defaultvalue </remarks>
        [JsiiProperty("defaultValue", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DefaultValue
        {
            get;
            set;
        }

        /// <summary>``MetricFilterResource.MetricTransformationProperty.MetricName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-cwl-metricfilter-metrictransformation-metricname </remarks>
        [JsiiProperty("metricName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MetricName
        {
            get;
            set;
        }

        /// <summary>``MetricFilterResource.MetricTransformationProperty.MetricNamespace``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-cwl-metricfilter-metrictransformation-metricnamespace </remarks>
        [JsiiProperty("metricNamespace", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MetricNamespace
        {
            get;
            set;
        }

        /// <summary>``MetricFilterResource.MetricTransformationProperty.MetricValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-cwl-metricfilter-metrictransformation-metricvalue </remarks>
        [JsiiProperty("metricValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MetricValue
        {
            get;
            set;
        }
    }
}