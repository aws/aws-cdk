package software.amazon.awscdk.examples;

import software.amazon.awscdk.App;

import java.util.Arrays;

public class HelloJavaApp {
    public static void main(final String[] args) {
        App app = new App();

        new HelloJavaStack(app, "hello-cdk");

        app.run();
    }
}
