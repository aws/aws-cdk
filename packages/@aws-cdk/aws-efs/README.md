## The CDK Construct Library for AWS Elastic File System (EFS)
This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.

### Create an Elastic File System (EFS)
further reading: 
https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html
 #### No Frills, just an EFS
```ts
 import efs = require('@aws-cdk/aws-efs');
 const myEFS = new efs.FileSystem(app.stack, 'MyFileSystem');
```
#### I Wanna go FAST!!!!
This will provision a throughput for 1024 MiB/s, which is the fastest EFS allows by default. A request to AWS Support
can increase this limit.
```ts
 import efs = require('@aws-cdk/aws-efs');
 const myEFS = new efs.FileSystem(app.stack, 'MyFileSystem',{
     throughput: 1024,
 });
```
#### I Wanna go FAST with ALL THE DATA!!!!
the 'MaxIO' performance mode will give you higher throughput at the cost of increased latency per file. By default, we
set you up with 'GeneralPurpose' performance mode as that is recommended for most file systems.
```ts
 import efs = require('@aws-cdk/aws-efs');
 const myEFS = new efs.FileSystem(app.stack, 'MyFileSystem',{
     throughput: 1024,
     PerformanceMode: PerformanceMode.MaxIO
 });
```