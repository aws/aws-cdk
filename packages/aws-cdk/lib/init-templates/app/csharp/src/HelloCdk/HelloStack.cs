using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.SNS;
using Amazon.CDK.AWS.SQS;

namespace HelloCdk
{
    public class HelloStack : Stack
    {
        public HelloStack(Construct parent, string id, IStackProps props) : base(parent, id, props)
        {
            // The CDK includes built-in constructs for most resource types, such as Queues and Topics.
            var queue = new Queue(this, "MyFirstQueue", new QueueProps
            {
                VisibilityTimeoutSec = 300
            });

            var topic = new Topic(this, "MyFirstTopic", new TopicProps
            {
                DisplayName = "My First Topic Yeah"
            });

            topic.SubscribeQueue(queue, null);

            // You can also define your own constructs and use them in your stack.
            HelloConstruct hello = new HelloConstruct(this, "Buckets", new HelloConstructProps()
            {
                BucketCount = 5
            });

            // Create a new user with read access to the HelloConstruct resource.
            User user = new User(this, "MyUser", new UserProps());
            hello.GrantRead(user);
        }
    }
}
