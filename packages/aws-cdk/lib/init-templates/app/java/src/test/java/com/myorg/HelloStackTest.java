package com.myorg;

import software.amazon.awscdk.core.App;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.Test;

import java.io.IOException;

import static junit.framework.TestCase.assertEquals;

public class HelloStackTest {
    private final static ObjectMapper JSON =
        new ObjectMapper().configure(SerializationFeature.INDENT_OUTPUT, true);

    @Test
    public void testStack() throws IOException {
        App app = new App();
        HelloStack stack = new HelloStack(app, "test");

        final CloudAssembly synth = app.synth();
        final File actualTemplateFile = new File(synth.getDirectory() + File.separator + synth.getStack(stack.getStackName()).getTemplateFile());
        // synthesize the stack to a CloudFormation template and compare against
        // a checked-in JSON file.
        try (final Reader reader = new FileReader(actualTemplateFile)) {
            JsonNode actual = JSON.valueToTree(JSON.readTree(reader));
            JsonNode expected = JSON.readTree(getClass().getResource("expected.cfn.json"));
            assertEquals(expected, actual);
        }
    }
}
