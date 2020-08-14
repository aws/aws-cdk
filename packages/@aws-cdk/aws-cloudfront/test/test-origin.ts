import { CfnDistribution, IOrigin, OriginBase, OriginProps, OriginProtocolPolicy } from '../lib';

/** Used for testing common Origin functionality */
export class TestOrigin extends OriginBase {
  constructor(domainName: string, props: OriginProps = {}) { super(domainName, props); }
  protected renderCustomOriginConfig(): CfnDistribution.CustomOriginConfigProperty | undefined {
    return { originProtocolPolicy: OriginProtocolPolicy.HTTPS_ONLY };
  }
}

export function defaultOrigin(domainName?: string): IOrigin {
  return new TestOrigin(domainName ?? 'www.example.com');
}
