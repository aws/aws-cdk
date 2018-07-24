using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    [JsiiInterfaceProxy(typeof(IDashboardProps), "@aws-cdk/aws-cloudwatch.DashboardProps")]
    internal class DashboardPropsProxy : DeputyBase, IDashboardProps
    {
        private DashboardPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Name of the dashboard</summary>
        /// <remarks>default: Automatically generated name</remarks>
        [JsiiProperty("dashboardName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string DashboardName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}