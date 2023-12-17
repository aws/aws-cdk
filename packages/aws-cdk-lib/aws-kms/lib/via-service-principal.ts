import * as iam from '../../aws-iam';

/**
 * A principal to allow access to a key if it's being used through another AWS service
 */
export class ViaServicePrincipal extends iam.PrincipalBase {
  private readonly basePrincipal: iam.IPrincipal;
  public readonly principalAccount;

  constructor(private readonly serviceName: string, basePrincipal?: iam.IPrincipal) {
    super();
    this.basePrincipal = basePrincipal ? basePrincipal : new iam.AnyPrincipal();
    this.principalAccount = this.basePrincipal.principalAccount;
  }

  public addToPrincipalPolicy(_statement: iam.PolicyStatement): iam.AddToPrincipalPolicyResult {
    const conditions = Object.assign({}, _statement.conditions);

    if (conditions.StringEquals) {
      conditions.StringEquals = Object.assign({ 'kms:ViaService': this.serviceName }, conditions.StringEquals);
    } else {
      conditions.StringEquals = { 'kms:ViaService': this.serviceName };
    }

    return this.basePrincipal.addToPrincipalPolicy(_statement.copy({ conditions }));
  }

  public get policyFragment(): iam.PrincipalPolicyFragment {
    // Make a copy of the base policyFragment to add a condition to it
    const base = this.basePrincipal.policyFragment;
    const conditions = Object.assign({}, base.conditions);

    if (conditions.StringEquals) {
      conditions.StringEquals = Object.assign({ 'kms:ViaService': this.serviceName }, conditions.StringEquals);
    } else {
      conditions.StringEquals = { 'kms:ViaService': this.serviceName };
    }

    return { principalJson: base.principalJson, conditions };
  }

  public dedupeString(): string | undefined {
    const base = iam.ComparablePrincipal.dedupeStringFor(this.basePrincipal);
    return base !== undefined ? `ViaServicePrincipal:${this.serviceName}:${base}` : undefined;
  }
}
