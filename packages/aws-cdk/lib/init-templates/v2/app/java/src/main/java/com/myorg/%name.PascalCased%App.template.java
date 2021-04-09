package com.myorg;

import software.amazon.awscdk.App;
import software.amazon.awscdk.Environment;

import java.util.Arrays;

public class %name.PascalCased%App {
    public static void main(final String[] args) {
        App app = new App();

        // If you don't specify 'env', this stack will be environment-agnostic.
        // Account/Region-dependent features and context lookups will not work,
        // but a single synthesized template can be deployed anywhere.
        new %name.PascalCased%Stack(app, "%name.PascalCased%Stack");

        // Replace the above stack intialization with the following to specialize
        // this stack for the AWS Account and Region that are implied by the current
        // CLI configuration.
        /*
        new %name.PascalCased%Stack(app, "%name.PascalCased%Stack", StackProps.builder()
                .env(Environment.builder()
                        .account(System.getenv("CDK_DEFAULT_ACCOUNT"))
                        .region(System.getenv("CDK_DEFAULT_REGION"))
                        .build())
                .build());
        */

        // Replace the above stack initialization with the following if you know exactly
        // what Account and Region you want to deploy the stack to.
        /*
        new %name.PascalCased%Stack(app, "%name.PascalCased%Stack", StackProps.builder()
                .env(Environment.builder()
                        .account("123456789012")
                        .region("us-east-1")
                        .build())

                .build());
        */

        // For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html

        app.synth();
    }
}
