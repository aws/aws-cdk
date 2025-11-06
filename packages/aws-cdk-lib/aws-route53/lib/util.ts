import { Construct } from 'constructs';
import { GrantDelegationOptions, IHostedZone } from './hosted-zone-ref';
import * as iam from '../../aws-iam';
import { Stack, Token, UnscopedValidationError } from '../../core';

/**
 * Validates a zone name is valid by Route53 specific naming rules,
 * and that there is no trailing dot in the name.
 *
 * @param zoneName the zone name to be validated.
 * @returns +zoneName+
 * @throws ValidationError if the name is not valid.
 */
export function validateZoneName(zoneName: string) {
  if (zoneName.length > 255) {
    throw new ValidationError('zone name cannot be more than 255 bytes long');
  }
  if (zoneName.split('.').find(label => label.length > 63)) {
    throw new ValidationError('zone name labels cannot be more than 63 bytes long');
  }
  if (!zoneName.match(/^[a-z0-9!"#$%&'()*+,/:;<=>?@[\\\]^_`{|}~.-]+$/i)) {
    throw new ValidationError('zone names can only contain a-z, 0-9, -, ! " # $ % & \' ( ) * + , - / : ; < = > ? @ [ \ ] ^ _ ` { | } ~ .');
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Route53 requires the record names are specified as fully qualified names, but this
 * forces lots of redundant work on the user (repeating the zone name over and over).
 * This function allows the user to be lazier and offers a nicer experience, by
 * qualifying relative names appropriately:
 *
 * @param providedName the user-specified name of the record.
 * @param zoneName   the fully-qualified name of the zone the record will be created in.
 *
 * @returns <ul>
 *        <li>If +providedName+ ends with a +.+, use it as-is</li>
 *        <li>If +providedName+ ends with or equals +zoneName+, append a trailing +.+</li>
 *        <li>Otherwise, append +.+, +zoneName+ and a trailing +.+</li>
 *      </ul>
 */
export function determineFullyQualifiedDomainName(providedName: string, hostedZone: IHostedZone): string {
  if (providedName.endsWith('.')) {
    return providedName;
  }

  const hostedZoneName = stripTrailingDot(hostedZone.zoneName);

  const suffix = `.${hostedZoneName}`;
  if (providedName.endsWith(suffix) || providedName === hostedZoneName) {
    return `${providedName}.`;
  }

  return `${providedName}${suffix}.`;
}

export function makeHostedZoneArn(construct: Construct, hostedZoneId: string): string {
  return Stack.of(construct).formatArn({
    account: '',
    region: '',
    service: 'route53',
    resource: 'hostedzone',
    resourceName: hostedZoneId,
  });
}

function stripTrailingDot(zoneName: string) {
  return zoneName.endsWith('.') ? zoneName.substring(0, zoneName.length - 1) : zoneName;
}

const octalConversionIgnoreRegex = /[a-z0-9-_\\.]/;

// Required to octal encode characters other than a–z, 0–9, - (hyphen), _ (underscore), and . (period) for IAM conditions
// https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/specifying-conditions-route53.html#route53_rrset_conditionkeys_normalization
function octalEncodeDelegatedZoneName(delegatedZoneName: string): string {
  if (Token.isUnresolved(delegatedZoneName)) {
    return delegatedZoneName;
  }

  return delegatedZoneName.split('')
    .map(c => {
      if (octalConversionIgnoreRegex.test(c)) {
        return c;
      }
      return '\\' + c.charCodeAt(0).toString(8).padStart(3, '0');
    }).join('');
}

function validateDelegatedZoneName(parentZoneName: string, delegatedZoneName: string) {
  if (delegatedZoneName.endsWith('.')) {
    throw new UnscopedValidationError(
      `Error while validating delegate zone name '${delegatedZoneName}': delegated zone name cannot have a trailing period`,
    );
  }

  if (Token.isUnresolved(delegatedZoneName)) {
    return;
  }

  try {
    validateZoneName(delegatedZoneName);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new UnscopedValidationError(
        `Error while validating delegated zone name '${delegatedZoneName}': ${error.message}`,
      );
    }
  }

  if (delegatedZoneName.toLowerCase() !== delegatedZoneName) {
    throw new UnscopedValidationError(
      `Error while validating delegate zone name '${delegatedZoneName}': delegated zone name cannot contain uppercase characters`,
    );
  }

  if (Token.isUnresolved(parentZoneName)) {
    return;
  }

  const parentZoneNameNoTrailingDot = stripTrailingDot(parentZoneName);

  if (!delegatedZoneName.endsWith(parentZoneNameNoTrailingDot)) {
    throw new UnscopedValidationError(
      `Error while validating delegate zone name '${delegatedZoneName}': delegated zone name must be suffixed by parent zone name`,
    );
  }

  if (delegatedZoneName === parentZoneNameNoTrailingDot) {
    throw new UnscopedValidationError(
      `Error while validating delegate zone name '${delegatedZoneName}': delegated zone name cannot be the same as the parent zone name`,
    );
  }
}

export function makeGrantDelegation(grantee: iam.IGrantable, hostedZone: IHostedZone, delegationOptions?: GrantDelegationOptions): iam.Grant {
  const delegatedZoneNames = delegationOptions?.delegatedZoneNames?.map(delegatedZoneName => {
    validateDelegatedZoneName(hostedZone.zoneName, delegatedZoneName);
    return octalEncodeDelegatedZoneName(delegatedZoneName);
  });
  const g1 = iam.Grant.addToPrincipal({
    grantee,
    actions: ['route53:ChangeResourceRecordSets'],
    resourceArns: [hostedZone.hostedZoneArn],
    conditions: {
      'ForAllValues:StringEquals': {
        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
        ...(delegationOptions?.delegatedZoneNames ? {
          'route53:ChangeResourceRecordSetsNormalizedRecordNames': delegatedZoneNames,
        } : {}),
      },
    },
  });
  const g2 = iam.Grant.addToPrincipal({
    grantee,
    actions: ['route53:ListHostedZonesByName'],
    resourceArns: ['*'],
  });

  return g1.combine(g2);
}
