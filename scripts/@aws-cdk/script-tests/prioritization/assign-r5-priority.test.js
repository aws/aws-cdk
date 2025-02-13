const { PRIORITIES, LABELS, STATUS, ...PROJECT_CONFIG } = require('../../../../scripts/prioritization/project-config');
const { 
    createMockGithubForR5,
    OPTION_IDS
} = require('./helpers/mock-data');

const assignR5Priority = require('../../../../scripts/prioritization/assign-r5-priority');

describe('Priority Assignment (R5)', () => {
    let mockGithub;
  
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
    
        const priorityUpdateCall = calls.find(call => 
            call[1].input?.fieldId === PROJECT_CONFIG.priorityFieldId
        );
        const statusUpdateCall = calls.find(call => 
            call[1].input?.fieldId === PROJECT_CONFIG.statusFieldId
        );
    
        expect(priorityUpdateCall[1].input.value.singleSelectOptionId)
            .toBe(OPTION_IDS[expectedPriority]);
    
        expect(statusUpdateCall[1].input.value.singleSelectOptionId)
            .toBe(OPTION_IDS[expectedStatus]);
    }

    describe('R5 Priority Tests', () => {
        test('should assign R5 and Ready status to non-draft PR with needs-community-review label and no updates for 21 days', async () => {
            mockGithub = createMockGithubForR5({
                draft: false,
                labels: [LABELS.COMMUNITY_REVIEW]
            });
    
            await assignR5Priority({ github: mockGithub });
            await verifyProjectState(PRIORITIES.R5, STATUS.READY);
        });
 
        test('should not assign R5 to draft PR with needs-community-review label and no updates for 21 days', async () => {
            mockGithub = createMockGithubForR5({
                draft: true,
                labels: [LABELS.COMMUNITY_REVIEW]
            });
    
            await assignR5Priority({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should not assign R5 if PR updated within 21 days', async () => {
            mockGithub = createMockGithubForR5({
                draft: false,
                labels: [LABELS.COMMUNITY_REVIEW],
                updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
            });
    
            await assignR5Priority({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should not assign R5 if PR has needs-community-review and pr/reviewer-clarification-requested labels', async () => {
            mockGithub = createMockGithubForR5({
                draft: false,
                labels: [LABELS.COMMUNITY_REVIEW, LABELS.CLARIFICATION_REQUESTED]
            });
    
            await assignR5Priority({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should not assign R5 if PR has needs-community-review and pr-linter/exemption-requested labels', async () => {
            mockGithub = createMockGithubForR5({
                draft: false,
                labels: [LABELS.COMMUNITY_REVIEW, LABELS.EXEMPTION_REQUESTED]
            });
    
            await assignR5Priority({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should not assign R5 if PR does not have community review label', async () => {
            mockGithub = createMockGithubForR5({
                draft: false,
                labels: []
            });
    
            await assignR5Priority({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should not update if PR already has R5 priority', async () => {
            mockGithub = createMockGithubForR5({
                draft: false,
                labels: [LABELS.COMMUNITY_REVIEW],
                existingPriority: PRIORITIES.R5
            });
    
            await assignR5Priority({ github: mockGithub });
            
            await verifyProjectState(null);
        });
    });
});
