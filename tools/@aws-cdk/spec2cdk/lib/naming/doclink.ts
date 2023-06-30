export interface DocLinkOptions {
  readonly resourceType: string;
  readonly propTypeName?: string;
  readonly propName?: string;
}

/**
 * Return a link to the CloudFormation documentation page
 */
export function cloudFormationDocLink(options: DocLinkOptions) {
  const parts = ['http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/'];
  const resourceTypeParts = options.resourceType.split('::').map((x) => x.toLowerCase());

  // Either '<svc>-<resource>' or '<svc>-<resource>-<prop>'
  let typeUid;

  if (options.propTypeName) {
    typeUid = `${resourceTypeParts[1]}-${resourceTypeParts[2]}-${options.propTypeName.toLowerCase()}`;
    parts.push(`aws-properties-${typeUid}.html`);
  } else {
    typeUid = `${resourceTypeParts[1]}-${resourceTypeParts[2]}`;
    parts.push(`aws-resource-${typeUid}.html`);
  }

  if (options.propName) {
    parts.push(`#cfn-${typeUid}-${options.propName.toLowerCase()}`);
  }

  return parts.join('');
}
