export function renderTags(tags: { [key: string]: any } | undefined): { [key: string]: any } {
  return tags ? { Tags: Object.keys(tags).map((key) => ({ Key: key, Value: tags[key] })) } : {};
}

export function renderEnvironment(environment: { [key: string]: any } | undefined): { [key: string]: any } {
  return environment ? { Environment: environment } : {};
}
