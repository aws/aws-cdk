export interface PropertyMap {
  [key: string]: string;
}

export interface CfnPropertyGroup {
  readonly propertyGroupId: string;
  readonly propertyMap: PropertyMap;
}

export class PropertyGroup {
  private readonly propertyGroupId: string;
  private readonly propertyMap: PropertyMap;

  constructor(propertyGroupId: string, propertyMap: PropertyMap) {
    this.propertyGroupId = propertyGroupId;
    this.propertyMap = propertyMap;
  }

  public toCfn(): CfnPropertyGroup {
    return {
      propertyGroupId: this.propertyGroupId,
      propertyMap: this.propertyMap,
    };
  }
}
