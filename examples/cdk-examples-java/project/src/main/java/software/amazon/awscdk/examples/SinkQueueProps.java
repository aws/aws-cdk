package software.amazon.awscdk.examples;

import software.amazon.awscdk.services.sqs.QueueProps;

/**
 * Props for {@link SinkQueue}.
 */
public class SinkQueueProps {
    private QueueProps queueProps;
    private Number requiredTopicCount;

    /**
     * @return A builder for {@link SinkQueueProps}.
     */
    public static SinkQueuePropsBuilder builder() {
        return new SinkQueuePropsBuilder();
    }

    /**
     * The exact number of topics required to subscribe to the queue.
     * You must call {@link SinkQueue::subscribe} to subscribe topics to this queue.
     * @default 0
     */
    public Number getRequiredTopicCount() {
        return requiredTopicCount;
    }

    /**
     * Props for the queue itself
     * @default See {@link software.amazon.awscdk.sqs.Queue} defaults
     */
    public QueueProps getQueueProps() {
        return queueProps;
    }

    /**
     * Builder for {@link SinkQueue}.
     */
    public static final class SinkQueuePropsBuilder {
        private QueueProps queueProps;
        private Number requiredTopicCount;

        private SinkQueuePropsBuilder() {
        }

        public static SinkQueuePropsBuilder aSinkQueueProps() {
            return new SinkQueuePropsBuilder();
        }

        public SinkQueuePropsBuilder withQueueProps(QueueProps queueProps) {
            this.queueProps = queueProps;
            return this;
        }

        public SinkQueuePropsBuilder withRequiredTopicCount(Number requiredTopicCount) {
            this.requiredTopicCount = requiredTopicCount;
            return this;
        }

        public SinkQueueProps build() {
            SinkQueueProps sinkQueueProps = new SinkQueueProps();
            sinkQueueProps.requiredTopicCount = this.requiredTopicCount;
            sinkQueueProps.queueProps = this.queueProps;
            return sinkQueueProps;
        }
    }
}
