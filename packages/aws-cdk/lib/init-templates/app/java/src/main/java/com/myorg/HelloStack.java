package com.myorg;

import com.amazonaws.cdk.App;
import com.amazonaws.cdk.Stack;
import com.amazonaws.cdk.StackProps;
import com.amazonaws.cdk.iam.User;
import com.amazonaws.cdk.sns.Topic;
import com.amazonaws.cdk.sns.TopicProps;
import com.amazonaws.cdk.sqs.Queue;
import com.amazonaws.cdk.sqs.QueueProps;

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
