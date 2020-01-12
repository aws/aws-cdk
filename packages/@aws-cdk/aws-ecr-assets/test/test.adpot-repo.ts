import { Test } from 'nodeunit';
import * as path from 'path';
import * as proxyquire from 'proxyquire';

let ecrMock: any;

export = {
  async 'exercise handler create with policy'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
      'aws-sdk': {
        '@noCallThru': true,
        "ECR": ECRWithEmptyPolicy,
      }
    });

    let output;
    async function response(responseStatus: string, reason: string, physId: string, data: any) {
      output = { responseStatus, reason, physId, data };
    }

    await handler.handler({
      StackId: 'StackId',
      ResourceProperties: {
        RepositoryName: 'RepositoryName',
        PolicyDocument: {
          Version: '2008-10-01',
          My: 'Document'
        }
      },
      RequestType: 'Create',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(JSON.parse(ecrMock.lastSetRepositoryPolicyRequest.policyText), {
      My: "Document",
      Version: '2008-10-01',
      Statement: [
        { Sid: "StackId", Effect: "Deny", Action: "OwnedBy:CDKStack", Principal: "*" }
      ]
    });

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: 'RepositoryName',
      data: {
        RepositoryName: 'RepositoryName'
      }
    });

    test.done();
  },

  async 'exercise handler create with policy with object statement'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
      'aws-sdk': {
        '@noCallThru': true,
        "ECR": ECRWithEmptyPolicy,
      }
    });

    let output;
    async function response(responseStatus: string, reason: string, physId: string, data: any) {
      output = { responseStatus, reason, physId, data };
    }

    await handler.handler({
      StackId: 'StackId',
      ResourceProperties: {
        RepositoryName: 'RepositoryName',
        PolicyDocument: {
          Statement: { Action: 'boom' }
        }
      },
      RequestType: 'Create',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(JSON.parse(ecrMock.lastSetRepositoryPolicyRequest.policyText), {
      Version: '2008-10-17',
      Statement: [
        { Action: 'boom' },
        { Sid: "StackId", Effect: "Deny", Action: "OwnedBy:CDKStack", Principal: "*" }
      ]
    });

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: 'RepositoryName',
      data: {
        RepositoryName: 'RepositoryName'
      }
    });

    test.done();
  },

  async 'exercise handler create with policy with array statement'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
      'aws-sdk': {
        '@noCallThru': true,
        "ECR": ECRWithEmptyPolicy,
      }
    });

    let output;
    async function response(responseStatus: string, reason: string, physId: string, data: any) {
      output = { responseStatus, reason, physId, data };
    }

    await handler.handler({
      StackId: 'StackId',
      ResourceProperties: {
        RepositoryName: 'RepositoryName',
        PolicyDocument: {
          Statement: [ { Action: 'boom' }, { Resource: "foo" }  ]
        }
      },
      RequestType: 'Create',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(JSON.parse(ecrMock.lastSetRepositoryPolicyRequest.policyText), {
      Version: '2008-10-17',
      Statement: [
        { Action: "boom" },
        { Resource: "foo" },
        { Sid: "StackId", Effect: "Deny", Action: "OwnedBy:CDKStack", Principal: "*" }
      ]
    });

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: 'RepositoryName',
      data: {
        RepositoryName: 'RepositoryName'
      }
    });

    test.done();
  },

  async 'exercise handler create'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
      'aws-sdk': {
        '@noCallThru': true,
        "ECR": ECRWithEmptyPolicy,
      }
    });

    let output;
    async function response(responseStatus: string, reason: string, physId: string, data: any) {
      output = { responseStatus, reason, physId, data };
    }

    await handler.handler({
      StackId: 'StackId',
      ResourceProperties: {
        RepositoryName: 'RepositoryName',
      },
      RequestType: 'Create',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: 'RepositoryName',
      data: {
        RepositoryName: 'RepositoryName'
      }
    });

    test.done();
  },

  async 'exercise handler delete'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
      'aws-sdk': { '@noCallThru': true, "ECR": ECRWithOwningPolicy }
    });

    let output;
    async function response(responseStatus: string, reason: string, physId: string, data: any) {
      output = { responseStatus, reason, physId, data };
    }

    await handler.handler({
      StackId: 'StackId',
      ResourceProperties: {
        RepositoryName: 'RepositoryName',
      },
      RequestType: 'Delete',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: 'RepositoryName',
      data: {
        RepositoryName: 'RepositoryName'
      }
    });

    test.done();
  },

  async 'exercise "delete" handler when repository doesnt exist'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
      'aws-sdk': { '@noCallThru': true, "ECR": ECRWithRepositoryNotFound }
    });

    let output;
    async function response(responseStatus: string, reason: string, physId: string, data: any) {
      output = { responseStatus, reason, physId, data };
    }

    await handler.handler({
      StackId: 'StackId',
      ResourceProperties: {
        RepositoryName: 'RepositoryName',
      },
      RequestType: 'Delete',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: 'RepositoryName',
      data: {
        RepositoryName: 'RepositoryName'
      }
    });

    test.done();
  },

  async 'exercise "create" handler when repository doesnt exist'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
      'aws-sdk': { '@noCallThru': true, "ECR": ECRWithRepositoryNotFound }
    });

    let output;
    async function response(responseStatus: string, reason: string, physId: string, data: any) {
      output = { responseStatus, reason, physId, data };
    }

    await handler.handler({
      StackId: 'StackId',
      ResourceProperties: {
        RepositoryName: 'RepositoryName',
      },
      RequestType: 'Create',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(output, {
      responseStatus: 'FAILED',
      reason: 'Simulated RepositoryPolicyNotFoundException',
      physId: 'xyz',
      data: { }
    });

    test.done();
  },
};

function ECRWithEmptyPolicy() {
  ecrMock = new ECR({ asdf: 'asdf' });
  return ecrMock;
}

function ECRWithOwningPolicy() {
  return new ECR({
    Statement: [
      {
        Sid: 'StackId',
        Effect: "Deny",
        Action: "OwnedBy:CDKStack",
        Principal: "*"
      }
    ]
  });
}

function ECRWithRepositoryNotFound() {
  const ecr = new ECR({});
  ecr.shouldThrowNotFound = true;
  return ecr;
}

class ECR {
  public lastSetRepositoryPolicyRequest: any;
  public shouldThrowNotFound = false;

  public constructor(private policy: any) {
  }

  public getRepositoryPolicy() {
    const self = this;
    return {
      async promise() {
        if (self.shouldThrowNotFound) { return self.throwNotFound(); }
        return { policyText: JSON.stringify(self.policy) };
      }
    };
  }

  public setRepositoryPolicy(req: any) {
    const self = this;
    this.lastSetRepositoryPolicyRequest = req;

    return {
      async promise() {
        if (self.shouldThrowNotFound) { return self.throwNotFound(); }
        return;
      }
    };
  }

  public listImages() {
    return {
      async promise() {
        return { imageIds: [] };
      }
    };
  }

  public batchDeleteImage() {
    const self = this;
    return {
      async promise() {
        if (self.shouldThrowNotFound) { return self.throwNotFound(); }
        return {};
      }
    };
  }

  public deleteRepository() {
    const self = this;
    return {
      async promise() {
        if (self.shouldThrowNotFound) { return self.throwNotFound(); }
        return {};
      }
    };
  }

  private throwNotFound() {
    const err = new Error('Simulated RepositoryPolicyNotFoundException');
    (err as any).code = 'RepositoryPolicyNotFoundException';
    throw err;
  }
}
