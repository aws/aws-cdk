import type { IConstruct } from 'constructs';
import { ValidationError } from '../errors';
import { lit } from './literal-string';

/** The Amazon-owned key under which CloudFormation Context is stored. */
export const METADATA_CONTEXT_KEY = 'com.aws.cloudformation.Context';

const resourceContext = new WeakMap<object, Record<string, any>>();
const templateContext = new WeakMap<object, Record<string, any>>();

export function clearResourceMetadataContext(resource: object): void {
  resourceContext.delete(resource);
}

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
  resource: IConstruct,
  metadata: Record<string, any> | undefined,
): Record<string, any> | undefined {
  return renderMetadata(resource, metadata, resourceContext.get(resource), 'resource');
}

export function renderTemplateMetadata(
  stack: IConstruct,
  metadata: Record<string, any> | undefined,
): Record<string, any> | undefined {
  return renderMetadata(stack, metadata, templateContext.get(stack), 'template');
}

function renderMetadata(
  scope: IConstruct,
  metadata: Record<string, any> | undefined,
  contextFromApi: Record<string, any> | undefined,
  level: 'resource' | 'template',
): Record<string, any> | undefined {
  const rendered = { ...metadata };

  if (contextFromApi !== undefined) {
    // A directly written resource block is already merged into the
    // API-produced block. At template level the two collide: fail loudly
    // instead of silently overwriting or merging incompatible blocks.
    if (level === 'template' && rendered[METADATA_CONTEXT_KEY] !== undefined) {
      throw new ValidationError(
        lit`MetadataContextCollision`,
        `both a manually added '${METADATA_CONTEXT_KEY}' metadata block and one produced by the ${level} MetadataContext API target this location; remove one to resolve the conflict`,
        scope,
      );
    }
    rendered[METADATA_CONTEXT_KEY] = contextFromApi;
  }

  return Object.keys(rendered).length > 0 ? rendered : undefined;
}
