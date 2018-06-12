import { Construct } from '@aws-cdk/core';
import { DefaultConnections, IConnectable, IPortRange, SecurityGroup, TcpPort, VpcNetworkRef } from '@aws-cdk/ec2';
import { rds } from '@aws-cdk/resources';
import { applyDefaults } from '@aws-cdk/util';

export interface SqlServerProps {
    instanceClass?: string;
    engine?: string;
    engineVersion?: string;
    licenseModel?: string;
    masterUsername: string;
    masterPassword: string;
    allocatedStorage?: number;
    vpc: VpcNetworkRef;
}

/**
 * An instance of Microsoft SQL server with associated security groups
 */
export class SqlServer extends Construct implements IConnectable {
    private static readonly PORT = 1433;
    public readonly connections: DefaultConnections;
    public readonly defaultPortRange: IPortRange;
    private readonly securityGroup: SecurityGroup;

    constructor(parent: Construct, name: string, props: SqlServerProps) {
        super(parent, name);

        this.securityGroup = new SecurityGroup(this, 'SecurityGroup', {
            vpc: props.vpc,
            description: 'Database security group',
        });

        const subnetGroup = new rds.DBSubnetGroupResource(this, 'Subnet', {
            subnetIds: props.vpc.privateSubnets.map(privateSubnet => privateSubnet.subnetId),
            dbSubnetGroupDescription: 'Database subnet group',
        });

        const p = applyDefaults(props, {
            instanceClass: 'db.m4.large',
            engine: 'sqlserver-se',
            engineVersion: '13.00.4422.0.v1',
            licenseModel: 'license-included',
            allocatedStorage: 200
        });

        new rds.DBInstanceResource(this, 'Resource', {
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

        this.defaultPortRange = new TcpPort(SqlServer.PORT);
        this.connections = new DefaultConnections(this.securityGroup, this);
    }
}
