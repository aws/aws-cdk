import { Template } from '../../assertions';
import { App, Stack } from '../../core';
import { Port, SecurityGroup, SubnetType, Vpc } from '../lib';
import { Ipv4Assign, NetworkInterface } from '../lib/network-interface';

describe('network interface', () => {
  describe('Ipv4Assign', () => {
    test('fromPrimaryIpAddress can not add a additional primary IPv4 address', () => {
      const ipv4 = Ipv4Assign.fromPrimaryIpAddress('10.0.0.10');
      expect(ipv4._primaryIpAddress).toBe('10.0.0.10');
      expect(() => ipv4.addPrimaryAddress('10.0.0.11'))
        .toThrow('You try add the primary IPv4 address 10.0.0.11, but already set the 10.0.0.10');
    });
    test('fromPrimaryIpAddress should throw an error when provide invalid IPv4 addresses', () => {
      expect(() => {
        Ipv4Assign.fromPrimaryIpAddress('10.0.0.-1');
      }).toThrow(/10.0.0.-1 is not valid IPv4 address./);
      expect(() => {
        Ipv4Assign.fromPrimaryIpAddress('10.0.0.256');
      }).toThrow(/10.0.0.256 is not valid IPv4 address./);
    });
    test('fromIpAddressCount can add a primary IPv4 address', () => {
      const ipv4 = Ipv4Assign.fromIpAddressCount(3).addPrimaryAddress('10.0.0.10');
      expect(ipv4._ipAddressCount).toBe(3);
      expect(ipv4._primaryIpAddress).toBe('10.0.0.10');
    });
    test('fromIpAdresses can add a primary IPv4 address', () => {
      const ipv4 = Ipv4Assign.fromIpAdresses('10.0.0.11', '10.0.0.12').addPrimaryAddress('10.0.0.10');
      expect(ipv4._ipAddresses).toStrictEqual(['10.0.0.11', '10.0.0.12']);
      expect(ipv4._primaryIpAddress).toBe('10.0.0.10');
    });
    test('fromIpAdresses should throw an error when provide invalid IPv4 addresses', () => {
      expect(() => {
        Ipv4Assign.fromIpAdresses('10.0.0.-1');
      }).toThrow(/10.0.0.-1 is not valid IPv4 address./);
      expect(() => {
        Ipv4Assign.fromIpAdresses('10.0.0.256');
      }).toThrow(/10.0.0.256 is not valid IPv4 address./);
    });
    test('fromPrefixCount can add a primary IPv4 address', () => {
      const ipv4 = Ipv4Assign.fromPrefixCount(3).addPrimaryAddress('10.0.0.10');
      expect(ipv4._prefixCount).toBe(3);
      expect(ipv4._primaryIpAddress).toBe('10.0.0.10');
    });
    test('fromPrefixes can add a primary IPv4 address', () => {
      const ipv4 = Ipv4Assign.fromPrefixes('10.0.0.0/28', '10.1.0.0/28').addPrimaryAddress('10.0.0.10');
      expect(ipv4._prefixes).toStrictEqual(['10.0.0.0/28', '10.1.0.0/28']);
      expect(ipv4._primaryIpAddress).toBe('10.0.0.10');
    });
    test('fromPrefixes should throw an error when provide prefix that not end with /28', () => {
      expect(() => {
        Ipv4Assign.fromPrefixes('10.0.0.0/27');
      }).toThrow(/IPv4 prefix must be end with \/28/);
      expect(() => {
        Ipv4Assign.fromPrefixes('10.0.0.0/29');
      }).toThrow(/IPv4 prefix must be end with \/28/);
    });
  });

  describe('NetworkInterface', () => {
    describe('default value', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      new NetworkInterface(stack, 'Eni', { vpc });
      const template = Template.fromStack(stack);
      it('Should create a new SecurityGroup', () => {
        template.hasResourceProperties('AWS::EC2::NetworkInterface', {
          GroupSet: [{ 'Fn::GetAtt': ['EniSecurityGroupB322E963', 'GroupId'] }],
        });
      });
      it('Should use a private subnet', () => {
        template.hasResourceProperties('AWS::EC2::NetworkInterface', {
          SubnetId: { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
        });
      });
      it('Should set the name tag with node path', () => {
        template.hasResourceProperties('AWS::EC2::NetworkInterface', {
          Tags: [{ Key: 'Name', Value: 'TestStack/Eni' }],
        });
      });
      it('Should set the description with default name', () => {
        template.hasResourceProperties('AWS::EC2::NetworkInterface', {
          Description: 'ENI TestStack/Eni',
        });
      });
    });

    test('Should use provided security groups', () => {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      const sg1 = new SecurityGroup(stack, 'SG1', { vpc });
      const eni = new NetworkInterface(stack, 'Eni', {
        vpc,
        securityGroups: [sg1],
      });
      eni.connections.allowFromAnyIpv4(Port.tcp(80));
      eni.connections.addSecurityGroup(new SecurityGroup(stack, 'SG2', { vpc }));

      // Then
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NetworkInterface', {
        GroupSet: [
          { 'Fn::GetAtt': ['SG1BA065B6E', 'GroupId'] },
          { 'Fn::GetAtt': ['SG20CE3219C', 'GroupId'] },
        ],
      });
      template.resourcePropertiesCountIs('AWS::EC2::SecurityGroup', {
        SecurityGroupIngress: [
          {
            CidrIp: '0.0.0.0/0',
            FromPort: 80,
            IpProtocol: 'tcp',
            ToPort: 80,
          },
        ],
      }, 2);
    });

    test('Should use provided description', () => {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      new NetworkInterface(stack, 'Eni', {
        vpc,
        networkInterfaceName: 'MyNetworkInterface',
      });

      // Then
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NetworkInterface', {
        Description: 'ENI MyNetworkInterface',
        Tags: [
          {
            Key: 'Name',
            Value: 'MyNetworkInterface',
          },
        ],
      });
    });

    test('Should use provided network interface name', () => {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      new NetworkInterface(stack, 'Eni', {
        vpc,
        networkInterfaceName: 'MyNetworkInterface',
        description: 'My description',
      });

      // Then
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NetworkInterface', {
        Description: 'My description',
      });
    });

    describe('subnet', () => {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      new NetworkInterface(stack, 'Eni', {
        vpc,
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        },
      });

      // Then
      const template = Template.fromStack(stack);
      it('Should use found a subnet by the provided subnet selection', () => {
        template.hasResourceProperties('AWS::EC2::NetworkInterface', {
          SubnetId: {
            Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
          },
        });
      });

      it('Should throw an error when provide not findable subnet selection', () => {
        expect(() => new NetworkInterface(stack, 'UndefinedSubnetEni', {
          vpc,
          vpcSubnets: {
            subnetFilters: [
              { selectSubnets: ()=> [] },
            ],
          },
        })).toThrow('Did not find any subnets matching \'{\"subnetFilters\":[{}]}\', please use a different selection.');
      });
    });

    test.each([1, 2, 3])('Should set Ipv4PrefixCount from value of Ipv4Assign.fromPrefixCount', (count)=> {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      new NetworkInterface(stack, 'Eni', {
        vpc,
        ipv4: Ipv4Assign.fromPrefixCount(count),
      });

      // Then
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NetworkInterface', {
        Ipv4PrefixCount: count,
      });
    });

    test('Should set Ipv4Prefixes from value of Ipv4Assign.fromPrefixes', ()=> {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      new NetworkInterface(stack, 'Eni', {
        vpc,
        ipv4: Ipv4Assign.fromPrefixes('10.0.0.0/28', '10.1.0.0/28'),
      });

      // Then
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NetworkInterface', {
        Ipv4Prefixes: [
          { Ipv4Prefix: '10.0.0.0/28' },
          { Ipv4Prefix: '10.1.0.0/28' },
        ],
      });
    });

    test('Should set privateIpAddress from value of Ipv4Assign.fromPrimaryIpAddress', ()=> {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      new NetworkInterface(stack, 'Eni', {
        vpc,
        ipv4: Ipv4Assign.fromPrimaryIpAddress('10.0.0.5'),
      });

      // Then
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NetworkInterface', {
        PrivateIpAddress: '10.0.0.5',
      });
    });

    test('Should set PrivateIpAddresses from value of Ipv4Assign.fromIpAdresses', ()=> {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      new NetworkInterface(stack, 'Eni', {
        vpc,
        ipv4: Ipv4Assign.fromIpAdresses('10.0.0.5', '10.0.0.6', '10.0.0.7'),
      });

      // Then
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NetworkInterface', {
        PrivateIpAddresses: [
          { Primary: false, PrivateIpAddress: '10.0.0.5' },
          { Primary: false, PrivateIpAddress: '10.0.0.6' },
          { Primary: false, PrivateIpAddress: '10.0.0.7' },
        ],
      });
    });

    test.each([1, 2, 3])('Should set SecondaryPrivateIpAddressCount from value of Ipv4Assign.fromIpAddressCount', (count)=> {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const vpc = new Vpc(stack, 'Vpc');
      new NetworkInterface(stack, 'Eni', {
        vpc,
        ipv4: Ipv4Assign.fromIpAddressCount(count),
      });

      // Then
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NetworkInterface', {
        SecondaryPrivateIpAddressCount: count,
      });
    });

    test('A imported network interface should implemtent IConnectable', () => {
      // When
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const eni = NetworkInterface.fromNetworkInterfaceAttributes(stack, 'ExistingNetworkInterface', {
        networkInterfaceId: 'eni-exist',
        securityGroups: [
          SecurityGroup.fromSecurityGroupId(stack, 'ExistingSecurityGroup', 'sg-eni-exist'),
        ],
      });
      eni.connections.allowFromAnyIpv4(Port.tcp(80));

      // Then
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
        CidrIp: '0.0.0.0/0',
        Description: 'from 0.0.0.0/0:80',
        FromPort: 80,
        GroupId: 'sg-eni-exist',
        IpProtocol: 'tcp',
        ToPort: 80,
      });
    });
  });
});

