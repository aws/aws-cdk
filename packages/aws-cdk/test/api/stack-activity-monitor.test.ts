/* eslint-disable import/order */
import * as chalk from 'chalk';
import { stderr } from './console-listener';
import { HistoryActivityPrinter } from '../../lib/api/util/cloudformation/stack-activity-monitor';
import { ResourceStatus } from '@aws-sdk/client-cloudformation';
import { CliIoHost } from '../../lib/toolkit/cli-io-host';

let TIMESTAMP: number;
let HUMAN_TIME: string;

beforeAll(() => {
  TIMESTAMP = new Date().getTime();
  HUMAN_TIME = new Date(TIMESTAMP).toLocaleTimeString();
  CliIoHost.instance().isCI = false;
});

test('prints 0/4 progress report, when addActivity is called with an "IN_PROGRESS" ResourceStatus', () => {
  const historyActivityPrinter = new HistoryActivityPrinter({
    resourceTypeColumnWidth: 23,
    resourcesTotal: 3,
    stream: process.stderr,
  });

  const output = stderr.inspectSync(() => {
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.CREATE_IN_PROGRESS,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
  });

  expect(output[0].trim()).toStrictEqual(
    `stack-name | 0/4 | ${HUMAN_TIME} | ${chalk.reset('CREATE_IN_PROGRESS  ')} | AWS::CloudFormation::Stack | ${chalk.reset(chalk.bold('stack1'))}`,
  );
});

test('prints 1/4 progress report, when addActivity is called with an "UPDATE_COMPLETE" ResourceStatus', () => {
  const historyActivityPrinter = new HistoryActivityPrinter({
    resourceTypeColumnWidth: 23,
    resourcesTotal: 3,
    stream: process.stderr,
  });

  const output = stderr.inspectSync(() => {
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.UPDATE_COMPLETE,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
  });

  expect(output[0].trim()).toStrictEqual(
    `stack-name | 1/4 | ${HUMAN_TIME} | ${chalk.green('UPDATE_COMPLETE     ')} | AWS::CloudFormation::Stack | ${chalk.green(chalk.bold('stack1'))}`,
  );
});

test('prints 1/4 progress report, when addActivity is called with an "UPDATE_COMPLETE" ResourceStatus', () => {
  const historyActivityPrinter = new HistoryActivityPrinter({
    resourceTypeColumnWidth: 23,
    resourcesTotal: 3,
    stream: process.stderr,
  });

  const output = stderr.inspectSync(() => {
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.UPDATE_COMPLETE,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
  });

  expect(output[0].trim()).toStrictEqual(
    `stack-name | 1/4 | ${HUMAN_TIME} | ${chalk.green('UPDATE_COMPLETE     ')} | AWS::CloudFormation::Stack | ${chalk.green(chalk.bold('stack1'))}`,
  );
});

test('prints 1/4 progress report, when addActivity is called with an "ROLLBACK_COMPLETE" ResourceStatus', () => {
  const historyActivityPrinter = new HistoryActivityPrinter({
    resourceTypeColumnWidth: 23,
    resourcesTotal: 3,
    stream: process.stderr,
  });

  const output = stderr.inspectSync(() => {
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.ROLLBACK_COMPLETE,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
  });

  expect(output[0].trim()).toStrictEqual(
    `stack-name | 1/4 | ${HUMAN_TIME} | ${chalk.yellow('ROLLBACK_COMPLETE   ')} | AWS::CloudFormation::Stack | ${chalk.yellow(chalk.bold('stack1'))}`,
  );
});

test('prints 0/4 progress report, when addActivity is called with an "UPDATE_FAILED" ResourceStatus', () => {
  const historyActivityPrinter = new HistoryActivityPrinter({
    resourceTypeColumnWidth: 23,
    resourcesTotal: 3,
    stream: process.stderr,
  });

  const output = stderr.inspectSync(() => {
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.UPDATE_FAILED,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
  });

  expect(output[0].trim()).toStrictEqual(
    `stack-name | 0/4 | ${HUMAN_TIME} | ${chalk.red('UPDATE_FAILED       ')} | AWS::CloudFormation::Stack | ${chalk.red(chalk.bold('stack1'))}`,
  );
});

