using Amazon.CDK;
using Amazon.CDK.AWS.SNS;
using Amazon.CDK.AWS.SNS.Subscriptions;
using Amazon.CDK.AWS.SQS;

namespace %name.PascalCased%
{
    public class %name.PascalCased%Stack : Stack
    {
        internal %name.PascalCased%Stack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
             // The CDK includes built-in constructs for most resource types, such as Queues and Topics.
            var queue = new Queue(this, "%name.PascalCased%Queue", new QueueProps
            {
                VisibilityTimeout = Duration.Seconds(300)
            });

            var topic = new Topic(this, "%name.PascalCased%Topic");

            topic.AddSubscription(new SqsSubscription(queue));
        }
    }
}
