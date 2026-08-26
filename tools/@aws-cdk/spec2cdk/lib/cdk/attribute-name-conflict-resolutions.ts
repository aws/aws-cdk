import { attributePropertyName } from '../naming';

/**
 * Replacement names for attributes whose generated property name is already taken, keyed by resource
 * type and then by CloudFormation attribute name. Values are logical names without the `attr` prefix.
 *
 * `AWS::EKS::Cluster` needs one because `CertificateAuthority.Data` flattens onto the released
 * `attrCertificateAuthorityData`, which cannot move. The EKS API models it as a `Certificate` object,
 * so `CertificateAuthorityCertificateData` follows the service's own vocabulary.
 */
export const ATTRIBUTE_NAME_CONFLICT_RESOLUTIONS: Record<string, Record<string, string>> = {
  'AWS::EKS::Cluster': {
    'CertificateAuthority.Data': 'CertificateAuthorityCertificateData',
  },
};

/**
 * The property name for every attribute of a resource, keyed by CloudFormation attribute name.
 *
 * Property names drop the non-alphanumerics, so a nested attribute can flatten onto a flat one. The
 * flat name wins because it is the pre-existing one and repointing its `Fn::GetAtt` would silently
 * change what existing apps synthesize; the other attribute takes its recorded replacement name. An
 * entry for an attribute that no longer collides is ignored, so a fix upstream cannot fail the build.
 */
export function attributePropertyNames(
  cloudFormationType: string,
  attributeNames: string[],
  resolutions: Record<string, Record<string, string>> = ATTRIBUTE_NAME_CONFLICT_RESOLUTIONS,
): Map<string, string> {
  const winnerByPropertyName = new Map<string, string>();
  const conflicting = new Array<string>();
  for (const attrName of attributeNames) {
    const propertyName = attributePropertyName(attrName);
    const incumbent = winnerByPropertyName.get(propertyName);
    if (incumbent === undefined) {
      winnerByPropertyName.set(propertyName, attrName);
    } else if (incumbent.includes('.') && !attrName.includes('.')) {
      winnerByPropertyName.set(propertyName, attrName);
      conflicting.push(incumbent);
    } else {
      conflicting.push(attrName);
    }
  }

  const propertyNames = new Map<string, string>();
  const attrNameByPropertyName = new Map<string, string>();
  for (const [propertyName, attrName] of winnerByPropertyName) {
    propertyNames.set(attrName, propertyName);
    attrNameByPropertyName.set(propertyName, attrName);
  }

  for (const attrName of conflicting) {
    const preferred = attributePropertyName(attrName);
    const resolution = resolutions[cloudFormationType]?.[attrName];
    if (resolution === undefined) {
      throw new Error(`Attribute name conflict on ${cloudFormationType} between '${winnerByPropertyName.get(preferred)}' and '${attrName}', which both become '${preferred}'. Update attribute-name-conflict-resolutions.ts to rename the newer attribute to something else.`);
    }

    const propertyName = attributePropertyName(resolution);
    const owner = attrNameByPropertyName.get(propertyName);
    if (owner !== undefined) {
      throw new Error(`Attribute name conflict on ${cloudFormationType}: the recorded name '${resolution}' for '${attrName}' becomes '${propertyName}', which '${owner}' already uses. Update attribute-name-conflict-resolutions.ts to rename it to something else.`);
    }

    propertyNames.set(attrName, propertyName);
    attrNameByPropertyName.set(propertyName, attrName);
  }

  return propertyNames;
}
