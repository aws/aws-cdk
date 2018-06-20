package com.amazonaws.cdk.examples;

import com.amazonaws.cdk.App;

import java.util.Arrays;

public class HelloJavaApp {
    public static void main(final String[] args) {
        App app = new App(Arrays.asList(args));

        new HelloJavaStack(app, "hello-cdk");

        System.out.println(app.run());
    }
}