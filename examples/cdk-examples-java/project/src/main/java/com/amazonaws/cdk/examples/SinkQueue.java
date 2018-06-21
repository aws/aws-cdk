package com.amazonaws.cdk.examples;

import com.amazonaws.cdk.Construct;
import com.amazonaws.cdk.sns.Topic;
import com.amazonaws.cdk.sqs.Queue;
import com.amazonaws.cdk.sqs.QueueProps;

/**
 * A sink queue is a queue aggregates messages published to any number of SNS topics.
 */
public class SinkQueue extends Construct {
    private final Queue queue;
    private final int maxTopics;

    private int numberOfTopics = 0;

    /**
     * Defines a SinkQueue.
     *
     * @param parent Parent construct
     * @param name   Logical name
     * @param props  Props
     */
    public SinkQueue(final Construct parent, final String name, SinkQueueProps props) {
        super(parent, name);

        // ensure props is non-null
        props = props != null ? props : SinkQueueProps.builder().build();

        // defaults
        QueueProps queueProps = props.getQueueProps();
        this.maxTopics = props.getMaxTopics() != null ? props.getMaxTopics().intValue() : 10;

        // WORKAROUND: https://github.com/awslabs/aws-cdk/issues/157
        if (queueProps == null) {
            queueProps = QueueProps.builder().build();
        }

        this.queue = new Queue(this, "Resource", queueProps);
    }

    /**
     * Defines a SinkQueue with default props.
     * @param parent Parent construct
     * @param name   Logical name
     */
    public SinkQueue(final Construct parent, final String name) {
        this(parent, name, null);
    }

    /**
     * Subscribes this queue to receive messages published to the specified topics.
     *
     * @param topics The topics to subscribe to
     */
    public void subscribe(final Topic... topics) {
        for (Topic topic: topics) {
            if (numberOfTopics == maxTopics) {
                throw new RuntimeException("Cannot add more topics to the sink. Maximum topics is configured to " + this.maxTopics);
            }
            topic.subscribeQueue(this.queue);
            numberOfTopics++;
        }
    }
}
