package com.myorg;

import software.amazon.awscdk.App;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.aws.iam.User;
import software.amazon.awscdk.aws.sns.Topic;
import software.amazon.awscdk.aws.sns.TopicProps;
import software.amazon.awscdk.aws.sqs.Queue;
import software.amazon.awscdk.aws.sqs.QueueProps;

public class HelloStack extends Stack {
    public HelloStack(final App parent, final String name) {
        this(parent, name, null);
    }

    public HelloStack(final App parent, final String name, final StackProps props) {
        super(parent, name, props);

        Queue queue = new Queue(this, "MyFirstQueue", QueueProps.builder()
                .withVisibilityTimeoutSec(300)
                .build());

        Topic topic = new Topic(this, "MyFirstTopic", TopicProps.builder()
                .withDisplayName("My First Topic Yeah")
                .build());

        topic.subscribeQueue(queue);

        HelloConstruct hello = new HelloConstruct(this, "Buckets", HelloConstructProps.builder()
                .withBucketCount(5)
                .build());

        User user = new User(this, "MyUser");
        hello.grantRead(user);
    }
}
