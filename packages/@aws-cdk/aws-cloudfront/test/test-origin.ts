import { Construct } from 'constructs';
import { CfnDistribution, IOrigin, OriginBase, OriginBindConfig, OriginBindOptions, OriginProps, OriginProtocolPolicy } from '../lib';

/** Used for testing common Origin functionality */
export class TestOrigin extends OriginBase {
  constructor(domainName: string, props: OriginProps = {}) { super(domainName, props); }
  protected renderCustomOriginConfig(): CfnDistribution.CustomOriginConfigProperty | undefined {
    return { originProtocolPolicy: OriginProtocolPolicy.HTTPS_ONLY };
  }
}

export class TestOriginGroup implements IOrigin {
  constructor(private readonly primaryDomainName: string, private readonly secondaryDomainName: string) { }
  /* eslint-disable @aws-cdk/no-core-construct */
  public bind(scope: Construct, options: OriginBindOptions): OriginBindConfig {
    const primaryOrigin = new TestOrigin(this.primaryDomainName);
    const secondaryOrigin = new TestOrigin(this.secondaryDomainName);

    const primaryOriginConfig = primaryOrigin.bind(scope, options);
    return {
      originProperty: primaryOriginConfig.originProperty,
      failoverConfig: {
        failoverOrigin: secondaryOrigin,
      },
    };
  }
}

export function defaultOrigin(domainName?: string): IOrigin {
  return new TestOrigin(domainName ?? 'www.example.com');
}

export function defaultOriginGroup(): IOrigin {
  return new TestOriginGroup('www.example.com', 'foo.example.com');
}
