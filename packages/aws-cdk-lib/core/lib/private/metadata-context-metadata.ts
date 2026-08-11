/** The Amazon-owned key under which CloudFormation Context is stored. */
export const METADATA_CONTEXT_KEY = 'com.aws.cloudformation.Context';

const resourceContext = new WeakMap<object, Record<string, any>>();
const templateContext = new WeakMap<object, Record<string, any>>();

export function setResourceMetadataContext(resource: object, context: Record<string, any>): void {
  resourceContext.set(resource, context);
}

export function getTemplateMetadataContext(stack: object): Record<string, any> | undefined {
  return templateContext.get(stack);
}

export function setTemplateMetadataContext(stack: object, context: Record<string, any>): void {
  templateContext.set(stack, context);
}

export function renderResourceMetadata(
  resource: object,
  metadata: Record<string, any> | undefined,
): Record<string, any> | undefined {
  return renderMetadata(metadata, resourceContext.get(resource));
}

export function renderTemplateMetadata(
  stack: object,
  metadata: Record<string, any> | undefined,
): Record<string, any> | undefined {
  return renderMetadata(metadata, templateContext.get(stack));
}

function renderMetadata(
  metadata: Record<string, any> | undefined,
  contextFromApi: Record<string, any> | undefined,
): Record<string, any> | undefined {
  const rendered = { ...metadata };

  if (contextFromApi !== undefined) {
    rendered[METADATA_CONTEXT_KEY] = contextFromApi;
  }

  return Object.keys(rendered).length > 0 ? rendered : undefined;
}
