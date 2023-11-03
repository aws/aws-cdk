const mockGetPipelineState = jest.fn();
const mockPutApprovalResult = jest.fn();
const mockCodePipeline = {
  getPipelineState: mockGetPipelineState,
  putApprovalResult: mockPutApprovalResult,
};

jest.mock('@aws-sdk/client-codepipeline', () => {
  return {
    CodePipeline: jest.fn(() => mockCodePipeline),
  };
});

jest.setTimeout(10_000);

import { handler } from '../../lib/pipelines/approve-lambda/index';

describe('approve-lambda handler', () => {

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('automatic approval works', async () => {
    // GIVEN
    mockGetPipelineState.mockImplementation(() => {
      return {
        stageStates: [{
          stageName: 'stage',
          actionStates: [{
            actionName: 'action',
            latestExecution: {
              lastStatusChange: 1446137358.328,
              status: 'Succeeded',
              token: 'token',
            },
          }],
        }],
      };
    });

    const event = {
      PipelineName: 'pipeline',
      StageName: 'stage',
      ActionName: 'action',
    };

    // WHEN
    await handler(event, {});

    // THEN
    expect(mockPutApprovalResult).toHaveBeenCalled();
  });

  test('does not approve if stageName not found', async () => {
    // GIVEN
    mockGetPipelineState.mockImplementation(async () => {
      return {
        stageStates: [{
          stageName: 'unknown',
          actionStates: [{
            actionName: 'action',
            latestExecution: {
              lastStatusChange: 1446137358.328,
              status: 'Succeeded',
              token: 'token',
            },
          }],
        }],
      };
    });

    // expire deadline after first loop
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10 * 60_000);

    const event = {
      PipelineName: 'pipeline',
      StageName: 'stage',
      ActionName: 'action',
    };

    // WHEN
    await handler(event, {});

    // THEN
    expect(setTimeout).toHaveBeenCalled();
    expect(mockPutApprovalResult).not.toHaveBeenCalled();
  });

  test('does not approve if actionName not found', async () => {
    // GIVEN
    mockGetPipelineState.mockImplementation(async () => {
      return {
        stageStates: [{
          stageName: 'stage',
          actionStates: [{
            actionName: 'unknown',
            latestExecution: {
              lastStatusChange: 1446137358.328,
              status: 'Succeeded',
              token: 'token',
            },
          }],
        }],
      };
    });

    // expire deadline after first loop
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10 * 60_000);

    const event = {
      PipelineName: 'pipeline',
      StageName: 'stage',
      ActionName: 'action',
    };

    // WHEN
    await handler(event, {});

    // THEN
    expect(setTimeout).toHaveBeenCalled();
    expect(mockPutApprovalResult).not.toHaveBeenCalled();
  });

  test('does not approve if token not present', async () => {
    // GIVEN
    mockGetPipelineState.mockImplementation(async () => {
      return {
        stageStates: [{
          stageName: 'stage',
          actionStates: [{
            actionName: 'unknown',
            latestExecution: {
              lastStatusChange: 1446137358.328,
              status: 'Succeeded',
            },
          }],
        }],
      };
    });

    // expire deadline after first loop
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10 * 60_000);

    const event = {
      PipelineName: 'pipeline',
      StageName: 'stage',
      ActionName: 'action',
    };

    // WHEN
    await handler(event, {});

    // THEN
    expect(setTimeout).toHaveBeenCalled();
    expect(mockPutApprovalResult).not.toHaveBeenCalled();
  });
});
