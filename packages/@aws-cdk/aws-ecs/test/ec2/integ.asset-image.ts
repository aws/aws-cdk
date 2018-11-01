import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import path = require('path');
import ecs = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ2');
const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });

const cluster = new ecs.Ec2Cluster(stack, 'Cluster', { vpc });

// Instantiate Ec2 Service with just cluster and image
new ecs.LoadBalancedEc2Service(stack, "Ec2Service", {
  cluster,
  containerPort: 8000,
  memoryReservationMiB: 128,
  image: new ecs.AssetImage(stack, 'Image', {
    directory: path.join(__dirname, '..', 'demo-image')
  })
});

app.run();
