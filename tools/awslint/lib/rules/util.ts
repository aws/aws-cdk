import reflect = require('jsii-reflect');

/**
 * Returns a documentation tag. Looks it up in inheritance hierarchy.
 * @param documetable starting point
 * @param tag the tag to search for
 */
export function getDocTag(documetable: reflect.Documentable, tag: string): string | undefined {
  const t = documetable.docs.customTag(tag);
  if (t) { return t; }

  if ((documetable instanceof reflect.Property || documetable instanceof reflect.Method) && documetable.overrides) {
    if (documetable.overrides.isClassType() || documetable.overrides.isInterfaceType()) {
      const baseMembers = documetable.overrides.allMembers.filter(m => m.name === documetable.name);
      for (const base of baseMembers) {
        const baseTag = getDocTag(base, tag);
        if (baseTag) {
          return baseTag;
        }
      }
    }
  }

  if (documetable instanceof reflect.ClassType || documetable instanceof reflect.InterfaceType) {
    for (const base of documetable.interfaces) {
      const baseTag = getDocTag(base, tag);
      if (baseTag) {
         return baseTag;
      }
    }
  }

  if (documetable instanceof reflect.ClassType && documetable.base) {
    const baseTag = getDocTag(documetable.base, tag);
    if (baseTag) {
      return baseTag;
    }
  }

  return undefined;
}