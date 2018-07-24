using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html </remarks>
    [JsiiInterface(typeof(IDashboardResourceProps), "@aws-cdk/aws-cloudwatch.cloudformation.DashboardResourceProps")]
    public interface IDashboardResourceProps
    {
        /// <summary>``AWS::CloudWatch::Dashboard.DashboardBody``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html#cfn-cloudwatch-dashboard-dashboardbody </remarks>
        [JsiiProperty("dashboardBody", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DashboardBody
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudWatch::Dashboard.DashboardName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html#cfn-cloudwatch-dashboard-dashboardname </remarks>
        [JsiiProperty("dashboardName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DashboardName
        {
            get;
            set;
        }
    }
}