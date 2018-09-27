import { HostedZoneRef } from '../hosted-zone-ref';

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
 *        <li>If +providedName+ ends with +zoneName+, append a trailing +.+</li>
 *        <li>Otherwise, append +.+, +zoneName+ and a trailing +.+</li>
 *      </ul>
 */
export function determineFullyQualifiedDomainName(providedName: string, hostedZone: HostedZoneRef): string {
  if (providedName.endsWith('.')) {
    return providedName;
  }

  const suffix = `.${hostedZone.zoneName}`;
  if (providedName.endsWith(suffix)) {
    return `${providedName}.`;
  }

  return `${providedName}${suffix}.`;
}
