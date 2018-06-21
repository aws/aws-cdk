package com.amazonaws.cdk.examples;

import com.amazonaws.cdk.sqs.QueueProps;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Props for {@link SinkQueue}
 */
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SinkQueueProps {
    /**
     * Props for the queue itself
     * @default See {@link com.amazonaws.cdk.sqs.Queue} defaults
     */
    private QueueProps queueProps;

    /**
     * The maximum number of topics allowed to subscribe to this queue.
     * @default 10
     */
    private Number maxTopics;
}
