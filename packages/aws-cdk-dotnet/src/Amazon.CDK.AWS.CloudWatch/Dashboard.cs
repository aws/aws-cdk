using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A CloudWatch dashboard</summary>
    [JsiiClass(typeof(Dashboard), "@aws-cdk/aws-cloudwatch.Dashboard", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.DashboardProps\",\"optional\":true}}]")]
    public class Dashboard : Construct
    {
        public Dashboard(Construct parent, string name, IDashboardProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Dashboard(ByRefValue reference): base(reference)
        {
        }

        protected Dashboard(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// Add a widget to the dashboard.
        /// 
        /// Widgets given in multiple calls to add() will be laid out stacked on
        /// top of each other.
        /// 
        /// Multiple widgets added in the same call to add() will be laid out next
        /// to each other.
        /// </summary>
        [JsiiMethod("add", null, "[{\"name\":\"widgets\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.IWidget\"}}]")]
        public virtual void Add(IIWidget widgets)
        {
            InvokeInstanceVoidMethod(new object[]{widgets});
        }
    }
}