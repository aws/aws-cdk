package com.amazonaws.cdk.examples;

import com.amazonaws.cdk.App;
import com.amazonaws.cdk.Stack;
import com.amazonaws.cdk.StackProps;
import com.amazonaws.cdk.Construct;
import com.amazonaws.cdk.ec2.Fleet;
import com.amazonaws.cdk.ec2.FleetProps;
import com.amazonaws.cdk.ec2.InstanceType;
import com.amazonaws.cdk.ec2.VpcNetwork;
import com.amazonaws.cdk.ec2.WindowsImage;
import com.amazonaws.cdk.ec2.WindowsVersion;
import com.amazonaws.cdk.s3.cloudformation.BucketResource;
import com.amazonaws.cdk.s3.cloudformation.BucketResourceProps;
import com.amazonaws.cdk.sns.Topic;
import com.amazonaws.cdk.sqs.Queue;
import com.amazonaws.cdk.sqs.QueueProps;

import java.util.Collections;
import java.util.List;

/**
 * Hello, CDK for Java!
 */
class HelloJavaStack extends Stack {
    public HelloJavaStack(final App parent, final String name) {
        super(parent, name);

        VpcNetwork vpc = new VpcNetwork(this, "VPC");

        MyFleetProps fleetProps = new MyFleetProps();
        fleetProps.vpc = vpc;

        int topicCount = 5;

        SinkQueue sinkQueue = new SinkQueue(this, "MySinkQueue", SinkQueueProps.builder().withRequiredTopicCount(5).build());

        for (int i = 0; i < topicCount; ++i) {
            sinkQueue.subscribe(new Topic(this, "Topic" + (i+1)));
        }

        new MyFleet(this, "MyFleet", fleetProps);
    }

    static class MyFleetProps {
        public VpcNetwork vpc;
    }

    static class MyFleet extends Construct {
        MyFleet(final Construct parent, final String name, final MyFleetProps props) {
            super(parent, name);

            new Fleet(this, "Compute", FleetProps.builder()
                .withInstanceType(new InstanceType("t2.micro"))
                .withMachineImage(new WindowsImage(WindowsVersion.WindowsServer2016EnglishNanoBase))
                .withVpc(props.vpc)
                .build());
        }

        @Override
        public List<String> validate() {
            System.err.println("Validating MyFleet...");
            return Collections.emptyList();
        }
    }
}
