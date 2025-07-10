const { PRIORITIES, LABELS, STATUS, ...PROJECT_CONFIG } = require('../../../../scripts/prioritization/project-config');
const {
    createMockGithubForR2,
    OPTION_IDS
} = require('./helpers/mock-data');

const assignR2Priority = require('../../../../scripts/prioritization/assign-r2-priority');

describe('Priority Assignment (R2)', () => {
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

        // Get the existing project item data from the mock response
        const projectItemResponse = await mockGithub.graphql.mock.results[2].value;
        const existingPRData = projectItemResponse.node.projectItems.nodes[0];

        // Verify priority update
        const priorityUpdateCall = calls.find(call =>
            call[1].input?.fieldId === PROJECT_CONFIG.priorityFieldId
        );
        expect(priorityUpdateCall[1].input.value.singleSelectOptionId)
            .toBe(OPTION_IDS[expectedPriority]);

        // Find any status update calls
        const statusUpdateCall = calls.find(call =>
            call[1].input?.fieldId === PROJECT_CONFIG.statusFieldId
        );

        if (existingPRData) {
            // For existing PR
            // Get the existing status
            const existingStatus = existingPRData.fieldValues.nodes
                .find(node => node.field.name === 'Status')?.name;

            // Verify no status update was made
            expect(statusUpdateCall).toBeUndefined();

            // Verify expected status matches existing status
            expect(existingStatus).toBe(expectedStatus);
        } else {
            // For new PR
            expect(statusUpdateCall[1].input.value.singleSelectOptionId)
                .toBe(OPTION_IDS[STATUS.READY]);
        }
    }

    describe('R2 Priority Tests', () => {
        test('should assign R2 priority and Ready status to approved PR with failing checks', async () => {
            mockGithub = createMockGithubForR2({
                approvalCount: 2,
                checksState: 'FAILURE'
            });

            await assignR2Priority({ github: mockGithub });
            await verifyProjectState(PRIORITIES.R2, STATUS.READY);
        });

        test('should not assign R2 priority to PR without approval', async () => {
            mockGithub = createMockGithubForR2({
                approvalCount: 0,
                checksState: 'SUCCESS'
            });

            await assignR2Priority({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should not assign R2 priority to PR with a single approval', async () => {
            mockGithub = createMockGithubForR2({
                approvalCount: 1,
                checksState: 'SUCCESS'
            });

            await assignR2Priority({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should assign R2 priority to PR with passing checks', async () => {
            mockGithub = createMockGithubForR2({
                approvalCount: 2,
                checksState: 'SUCCESS'
            });

            await assignR2Priority({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should update existing PR to R2 priority', async () => {
            mockGithub = createMockGithubForR2({
                approvalCount: 2,
                checksState: 'FAILURE',
                existingPriority: PRIORITIES.R3,
                existingStatus: STATUS.IN_PROGRESS
            });

            await assignR2Priority({ github: mockGithub });
            await verifyProjectState(PRIORITIES.R2, STATUS.IN_PROGRESS);
        });

        test('should not update if PR already has R2 priority', async () => {
            mockGithub = createMockGithubForR2({
                approvalCount: 2,
                checksState: 'FAILURE',
                existingPriority: PRIORITIES.R2
            });

            await assignR2Priority({ github: mockGithub });
            await verifyProjectState(null);
        });
    });
});