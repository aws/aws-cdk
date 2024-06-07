import { StackStatus } from '../../../lib/api/util/cloudformation/stack-status';

describe('StackStatus', () => {
  describe('fromStackDescription', () => {
    it('should create a StackStatus instance from an AWS.CloudFormation.Stack', () => {
      const stackDescription: AWS.CloudFormation.Stack = {
        StackStatus: 'CREATE_COMPLETE',
        StackStatusReason: 'Deployment successful',
        DetailedStatus: 'CONFIGURATION_COMPLETE',
        StackName: 'my-stack',
        CreationTime: new Date(),
      };

      const stackStatus = StackStatus.fromStackDescription(stackDescription);

      expect(stackStatus.name).toBe('CREATE_COMPLETE');
      expect(stackStatus.reason).toBe('Deployment successful');
      expect(stackStatus.detailedName).toBe('CONFIGURATION_COMPLETE');
    });
  });

  describe('isCreationFailure', () => {
    it('should return true for ROLLBACK_COMPLETE', () => {
      const stackStatus = new StackStatus('ROLLBACK_COMPLETE');
      expect(stackStatus.isCreationFailure).toBe(true);
    });

    it('should return true for ROLLBACK_FAILED', () => {
      const stackStatus = new StackStatus('ROLLBACK_FAILED');
      expect(stackStatus.isCreationFailure).toBe(true);
    });

    it('should return false for other stack statuses', () => {
      const stackStatus = new StackStatus('CREATE_COMPLETE');
      expect(stackStatus.isCreationFailure).toBe(false);
    });
  });

  describe('isDeleted', () => {
    it('should return true for DELETE_COMPLETE', () => {
      const stackStatus = new StackStatus('DELETE_COMPLETE');
      expect(stackStatus.isDeleted).toBe(true);
    });

    it('should return true for DELETE_FAILED', () => {
      const stackStatus = new StackStatus('DELETE_FAILED');
      expect(stackStatus.isDeleted).toBe(true);
    });

    it('should return false for other stack statuses', () => {
      const stackStatus = new StackStatus('CREATE_COMPLETE');
      expect(stackStatus.isDeleted).toBe(false);
    });
  });

  describe('isFailure', () => {
    it('should return true for CREATE_FAILED', () => {
      const stackStatus = new StackStatus('CREATE_FAILED');
      expect(stackStatus.isFailure).toBe(true);
    });

    it('should return true for UPDATE_FAILED', () => {
      const stackStatus = new StackStatus('UPDATE_FAILED');
      expect(stackStatus.isFailure).toBe(true);
    });

    it('should return false for other stack statuses', () => {
      const stackStatus = new StackStatus('CREATE_COMPLETE');
      expect(stackStatus.isFailure).toBe(false);
    });
  });

  describe('isInProgress', () => {
    it('should return true for CREATE_IN_PROGRESS', () => {
      const stackStatus = new StackStatus('CREATE_IN_PROGRESS');
      expect(stackStatus.isInProgress).toBe(true);
    });

    it('should return true for UPDATE_IN_PROGRESS', () => {
      const stackStatus = new StackStatus('UPDATE_IN_PROGRESS');
      expect(stackStatus.isInProgress).toBe(true);
    });

    it('should return false for REVIEW_IN_PROGRESS', () => {
      const stackStatus = new StackStatus('REVIEW_IN_PROGRESS');
      expect(stackStatus.isInProgress).toBe(false);
    });

    it('should return false for other stack statuses', () => {
      const stackStatus = new StackStatus('CREATE_COMPLETE');
      expect(stackStatus.isInProgress).toBe(false);
    });
  });

  describe('isReviewInProgress', () => {
    it('should return true for REVIEW_IN_PROGRESS', () => {
      const stackStatus = new StackStatus('REVIEW_IN_PROGRESS');
      expect(stackStatus.isReviewInProgress).toBe(true);
    });

    it('should return false for other stack statuses', () => {
      const stackStatus = new StackStatus('CREATE_COMPLETE');
      expect(stackStatus.isReviewInProgress).toBe(false);
    });
  });

  describe('isNotFound', () => {
    it('should return true for NOT_FOUND', () => {
      const stackStatus = new StackStatus('NOT_FOUND');
      expect(stackStatus.isNotFound).toBe(true);
    });

    it('should return false for other stack statuses', () => {
      const stackStatus = new StackStatus('CREATE_COMPLETE');
      expect(stackStatus.isNotFound).toBe(false);
    });
  });

  describe('isDeploySuccess', () => {
    it('should return true for CREATE_COMPLETE', () => {
      const stackStatus = new StackStatus('CREATE_COMPLETE');
      expect(stackStatus.isDeploySuccess).toBe(true);
    });

    it('should return true for UPDATE_COMPLETE', () => {
      const stackStatus = new StackStatus('UPDATE_COMPLETE');
      expect(stackStatus.isDeploySuccess).toBe(true);
    });

    it('should return true for IMPORT_COMPLETE', () => {
      const stackStatus = new StackStatus('IMPORT_COMPLETE');
      expect(stackStatus.isDeploySuccess).toBe(true);
    });

    it('should return false for NOT_FOUND', () => {
      const stackStatus = new StackStatus('NOT_FOUND');
      expect(stackStatus.isDeploySuccess).toBe(false);
    });

    it('should return false for other stack statuses', () => {
      const stackStatus = new StackStatus('CREATE_FAILED');
      expect(stackStatus.isDeploySuccess).toBe(false);
    });
  });

  describe('isRollbackSuccess', () => {
    it('should return true for ROLLBACK_COMPLETE', () => {
      const stackStatus = new StackStatus('ROLLBACK_COMPLETE');
      expect(stackStatus.isRollbackSuccess).toBe(true);
    });

    it('should return true for UPDATE_ROLLBACK_COMPLETE', () => {
      const stackStatus = new StackStatus('UPDATE_ROLLBACK_COMPLETE');
      expect(stackStatus.isRollbackSuccess).toBe(true);
    });

    it('should return false for other stack statuses', () => {
      const stackStatus = new StackStatus('CREATE_COMPLETE');
      expect(stackStatus.isRollbackSuccess).toBe(false);
    });
  });

  describe('isConfigurationComplete', () => {
    it('should return true when the detailed status is CONFIGURATION_COMPLETE', () => {
      const stackStatus = new StackStatus(
        'CREATE_COMPLETE',
        'Deployment successful',
        'CONFIGURATION_COMPLETE',
      );
      expect(stackStatus.isConfigurationComplete).toBe(true);
    });

    it('should return false when the detailed status is not CONFIGURATION_COMPLETE', () => {
      const stackStatus = new StackStatus(
        'CREATE_COMPLETE',
        'Deployment successful',
        'SOME_OTHER_STATUS',
      );
      expect(stackStatus.isConfigurationComplete).toBe(false);
    });
  });

  describe('isValidationFailed', () => {
    it('should return true when the detailed status is VALIDATION_FAILED', () => {
      const stackStatus = new StackStatus(
        'CREATE_FAILED',
        'Deployment failed',
        'VALIDATION_FAILED',
      );
      expect(stackStatus.isValidationFailed).toBe(true);
    });

    it('should return false when the detailed status is not VALIDATION_FAILED', () => {
      const stackStatus = new StackStatus(
        'CREATE_FAILED',
        'Deployment failed',
        'SOME_OTHER_STATUS',
      );
      expect(stackStatus.isValidationFailed).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the status string with the reason', () => {
      const stackStatus = new StackStatus(
        'CREATE_COMPLETE',
        'Deployment successful',
      );
      expect(stackStatus.toString()).toBe('CREATE_COMPLETE (Deployment successful)');
    });

    it('should return the status string with the detailed status', () => {
      const stackStatus = new StackStatus(
        'CREATE_COMPLETE',
        'Deployment successful',
        'CONFIGURATION_COMPLETE',
      );
      expect(stackStatus.toString()).toBe('CREATE_COMPLETE (Deployment successful) - CONFIGURATION_COMPLETE');
    });

    it('should return the status string without the reason', () => {
      const stackStatus = new StackStatus('CREATE_COMPLETE');
      expect(stackStatus.toString()).toBe('CREATE_COMPLETE');
    });
  });
});
