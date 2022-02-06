export class Attributions {

  constructor(private readonly packages: Set<string>) {}

  public validate() {
    console.log(`Validatioing ${this.packages.size}`);
  }

  public create() {

  }
}