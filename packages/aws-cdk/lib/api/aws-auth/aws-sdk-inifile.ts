import * as AWS from 'aws-sdk';


/**
 * Hack-fix
 *
 * There are a number of issues in the upstream version of SharedIniFileCredentials
 * that need fixing:
 *
 * 1. The upstream aws-sdk does not support the 'credential_source' option. Meaning credentials
 *    for assume-role cannot be fetched using EC2/ESC metadata.
 *
 * 2. The upstream aws-sdk does not support SSO profiles as the source of RoleProfiles,
 *    because it will always use the `SharedIniFileCredentials` provider to load
 *    source credentials, but in order to support SSO profiles you must use a
 *    separate class (`SsoCredentials).
 */
export class PatchedSharedIniFileCredentials extends AWS.SharedIniFileCredentials {
  declare private profile: string;
  declare private filename: string;
  declare private disableAssumeRole: boolean;
  declare private options: Record<string, string>;
  declare private roleArn: string;
  declare private httpOptions?: AWS.HTTPOptions;
  declare private tokenCodeFn?: (mfaSerial: string, callback: (err?: Error, token?: string) => void) => void;

  public loadRoleProfile(
    creds: Record<string, Record<string, string>>,
    roleProfile: Record<string, string>,
    callback: (err?: Error, data?: any) => void) {

    // Need to duplicate the whole implementation here -- the function is long and has been written in
    // such a way that there are no small monkey patches possible.

    if (this.disableAssumeRole) {
      throw (AWS as any).util.error(
        new Error('Role assumption profiles are disabled. ' +
                  'Failed to load profile ' + this.profile +
                  ' from ' + creds.filename),
        { code: 'SharedIniFileCredentialsProviderFailure' },
      );
    }

    var self = this;
    var roleArn = roleProfile.role_arn;
    var roleSessionName = roleProfile.role_session_name;
    var externalId = roleProfile.external_id;
    var mfaSerial = roleProfile.mfa_serial;
    var sourceProfile = roleProfile.source_profile;
    var credentialSource = roleProfile.credential_source;

    if (!!sourceProfile === !!credentialSource) {
      throw (AWS as any).util.error(
        new Error(`When using 'role_arn' in profile ('${this.profile}'), you must also configure exactly one of 'source_profile' or 'credential_source'`),
        { code: 'SharedIniFileCredentialsProviderFailure' },
      );
    }

    // Confirmed this against AWS CLI behavior -- the region must be in the assumED profile,
    // otherwise `us-east-1`. From the upstream comment in `aws-sdk-js`:
    // -------- comment from aws-sdk-js -------------------
    // Experimentation shows that the AWS CLI (tested at version 1.18.136)
    // ignores the following potential sources of a region for the purposes of
    // this AssumeRole call:
    //
    // - The [default] profile
    // - The AWS_REGION environment variable
    //
    // Ignoring the [default] profile for the purposes of AssumeRole is arguably
    // a bug in the CLI since it does use the [default] region for service
    // calls... but right now we're matching behavior of the other tool.
    // -------------------------------------------------

    const region = roleProfile?.region ?? 'us-east-1';

    const stsCreds = sourceProfile ? this.sourceProfileCredentials(sourceProfile, creds) : this.credentialSourceCredentials(credentialSource);

    this.roleArn = roleArn;
    var sts = new AWS.STS({
      credentials: stsCreds,
      region,
      httpOptions: this.httpOptions,
    });

    var roleParams: AWS.STS.AssumeRoleRequest = {
      RoleArn: roleArn,
      RoleSessionName: roleSessionName || 'aws-sdk-js-' + Date.now(),
    };

    if (externalId) {
      roleParams.ExternalId = externalId;
    }

    if (mfaSerial && self.tokenCodeFn) {
      roleParams.SerialNumber = mfaSerial;
      self.tokenCodeFn(mfaSerial, function(err, token) {
        if (err) {
          var message;
          if (err instanceof Error) {
            message = err.message;
          } else {
            message = err;
          }
          callback(
            (AWS as any).util.error(
              new Error('Error fetching MFA token: ' + message),
              { code: 'SharedIniFileCredentialsProviderFailure' },
            ));
          return;
        }

        roleParams.TokenCode = token;
        sts.assumeRole(roleParams, callback);
      });
      return;
    }
    sts.assumeRole(roleParams, callback);
  }

  private sourceProfileCredentials(sourceProfile: string, profiles: Record<string, Record<string, string>>) {
    var sourceProfileExistanceTest = profiles[sourceProfile];

    if (typeof sourceProfileExistanceTest !== 'object') {
      throw (AWS as any).util.error(
        new Error('source_profile ' + sourceProfile + ' using profile '
          + this.profile + ' does not exist'),
        { code: 'SharedIniFileCredentialsProviderFailure' },
      );
    }

    // We need to do a manual check here if the source profile (providing the
    // credentials for the AssumeRole) is an SSO profile. That's because
    // `SharedIniFileCredentials` itself doesn't support providing credentials from
    // arbitrary profiles, only for StaticCredentials and AssumeRole type
    // profiles; if it's an SSO profile you need to instantiate a special
    // Credential Provider for that.
    //
    // ---
    //
    // An SSO profile can be configured in 2 ways (put all the info in the profile
    // section, or put half of it in an `[sso-session]` block), but in both cases
    // the primary profile block must have the `sso_account_id` key
    if (sourceProfileExistanceTest.sso_account_id) {
      return new AWS.SsoCredentials({ profile: sourceProfile });
    }

    return new PatchedSharedIniFileCredentials(
      (AWS as any).util.merge(this.options || {}, {
        profile: sourceProfile,
        preferStaticCredentials: true,
      }),
    );

  }

  // the aws-sdk for js does not support 'credential_source' (https://github.com/aws/aws-sdk-js/issues/1916)
  // so unfortunately we need to implement this ourselves.
  private credentialSourceCredentials(sourceCredential: string) {
    // see https://docs.aws.amazon.com/credref/latest/refdocs/setting-global-credential_source.html
    switch (sourceCredential) {
      case 'Environment': {
        return new AWS.EnvironmentCredentials('AWS');
      }
      case 'Ec2InstanceMetadata': {
        return new AWS.EC2MetadataCredentials();
      }
      case 'EcsContainer': {
        return new AWS.ECSCredentials();
      }
      default: {
        throw new Error(`credential_source ${sourceCredential} in profile ${this.profile} is unsupported. choose one of [Environment, Ec2InstanceMetadata, EcsContainer]`);
      }
    }

  }
}
