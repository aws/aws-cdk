package com.myorg;

import software.amazon.awscdk.App;

public final class %name.PascalCased%App {
    public static void main(final String[] args) {
        App app = new App();

        new %name.PascalCased%Stack(app, "%stackname%");

        app.synth();
    }
}
