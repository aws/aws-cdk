interface PropertyMap {
  [key: string]: string;
}

export class PropertyGroup {
  private readonly propertyGroupId;
  private readonly propertyMap;

  constructor(propertyGroupId: string, propertyMap: PropertyMap) {
    this.propertyGroupId = propertyGroupId;
    this.propertyMap = propertyMap;
  }

  public toCfn() {
    return {
      propertyGroupId: this.propertyGroupId,
      propertyMap: this.propertyMap,
    };
  }
}
