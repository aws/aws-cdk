/**
 * Define dynamic target parameters.
 */
export class TargetParameter {
  /**
   * Target parameter based on a jsonPath expression from the incoming event.
   */
  static fromJsonPath(jsonPath: string): string {
    if (!jsonPath.startsWith('$.')) {
      throw new Error('JsonPath must start with "$."');
    }
    return `<${jsonPath}>`;
  }

}
