package software.amazon.awscdk.examples;

import software.amazon.awscdk.Construct;
import software.amazon.awscdk.services.sns.Topic;
import software.amazon.awscdk.services.sqs.Queue;
import software.amazon.awscdk.services.sqs.QueueProps;

import java.util.Arrays;
import java.util.List;

/**
 * A sink queue is a queue aggregates messages published to any number of SNS topics.
 */
public class SinkQueue extends Construct {
    private final Queue queue;
    private final int expectedTopicCount;

    private int actualTopicCount = 0;

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
        this.expectedTopicCount = props.getRequiredTopicCount() != null ? props.getRequiredTopicCount().intValue() : 10;

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
            if (actualTopicCount == expectedTopicCount) {
                throw new RuntimeException("Cannot add more topics to the sink. Maximum topics is configured to " + this.expectedTopicCount);
            }
            topic.subscribeQueue(this.queue);
            actualTopicCount++;
        }
    }

    @Override
    public List<String> validate() {
        if (actualTopicCount < expectedTopicCount) {
            return Arrays.asList(
                "There are not enough subscribers to the sink. Expecting " +
                    this.expectedTopicCount +
                    ", actual is " + this.actualTopicCount);
        }

        return super.validate();
    }
}
