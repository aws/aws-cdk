import * as nock from "nock";

export class FakeMetadataService {
  private accessKeyId?: string;
  private secretAccessKey?: string
  private roleName?: string

  public begin() {
    const self = this;
    nock.disableNetConnect();
    if (!nock.isActive()) {
      nock.activate();
    }

    nock(/.*/).persist().get(/.*/).reply(function (this, uri, _body, cb) {
      if (uri === '/latest/meta-data/iam/security-credentials/') {
        if (self.roleName == null) {
          throw new Error('FakeMetadataService cannot return a result because the roleName has not been set');
        }

        cb(null, [200, self.roleName]);
      } else if (uri === `/latest/meta-data/iam/security-credentials/${self.roleName}`) {
        if (self.accessKeyId == null) {
          throw new Error('FakeMetadataService cannot return a result because the accessKeyId has not been set');
        }
        if (self.secretAccessKey == null) {
          throw new Error('FakeMetadataService cannot return a result because the secretAccessKey has not been set');
        }
        cb(null, [200, {
          AccessKeyId: self.accessKeyId,
          SecretAccessKey: self.secretAccessKey,
          Token: 'abcdefghijklmnopqrst',
          Expiration: '2017-05-17T15:09:54Z',
        }]);
      }
    });
  }

  /**
   * Restore everything to normal
   */
  public restore() {
    nock.restore(); // https://github.com/nock/nock/issues/1817
    nock.cleanAll();
    nock.enableNetConnect();
  }

  public registerCredentials(accessKeyId: string, secretAccessKey: string): void {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
  }

  public registerRole(roleName: string): void {
    this.roleName = roleName;
  }
}
