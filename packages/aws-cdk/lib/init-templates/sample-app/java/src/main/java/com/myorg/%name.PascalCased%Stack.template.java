package com.myorg;

import software.amazon.awscdk.core.Construct;
import software.amazon.awscdk.core.Duration;
import software.amazon.awscdk.core.Stack;
import software.amazon.awscdk.core.StackProps;
import software.amazon.awscdk.services.iam.User;
import software.amazon.awscdk.services.iam.UserProps;
import software.amazon.awscdk.services.sns.Topic;
import software.amazon.awscdk.services.sns.TopicProps;
import software.amazon.awscdk.services.sns.subscriptions.SqsSubscription;
import software.amazon.awscdk.services.sqs.Queue;
import software.amazon.awscdk.services.sqs.QueueProps;

public class %name.PascalCased%Stack extends Stack {
    public %name.PascalCased%Stack(final Construct parent, final String id) {
        this(parent, id, null);
    }

    public %name.PascalCased%Stack(final Construct parent, final String id, final StackProps props) {
        super(parent, id, props);

        Queue queue = new Queue(this, "%name.PascalCased%Queue", QueueProps.builder()
                .visibilityTimeout(Duration.seconds(300))
                .build());

        Topic topic = new Topic(this, "%name.PascalCased%Topic", TopicProps.builder()
            .displayName("My First Topic Yeah")    
            .build());

        topic.addSubscription(new SqsSubscription(queue));
    }
}