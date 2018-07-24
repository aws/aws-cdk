using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>
    /// A new subscription.
    /// 
    /// Prefer to use the `TopicRef.subscribeXxx()` methods to creating instances of
    /// this class.
    /// </summary>
    [JsiiClass(typeof(Subscription), "@aws-cdk/aws-sns.Subscription", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-sns.SubscriptionProps\"}}]")]
    public class Subscription : Construct
    {
        public Subscription(Construct parent, string name, ISubscriptionProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Subscription(ByRefValue reference): base(reference)
        {
        }

        protected Subscription(DeputyProps props): base(props)
        {
        }
    }
}