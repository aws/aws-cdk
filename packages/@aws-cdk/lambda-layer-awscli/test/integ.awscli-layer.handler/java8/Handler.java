package software.amazon.awscdk.lambdalayerawsclitest;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.LambdaLogger;

public class Handler implements RequestHandler<Object, Object> {

    @Override
    public Object handleRequest(Object event, Context context) {
        try {
            Process process = new ProcessBuilder("/opt/awscli/aws", "--version")
                .redirectErrorStream(true)
                .start();

            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = null;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }

            if (process.waitFor() != 0) {
                throw new RuntimeException("Failed to invoke aws cli");
            }

            return null;
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Failed to invoke aws cli", e);
        }
    }
}
