const { PRIORITIES, LABELS, STATUS, ...PROJECT_CONFIG} = require('../../../../scripts/prioritization/project-config');
const { 
    createMockPR, 
    createMockGithub,
    OPTION_IDS
} = require('./helpers/mock-data');

const assignPriority = require('../../../../scripts/prioritization/assign-priority');


describe('Priority Assignment (R1, R3, R4)', () => {
    let mockGithub;
    let mockContext;
  
    beforeEach(() => {
        mockGithub = createMockGithub();
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
    
        const priorityUpdateCall = calls.find(call => 
            call[1].input?.fieldId === PROJECT_CONFIG.priorityFieldId
        );
        const statusUpdateCall = calls.find(call => 
            call[1].input?.fieldId === PROJECT_CONFIG.statusFieldId
        );
    
        // Verify priority was set correctly
        expect(priorityUpdateCall[1].input.value.singleSelectOptionId)
            .toBe(OPTION_IDS[expectedPriority]);
    
        // Verify status was set to Ready
        expect(statusUpdateCall[1].input.value.singleSelectOptionId)
            .toBe(OPTION_IDS[expectedStatus]);
    }
  
    describe('R1 Priority Tests', () => {
      test('should assign R1 and Ready status to non-draft PR with contribution/core label', async () => {
        const pr = createMockPR({
          draft: false,
          labels: [LABELS.CORE]
        });
  
        mockContext = { payload: { pull_request: pr } };
                  
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R1, STATUS.READY);
      });
        
      test('should assign R1 and Ready status to non-draft PR with contribution/core and needs-maintainer-review labels', async () => {
        const pr = createMockPR({
          draft: false,
          labels: [LABELS.CORE, LABELS.MAINTAINER_REVIEW]
        });
  
        mockContext = { payload: { pull_request: pr } };
                  
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R1, STATUS.READY);
      });
  
      test('should not add draft PR with contribution/core label to project', async () => {
        const pr = createMockPR({
          draft: true,
          labels: [LABELS.CORE]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(null);
      });
    });
  
    describe('R3 Priority Tests', () => {
      test('should assign R3 and Ready status to non-draft PR with needs-maintainer-review label', async () => {
        const pr = createMockPR({
          draft: false,
          labels: [LABELS.MAINTAINER_REVIEW]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R3, STATUS.READY);
      });

      test('should not assign R3 to draft PR with needs-maintainer-review label', async () => {
        const pr = createMockPR({
          draft: true,
          labels: [LABELS.MAINTAINER_REVIEW]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(null);
      });
    });
  
    describe('R4 Priority Tests', () => {
      test('should assign R4 and Ready status to PR with pr/reviewer-clarification-requested and needs-community-review labels', async () => {
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
        const pr = createMockPR({
          labels: [LABELS.CLARIFICATION_REQUESTED]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R4, STATUS.READY);
      });

      test('should assign R4 and Ready status to PR with pr-linter/exemption-requested label and no review labels', async () => {
        const pr = createMockPR({
          draft: true,
          labels: [LABELS.EXEMPTION_REQUESTED]
        });
  
        mockContext = { payload: { pull_request: pr } };
        
        await assignPriority({ github: mockGithub, context: mockContext });
        await verifyProjectState(PRIORITIES.R4, STATUS.READY);
      });
    });

    describe('Priority Precedence Tests', () => {
      test('should assign R1 over R3 when PR has both contribution/core and needs-maintainer-review labels', async () => {
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