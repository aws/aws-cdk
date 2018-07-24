using Amazon.CDK;
using Amazon.CDK.AWS.Logs.cloudformation.MetricFilterResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html </remarks>
    [JsiiInterface(typeof(IMetricFilterResourceProps), "@aws-cdk/aws-logs.cloudformation.MetricFilterResourceProps")]
    public interface IMetricFilterResourceProps
    {
        /// <summary>``AWS::Logs::MetricFilter.FilterPattern``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-cwl-metricfilter-filterpattern </remarks>
        [JsiiProperty("filterPattern", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object FilterPattern
        {
            get;
            set;
        }

        /// <summary>``AWS::Logs::MetricFilter.LogGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-cwl-metricfilter-loggroupname </remarks>
        [JsiiProperty("logGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object LogGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::Logs::MetricFilter.MetricTransformations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-cwl-metricfilter-metrictransformations </remarks>
        [JsiiProperty("metricTransformations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-logs.cloudformation.MetricFilterResource.MetricTransformationProperty\"}]}}}}]}}")]
        object MetricTransformations
        {
            get;
            set;
        }
    }
}