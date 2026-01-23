import { IEmailIdentityRef } from "../../interfaces/generated/aws-ses-interfaces.generated";
import { Grant, IGrantable } from "../../aws-iam";

export class EmailIdentityGrants {
  public static fromEmailIdentity(resource: IEmailIdentityRef): EmailIdentityGrants {
    return new EmailIdentityGrants(resource);
  }

  private constructor(private readonly resource: IEmailIdentityRef) {
  }

  public sendEmail(grantee: IGrantable): Grant {
    const actions = ["ses:SendEmail", "ses:SendRawEmail"];
    return Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.resource.emailIdentityArn],
    });
  }
}