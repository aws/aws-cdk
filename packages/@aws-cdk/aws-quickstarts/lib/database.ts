import ec2 = require('@aws-cdk/aws-ec2');
import rds = require('@aws-cdk/aws-rds');
import cdk = require('@aws-cdk/cdk');
import util = require('@aws-cdk/util');

export interface SqlServerProps {
    instanceClass?: string;
    engine?: string;
    engineVersion?: string;
    licenseModel?: string;
    masterUsername: string;
    masterPassword: string;
    allocatedStorage?: number;
    vpc: ec2.VpcNetworkRef;
}

/**
 * An instance of Microsoft SQL server with associated security groups
 */
export class SqlServer extends cdk.Construct implements ec2.IConnectable {
    private static readonly PORT = 1433;
    public readonly connections: ec2.Connections;
    public readonly defaultPortRange: ec2.IPortRange;
    private readonly securityGroup: ec2.SecurityGroup;

    constructor(parent: cdk.Construct, name: string, props: SqlServerProps) {
        super(parent, name);

        this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
            vpc: props.vpc,
            description: 'Database security group',
        });

        const subnetGroup = new rds.cloudformation.DBSubnetGroupResource(this, 'Subnet', {
            subnetIds: props.vpc.privateSubnets.map(privateSubnet => privateSubnet.subnetId),
            dbSubnetGroupDescription: 'Database subnet group',
        });

        const p = util.applyDefaults(props, {
            instanceClass: 'db.m4.large',
            engine: 'sqlserver-se',
            engineVersion: '13.00.4422.0.v1',
            licenseModel: 'license-included',
            allocatedStorage: 200
        });

        new rds.cloudformation.DBInstanceResource(this, 'Resource', {
            allocatedStorage: p.allocatedStorage.toString(),
            dbInstanceClass: p.instanceClass,
            engine: p.engine,
            engineVersion: p.engineVersion,
            licenseModel: p.licenseModel,
            masterUsername: p.masterUsername,
            masterUserPassword: p.masterPassword,
            port: SqlServer.PORT.toString(),
            dbSubnetGroupName: subnetGroup.ref,
            vpcSecurityGroups: [ this.securityGroup.securityGroupId ]
        });

        this.defaultPortRange = new ec2.TcpPort(SqlServer.PORT);
        this.connections = new ec2.Connections(this.securityGroup, this.defaultPortRange);
    }
}
