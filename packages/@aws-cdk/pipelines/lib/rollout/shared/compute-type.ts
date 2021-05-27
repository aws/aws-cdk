export abstract class ComputeType {
  public static get default(): ComputeType { return new ConcreteComputeType('default'); }
  public static get large(): ComputeType { return new ConcreteComputeType('large'); }
  public static get medium(): ComputeType { return new ConcreteComputeType('medium'); }
  public static get small(): ComputeType { return new ConcreteComputeType('small'); }

  public abstract readonly computeTypeClass: string;
}

class ConcreteComputeType extends ComputeType {
  constructor(public readonly computeTypeClass: string) {
    super();
  }
}

