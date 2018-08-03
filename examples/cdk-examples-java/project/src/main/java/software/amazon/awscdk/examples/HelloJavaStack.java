package software.amazon.awscdk.examples;

import software.amazon.awscdk.App;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.Construct;
import software.amazon.awscdk.services.ec2.AutoScalingGroup;
import software.amazon.awscdk.services.ec2.AutoScalingGroupProps;
import software.amazon.awscdk.services.ec2.InstanceType;
import software.amazon.awscdk.services.ec2.VpcNetwork;
import software.amazon.awscdk.services.ec2.WindowsImage;
import software.amazon.awscdk.services.ec2.WindowsVersion;
import software.amazon.awscdk.services.s3.cloudformation.BucketResource;
import software.amazon.awscdk.services.s3.cloudformation.BucketResourceProps;
import software.amazon.awscdk.services.sns.Topic;
import software.amazon.awscdk.services.sqs.Queue;
import software.amazon.awscdk.services.sqs.QueueProps;

import java.util.Collections;
import java.util.List;

/**
 * Hello, CDK for Java!
 */
class HelloJavaStack extends Stack {
    public HelloJavaStack(final App parent, final String name) {
        super(parent, name);

        VpcNetwork vpc = new VpcNetwork(this, "VPC");

        MyAutoScalingGroupProps autoScalingGroupProps = new MyAutoScalingGroupProps();
        autoScalingGroupProps.vpc = vpc;

        int topicCount = 5;

        SinkQueue sinkQueue = new SinkQueue(this, "MySinkQueue", SinkQueueProps.builder().withRequiredTopicCount(5).build());

        for (int i = 0; i < topicCount; ++i) {
            sinkQueue.subscribe(new Topic(this, "Topic" + (i+1)));
        }

        new MyAutoScalingGroup(this, "MyAutoScalingGroup", autoScalingGroupProps);
    }

    static class MyAutoScalingGroupProps {
        public VpcNetwork vpc;
    }

    static class MyAutoScalingGroup extends Construct {
        MyAutoScalingGroup(final Construct parent, final String name, final MyAutoScalingGroupProps props) {
            super(parent, name);

            new AutoScalingGroup(this, "Compute", AutoScalingGroupProps.builder()
                .withInstanceType(new InstanceType("t2.micro"))
                .withMachineImage(new WindowsImage(WindowsVersion.WindowsServer2016EnglishNanoBase))
                .withVpc(props.vpc)
                .build());
        }

        @Override
        public List<String> validate() {
            System.err.println("Validating MyAutoScalingGroup...");
            return Collections.emptyList();
        }
    }
}
