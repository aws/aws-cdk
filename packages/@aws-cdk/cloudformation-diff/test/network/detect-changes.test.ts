import { diffTemplate } from '../../lib';
import { resource, template } from '../util';

test('detect addition of all types of rules', () => {
  // WHEN
  const diff = diffTemplate({}, template({
    SG: resource('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        {
          CidrIp: '1.2.3.4/8',
          FromPort: 80,
          ToPort: 80,
          IpProtocol: 'tcp',
        },
      ],
      SecurityGroupEgress: [
        {
          DestinationSecurityGroupId: { 'Fn::GetAtt': ['ThatOtherGroup', 'GroupId'] },
          FromPort: 80,
          ToPort: 80,
          IpProtocol: 'tcp',
        },
      ],
    }),
    InRule: resource('AWS::EC2::SecurityGroupIngress', {
      GroupId: { 'Fn::GetAtt': ['SG', 'GroupId'] },
      FromPort: -1,
      ToPort: -1,
      IpProtocol: 'icmp',
      SourcePrefixListId: 'pl-1234',
    }),
    OutRule: resource('AWS::EC2::SecurityGroupEgress', {
      GroupId: { 'Fn::GetAtt': ['SG', 'GroupId'] },
      FromPort: -1,
      ToPort: -1,
      IpProtocol: 'udp',
      CidrIp: '7.8.9.0/24',
    }),
  }));

  // THEN
  expect(diff.securityGroupChanges.toJson()).toEqual({
    ingressRuleAdditions: [
      {
        groupId: '${SG.GroupId}',
        ipProtocol: 'tcp',
        fromPort: 80,
        toPort: 80,
        peer: { kind: 'cidr-ip', ip: '1.2.3.4/8' },
      },
      {
        groupId: '${SG.GroupId}',
        ipProtocol: 'icmp',
        fromPort: -1,
        toPort: -1,
        peer: { kind: 'prefix-list', prefixListId: 'pl-1234' },
      },
    ],
    egressRuleAdditions: [
      {
        groupId: '${SG.GroupId}',
        ipProtocol: 'tcp',
        fromPort: 80,
        toPort: 80,
        peer: { kind: 'security-group', securityGroupId: '${ThatOtherGroup.GroupId}' },
      },
      {
        groupId: '${SG.GroupId}',
        ipProtocol: 'udp',
        fromPort: -1,
        toPort: -1,
        peer: { kind: 'cidr-ip', ip: '7.8.9.0/24' },
      },
    ],
  });
});
