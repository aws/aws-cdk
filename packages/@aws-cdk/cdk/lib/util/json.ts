export function merge(template: any, part: any, mergeLists = false) {
  for (const section of Object.keys(part)) {
    const src = part[section];

    // create top-level section if it doesn't exist
    let dest = template[section];
    if (!dest) {
      template[section] = dest = src;
    } else {
      // add all entities from source section to destination section
      for (const id of Object.keys(src)) {
        if (Array.isArray(dest[id]) && mergeLists) {
          if (!Array.isArray(src[id])) {
            throw new Error(`Destination '${id}' in '${section}' is a list, but not in source: '${src}'`);
          }
          dest[id].push(...src[id]);
        } else {
          if (id in dest) {
            throw new Error(`section '${section}' already contains '${id}'`);
          }
          dest[id] = src[id];
        }
      }
    }
  }
}