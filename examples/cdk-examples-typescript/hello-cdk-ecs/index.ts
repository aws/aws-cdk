import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');

class BonjourECS extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    // For better iteration speed, it might make sense to put this VPC into
    // a separate stack and import it here. We then have two stacks to
    // deploy, but VPC creation is slow so we'll only have to do that once
    // and can iterate quickly on consuming stacks. Not doing that for now.
    const vpc = new ec2.VpcNetwork(this, 'MyVpc', {
      maxAZs: 2
    });

    const cluster = new ecs.EcsCluster(this, 'EcsCluster', {
      vpc
    });

    // name, image, cpu, memory, port (with default)
    //
    // Include in constructs:
    //   - networking - include SD, ALB
    //   - logging - cloudwatch logs integration? talk to nathan about 3rd
    //     party integrations - aggregated logging across the service
    //     (instead of per task). Probably prometheus or elk?
    //   - tracing aws-xray-fargate - CNCF opentracing standard - jaeger,
    //     zipkin.
    //   - so x-ray is a container that is hooked up to sidecars that come
    //     with the application container itself
    //   - autoscaling - application autoscaling (Fargate focused?)

    const taskDefinition = new ecs.EcsTaskDefinition(this, "EcsTD", {
      family: "ecs-task-definition",
    });

    const container = taskDefinition.addContainer('web', {
      image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
      cpu: 1024,
      memoryLimitMiB: 512,
      essential: true
    });

    container.linuxParameters.addCapabilities(ecs.Capability.All);
    container.linuxParameters.dropCapabilities(ecs.Capability.Chown);

    container.linuxParameters.addDevices({
      containerPath: "/dev/pudding",
      hostPath: "/dev/clyde",
      permissions: [ecs.DevicePermission.Read]
    });

    container.linuxParameters.addTmpfs({
      containerPath: "/dev/sda",
      size: 12345,
      mountOptions: [ecs.TmpfsMountOption.Ro]
    });

    container.linuxParameters.sharedMemorySize = 65535;
    container.linuxParameters.initProcessEnabled = true;

    container.addUlimits({
      name: ecs.UlimitName.Core,
      softLimit: 1234,
      hardLimit: 1234,
    });

    container.addPortMappings({
      containerPort: 80,
      hostPort: 80,
      protocol: ecs.Protocol.Tcp,
    });

    container.addMountPoints({
      containerPath: '/tmp/cache',
      sourceVolume: 'volume-1',
      readOnly: true,
    }, {
      containerPath: './cache',
      sourceVolume: 'volume-2',
      readOnly: true,
    });


    new ecs.EcsService(this, "EcsService", {
            cluster,
            taskDefinition,
            desiredCount: 1,
    });
    // cluster.runService(taskDefinition);
  }
}

const app = new cdk.App(process.argv);

new BonjourECS(app, 'Bonjour');

process.stdout.write(app.run());
