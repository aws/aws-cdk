package com.myorg;

import software.amazon.awscdk.core.App;

import java.util.Arrays;

public class %name.PascalCased%App {
    public static void main(final String[] args) {
        App app = new App();

        new %name.PascalCased%Stack(app, "%name.PascalCased%Stack");

        app.synth();
    }
}
