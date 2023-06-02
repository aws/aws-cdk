# vpcLattice L2 Construct

- Example Impleentation
- API Design.





## Example Implementation


```typescript
// A service within VPC Lattice is an independently deployable unit of software that delivers
// a specific task or function. A service can run on instances, containers, or as serverless
// functions within an account or a virtual private cloud (VPC).
// A service has a listener that uses rules, called listener rules, that you can configure to 
// route traffic to your targets. Targets can be EC2 instances, IP addresses, serverless Lambda
// functions, Application Load Balancers,
const myLatticeService = new vpclattice.Service(this, 'myLatticeService', {

})

// A service network is a logical boundary for a collection of services.
// Services associated with the  network can be authorized for discovery, connectivity, 
// accessibility, and observability. To make requests to services in the network, your service or
// client must be in a VPC that is associated with the service network.

const latticeLogs: s3.Bucket = new s3.Bucket()
const vpc1: ec2.Vpc = ec2.Vpc();
const vpc2: ec2.Vpc = ec2.Vpc();


new vpclattice.ServiceNetwork(this, 'myLatticeServiceNetwork', {
  name: 'alpha-service-network',
  services: [ myLatticeService ],
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


## Proposed API Design for vpclattice

ServiceNetwork
Service

### ServiceNetwork
A service network is a logical boundary for a collection of services. Services associated with the network can be authorized for discovery, connectivity, accessibility, and observability. To make requests to services in the network, your service or client must be in a VPC that is associated with the service network.

The construct `ServiceNetwork` provides for this. 


The construct will implement `IServiceNetwork`.  


```typescript
/**
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
  grantAccess(principal: iam.IPrincipal[]): void;
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
  addAuthPolicy(): void;

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
