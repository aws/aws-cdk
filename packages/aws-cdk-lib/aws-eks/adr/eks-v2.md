## Stack Destroy

We commonly see failures to destroy stacks. The VPC is failing with:

```console
Resource handler returned message: "The subnet 'subnet-0bfbe125dc79e16b1' has dependencies and cannot be deleted. (Service: Ec2, Status Code: 400, 
Request ID: b7fc959a-2f63-4cb6-bcc1-94d018266dad)" (RequestToken: 2065a297-5217-32dc-e093-913ef88ae05d, HandlerErrorCode: InvalidRequest)
```

When this happens, there are two resources that aren't managed by CFN:

- Two ENI's with: (Created by Lambda)

  - **Description:** AWS Lambda VPC ENI-ClusterStack-awscdkawseksKubectlPr-Handler886CB40B-PPn4IvQMx4pw-8ce48986-c60e-4a85-9fad-9d5d17ad4d04
  - **Security group:** sg-0997f1d0dda954f4e (eks-cluster-sg-Cluster9EE0221C-46503e2383b2404dbc30cbc52a59c844-1533687528)
  - **Status:** Available

- A security group with: (Created by EKS)

  - **Name:** eks-cluster-sg-Cluster9EE0221C-46503e2383b2404dbc30cbc52a59c844-1533687528
  - **Description:** EKS created security group applied to ENI that is attached to EKS Control Plane master nodes, as well as any managed workloads.
  
  So when the VPC is deleted, its trying to delete the subnet, which cannot be deleted because the ENIs are still using it. Also, why does the security group still exist? it should have been deleted by EKS - could it be because the kubectl provider is using it? 

## Resources

- https://github.com/weaveworks/eksctl/issues/5135
