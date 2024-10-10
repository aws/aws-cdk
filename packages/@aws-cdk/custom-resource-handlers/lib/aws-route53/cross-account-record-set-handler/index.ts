// eslint-disable-next-line import/no-extraneous-dependencies
import * as crypto from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Change, ListResourceRecordSetsCommandInput, Route53 } from '@aws-sdk/client-route-53';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ResourceRecordSet } from 'aws-sdk/clients/route53';
// esbuild-disable unsupported-require-call
import { submitResponse } from '../../core/nodejs-entrypoint-handler/index';
import { route53Region } from '../sts-util';

export type CrossAccountRecordSetEvent = AWSLambda.CloudFormationCustomResourceEvent & {
  ResourceProperties: ResourceProperties;
  OldResourceProperties?: ResourceProperties;
};

export interface ResourceProperties {
  AssumeRoleArn: string;
  AssumeRoleRegion?: string;
  HostedZoneId: string;
  Name: string;
  Type: string;
  ResourceRecords?: { Value: string }[];
  AliasTarget?: {
    DNSName: string;
    HostedZoneId: string;
  };
  TTL: string;
  SetIdentifier?: string;
  Weight?: number;
  Region?: string;
  GeoLocation?: {
    ContinentCode?: string;
    CountryCode?: string;
    SubdivisionCode?: string;
  };
  DeleteExisting: string; // Ensure this is converted to boolean!
}

/**
 * Why does this implementation use a DELETE/CREATE ChangeBatch pattern
 * rather than UPSERT?
 *
 * ### No extra custom handlers required
 * We don't have to use another custom handler
 * to potentially delete an existing RecordSet on CREATE operations.
 *
 * ### Less InvalidChangeBatch Errors
 * The unique RecordSet identifier is deceptive. With UPSERT, a user
 * will run into more unintuitive InvalidChangeBatch errors than they would expect.
 *
 * You will encounter an InvalidChangeBatch error if you try to change
 * the RecordType.
 *
 * Changing the Record routing policy is not allowed with upsert.
 * See [aws_route53: Allow updates to existing records in a single operation](https://github.com/aws/aws-cdk/issues/26754)
 * Technically this construct still has the same problem once more than one RecordSet
 * with the same RecordName and RecordType already exists.
 *
 * ### Follows how Route53 UI does it
 * For further justification, look at how the Route53 UI solves this:
 *  1. Open a Route53 UI console
 *  2. Open DevTools > Network tab
 *  3. Edit a RecordSet
 *  4. View the Request payload in the network tab
 *  5. Notice that Route53 too uses a ChangeBatch with both DELETE & CREATE changes
 *
 * Even Route53 uses the delete/create ChangeBatch pattern for their own UI.
 *
 **/

/**
     * Top level handle for responding to Create/Update/Delete events
 */
export async function handler(
  event: CrossAccountRecordSetEvent,
): Promise<void> {
  try {
    const physicalResourceId = PhysicalResourceId.create(event.ResourceProperties);
    const props = event.ResourceProperties;

    const route53 = createRoute53Client(props);

    switch (event.RequestType) {
      case 'Create':
        await handleCreate(route53, props);
        break;
      case 'Update':
        await handleUpdate(route53, event.OldResourceProperties, props);
        break;
      case 'Delete':
        await handleDelete(route53, props, event.PhysicalResourceId);
        break;
    }
    await submitResponse('SUCCESS', { ...event, PhysicalResourceId: physicalResourceId.physicalResourceId() });
  } catch (error) {
    const physicalResourceId = PhysicalResourceId.create(event.ResourceProperties);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    await submitResponse('FAILED', { ...event, PhysicalResourceId: physicalResourceId.physicalResourceId(), Reason: errorMessage });
  }

}

function createRoute53Client(props: ResourceProperties): Route53 {
  const timestamp = new Date().getTime();

  return new Route53({
    credentials: fromTemporaryCredentials({
      clientConfig: {
        region:
          props.AssumeRoleRegion ??
          route53Region(process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? ''),
      },
      params: {
        RoleArn: props.AssumeRoleArn,
        RoleSessionName: `cross-account-record-set-${timestamp}`,
      },
    }),
  });
}

interface getResourceRecordSetOptions {
  /*
   * @default false
   */
  requireStrictIdentifierMatch?: boolean;
}

