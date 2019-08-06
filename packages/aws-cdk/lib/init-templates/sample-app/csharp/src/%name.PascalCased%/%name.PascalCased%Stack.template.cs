using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.SNS;
using Amazon.CDK.AWS.SNS.Subscriptions;
using Amazon.CDK.AWS.SQS;

namespace %name.PascalCased%
{
    public class %name.PascalCased%Stack : Stack
    {
        public %name.PascalCased%Stack(Construct parent, string id, IStackProps props) : base(parent, id, props)
        {
             // The CDK includes built-in constructs for most resource types, such as Queues and Topics.
            var queue = new Queue(this, "MyFirstQueue", new QueueProps
            {
                VisibilityTimeout = Duration.Seconds(300)
            });

            var topic = new Topic(this, "MyFirstTopic", new TopicProps
            {
                DisplayName = "My First Topic Yeah"
            });

            topic.AddSubscription(new SqsSubscription(queue, null));

            // You can also define your own constructs and use them in your stack.
            %name.PascalCased%Construct hello = new %name.PascalCased%Construct(this, "Buckets", new %name.PascalCased%ConstructProps()
            {
                BucketCount = 5
            });

            // Create a new user with read access to the HelloConstruct resource.
            User user = new User(this, "MyUser", new UserProps());
            hello.GrantRead(user);
        }
    }
}
