package com.myorg;

import software.amazon.awscdk.Construct;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.iam.User;
import software.amazon.awscdk.services.iam.UserProps;
import software.amazon.awscdk.services.sns.Topic;
import software.amazon.awscdk.services.sns.TopicProps;
import software.amazon.awscdk.services.sns.subscribers.SqsSubscriber;
import software.amazon.awscdk.services.sqs.Queue;
import software.amazon.awscdk.services.sqs.QueueProps;

public class HelloStack extends Stack {
    public HelloStack(final Construct parent, final String id) {
        this(parent, id, null);
    }

    public HelloStack(final Construct parent, final String id, final StackProps props) {
        super(parent, id, props);

        Queue queue = new Queue(this, "MyFirstQueue", QueueProps.builder()
                .withVisibilityTimeoutSec(300)
                .build());

        Topic topic = new Topic(this, "MyFirstTopic", TopicProps.builder()
                .withDisplayName("My First Topic Yeah")
                .build());

        topic.subscribe(new SqsSubscriber(queue));

        HelloConstruct hello = new HelloConstruct(this, "Buckets", HelloConstructProps.builder()
                .withBucketCount(5)
                .build());

        User user = new User(this, "MyUser", UserProps.builder().build());
        hello.grantRead(user);
    }
}
