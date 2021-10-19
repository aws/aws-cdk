package com.myorg;

import software.amazon.awscdk.core.App;
import software.amazon.awscdk.assertions.Template;
import software.amazon.awscdk.assertions.Match;
import java.io.IOException;

import java.util.*;

import org.junit.jupiter.api.Test;

public class %name.PascalCased%Test {

    @Test
    public void testStack() throws IOException {
        App app = new App();
        %name.PascalCased%Stack stack = new %name.PascalCased%Stack(app, "test");

        Template template = Template.fromStack(stack);

        // Update once resources have been added to the stack
        Map<String, Object> expected = Map.of();
        template.templateMatches(expected);
    }
}
