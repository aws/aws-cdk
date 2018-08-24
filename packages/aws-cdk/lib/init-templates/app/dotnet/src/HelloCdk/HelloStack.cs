using Amazon.CDK;
using Amazon.CDK.AWS.SNS;
using Amazon.CDK.AWS.SQS;
using System;
using System.Collections.Generic;
using System.Text;

namespace HelloCdk
{
    public class HelloStack : Stack
    {
        public HelloStack(App parent, string name, IStackProps props) : base(parent, name, props)
        {
            var queue = new Queue(this, "MyFirstQueue", new QueueProps
            {
                VisibilityTimeoutSec = 300
            });

            var topic = new Topic(this, "MyFirstTopic", new TopicProps
            {
                DisplayName = "My First Topic Yeah"
            });

            topic.SubscribeQueue(queue);
        }
    }
}
