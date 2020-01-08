package com.myorg;

import software.amazon.awscdk.core.App;
import software.amazon.awscdk.cxapi.CloudAssembly;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class %name.PascalCased%Test {
    private final static ObjectMapper MAPPER =
        new ObjectMapper().configure(SerializationFeature.INDENT_OUTPUT, true);

    @Test
    public void testStack() throws Exception {
        App app = new App();
        %name.PascalCased%Stack stack = new %name.PascalCased%Stack(app, "test");

        CloudAssembly assembly = app.synth();
        Object template = assembly.getStackArtifact(stack.getArtifactId()).getTemplate();
        String json = MAPPER.writeValueAsString(template);
        assertTrue(json.length() > 0);
    }
}
