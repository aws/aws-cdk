import { Construct } from 'constructs';
import {
  AliasRecordTargetConfig,
  IAliasRecordTarget,
  IHostedZone,
  IRecordSet,
  RecordSetProps,
} from './';
import { determineFullyQualifiedDomainName, validateRecordSetProps } from './util';
import * as iam from '../../aws-iam';
import { CustomResource, Duration, RemovalPolicy, Size, Stack } from '../../core';
import { CrossAccountRecordSetProvider } from '../../custom-resource-handlers/dist/aws-route53/cross-account-record-set-provider.generated';

/**
 * Construction properties for a CrossAccountRecordSet
 */
export interface CrossAccountRecordSetProps extends RecordSetProps {
  /**
     * The cross account IAM role which exists in the same account that contains the HostedZone where you want to create the RecordSet.
     *
     * The role must have the following permissions set:
     *   * Trust the account deploying this `CrossAccountRecordSet` construct within the AssumeRolePolicy of the role.
     *   * Grant `route53:ChangeResourceRecordSets` and `route53:ListResourceRecordSets` actions on the Hostedzone.
     *
     */
  readonly crossAccountRole: iam.IRole;
  /**
     * Region from which to obtain temporary credentials.
     *
     * @default - the Route53 signing region in the current partition
     */
  readonly assumeRoleRegion?: string;
}

/**
 * Comprehensive Route 53 Construct for cross-account RecordSet management.
 *
 * This construct is designed to simplify the creation of Route 53 RecordSets within your APEX HostedZone, enabling non-simple routing policies. It is compatible with any RecordSet configuration that conforms to the `RecordSetProps` interface.
 *
 * Similar to [CrossAccountZoneDelegationRecord](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.CrossAccountZoneDelegationRecord.html), but with extended support for all record types, not just NS delegation.
 **/
export class CrossAccountRecordSet extends Construct {
  constructor(scope: Construct, id: string, props: CrossAccountRecordSetProps) {
    super(scope, id);

    validateRecordSetProps(props);
    const resourceProperties = this.propsToResourceProperties(props);

    const customResourceType = 'Custom::CrossAccountRecordSet';
    const provider = CrossAccountRecordSetProvider.getOrCreateProvider(this, customResourceType, {
      // The lambda typically completes in <2 seconds
      timeout: Duration.seconds(30),
      description: 'Lambda function for CrossAccountRecordSet custom resource',
      useCfnResponseWrapper: false,
      // Lambda used 89 out of 128Mb (69.5%) in testing with small payloads.
      // bump memory size one level so larger ChangeBatches don't creep
      // towards the memory limit.
      memorySize: Size.mebibytes(256),
    });

    const role = iam.Role.fromRoleArn(this, 'cross-account-record-set-handler-role', provider.roleArn);

    const addToPrinciplePolicyResult = role.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sts:AssumeRole'],
      resources: [props.crossAccountRole.roleArn],
    }));

    const customResource = new CustomResource(this, 'CrossAccountRecordSetCustomResource', {
      serviceToken: provider.serviceToken,
      resourceType: customResourceType,
      properties: resourceProperties,
    });

    if (addToPrinciplePolicyResult.policyDependable) {
      customResource.node.addDependency(addToPrinciplePolicyResult.policyDependable);
    }
  }

  private propsToResourceProperties(props: CrossAccountRecordSetProps): ResourceProperties {
    let recordName: string;
    if (props.recordName) {
      recordName = determineFullyQualifiedDomainName(props.recordName!, props.zone);
    } else {
      recordName = `${props.zone.zoneName}.`;
    }
    const setIdentifier = props.setIdentifier ? props.setIdentifier : '';

    let resourceRecords = undefined;
    if (props.target.values) {
      resourceRecords = props.target.values.map((value) => {
        return { Value: value };
      });
    }

    let aliasTarget = undefined;
    if (props.target.aliasTarget) {
      const aliasRecordTargetConfig = this.getAliasRecordTargetConfig(
        recordName,
        props.target.aliasTarget,
        props.zone,
      );
      aliasTarget = {
        DNSName: aliasRecordTargetConfig.dnsName,
        HostedZoneId: aliasRecordTargetConfig.hostedZoneId,
        EvaluateTargetHealth: false,
      };
    }

    const resourceProperties: ResourceProperties = {
      AssumeRoleArn: props.crossAccountRole.roleArn,
      AssumeRoleRegion: props.assumeRoleRegion,
      HostedZoneId: props.zone.hostedZoneId,
      Name: recordName,
      Type: props.recordType,
      ResourceRecords: resourceRecords,
      AliasTarget: aliasTarget,
      TTL: props.ttl ? props.ttl!.toSeconds() : 60 * 30, // 30 minutes
      SetIdentifier: setIdentifier,
      Weight: props.weight,
      Region: props.region,
      GeoLocation: {
        ContinentCode: props.geoLocation?.continentCode,
        CountryCode: props.geoLocation?.countryCode,
        SubdivisionCode: props.geoLocation?.subdivisionCode,
      },
      DeleteExisting: props.deleteExisting ? props.deleteExisting : false,
    };

    return resourceProperties;
  }

  private getAliasRecordTargetConfig(
    domainName: string,
    target: IAliasRecordTarget,
    zone: IHostedZone,
  ): AliasRecordTargetConfig {
    // The user will have various classes that implement [IAliasRecordTarget](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.IAliasRecordTarget.html).
    // These targets need to be translated to the [Route53 ChangeResourceRecordSet Alias Target object](https://docs.aws.amazon.com/Route53/latest/APIReference/API_AliasTarget.html).
    //
    // To do that, we have to perform this funky transformation step where
    // we create a fake IRecordSet object, since that is a required parameter to [IAliasRecordTarget.bind](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.IAliasRecordTarget.html#bindrecord-zone).
    // The public bind method allows us to select the [AliasRecordTargetConfig](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.AliasRecordTargetConfig.html).
    //
    // We deal with a bit of ugliness here internally, so that the customer interface
    // remains super clean and enjoyable. They just need to pass RecordSetProps which the
    // user should already be familiar with!
    const stack = Stack.of(this);
    const mockRecordSet: IRecordSet = {
      stack: stack,
      node: this.node,
      env: {
        account: stack.account,
        region: stack.region,
      },
      domainName: domainName,
      applyRemovalPolicy: () => {
        return;
      },
    };
    mockRecordSet.applyRemovalPolicy(RemovalPolicy.DESTROY); // line coverage

    return target.bind(mockRecordSet, zone);
  }
}

// The cross-account-record-set-handler will expect this exact interface in
// @aws-cdk/custom-resource-handlers/lib/aws-route53/cross-account-record-set-handler
// Except booleans will be received as strings (CloudFormation limitation).
interface ResourceProperties {
  AssumeRoleArn: string;
  AssumeRoleRegion?: string;
  HostedZoneId: string;
  Name: string;
  Type: string;
  ResourceRecords?: { Value: string }[];
  AliasTarget?: {
    DNSName: string;
    HostedZoneId: string;
    EvaluateTargetHealth: boolean;
  };
  TTL: number;
  SetIdentifier?: string;
  Weight?: number;
  Region?: string;
  GeoLocation?: {
    ContinentCode?: string;
    CountryCode?: string;
    SubdivisionCode?: string;
  };
  DeleteExisting: boolean;
}

