const { PRIORITIES, LABELS, STATUS, ...PROJECT_CONFIG} = require('../../../../scripts/prioritization/project-config');
const { 
    createMockPR,
    createMockGithubForPriority,
    OPTION_IDS
} = require('./helpers/mock-data');

const assignPriority = require('../../../../scripts/prioritization/assign-priority');


describe('Priority Assignment (R1, R3, R4)', () => {
    let mockGithub;
    let mockContext;
  
    beforeEach(() => {
        jest.clearAllMocks();
    });

    async function verifyProjectState(expectedPriority, expectedStatus) {
      const calls = mockGithub.graphql.mock.calls;
      
      if (!expectedPriority) {
          const priorityUpdateCall = calls.find(call => 
              call[1].input?.fieldId === PROJECT_CONFIG.priorityFieldId
          );
          expect(priorityUpdateCall).toBeUndefined();
          return;
      }
  
      const fetchItemResponse = await mockGithub.graphql.mock.results[1].value;
      const existingItem = fetchItemResponse?.node?.projectItems?.nodes?.[0];
  
      // Find priority update call
      const priorityUpdateCall = calls.find(call => 
          call[1].input?.fieldId === PROJECT_CONFIG.priorityFieldId
      );
  
      // Verify priority was set correctly
      expect(priorityUpdateCall[1].input.value.singleSelectOptionId)
          .toBe(OPTION_IDS[expectedPriority]);
  
      // Check if item exists in project
      if (existingItem) {
          // For existing items, verify no status update was attempted
          const statusUpdateCall = calls.find(call => 
              call[1].input?.fieldId === PROJECT_CONFIG.statusFieldId
          );
          expect(statusUpdateCall).toBeUndefined();
          
          const actualStatus = existingItem.fieldValues.nodes
              .find(node => node.field?.name === 'Status')?.name;
          expect(actualStatus).toBe(expectedStatus);
      } else {
          // For new items, verify status was set to Ready
          const statusUpdateCall = calls.find(call => 
              call[1].input?.fieldId === PROJECT_CONFIG.statusFieldId
          );
          expect(statusUpdateCall[1].input.value.singleSelectOptionId)
              .toBe(OPTION_IDS[STATUS.READY]);
      }
    }
  
  
    describe('R1 Priority Tests', () => {
      test('should assign R1 and Ready status to non-draft PR with contribution/core label', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: false,
          labels: [LABELS.CORE]
        });
  
        mockContext = { payload: { pull_request: pr } };
                  
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R1, STATUS.READY);
      });
        
      test('should assign R1 and Ready status to non-draft PR with contribution/core and needs-maintainer-review labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: false,
          labels: [LABELS.CORE, LABELS.MAINTAINER_REVIEW]
        });
  
        mockContext = { payload: { pull_request: pr } };
                  
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R1, STATUS.READY);
      });
  
      test('should not add draft PR with contribution/core label to project', async () => {
        mockGithub = createMockGithubForPriority();
        
        const pr = createMockPR({
          draft: true,
          labels: [LABELS.CORE]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(null);
      });

      test('should retain existing status when updating priority to R1', async () => {
        mockGithub = createMockGithubForPriority({
          existingPriority: PRIORITIES.R3,
          existingStatus: STATUS.IN_PROGRESS
        });

        const pr = createMockPR({
          draft: false,
          labels: [LABELS.CORE]
        });

        mockContext = { payload: { pull_request: pr } };

        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R1, STATUS.IN_PROGRESS);
      });
    });
  
    describe('R3 Priority Tests', () => {
      test('should assign R3 and Ready status to non-draft PR with needs-maintainer-review label', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: false,
          labels: [LABELS.MAINTAINER_REVIEW]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R3, STATUS.READY);
      });

      test('should not assign R3 to draft PR with needs-maintainer-review label', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: true,
          labels: [LABELS.MAINTAINER_REVIEW]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(null);
      });

      test('should retain existing status when updating priority to R3', async () => {
        mockGithub = createMockGithubForPriority({
            existingPriority: PRIORITIES.R4,
            existingStatus: STATUS.IN_PROGRESS
        });

        const pr = createMockPR({
            draft: false,
            labels: [LABELS.MAINTAINER_REVIEW]
        });

        mockContext = { payload: { pull_request: pr } };

        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R3, STATUS.IN_PROGRESS);
      });
    });
  
    describe('R4 Priority Tests', () => {
      test('should assign R4 and Ready status to PR with pr/reviewer-clarification-requested and needs-community-review labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: true,
          labels: [
            LABELS.CLARIFICATION_REQUESTED,
            LABELS.COMMUNITY_REVIEW
          ]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R4, STATUS.READY);
      });
  
      test('should assign R4 and Ready status to PR with pr-linter/exemption-requested and needs-community-review labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: true,
          labels: [
            LABELS.EXEMPTION_REQUESTED,
            LABELS.COMMUNITY_REVIEW
          ]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R4, STATUS.READY);
      });

      test('should assign R4 and Ready status to PR with pr/reviewer-clarification-requested and needs-maintainer-review labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: true,
          labels: [
            LABELS.CLARIFICATION_REQUESTED,
            LABELS.MAINTAINER_REVIEW
          ]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R4, STATUS.READY);
      });
        
      test('should assign R4 and Ready status to PR with pr-linter/exemption-requested and needs-maintainer-review labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          labels: [
            LABELS.EXEMPTION_REQUESTED,
            LABELS.MAINTAINER_REVIEW
          ]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R4, STATUS.READY);
      });

      test('should assign R4 and Ready status to PR with pr/reviewer-clarification-requested label and no review labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          labels: [LABELS.CLARIFICATION_REQUESTED]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R4, STATUS.READY);
      });

      test('should assign R4 and Ready status to PR with pr-linter/exemption-requested label and no review labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: true,
          labels: [LABELS.EXEMPTION_REQUESTED]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R4, STATUS.READY);
      });

      test('should retain existing status when updating priority to R4', async () => {
        mockGithub = createMockGithubForPriority({
            existingPriority: PRIORITIES.R5,
            existingStatus: STATUS.PAUSED
        });

        const pr = createMockPR({
            labels: [
                LABELS.CLARIFICATION_REQUESTED,
                LABELS.COMMUNITY_REVIEW
            ]
        });

        mockContext = { payload: { pull_request: pr } };

        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R4, STATUS.PAUSED);
      });
    });

    describe('Priority Precedence Tests', () => {
      test('should assign R1 over R3 when PR has both contribution/core and needs-maintainer-review labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: false,
          labels: [
            LABELS.CORE,
            LABELS.MAINTAINER_REVIEW
          ]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R1, STATUS.READY);
      });
        
      test('should assign R1 over R4 when PR has both contribution/core and pr/reviewer-clarification-requested labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: false,
          labels: [
            LABELS.CORE,
            LABELS.CLARIFICATION_REQUESTED
          ]
        });
    
        mockContext = { payload: { pull_request: pr } };
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R1, STATUS.READY);
      });

      test('should not assign any priority when no matching labels', async () => {
        mockGithub = createMockGithubForPriority();

        const pr = createMockPR({
          draft: false,
          labels: []
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(null);
      });
    });
});