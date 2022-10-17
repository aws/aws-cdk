/**
To run this and get the snapshot, you need to:
- install the dependencies from pom.xml by running `mvn dependency:resolve` in the test-data-java directory
- set the Java classpath for the module's dependencies and provide a command that can execute each test in the
    package separately:
    `export $CLASSPATH="$(cd test/test-data-java; mvn dependency:build-classpath -q -Dmdep.outputFile=/dev/stdout)"; node bin/integ-runner --directory test/test-data-java/src/main/java/com/myorg --update-on-failed --dry-run --test-run-command="java -cp $CLASSPATH"`
**/
package com.myorg;

import software.amazon.awscdk.App;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.Environment;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.integtests.alpha.IntegTest;

import java.util.List;


public class IntegTestJava {
    public static void main(final String[] args) {
        App app = new App();

        Stack stack = new Stack(app, "Stack", StackProps.builder().build());

        IntegTest.Builder.create(app, "Integ").testCases(List.of(stack)).build();

        app.synth();
    }
}
