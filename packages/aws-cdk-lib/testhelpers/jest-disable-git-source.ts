// Disable git source metadata in CloudFormation templates during tests
// to avoid breaking existing snapshot/assertion tests.
process.env.CDK_DISABLE_GIT_SOURCE = '1';
