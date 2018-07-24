using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    public class DashboardProps : DeputyBase, IDashboardProps
    {
        /// <summary>Name of the dashboard</summary>
        /// <remarks>default: Automatically generated name</remarks>
        [JsiiProperty("dashboardName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string DashboardName
        {
            get;
            set;
        }
    }
}