async function getResourceRecordSet(
  route53: Route53,
  props: ResourceProperties,
  options?: getResourceRecordSetOptions,
): Promise<ResourceRecordSet | undefined> {
  const listResourceRecordSetArgs: ListResourceRecordSetsCommandInput = {
    HostedZoneId: props.HostedZoneId,
    StartRecordName: props.Name,
    StartRecordType: props.Type,
    MaxItems: 1,
  };

  if (props.SetIdentifier) {
    listResourceRecordSetArgs.StartRecordIdentifier = props.SetIdentifier;
  }
  defaultLog('Searching for recordsets with args: ', listResourceRecordSetArgs);
  const response = await route53.listResourceRecordSets(listResourceRecordSetArgs);
  defaultLog('Returned RecordSets: ', response.ResourceRecordSets);

  const existingRecord = response.ResourceRecordSets?.find(
    (r) => r.Name?.toLowerCase() === props.Name.toLowerCase() && r.Type === props.Type,
  );
  defaultLog('Existing Record: ', existingRecord);

  if (!existingRecord) {
    // No record with a matching Name or Type was found. Safely return nothing.
    return;
  } else if (
    options?.requireStrictIdentifierMatch &&
    props.SetIdentifier !== existingRecord.SetIdentifier
  ) {
    // We found a record with the same Name and Type, but SetIdentifier was different.
    // Return nothing.
    return;
  } else {
    existingRecord.Name = normalizeRecordName(existingRecord.Name!);
    return existingRecord as ResourceRecordSet;
  }
}

async function handleCreate(route53: Route53, props: ResourceProperties): Promise<void> {
  const changes: Change[] = [];

  if (strToBool(props.DeleteExisting)) {
    /*
     * The only reason you wouldn't want to set `DeleteExisting` to true
     * is for the following scenario:
     *   * This handler succeeds the CREATE operation
     *   * CloudFormation later fails the CREATE_IN_PROGRESS event
     *   * CloudFormation performs the ROLLBACK_IN_PROGRESS event
     *   * This handler receives a DELETE event
     *   * This handler deletes the new created RecordSet.
     *
     * If there was an existing RecordSet, then it will have been deleted,
     * and it will stay deleted even after CloudFormation has "rolled back".
     *
     * This isn't a new risk introduced in this construct, anything that
     * already uses a RecordSet shares this same risk.
     *
     */
    const existingRecord: ResourceRecordSet | undefined = await getResourceRecordSet(
      route53,
      props,
      { requireStrictIdentifierMatch: true },
    );

    if (existingRecord) {
      changes.push({
        Action: 'DELETE',
        ResourceRecordSet: existingRecord,
      });
    }
  }
  changes.push({
    Action: 'CREATE',
    ResourceRecordSet: propsToRecordSet(props),
  });

  defaultLog('Sending ChangeBatch for create operation: ', changes);
  await route53.changeResourceRecordSets({
    HostedZoneId: props.HostedZoneId,
    ChangeBatch: {
      Changes: changes,
    },
  });
}

async function handleUpdate(
  route53: Route53,
  oldProps: ResourceProperties,
  newProps: ResourceProperties,
): Promise<void> {
  const changes = [
    {
      /*
        * We delete the previous record in the Update event,
        * rather than letting CloudFormation delete the record in a subsequent
        * Delete event. This is required in order to avoid numerous InvalidChangeBatch
        * pitfalls.
        *
        * The Delete handler will only cleanup a record if it finds an exact
        * PhysicalResourceId match.
      */
      Action: 'DELETE',
      ResourceRecordSet: propsToRecordSet(oldProps),
    },
    {
      /**
          * UPSERT is chosen over CREATE for an update operation in the event
          * that the user manually modified the RecordSet to a new state,
          * and then later changed their CDK code to reflect the new state.
          * A possible scenario would involve manually changing the routing policy
          * for multiple RecordSets, and then later updating their CDK code.
          * If we ran a CREATE operation, this handler would needlessly throw an exception,
          * stating that the RecordSet already exists.
      */
      Action: 'UPSERT',
      ResourceRecordSet: propsToRecordSet(newProps),
    },
  ];
  defaultLog('Sending ChangeBatch for Update operation: ', changes);
  await route53.changeResourceRecordSets({
    HostedZoneId: newProps.HostedZoneId,
    ChangeBatch: {
      Changes: changes,
    },
  });
}

async function handleDelete(
  route53: Route53,
  props: ResourceProperties,
  physicalResourceId: string,
): Promise<void> {
  const oldRecord: ResourceRecordSet | undefined = await getResourceRecordSet(route53, props);

  if (!oldRecord) {
    defaultLog(`The RecordSet has already been deleted in a prior CREATE or UPDATE operation.
Taking no action for Delete event.`);
    return;
  }

  const oldPhysicalResourceId = new PhysicalResourceId(oldRecord);

  /*
   * This is why checking the physical resource ID is so critical.
   * It's possible that a RecordSet had a non identifier property updated,
   * which results in the same SimpleUniqueRecordId, but a different FullUniqueRecordId.
   * We must check that the PhysicalResourceId is exactly the same to ensure
   * we're deleting a record that we should really be deleting.
   *
   * Otherwise, we could end up deleting a RecordSet that had just been created or updated!
   */
  if (physicalResourceId === oldPhysicalResourceId.physicalResourceId()) {
    const changes = [
      {
        Action: 'DELETE',
        ResourceRecordSet: oldRecord,
      },
    ];
    defaultLog(`Existing record found that matches provided PhysicalResourceId
value of ${physicalResourceId}.`);
    defaultLog('Sending ChangeBatch for Delete operation: ', changes);
    await route53.changeResourceRecordSets({
      HostedZoneId: props.HostedZoneId,
      ChangeBatch: {
        Changes: changes,
      },
    });
  } else {
    defaultLog(
      `Record to delete with props ${JSON.stringify(propsToRecordSet(props))}
does not match found existing record ${JSON.stringify(oldRecord)}.
Taking no action for this Delete event.
`);
  }
}

