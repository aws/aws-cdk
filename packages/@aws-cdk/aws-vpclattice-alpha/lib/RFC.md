# vpcLattice L2 Construct

- [Project Information](#project-information)
- [Example Impleentation](#example-implementation)
- [API Design](#proposed-api-design-for-vpclattice)
- [FAQ](#faq)
- [Acceptance](#acceptance)


--- 
## Project Information

**Status** (DRAFT)

**Original Author(s):** @mrpackethead, , @taylaand,  @nbaillie

**Tracking Issue:** #502

**API Bar Raiser:** @TheRealAmazonKendra

**Public Issues ( aws-cdk)**
* (vpclattice): L2 for Amazon VPC Lattice #25452


**Prototype Code**
- https://github.com/raindancers/latticeplay
- https://github.com/raindancers/aws-cdk/tree/mrpackethead/aws-vpclattice-alpha/packages/%40aws-cdk/aws-vpclattice-alpha


**VpcLattice**

Amazon VPC Lattice is an application networking service that consistently connects, monitors, and secures communications between your services, helping to improve productivity so that your developers can focus on building features that matter to your business. You can define policies for network traffic management, access, and monitoring to connect compute services in a simplified and consistent way across instances, containers, and serverless applications.
 
---

## Example Implementation

A Service is created and assocaited with a ServiceNetwork
A Lattice Network is created, and associated with two different VPC's, VPC1 and VPC2.  
Two lambdas are created,  lambda1 is providing a interface to an api,  lambda2 is making requests..  Lambda1 will be in VPC1, and Lambda2 in VPC2



```typescript
const serviceCert: certificatemanager.Certificate;
const lambda1: lambda.Function;
const lambda2: lambda.Function;


// Create a Lattice Service, with a custom certificate and domain name,
// this will default to using IAM Authentication
const myLatticeService = new vpclattice.Service(this, 'myLatticeService', {
  certificate: serviceCert,
  customDomain: 'exampleorg.cloud'
  dnsEntry: 'latticerfc'
});

// add a listener to the service, using the defaults  ( HTTPS, port 443
// a default action of returning 404 NOT FOUND, and a cloudformation provided name
const myListener = myLatticeService.addListener();


// add a rule to the service called 'rule1', with an forwarding action to a 
// target group that contains lambda1.
// the rule will be triggered if there is a path match of `/path1`
// allow Lambda2 to access this path ( this adds a statment in the authPolicy for 
// the service )

myListener.addListenerRule(
  name: 'rule1'
  action: [
    { 
      targetGroup: new vpclattice.TargetGroup(
        name: 'lambda1target',
        lambdaTargets: [ lambda1 ]
      )
    }
  ]
  pathMatch: {
    path: '/path1'
  }
  allowedPrincipals: [lambda2.role]
)

// add an additonal auth policy to the service as reqiured;
myLatticeService.addPolicyStatement(
  new iam.PolicyStatement({}),
);

// after the creation of Rules, or the additons of additonal PolicyStatements, apply the authPolicy to the Service.
myLatticeService.applyAuthPolicyToService();


// Create a service Network, and add the services as required.
// client must be in a VPC that is associated with the service network.

const latticeLogs: s3.Bucket = new s3.Bucket()
const vpc1: ec2.Vpc = ec2.Vpc();
const vpc2: ec2.Vpc = ec2.Vpc();

new vpclattice.ServiceNetwork(this, 'myLatticeServiceNetwork', {
  name: 'alpha-service-network',
  services: [ 
    myLatticeService 
  ],
  s3LogDestination: [ latticelogs ],
  vpcs: [
    vpc1,
    vpc2,
  ],
  accounts: [
	'1111111111111',
	'2222222222222'
  ],
})
```
---

## Proposed API Design for vpclattice

- [ServiceNetwork](#servicenetwork)
- [Service](#serviceService)
- [Listener](#listener)
- [TargetGroups](#targetgroups)   



### ServiceNetwork
A service network is a logical boundary for a collection of services. Services associated with the network can be authorized for discovery, connectivity, accessibility, and observability. To make requests to services in the network, your service or client must be in a VPC that is associated with the service network.


![Service Network](https://docs.aws.amazon.com/images/vpc-lattice/latest/ug/images/service-network.png)

The construct `ServiceNetwork` provides for this. 


The construct will implement `IServiceNetwork`.  


```typescript
/**
 * Create a vpc lattice service network.
 * Implemented by `ServiceNetwork`.
 */
e/**
 * Create a vpc lattice service network.
 * Implemented by `ServiceNetwork`.
 */
export interface IServiceNetwork extends core.IResource {

  /**
  * The Amazon Resource Name (ARN) of the service network.
  */
  readonly serviceNetworkArn: string;

  /**
   * The Id of the Service Network
   */
  readonly serviceNetworkId: string;
  /**
   * Grant Princopals access to the Service Network
   */
  grantAccessToServiceNetwork(principal: iam.IPrincipal[]): void;
  /**
   * Add Lattice Service Policy
   */
  addService(service: Service): void;
  /**
   * Associate a VPC with the Service Network
   */
  associateVPC(props: AssociateVPCProps): void;
  /**
   * Log To S3
   */
  logToS3(bucket: s3.Bucket | s3.IBucket ): void;
  /**
   * Send Events to Cloud Watch
   */
  sendToCloudWatch(log: logs.LogGroup | logs.ILogGroup ): void;
  /**
   * Stream to Kinesis
   */
  streamToKinesis(stream: kinesis.Stream | kinesis.IStream ): void;
  /**
   * Share the ServiceNetwork
   */
  share(props: ShareServiceNetworkProps): void;
  /**
   * Create and Add an auth policy to the Service Network
   */
  applyAuthPolicyToServiceNetwork(): void;
}

}
``` 
All of the class functions, apart from addAuthPolicy, are convience functions that mirror the properties. 

`ServiceNetwork` will take `ServiceNetworkProps` as props
```typescript
/**
 * The properties for the ServiceNetwork.
 */
export interface ServiceNetworkProps {

  /** The name of the Service Network. If not provided Cloudformation will provide
   * a name
   * @default cloudformation generated name
   */
  readonly name?: string

  /** The type of  authentication to use with the Service Network.
   * @default 'AWS_IAM'
   */
  readonly authType?: AuthType | undefined;

  /**
   * S3 buckets for access logs
   * @default no s3 logging
   */

  readonly s3LogDestination: s3.IBucket[] | undefined;
  /**
   * Cloudwatch Logs
   * @default no logging to cloudwatch
   */
  readonly cloudwatchLogs?: logs.ILogGroup[] | undefined;

  /**
   * kinesis streams
   * @default no streaming to Kinesis
   */
  readonly kinesisStreams?: kinesis.IStream[];

  /**
   * Lattice Services that are assocaited with this Service Network
   * @default no services are associated with the service network
   */
  readonly services?: Service[] | undefined;

  /**
   * Vpcs that are associated with this Service Network
   * @default no vpcs are associated
   */
  readonly vpcs?: ec2.IVpc[] | undefined;

  /**
   * Account principals that are permitted to use this service
   * @default none
   */
  readonly accounts?: iam.AccountPrincipal[] | undefined;

  /**
   * arnToShareWith, use this for specifying Orgs and OU's
   * @default false
   */
  readonly arnToShareServiceWith?: string[] | undefined;

  /**
   * Allow external principals
   * @default false
   */

  readonly allowExternalPrincipals?: boolean | undefined;
}

```

### Service

A service within VPC Lattice is an independently deployable unit of software that delivers a specific task or function.  A service has listeners that use rules, that you configure to route traffic to your targets. Targets can be EC2 instances, IP addresses, serverless Lambda functions, Application Load Balancers, or Kubernetes Pods.  The following diagram shows the key components of a typical service within VPC Lattice.


![service](https://docs.aws.amazon.com/images/vpc-lattice/latest/ug/images/service.png)


```typescript
**
 * Create a vpcLattice service network.
 * Implemented by `Service`.
 */
export interface IService extends core.IResource {
  /**
  * The Amazon Resource Name (ARN) of the service.
  */
  readonly serviceArn: string;
  /**
  * The Id of the Service Network
  */
  readonly serviceId: string;

  /**
   * Add A vpc listener to the Service.
   * @param props
   */
  addListener(props: AddListenerProps ): IListener;
  /**
   * Share the service to other accounts via RAM
   * @param props
   */
  share(props: ShareServiceProps): void;

  /**
  * Create a DNS entry in R53 for the service.
  */
  addDNSEntry(props: aws_vpclattice.CfnService.DnsEntryProperty): void;

  /**
   * Add a certificate to the service
   * @param certificate
   */
  addCertificate(certificate: certificatemanager.Certificate): void;

  /**
   * add a custom domain to the service
   * @param domain
   */
  addCustomDomain(domain: string): void;

  /**
   * add a name for the service
   * @default cloudformation will provide a name
   */
  addName(name: string): void;
  /**
   * grant access to the service
   *
   */
  grantAccess(principals: iam.IPrincipal[]): void;
  /**
   * Apply the authAuthPolicy to the Service
   */
  applyAuthPolicyToService(): iam.PolicyDocument;
  /**
   * Add A policyStatement to the Auth Policy
   */
  addPolicyStatement(statement: iam.PolicyStatement): void;
}
```
### Listener
A listener is a process that checks for connection requests, using the protocol and port that you configure. The rules that you define for a listener determine how the service routes requests to its registered targets.

It is not expected that a direct call to Listener will be made, instead the `.addListener()` should be used.


``` typescript
export interface IListener extends core.IResource {
  /**
  * The Amazon Resource Name (ARN) of the service.
  */
  readonly listenerArn: string;
  /**
  * The Id of the Service Network
  */
  readonly listenerId: string;

  /**
   * Add A Listener Rule to the Listener
   */
  addListenerRule(props: AddRuleProps): void;

}
```


```typescript
/**
 * Propertys to Create a Lattice Listener
 */
export interface ListenerProps {
  /**
   *  * A default action that will be taken if no rules match.
   *  @default 404 NOT Found
  */
  readonly defaultAction?: aws_vpclattice.CfnListener.DefaultActionProperty | undefined;
  /**
  * protocol that the listener will listen on
  */
  readonly protocol: Protocol
  /**
  * Optional port number for the listener. If not supplied, will default to 80 or 443, depending on the Protocol
  * @default 80 or 443 depending on the Protocol

  */
  readonly port?: number | undefined
  /**
  * The Name of the service.
  * @default CloudFormation provided name.
  */
  readonly name?: string;
  /**
   * The service
   */
  readonly serviceId: string;
  /**
   * the authpolicy for the service this listener is associated with
   * @default none.
   */
  readonly serviceAuthPolicy?: iam.PolicyDocument | undefined
}
```

### TargetGroups

A VPC Lattice target group is a collection of targets, or compute resources, that run your application or service. Targets can be EC2 instances, IP addresses, Lambda functions, Application Load Balancers, or Kubernetes Pods. 

```typescript
 * Create a vpc lattice TargetGroup.
 * Implemented by `TargetGroup`.
 */
export interface ITargetGroup extends core.IResource {
  /**
   * The id of the target group
   */
  readonly targetGroupId: string
  /**
   * The Arn of the target group
   */
  readonly targetGroupArn: string;

}
```



```typescript
/**
 * Properties for a Target Group, Only supply one of instancetargets, lambdaTargets, albTargets, ipTargets
 */
export interface TargetGroupProps {
  /**
   * The name of the target group
   */
  readonly name: string,
  /**
   * A list of ec2 instance targets.
   * @default - No targets
   */
  readonly instancetargets?: ec2.Instance[],
  /**
   * A list of ip targets
   * @default - No targets
   */
  readonly ipTargets?: string[],
  /**
   * A list of lambda targets
   * @default - No targets
   */
  readonly lambdaTargets?: aws_lambda.Function[],
  /**
   * A list of alb targets
   * @default - No targets
   */
  readonly albTargets?: elbv2.ApplicationListener[]
  /**
   * The Target Group configuration. Must be provided for alb, instance and Ip targets, but
   * must not be provided for lambda targets
   * @default - No configuration
   */
  /**
   * The Target Group configuration. Must be provided for alb, instance and Ip targets, but
   * must not be provided for lambda targets
   * @default - No configuration
   */
  readonly config?: vpclattice.TargetGroupConfig | undefined,
}
```

---

### FAQ

**What are we launching today?**  
Amazon VPC Lattice AWS CDK L2 Construct

**Why should I use this construct?**  
This CDK L2 Construct can be used to deploy resources from Amazon VPC Lattice. VPC Lattice is a fully managed application networking service that you use to connect, secure, and monitor all your services across multiple accounts and virtual private clouds (VPCs).

This construct handles all the different resources you can use with VPC Lattice: Service Network, Service, Listeners, Listener Rules, Target Groups (and targets), and Associations (Service or VPC). You have the freedom to create the combination of resources you need, so in multi-AWS Account environments you can make use of the module as many times as needed (different providers) to create your application network architecture.

You can check common Amazon VPC Lattice Reference Architectures to understand the different use cases you can build with the AWS service.

- It simplifies the deployment of common patterns for AWS VPC Lattice
- It has been tested and implemented as part of a number of wider architectures
- It is extensible to support other patterns as they emerge
- It simplifies AWS VPC Lattice adoption and administration
- Allows you to integrate infrastructure deployment with your application code
- Reduces time to deploy and test AWS VPC Lattice
- Provides separation of concerns with a common interface for user personas

**Why are we doing this?**  
- To provide a CDK native interface for AWS VPC Lattice
- Provide a way to deploy AWS VPC Lattice deterministically

**Is this a breaking change**  
No.

**What are the drawbacks of this solution**  
- It is an opinionated pattern, however there are escapes to help customisation where needed.
- It is a new AWS Service and its common usecases and features may change and evolve

---
### Acceptance
Ticking the box below indicates that the public API of this RFC has been signed-off by the API bar raiser (the api-approved label was applied to the RFC pull request):


`[ ] Signed-off by API Bar Raiser @TheRealAmazonKendra`
