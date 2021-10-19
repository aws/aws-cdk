package com.myorg;

import software.amazon.awscdk.App;
import software.amazon.awscdk.assertions.alpha.Template;
import software.amazon.awscdk.assertions.alpha.Match;
import java.io.IOException;

import java.util.*;

import org.junit.jupiter.api.Test;

public class %name.PascalCased%StackTest {

    @Test
    public void testStack() throws IOException {
        App app = new App();
        %name.PascalCased%Stack stack = new %name.PascalCased%Stack(app, "test");

        Template template = Template.fromStack(stack);

        Map<String, Object> expected = Map.of(
         "VisibilityTimeout", 300);

        template.hasResourceProperties("AWS::SQS::Queue", expected);
        template.hasResourceProperties("AWS::SNS::Topic", Match.anyValue());
    }
}
