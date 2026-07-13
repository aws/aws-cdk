"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEvent = onEvent;
exports.isComplete = isComplete;
// eslint-disable-next-line import/no-extraneous-dependencies
const client_glue_1 = require("@aws-sdk/client-glue");
class PartitionIndexError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PartitionIndexError';
    }
}
const glue = new client_glue_1.GlueClient({});
async function findPartitionIndex(DatabaseName, TableName, IndexName) {
    const resp = await glue.send(new client_glue_1.GetPartitionIndexesCommand({ DatabaseName, TableName }));
    // Glue lowercases index names, so compare case-insensitively
    return (resp.PartitionIndexDescriptorList || []).find((i) => i.IndexName.toLowerCase() === IndexName.toLowerCase());
}
async function onEvent(event) {
    const { DatabaseName, TableName, IndexName, Keys } = event.ResourceProperties;
    if (event.RequestType === 'Create') {
        try {
            await glue.send(new client_glue_1.CreatePartitionIndexCommand({
                DatabaseName,
                TableName,
                PartitionIndex: { IndexName, Keys },
            }));
        }
        catch (e) {
            // The index may already exist if it was created out-of-band or by a previous
            // resource being replaced (CloudFormation creates the replacement before deleting
            // the old resource). Treat this as success and let isComplete verify its state.
            if (e.name === 'AlreadyExistsException') {
                // eslint-disable-next-line no-console
                console.log(`Partition index ${IndexName} already exists on ${DatabaseName}.${TableName} - reusing existing index`);
            }
            else {
                throw e;
            }
        }
        return { PhysicalResourceId: IndexName };
    }
    else if (event.RequestType === 'Update') {
        const oldKeys = event.OldResourceProperties?.Keys;
        if (JSON.stringify(oldKeys) !== JSON.stringify(Keys)) {
            // For auto-generated index names, this should be unreachable. CDK derives index names from keys, so key changes always produce a new resource
            throw new PartitionIndexError('Partition index keys cannot be updated. Delete and recreate the index instead.');
        }
        return { PhysicalResourceId: IndexName };
    }
    else if (event.RequestType === 'Delete') {
        try {
            await glue.send(new client_glue_1.DeletePartitionIndexCommand({
                DatabaseName,
                TableName,
                IndexName,
            }));
        }
        catch (e) {
            if (e.name === 'EntityNotFoundException') {
                // eslint-disable-next-line no-console
                console.log(`Partition index ${IndexName} not found on ${DatabaseName}.${TableName} - may have been deleted out-of-band`);
            }
            else {
                throw e;
            }
        }
    }
    return {};
}
async function isComplete(event) {
    const { DatabaseName, TableName, IndexName } = event.ResourceProperties;
    if (event.RequestType === 'Delete') {
        const index = await findPartitionIndex(DatabaseName, TableName, IndexName);
        if (!index || index.IndexStatus !== 'DELETING') {
            return { IsComplete: true };
        }
        return { IsComplete: false };
    }
    const index = await findPartitionIndex(DatabaseName, TableName, IndexName);
    if (!index)
        return { IsComplete: false };
    if (index.IndexStatus === 'ACTIVE')
        return { IsComplete: true };
    if (index.IndexStatus === 'CREATING')
        return { IsComplete: false };
    const errorDetails = index.BackfillErrors?.length
        ? ` Backfill errors: ${JSON.stringify(index.BackfillErrors)}`
        : '';
    throw new PartitionIndexError(`Partition index ${IndexName} in unexpected state: ${index.IndexStatus}.${errorDetails}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQW9CQSwwQkErQ0M7QUFFRCxnQ0FxQkM7QUExRkQsNkRBQTZEO0FBQzdELHNEQUF3STtBQUV4SSxNQUFNLG1CQUFvQixTQUFRLEtBQUs7SUFDckMsWUFBWSxPQUFlO1FBQ3pCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUM7S0FDbkM7Q0FDRjtBQUVELE1BQU0sSUFBSSxHQUFHLElBQUksd0JBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVoQyxLQUFLLFVBQVUsa0JBQWtCLENBQUMsWUFBb0IsRUFBRSxTQUFpQixFQUFFLFNBQWlCO0lBQzFGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLHdDQUEwQixDQUFDLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxRiw2REFBNkQ7SUFDN0QsT0FBTyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQ25ELENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FDOUQsQ0FBQztBQUNKLENBQUM7QUFFTSxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQVU7SUFDdEMsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztJQUU5RSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUkseUNBQTJCLENBQUM7Z0JBQzlDLFlBQVk7Z0JBQ1osU0FB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LEVBQUUsQ0FBQztJQUVuRSxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFLE1BQU07UUFDL0MsQ0FBQyxDQUFDLHFCQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRTtRQUM3RCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ1AsTUFBTSxJQUFJLG1CQUFtQixDQUFDLG1CQUFtQixTQUFTLHlCQUF5QixLQUFLLENBQUMsV0FBVyxJQUFJLFlBQVksRUFBRSxDQUFDLENBQUM7QUFDMUgsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IEdsdWVDbGllbnQsIENyZWF0ZVBhcnRpdGlvbkluZGV4Q29tbWFuZCwgRGVsZXRlUGFydGl0aW9uSW5kZXhDb21tYW5kLCBHZXRQYXJ0aXRpb25JbmRleGVzQ29tbWFuZCB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1nbHVlJztcblxuY2xhc3MgUGFydGl0aW9uSW5kZXhFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gJ1BhcnRpdGlvbkluZGV4RXJyb3InO1xuICB9XG59XG5cbmNvbnN0IGdsdWUgPSBuZXcgR2x1ZUNsaWVudCh7fSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbmRQYXJ0aXRpb25JbmRleChEYXRhYmFzZU5hbWU6IHN0cmluZywgVGFibGVOYW1lOiBzdHJpbmcsIEluZGV4TmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3AgPSBhd2FpdCBnbHVlLnNlbmQobmV3IEdldFBhcnRpdGlvbkluZGV4ZXNDb21tYW5kKHsgRGF0YWJhc2VOYW1lLCBUYWJsZU5hbWUgfSkpO1xuICAvLyBHbHVlIGxvd2VyY2FzZXMgaW5kZXggbmFtZXMsIHNvIGNvbXBhcmUgY2FzZS1pbnNlbnNpdGl2ZWx5XG4gIHJldHVybiAocmVzcC5QYXJ0aXRpb25JbmRleERlc2NyaXB0b3JMaXN0IHx8IFtdKS5maW5kKFxuICAgIChpKSA9PiBpLkluZGV4TmFtZSEudG9Mb3dlckNhc2UoKSA9PT0gSW5kZXhOYW1lLnRvTG93ZXJDYXNlKCksXG4gICk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvbkV2ZW50KGV2ZW50OiBhbnkpIHtcbiAgY29uc3QgeyBEYXRhYmFzZU5hbWUsIFRhYmxlTmFtZSwgSW5kZXhOYW1lLCBLZXlzIH0gPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXM7XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBnbHVlLnNlbmQobmV3IENyZWF0ZVBhcnRpdGlvbkluZGV4Q29tbWFuZCh7XG4gICAgICAgIERhdGFiYXNlTmFtZSxcbiAgICAgICAgVGFibGVOYW1lLFxuICAgICAgICBQYXJ0aXRpb25JbmRleDogeyBJbmRleE5hbWUsIEtleXMgfSxcbiAgICAgIH0pKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIC8vIFRoZSBpbmRleCBtYXkgYWxyZWFkeSBleGlzdCBpZiBpdCB3YXMgY3JlYXRlZCBvdXQtb2YtYmFuZCBvciBieSBhIHByZXZpb3VzXG4gICAgICAvLyByZXNvdXJjZSBiZWluZyByZXBsYWNlZCAoQ2xvdWRGb3JtYXRpb24gY3JlYXRlcyB0aGUgcmVwbGFjZW1lbnQgYmVmb3JlIGRlbGV0aW5nXG4gICAgICAvLyB0aGUgb2xkIHJlc291cmNlKS4gVHJlYXQgdGhpcyBhcyBzdWNjZXNzIGFuZCBsZXQgaXNDb21wbGV0ZSB2ZXJpZnkgaXRzIHN0YXRlLlxuICAgICAgaWYgKGUubmFtZSA9PT0gJ0FscmVhZHlFeGlzdHNFeGNlcHRpb24nKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUubG9nKGBQYXJ0aXRpb24gaW5kZXggJHtJbmRleE5hbWV9IGFscmVhZHkgZXhpc3RzIG9uICR7RGF0YWJhc2VOYW1lfS4ke1RhYmxlTmFtZX0gLSByZXVzaW5nIGV4aXN0aW5nIGluZGV4YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBQaHlzaWNhbFJlc291cmNlSWQ6IEluZGV4TmFtZSB9O1xuICB9IGVsc2UgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJykge1xuICAgIGNvbnN0IG9sZEtleXMgPSBldmVudC5PbGRSZXNvdXJjZVByb3BlcnRpZXM/LktleXM7XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KG9sZEtleXMpICE9PSBKU09OLnN0cmluZ2lmeShLZXlzKSkge1xuICAgIC8vIEZvciBhdXRvLWdlbmVyYXRlZCBpbmRleCBuYW1lcywgdGhpcyBzaG91bGQgYmUgdW5yZWFjaGFibGUuIENESyBkZXJpdmVzIGluZGV4IG5hbWVzIGZyb20ga2V5cywgc28ga2V5IGNoYW5nZXMgYWx3YXlzIHByb2R1Y2UgYSBuZXcgcmVzb3VyY2VcbiAgICAgIHRocm93IG5ldyBQYXJ0aXRpb25JbmRleEVycm9yKCdQYXJ0aXRpb24gaW5kZXgga2V5cyBjYW5ub3QgYmUgdXBkYXRlZC4gRGVsZXRlIGFuZCByZWNyZWF0ZSB0aGUgaW5kZXggaW5zdGVhZC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgUGh5c2ljYWxSZXNvdXJjZUlkOiBJbmRleE5hbWUgfTtcbiAgfSBlbHNlIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZ2x1ZS5zZW5kKG5ldyBEZWxldGVQYXJ0aXRpb25JbmRleENvbW1hbmQoe1xuICAgICAgICBEYXRhYmFzZU5hbWUsXG4gICAgICAgIFRhYmxlTmFtZSxcbiAgICAgICAgSW5kZXhOYW1lLFxuICAgICAgfSkpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgaWYgKGUubmFtZSA9PT0gJ0VudGl0eU5vdEZvdW5kRXhjZXB0aW9uJykge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmxvZyhgUGFydGl0aW9uIGluZGV4ICR7SW5kZXhOYW1lfSBub3QgZm91bmQgb24gJHtEYXRhYmFzZU5hbWV9LiR7VGFibGVOYW1lfSAtIG1heSBoYXZlIGJlZW4gZGVsZXRlZCBvdXQtb2YtYmFuZGApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge307XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0NvbXBsZXRlKGV2ZW50OiBhbnkpIHtcbiAgY29uc3QgeyBEYXRhYmFzZU5hbWUsIFRhYmxlTmFtZSwgSW5kZXhOYW1lIH0gPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXM7XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJykge1xuICAgIGNvbnN0IGluZGV4ID0gYXdhaXQgZmluZFBhcnRpdGlvbkluZGV4KERhdGFiYXNlTmFtZSwgVGFibGVOYW1lLCBJbmRleE5hbWUpO1xuICAgIGlmICghaW5kZXggfHwgaW5kZXguSW5kZXhTdGF0dXMgIT09ICdERUxFVElORycpIHtcbiAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IHRydWUgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgSXNDb21wbGV0ZTogZmFsc2UgfTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4ID0gYXdhaXQgZmluZFBhcnRpdGlvbkluZGV4KERhdGFiYXNlTmFtZSwgVGFibGVOYW1lLCBJbmRleE5hbWUpO1xuXG4gIGlmICghaW5kZXgpIHJldHVybiB7IElzQ29tcGxldGU6IGZhbHNlIH07XG4gIGlmIChpbmRleC5JbmRleFN0YXR1cyA9PT0gJ0FDVElWRScpIHJldHVybiB7IElzQ29tcGxldGU6IHRydWUgfTtcbiAgaWYgKGluZGV4LkluZGV4U3RhdHVzID09PSAnQ1JFQVRJTkcnKSByZXR1cm4geyBJc0NvbXBsZXRlOiBmYWxzZSB9O1xuXG4gIGNvbnN0IGVycm9yRGV0YWlscyA9IGluZGV4LkJhY2tmaWxsRXJyb3JzPy5sZW5ndGhcbiAgICA/IGAgQmFja2ZpbGwgZXJyb3JzOiAke0pTT04uc3RyaW5naWZ5KGluZGV4LkJhY2tmaWxsRXJyb3JzKX1gXG4gICAgOiAnJztcbiAgdGhyb3cgbmV3IFBhcnRpdGlvbkluZGV4RXJyb3IoYFBhcnRpdGlvbiBpbmRleCAke0luZGV4TmFtZX0gaW4gdW5leHBlY3RlZCBzdGF0ZTogJHtpbmRleC5JbmRleFN0YXR1c30uJHtlcnJvckRldGFpbHN9YCk7XG59XG4iXX0=