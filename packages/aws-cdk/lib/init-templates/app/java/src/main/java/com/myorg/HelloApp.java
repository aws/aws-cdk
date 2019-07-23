package com.myorg;

import software.amazon.awscdk.core.App;

import java.util.Arrays;

public class HelloApp {
    public static void main(final String argv[]) {
        App app = new App();

        new HelloStack(app, "hello-cdk-1");
        new HelloStack(app, "hello-cdk-2");

        // required until https://github.com/aws/jsii/issues/456 is resolved
        app.synth();
    }
}