test('does not print "Failed Resources:" list, when all deployments are successful', () => {
  const historyActivityPrinter = new HistoryActivityPrinter({
    resourceTypeColumnWidth: 23,
    resourcesTotal: 1,
    stream: process.stderr,
  });

  const output = stderr.inspectSync(() => {
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.UPDATE_IN_PROGRESS,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.UPDATE_COMPLETE,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack2',
        ResourceStatus: ResourceStatus.UPDATE_COMPLETE,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
    historyActivityPrinter.stop();
  });

  expect(output.length).toStrictEqual(3);
  expect(output[0].trim()).toStrictEqual(
    `stack-name | 0/2 | ${HUMAN_TIME} | ${chalk.reset('UPDATE_IN_PROGRESS  ')} | AWS::CloudFormation::Stack | ${chalk.reset(chalk.bold('stack1'))}`,
  );
  expect(output[1].trim()).toStrictEqual(
    `stack-name | 1/2 | ${HUMAN_TIME} | ${chalk.green('UPDATE_COMPLETE     ')} | AWS::CloudFormation::Stack | ${chalk.green(chalk.bold('stack1'))}`,
  );
  expect(output[2].trim()).toStrictEqual(
    `stack-name | 2/2 | ${HUMAN_TIME} | ${chalk.green('UPDATE_COMPLETE     ')} | AWS::CloudFormation::Stack | ${chalk.green(chalk.bold('stack2'))}`,
  );
});

test('prints "Failed Resources:" list, when at least one deployment fails', () => {
  const historyActivityPrinter = new HistoryActivityPrinter({
    resourceTypeColumnWidth: 23,
    resourcesTotal: 1,
    stream: process.stderr,
  });

  const output = stderr.inspectSync(() => {
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.UPDATE_IN_PROGRESS,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.UPDATE_FAILED,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
      },
      parentStackLogicalIds: [],
    });
    historyActivityPrinter.stop();
  });

  expect(output.length).toStrictEqual(4);
  expect(output[0].trim()).toStrictEqual(
    `stack-name | 0/2 | ${HUMAN_TIME} | ${chalk.reset('UPDATE_IN_PROGRESS  ')} | AWS::CloudFormation::Stack | ${chalk.reset(chalk.bold('stack1'))}`,
  );
  expect(output[1].trim()).toStrictEqual(
    `stack-name | 0/2 | ${HUMAN_TIME} | ${chalk.red('UPDATE_FAILED       ')} | AWS::CloudFormation::Stack | ${chalk.red(chalk.bold('stack1'))}`,
  );
  expect(output[2].trim()).toStrictEqual('Failed resources:');
  expect(output[3].trim()).toStrictEqual(
    `stack-name | ${HUMAN_TIME} | ${chalk.red('UPDATE_FAILED       ')} | AWS::CloudFormation::Stack | ${chalk.red(chalk.bold('stack1'))}`,
  );
});

test('print failed resources because of hook failures', () => {
  const historyActivityPrinter = new HistoryActivityPrinter({
    resourceTypeColumnWidth: 23,
    resourcesTotal: 1,
    stream: process.stderr,
  });

  const output = stderr.inspectSync(() => {
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.UPDATE_IN_PROGRESS,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
        HookStatus: 'HOOK_COMPLETE_FAILED',
        HookType: 'hook1',
        HookStatusReason: 'stack1 must obey certain rules',
      },
      parentStackLogicalIds: [],
    });
    historyActivityPrinter.addActivity({
      event: {
        LogicalResourceId: 'stack1',
        ResourceStatus: ResourceStatus.UPDATE_FAILED,
        Timestamp: new Date(TIMESTAMP),
        ResourceType: 'AWS::CloudFormation::Stack',
        StackId: '',
        EventId: '',
        StackName: 'stack-name',
        ResourceStatusReason: 'The following hook(s) failed: hook1',
      },
      parentStackLogicalIds: [],
    });
    historyActivityPrinter.stop();
  });

  expect(output.length).toStrictEqual(4);
  expect(output[0].trim()).toStrictEqual(
    `stack-name | 0/2 | ${HUMAN_TIME} | ${chalk.reset('UPDATE_IN_PROGRESS  ')} | AWS::CloudFormation::Stack | ${chalk.reset(chalk.bold('stack1'))}`,
  );
  expect(output[1].trim()).toStrictEqual(
    `stack-name | 0/2 | ${HUMAN_TIME} | ${chalk.red('UPDATE_FAILED       ')} | AWS::CloudFormation::Stack | ${chalk.red(chalk.bold('stack1'))} ${chalk.red(chalk.bold('The following hook(s) failed: hook1 : stack1 must obey certain rules'))}`,
  );
  expect(output[2].trim()).toStrictEqual('Failed resources:');
  expect(output[3].trim()).toStrictEqual(
    `stack-name | ${HUMAN_TIME} | ${chalk.red('UPDATE_FAILED       ')} | AWS::CloudFormation::Stack | ${chalk.red(chalk.bold('stack1'))} ${chalk.red(chalk.bold('The following hook(s) failed: hook1 : stack1 must obey certain rules'))}`,
  );
});
