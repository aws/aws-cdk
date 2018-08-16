package software.amazon.awscdk.examples;

import software.amazon.awscdk.App;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.services.sns.Topic;
import software.amazon.awscdk.services.sqs.QueueProps;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.jsii.JsiiException;
import org.junit.Test;

import java.io.IOException;
import java.net.URL;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SinkQueueTest {

    private static ObjectMapper JSON = new ObjectMapper();

    /** Defines a queue sink with default props */
    @Test public void testDefaults() throws IOException {
        Stack stack = new Stack();
        new SinkQueue(stack, "MySinkQueue");
        assertTemplate(stack, "{\"Resources\":{\"MySinkQueueEFCD79C2\":{\"Type\":\"AWS::SQS::Queue\"}}}");
    }

    /** Defines a sink with custom queue props */
    @Test public void testQueueProps() throws IOException {
        Stack stack = new Stack();
        new SinkQueue(stack, "MySinkQueue", SinkQueueProps.builder()
                .withQueueProps(QueueProps.builder()
                        .withVisibilityTimeoutSec(500)
                        .build())
                .build());
        assertTemplate(stack, "{\n" +
                "  \"Resources\" : {\n" +
                "    \"MySinkQueueEFCD79C2\" : {\n" +
                "      \"Type\" : \"AWS::SQS::Queue\",\n" +
                "      \"Properties\" : {\n" +
                "        \"VisibilityTimeout\" : 500\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}");
    }

    /** Calls "subscribe" to add topics to the sink */
    @Test public void testSubscribeTopics() throws IOException {
        Stack stack = new Stack();

        SinkQueue sink = new SinkQueue(stack, "MySinkQueue");

        // add three topics in two calls to "subscribe"
        sink.subscribe(new Topic(stack, "Topic1"), new Topic(stack, "Topic2"));
        sink.subscribe(new Topic(stack, "Topic3"));

        assertTemplate(stack, getClass().getResource("testSubscribeTopics.expected.json"));
    }

    /** Verifies that if we exceed the number of allows topics, an exception is thrown */
    @Test public void failsIfExceedMaxTopic() {
        Stack stack = new Stack();

        SinkQueue sink = new SinkQueue(stack, "MySinkQueue", SinkQueueProps.builder()
                .withRequiredTopicCount(3)
                .build());

        sink.subscribe(new Topic(stack, "Topic1"));
        sink.subscribe(new Topic(stack, "Topic2"));
        sink.subscribe(new Topic(stack, "Topic3"));

        boolean thrown = false;
        try {
            sink.subscribe(new Topic(stack, "Topic4"));
        } catch (RuntimeException e) {
            thrown = true;
        }
        assertTrue(thrown);
    }

    /** Verifies that the sink queue validates that the exact number of subscribers was added */
    @Test(expected = JsiiException.class) public void failsIfNotEnoughTopics() {
        App app = new App();
        Stack stack = new Stack(app, "test");

        SinkQueue sink = new SinkQueue(stack, "MySinkQueue", SinkQueueProps.builder()
                .withRequiredTopicCount(80).build());

        for (int i = 0; i < 77; ++i) {
            sink.subscribe(new Topic(stack, "Topic" + i));
        }

        app.synthesizeStack(stack.getName());
    }

    private static void assertTemplate(final Stack stack, final URL expectedResource) throws IOException {
        assertTemplate(stack, JSON.readTree(expectedResource));
    }

    private static void assertTemplate(final Stack stack, final String expectedTemplate) throws IOException {
        assertTemplate(stack, JSON.readTree(expectedTemplate));
    }

    private static void assertTemplate(final Stack stack, final JsonNode expected) throws IOException {
        JsonNode actual = JSON.valueToTree(stack.toCloudFormation());

        // print to stderr if non-equal, so it will be easy to grab
        if (expected == null || !expected.equals(actual)) {
            String prettyActual = JSON.writerWithDefaultPrettyPrinter().writeValueAsString(actual);
            System.err.println(prettyActual);
        }

        assertEquals(expected, actual);
    }
}
