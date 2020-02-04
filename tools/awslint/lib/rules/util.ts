import * as reflect from 'jsii-reflect';

/**
 * Returns a documentation tag. Looks it up in inheritance hierarchy.
 * @param documentable starting point
 * @param tag the tag to search for
 */
export function getDocTag(documentable: reflect.Documentable, tag: string): string | undefined {
  const t = documentable.docs.customTag(tag);
  if (t) { return t; }

  if ((documentable instanceof reflect.Property || documentable instanceof reflect.Method) && documentable.overrides) {
    if (documentable.overrides.isClassType() || documentable.overrides.isInterfaceType()) {
      const baseMembers = documentable.overrides.allMembers.filter(m => m.name === documentable.name);
      for (const base of baseMembers) {
        const baseTag = getDocTag(base, tag);
        if (baseTag) {
          return baseTag;
        }
      }
    }
  }

  if (documentable instanceof reflect.ClassType || documentable instanceof reflect.InterfaceType) {
    for (const base of documentable.interfaces) {
      const baseTag = getDocTag(base, tag);
      if (baseTag) {
        return baseTag;
      }
    }
  }

  if (documentable instanceof reflect.ClassType && documentable.base) {
    const baseTag = getDocTag(documentable.base, tag);
    if (baseTag) {
      return baseTag;
    }
  }

  return undefined;
}

export function memberFqn(m: reflect.Method | reflect.Property) {
  return `${m.parentType.fqn}.${m.name}`;
}
