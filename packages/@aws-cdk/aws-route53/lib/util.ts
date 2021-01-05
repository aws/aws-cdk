import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IHostedZone } from './hosted-zone-ref';

/**
 * Validates a zone name is valid by Route53 specifc naming rules,
 * and that there is no trailing dot in the name.
 *
 * @param zoneName the zone name to be validated.
 * @returns +zoneName+
 * @throws ValidationError if the name is not valid.
 */
export function validateZoneName(zoneName: string) {
  if (zoneName.endsWith('.')) {
    throw new ValidationError('zone name must not end with a trailing dot');
  }
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

  const hostedZoneName = hostedZone.zoneName.endsWith('.')
    ? hostedZone.zoneName.substring(0, hostedZone.zoneName.length - 1)
    : hostedZone.zoneName;

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
