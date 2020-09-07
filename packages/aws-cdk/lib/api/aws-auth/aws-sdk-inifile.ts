import * as AWS from 'aws-sdk';
import { print } from '../../logging';


/**
 * Hack-fix
 *
 * There are a number of issues in the upstream version of SharedIniFileCredentials
 * that need fixing:
 *
 *  1. The upstream aws-sdk contains an incorrect instantiation of an `AWS.STS`
 *     client, which *should* have taken the region from the requested profile
 *     but doesn't. It will use the region from the default profile, which
 *     may not exist, defaulting to `us-east-1` (since we switched to
 *     AWS_STS_REGIONAL_ENDPOINTS=regional, that default is not even allowed anymore
 *     and the absence of a default region will lead to an error).
 *
 *  2. The simple fix is to get the region from the `config` file. profiles
 *     are made up of a combination of `credentials` and `config`, and the region is
 *     generally in `config` with the rest in `credentials`. However, a bug in
 *     `getProfilesFromSharedConfig` overwrites ALL `config` data with `credentials`
 *     data, so we also need to do extra work to fish the `region` out of the config.
 *
 * 3.  The 'credential_source' option is not supported. This
 *
 * See https://github.com/aws/aws-sdk-js/issues/3418 for all the gory details.
 * See https://github.com/aws/aws-sdk-js/issues/1916 for some more glory details.
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
    var sourceProfileName = roleProfile.source_profile;
    var sourceCredentials = roleProfile.credential_source;

    print(`loaded role profile: ${JSON.stringify(roleProfile)}`);

    if (sourceProfileName && sourceCredentials) {
      throw (AWS as any).util.error(
        new Error('source_profile and credential_source are both configured in profile ' + this.profile + '. please choose one or the other.'),
        { code: 'SharedIniFileCredentialsProviderFailure' },
      );
    }

    if (!sourceProfileName && !sourceCredentials) {
      throw (AWS as any).util.error(
        new Error('neither source_profile nor credential_source configured in profile ' + this.profile + '. please configure one or the other.'),
        { code: 'SharedIniFileCredentialsProviderFailure' },
      );
    }

    // --------- THIS IS NEW ----------------------
    const profiles = loadProfilesProper(this.filename);
    const region = profiles[this.profile]?.region ?? profiles.default?.region ?? 'us-east-1';
    // --------- /THIS IS NEW ----------------------

    let stsCreds = undefined;

    if (sourceProfileName) {

      var sourceProfileExistanceTest = creds[sourceProfileName];

      if (typeof sourceProfileExistanceTest !== 'object') {
        throw (AWS as any).util.error(
          new Error('source_profile ' + sourceProfileName + ' using profile '
            + this.profile + ' does not exist'),
          { code: 'SharedIniFileCredentialsProviderFailure' },
        );
      }

      stsCreds = new AWS.SharedIniFileCredentials(
        (AWS as any).util.merge(this.options || {}, {
          profile: sourceProfileName,
          preferStaticCredentials: true,
        }),
      );

    }

    // the aws-sdk for js does not support 'credential_source' (https://github.com/aws/aws-sdk-js/issues/1916)
    // so unfortunately we need to implement this ourselves.
    if (sourceCredentials) {

      print(`Using credential_source = ${sourceCredentials}`);

      // see https://docs.aws.amazon.com/credref/latest/refdocs/setting-global-credential_source.html
      switch (sourceCredentials) {
        case 'Environment': {
          stsCreds = new AWS.EnvironmentCredentials('AWS');
          break;
        }
        case 'Ec2InstanceMetadata': {
          stsCreds = new AWS.EC2MetadataCredentials();
          break;
        }
        case 'EcsContainer': {
          stsCreds = new AWS.ECSCredentials();
          break;
        }
        default: {
          throw new Error(`credential_source ${sourceCredentials} in profile ${this.profile} is unsupported. choose one of [Environment, Ec2InstanceMetadata, EcsContainer]`);
        }
      }

    }

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
}

/**
 * A function to load profiles from disk that MERGES credentials and config instead of overwriting
 *
 * @see https://github.com/aws/aws-sdk-js/blob/5ae5a7d7d24d1000dbc089cc15f8ed2c7b06c542/lib/util.js#L956
 */
function loadProfilesProper(filename: string) {
  const util = (AWS as any).util; // Does exists even though there aren't any typings for it
  const iniLoader = util.iniLoader;
  const profiles: Record<string, Record<string, string>> = {};
  let profilesFromConfig: Record<string, Record<string, string>> = {};
  if (process.env[util.configOptInEnv]) {
    profilesFromConfig = iniLoader.loadFrom({
      isConfig: true,
      filename: process.env[util.sharedConfigFileEnv],
    });
  }
  var profilesFromCreds: Record<string, Record<string, string>> = iniLoader.loadFrom({
    filename: filename ||
      (process.env[util.configOptInEnv] && process.env[util.sharedCredentialsFileEnv]),
  });
  for (const [name, profile] of Object.entries(profilesFromConfig)) {
    profiles[name] = profile;
  }
  for (const [name, profile] of Object.entries(profilesFromCreds)) {
    profiles[name] = {
      ...profiles[name],
      ...profile,
    };
  }
  return profiles;
}
