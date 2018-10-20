/**
 * Used internally to bootstrap the worker nodes
 * This sets the max pods based on the instanceType created
 * ref: https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2018-08-30/amazon-eks-nodegroup.yamls
 */
export const maxPods = Object.freeze(
  new Map([
    ["c4.large", 29],
    ["c4.xlarge", 58],
    ["c4.2xlarge", 58],
    ["c4.4xlarge", 23],
    ["c4.8xlarge", 23],
    ["c5.large", 29],
    ["c5.xlarge", 58],
    ["c5.2xlarge", 58],
    ["c5.4xlarge", 23],
    ["c5.9xlarge", 23],
    ["c5.18xlarge", 7],
    ["i3.large", 29],
    ["i3.xlarge", 58],
    ["i3.2xlarge", 58],
    ["i3.4xlarge", 23],
    ["i3.8xlarge", 23],
    ["i3.16xlarge", 7],
    ["m3.medium", 12],
    ["m3.large", 29],
    ["m3.xlarge", 58],
    ["m3.2xlarge", 11],
    ["m4.large", 20],
    ["m4.xlarge", 58],
    ["m4.2xlarge", 58],
    ["m4.4xlarge", 23],
    ["m4.10xlarge", 2],
    ["m5.large", 29],
    ["m5.xlarge", 58],
    ["m5.2xlarge", 58],
    ["m5.4xlarge", 23],
    ["m5.12xlarge", 2],
    ["m5.24xlarge", 7],
    ["p2.xlarge", 58],
    ["p2.8xlarge", 23],
    ["p2.16xlarge", 2],
    ["p3.2xlarge", 58],
    ["p3.8xlarge", 23],
    ["p3.16xlarge", 2],
    ["r3.xlarge", 58],
    ["r3.2xlarge", 58],
    ["r3.4xlarge", 23],
    ["r3.8xlarge", 23],
    ["r4.large", 29],
    ["r4.xlarge", 58],
    ["r4.2xlarge", 58],
    ["r4.4xlarge", 23],
    ["r4.8xlarge", 23],
    ["r4.16xlarge", 7],
    ["t2.small", 8],
    ["t2.medium", 17],
    ["t2.large", 35],
    ["t2.xlarge", 44],
    ["t2.2xlarge", 44],
    ["x1.16xlarge", 2],
    ["x1.32xlarge", 23]
  ])
);

/**
 * Whether the worker nodes should support GPU or just normal instances
 */
export const enum NodeType {
  Normal = "Normal",
  GPU = "GPUSupport"
}

/**
 * Select AMI to use based on the AWS Region being deployed
 *
 * TODO: Create dynamic mappign by searching SSM Store
 */
export const nodeAmi = Object.freeze({
  Normal: {
    ["us-east-1"]: "ami-0440e4f6b9713faf6",
    ["us-west-2"]: "ami-0a54c984b9f908c81",
    ["eu-west-1"]: "ami-0c7a4976cb6fafd3a"
  },
  GPUSupport: {
    ["us-east-1"]: "ami-058bfb8c236caae89",
    ["us-west-2"]: "ami-0731694d53ef9604b",
    ["eu-west-1"]: "ami-0706dc8a5eed2eed9"
  }
});

/**
 * The type of update to perform on instances in this AutoScalingGroup
 */
export enum UpdateType {
  /**
   * Don't do anything
   */
  None = "None",

  /**
   * Replace the entire AutoScalingGroup
   *
   * Builds a new AutoScalingGroup first, then delete the old one.
   */
  ReplacingUpdate = "Replace",

  /**
   * Replace the instances in the AutoScalingGroup.
   */
  RollingUpdate = "RollingUpdate"
}
