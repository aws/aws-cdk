using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>A new Subscription on a CloudWatch log group.</summary>
    [JsiiClass(typeof(SubscriptionFilter), "@aws-cdk/aws-logs.SubscriptionFilter", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.SubscriptionFilterProps\"}}]")]
    public class SubscriptionFilter : Construct
    {
        public SubscriptionFilter(Construct parent, string id, ISubscriptionFilterProps props): base(new DeputyProps(new object[]{parent, id, props}))
        {
        }

        protected SubscriptionFilter(ByRefValue reference): base(reference)
        {
        }

        protected SubscriptionFilter(DeputyProps props): base(props)
        {
        }
    }
}