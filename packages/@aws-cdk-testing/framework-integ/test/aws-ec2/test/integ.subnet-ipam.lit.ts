import { SubnetIpamTest, SubnetIpamIntegTest } from './integ.subnet-ipam';

// 既存テストスタックの説明
const literalOutput = `
# サブネットの機能とIPv6のサポート

このテストは、AWS CDKでのサブネットの基本機能とIPv6サポートのテスト例です。
また、将来的な機能として実装予定のIPAM（IP Address Manager）機能についても説明しています。

## テスト内容

1. **基本的なサブネットの作成**
   - VPC内に標準的なIPv4サブネットを作成
   - 固定のCIDRブロックを使用

2. **IPv6サポートの有効化**
   - 2つ目のサブネットでIPv6アドレスの自動割り当てを有効化
   - デュアルスタック（IPv4/IPv6）構成の検証

## 将来の機能: IPAM (IP Address Manager) 統合

AWS IP Address Manager (IPAM) の統合により、以下の機能が利用可能になる予定です:

- IPv4およびIPv6アドレス空間を一元管理
- IPAMプールからCIDRを動的に割り当て
- 使用中のCIDRブロックの重複を防止
- IPアドレスの割り当て履歴を追跡

IPAM機能の例（将来のリリースで実装予定）:

\`\`\`typescript
// IPv4 IPAM割り当てを使用したサブネット
const subnet = new ec2.Subnet(stack, 'Subnet', {
  vpcId: vpc.vpcId,
  availabilityZone: vpc.availabilityZones[0],
  ipv4IpamAllocation: {
    ipamPoolId: 'ipam-pool-id', // 実際のIPAMプールID
    netmaskLength: 24,
  },
});

// IPv6 IPAM割り当てを使用したサブネット
const subnetIpv6 = new ec2.Subnet(stack, 'SubnetIpv6', {
  vpcId: vpc.vpcId,
  availabilityZone: vpc.availabilityZones[1],
  cidrBlock: '10.0.1.0/24',
  assignIpv6AddressOnCreation: true,
  ipv6IpamAllocation: {
    ipamPoolId: 'ipam-pool-id', // 実際のIPAMプールID
    netmaskLength: 64,
  },
});
\`\`\`

## テスト実行方法

このテストは合成のみを行い、実際のデプロイは実行しません。
IPAM機能を実際にテストするには、AWS組織内で設定されたIPAMプールが必要です。
`;

// スタックをリエクスポート
export = { SubnetIpamTest, SubnetIpamIntegTest, literalOutput };
