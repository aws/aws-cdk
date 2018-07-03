package com.myorg;

import com.amazonaws.cdk.App;

import java.util.Arrays;

public class HelloApp {
    public static void main(final String argv[]) {
        App app = new App(Arrays.asList(argv));

        new HelloStack(app, "hello-cdk-1");
        new HelloStack(app, "hello-cdk-2");

        System.out.println(app.run());
    }
}