import { Test } from 'nodeunit';
declare const _default: {
    'test instantiating Asset Image'(test: Test): void;
    'with build args'(test: Test): void;
    'asset.repository.grantPull can be used to grant a principal permissions to use the image'(test: Test): void;
    'asset.repository.addToResourcePolicy can be used to modify the ECR resource policy via the adoption custom resource'(test: Test): void;
    'fails if the directory does not exist'(test: Test): void;
    'fails if the directory does not contain a Dockerfile'(test: Test): void;
    'docker directory is staged if asset staging is enabled'(test: Test): void;
};
export = _default;
