using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    [JsiiInterface(typeof(IDashboardProps), "@aws-cdk/aws-cloudwatch.DashboardProps")]
    public interface IDashboardProps
    {
        /// <summary>Name of the dashboard</summary>
        /// <remarks>default: Automatically generated name</remarks>
        [JsiiProperty("dashboardName", "{\"primitive\":\"string\",\"optional\":true}")]
        string DashboardName
        {
            get;
            set;
        }
    }
}