## Connections

AWS resources that use EC2 security groups to manage network security should
implement the **connections API** interface by having the construct interface
extend **ec2.IConnectable** _[awslint:connectable-interface]_.