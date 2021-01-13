export abstract class ComputeType {
  public static get DEFAULT() { return new ConcreteComputeType('default'); }
  public static get LARGE() { return new ConcreteComputeType('large'); }
  public static get MEDIUM() { return new ConcreteComputeType('medium'); }
  public static get SMALL() { return new ConcreteComputeType('small'); }

  public abstract readonly computeTypeClass: string;
}

class ConcreteComputeType extends ComputeType {
  constructor(public readonly computeTypeClass: string) {
    super();
  }
}

