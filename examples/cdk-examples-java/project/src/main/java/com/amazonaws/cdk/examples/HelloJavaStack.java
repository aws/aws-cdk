package com.amazonaws.cdk.examples;

import com.amazonaws.cdk.App;
import com.amazonaws.cdk.Stack;
import com.amazonaws.cdk.StackProps;
import com.amazonaws.cdk.Construct;
import com.amazonaws.cdk.aws.ec2.AutoScalingGroup;
import com.amazonaws.cdk.aws.ec2.AutoScalingGroupProps;
import com.amazonaws.cdk.aws.ec2.InstanceType;
import com.amazonaws.cdk.aws.ec2.VpcNetwork;
import com.amazonaws.cdk.aws.ec2.WindowsImage;
import com.amazonaws.cdk.aws.ec2.WindowsVersion;
import com.amazonaws.cdk.aws.s3.cloudformation.BucketResource;
import com.amazonaws.cdk.aws.s3.cloudformation.BucketResourceProps;
import com.amazonaws.cdk.aws.sns.Topic;
import com.amazonaws.cdk.aws.sqs.Queue;
import com.amazonaws.cdk.aws.sqs.QueueProps;

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
