const { STATUS, NEEDS_ATTENTION_STATUS, ...PROJECT_CONFIG } = require('../../../../scripts/prioritization/project-config');
const { 
    createMockGithubForNeedsAttention,
    OPTION_IDS
} = require('./helpers/mock-data');

const updateAttentionStatus = require('../../../../scripts/prioritization/update-attention-status');

describe('Needs Attention Status Assignment', () => {
    let mockGithub;
  
    beforeEach(() => {
        jest.clearAllMocks();
    });

    async function verifyProjectState(expectedAttentionStatus) {
        const calls = mockGithub.graphql.mock.calls;
    
        if (!expectedAttentionStatus) {
            const attentionUpdateCall = calls.find(call => 
                call[1].input?.fieldId === PROJECT_CONFIG.attentionFieldId
            );
            expect(attentionUpdateCall).toBeUndefined();
            return;
        }
    
        // Verify attention status update
        const attentionUpdateCall = calls.find(call => 
            call[1].input?.fieldId === PROJECT_CONFIG.attentionFieldId
        );
        expect(attentionUpdateCall[1].input.value.singleSelectOptionId)
            .toBe(OPTION_IDS[expectedAttentionStatus]);
    }

    describe('Needs Attention Status Tests', () => {
        test('should set Extended status for items in status 7-14 days', async () => {
            mockGithub = createMockGithubForNeedsAttention({
                status: STATUS.READY,
                daysInStatus: 10
            });
        
            await updateAttentionStatus({ github: mockGithub });
            await verifyProjectState(NEEDS_ATTENTION_STATUS.EXTENDED.name);
        });

        test('should set Aging status for items in status 14-21 days', async () => {
            mockGithub = createMockGithubForNeedsAttention({
                status: STATUS.IN_PROGRESS,
                daysInStatus: 16
            });
        
            await updateAttentionStatus({ github: mockGithub });
            await verifyProjectState(NEEDS_ATTENTION_STATUS.AGING.name);
        });

        test('should set Stalled status for items in status >21 days', async () => {
            mockGithub = createMockGithubForNeedsAttention({
                status: STATUS.PAUSED,
                daysInStatus: 25
            });
        
            await updateAttentionStatus({ github: mockGithub });
            await verifyProjectState(NEEDS_ATTENTION_STATUS.STALLED.name);
        });

        test('should not set attention status for items under threshold', async () => {
            mockGithub = createMockGithubForNeedsAttention({
                status: STATUS.ASSIGNED,
                daysInStatus: 5
            });
        
            await updateAttentionStatus({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should not set attention status for non-monitored status', async () => {
            mockGithub = createMockGithubForNeedsAttention({
                status: STATUS.DONE,
                daysInStatus: 25
            });
        
            await updateAttentionStatus({ github: mockGithub });
            await verifyProjectState(null);
        });

        test('should handle multiple items with different statuses', async () => {
            mockGithub = createMockGithubForNeedsAttention({
                items: [
                    { status: STATUS.READY, daysInStatus: 10 },
                    { status: STATUS.IN_PROGRESS, daysInStatus: 16 },
                    { status: STATUS.PAUSED, daysInStatus: 25 },
                    { status: STATUS.DONE, daysInStatus: 30 }
                ]
            });
        
            await updateAttentionStatus({ github: mockGithub });
            
            const calls = mockGithub.graphql.mock.calls;
            const attentionCalls = calls.filter(call => 
                call[1].input?.fieldId === PROJECT_CONFIG.attentionFieldId
            );

            expect(attentionCalls).toHaveLength(3); // Only 3 items should be updated
            expect(attentionCalls[0][1].input.value.singleSelectOptionId)
                .toBe(OPTION_IDS[NEEDS_ATTENTION_STATUS.EXTENDED.name]);
            expect(attentionCalls[1][1].input.value.singleSelectOptionId)
                .toBe(OPTION_IDS[NEEDS_ATTENTION_STATUS.AGING.name]);
            expect(attentionCalls[2][1].input.value.singleSelectOptionId)
                .toBe(OPTION_IDS[NEEDS_ATTENTION_STATUS.STALLED.name]);
        });
    });
});