import { Tag } from '../cdk-toolkit';

/**
 * Throws an error if tags is neither undefined nor an array of Tags,
 * as defined in cdk-toolkit.ts.
 *
 * It does not attempt to validate the tags themselves. It only validates
 * that the objects in the array conform to the Tags interface.
 */
export function validateTags(tags: any): Tag[] | undefined {
  const valid = tags === undefined || (
    Array.isArray(tags) &&
    tags.every(t => typeof(t.Tag) === 'string' && typeof(t.Value) === 'string')
  );
  if (valid) {
    return tags;
  } else {
    throw new Error('tags must be an array of { Tag: string, Value: string } objects');
  }
}