/*
 * Route53 has peculiar requirements for identifying RecordSets.
 *
 * A RecordSet is uniquely identified by the following conditional "composite" keys:
 *   * Name + Type
 *   * Name + Type + SetIdentifier (if provided)
 *
 * This unique identifier will be referred to as the "SimpleUniqueRecordId".
 *
 * A second identifier will be created called the "FullUniqueRecordId".
 * This identifier is the hash of all properties that make up the RecordSet.
 * This allows us to accurately determine if a single property has been changed in the request.
 *
 * The PhysicalResourceId will be the '_' character joining the SimpleUniqueRecordId, and the FullUniqueRecordId.
 *
 * This creates a readable identifier that changes when any property within the RecordSet is modified,
 * resulting in the correct triggering of CREATE/UPDATE/DELETE CloudFormation events.
 */
export class PhysicalResourceId {
  public static create(props: ResourceProperties): PhysicalResourceId {
    return new PhysicalResourceId(propsToRecordSet(props));
  }

  private _resourceRecordSet: ResourceRecordSet;
  public recordName: string;
  public recordType: string;
  public setIdentifier?: string;

  constructor(resourceRecordSet: ResourceRecordSet) {
    this._resourceRecordSet = resourceRecordSet;
    this.recordName = this._resourceRecordSet.Name!;
    this.recordType = this._resourceRecordSet.Type!;
    this.setIdentifier = this._resourceRecordSet.SetIdentifier;
  }

  simpleUniqueRecordId(): string {
    if (this.setIdentifier) {
      return `${this.recordName}-${this.recordType}-${this.setIdentifier}`;
    } else {
      return `${this.recordName}-${this.recordType}`;
    }
  }

  fullUniqueRecordId(): string {
    const resourceRecordSetJson = JSON.stringify(
      this._resourceRecordSet,
      Object.keys(this._resourceRecordSet).sort(),
    );
    return crypto
      // eslint-disable-next-line no-restricted-syntax
      .createHash('md5')
      .update(resourceRecordSetJson, 'utf8')
      .digest('hex')
      .slice(0, 12);
  }

  physicalResourceId(): string {
    return `${this.simpleUniqueRecordId()}_${this.fullUniqueRecordId()}`;
  }
}

function propsToRecordSet(props: ResourceProperties): ResourceRecordSet {
  /*
   * NOTE: `ResourceProperties` doesn't cover the full API of ChangeResourceRecordSets
   * because [RecordSet](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.RecordSet.html)
   * doesn't cover the full scope either. RecordSet should be updated to support parameters like
   * Failover, HealthCheckId, TrafficPolicyInstanceId, and CidrRoutingConfig.
   */
  const recordSet: ResourceRecordSet = {
    Name: normalizeRecordName(props.Name),
    Type: props.Type,
    Region: props.Region,
    Weight: props.Weight,
    ResourceRecords: props.ResourceRecords,
    GeoLocation: props.GeoLocation,
    SetIdentifier: props.SetIdentifier,
  };

  if (props.ResourceRecords) {
    recordSet.TTL = parseInt(props.TTL);
  }
  if (props.AliasTarget) {
    recordSet.AliasTarget = {
      DNSName: normalizeRecordName(props.AliasTarget.DNSName),
      HostedZoneId: props.AliasTarget.HostedZoneId,
      EvaluateTargetHealth: false,
    };
  }

  function isEmptyObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0;
  }

  function removeUndefinedValues(obj: Record<string, any>): Record<string, any> {
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === '' || isEmptyObject(obj[key]) ) {
        delete obj[key];
      }
    }
    return obj;
  }

  // Don't include extraneous properties with undefined values.
  // The ChangeResourceRecordSets API would otherwise complain.
  // https://github.com/aws/aws-sdk-js/issues/3506
  return removeUndefinedValues(recordSet) as ResourceRecordSet;
}

function normalizeRecordName(recordName: string): string {
  /**
   * Ensure record name includes a trailing dot since Route53 returns record names with a trailing dot.
   */
  if (!recordName.endsWith('.')) {
    return `${recordName}.`.toLowerCase();
  } else {
    return recordName.toLowerCase();
  }
}

function strToBool(s: string): boolean {
  const lowerS = s.toLowerCase();

  if (lowerS === '1' || lowerS === 'true') {
    return true;
  } else if (lowerS === '0' || lowerS === 'false') {
    return false;
  } else {
    throw new Error(`The string ${s} must be one of [0, 1, true, false, True, False]`);
  }
}

function defaultLog(...params: any) {
  const formattedParams = params.map((param: any) => {
    if (typeof param === 'object' && param !== null) {
      return JSON.stringify(param, null, 2);
    } else {
      return String(param);
    }
  });
    // eslint-disable-next-line no-console
  console.log(formattedParams.join(' '));
}
