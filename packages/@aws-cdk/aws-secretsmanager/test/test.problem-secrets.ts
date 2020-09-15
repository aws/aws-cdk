import { Test } from 'nodeunit';
import * as secretsmanager from '../lib';

export = {
  'ProblemCharacters exist'(test: Test) {
    expect(secretsmanager.ProblemCharacters.AWS_DMS).toBeDefined;
    expect(secretsmanager.ProblemCharacters.SHELL).toBeDefined;
    test.done();
  },

}

