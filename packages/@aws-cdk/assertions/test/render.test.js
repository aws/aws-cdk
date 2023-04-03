"use strict";
/**
 * Snapshot tests to assert that the rendering styles of the deep mismatch rendering make sense
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const CASES = [
    //////////////////////////////////////////////////////////////////////
    {
        name: 'Match.objectLike with mismatched string value',
        target: {
            Value: 'Balue',
            Other: 'Other',
        },
        matcher: lib_1.Match.objectLike({
            Value: 'Value',
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'Deep Match.objectLike with mismatched string value',
        target: {
            Deep: {
                Value: 'Balue',
                Other: 'Other',
            },
        },
        matcher: lib_1.Match.objectLike({
            Deep: {
                Value: 'Value',
            },
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'Match.objectEquals with unexpected key',
        target: {
            Value: 'Value',
            Other: 'Other',
        },
        matcher: lib_1.Match.objectEquals({
            Value: 'Value',
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'Match.objectEquals with missing key',
        target: {},
        matcher: lib_1.Match.objectEquals({
            Value: 'Value',
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'Match.objectLike looking for absent key',
        target: {
            Value: 'Value',
        },
        matcher: lib_1.Match.objectEquals({
            Value: lib_1.Match.absent(),
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'Abridged rendering of uninteresting keys (showing Other)',
        target: {
            Other: { OneKey: 'Visible' },
            Value: 'Value',
        },
        matcher: lib_1.Match.objectLike({
            Value: 'Balue',
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'Abridged rendering of uninteresting keys (hiding Other)',
        target: {
            Other: { OneKey: 'Visible', TooMany: 'Keys' },
            Value: 'Value',
        },
        matcher: lib_1.Match.objectLike({
            Value: 'Balue',
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'Encodedjson matcher',
        target: {
            Json: JSON.stringify({
                Value: 'Value',
            }),
        },
        matcher: lib_1.Match.objectLike({
            Json: lib_1.Match.serializedJson({
                Value: 'Balue',
            }),
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'ArrayWith matcher',
        note: 'Most entries should be collapsed but at least one should for a deep comparison',
        target: {
            List: [
                { Value: '1', MakeItBig: true },
                { Value: '2', MakeItBig: true },
                { Value: '3', MakeItBig: true },
                { Value: '4', MakeItBig: true },
            ],
        },
        matcher: lib_1.Match.objectLike({
            List: lib_1.Match.arrayWith([
                lib_1.Match.objectLike({ Value: '5' }),
            ]),
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'ArrayWith partial match',
        note: 'Most entries should be collapsed but at least one should for a deep comparison, and should show a place for previous matches',
        target: {
            List: [
                { Value: '1', MakeItBig: true },
                { Value: '2', MakeItBig: true },
                { Value: '3', MakeItBig: true },
                { Value: '4', MakeItBig: true },
            ],
        },
        matcher: lib_1.Match.objectLike({
            List: lib_1.Match.arrayWith([
                lib_1.Match.objectLike({ Value: '2' }),
                lib_1.Match.objectLike({ Value: '5' }),
            ]),
        }),
    },
    //////////////////////////////////////////////////////////////////////
    {
        name: 'ArrayWith out-of-order match',
        target: [5, 3],
        matcher: lib_1.Match.arrayWith([3, 5]),
    },
];
CASES.forEach(c => {
    test(c.name, () => {
        const result = c.matcher.test(c.target);
        expect(`${c.note ?? ''}\n${result.renderMismatch()}`).toMatchSnapshot();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZW5kZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsZ0NBQXdDO0FBU3hDLE1BQU0sS0FBSyxHQUFXO0lBQ3BCLHNFQUFzRTtJQUN0RTtRQUNFLElBQUksRUFBRSwrQ0FBK0M7UUFDckQsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFLE9BQU87WUFDZCxLQUFLLEVBQUUsT0FBTztTQUNmO1FBQ0QsT0FBTyxFQUFFLFdBQUssQ0FBQyxVQUFVLENBQUM7WUFDeEIsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDO0tBQ0g7SUFDRCxzRUFBc0U7SUFDdEU7UUFDRSxJQUFJLEVBQUUsb0RBQW9EO1FBQzFELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsT0FBTztnQkFDZCxLQUFLLEVBQUUsT0FBTzthQUNmO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsV0FBSyxDQUFDLFVBQVUsQ0FBQztZQUN4QixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLE9BQU87YUFDZjtTQUNGLENBQUM7S0FDSDtJQUNELHNFQUFzRTtJQUN0RTtRQUNFLElBQUksRUFBRSx3Q0FBd0M7UUFDOUMsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFLE9BQU87WUFDZCxLQUFLLEVBQUUsT0FBTztTQUNmO1FBQ0QsT0FBTyxFQUFFLFdBQUssQ0FBQyxZQUFZLENBQUM7WUFDMUIsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDO0tBQ0g7SUFDRCxzRUFBc0U7SUFDdEU7UUFDRSxJQUFJLEVBQUUscUNBQXFDO1FBQzNDLE1BQU0sRUFBRSxFQUNQO1FBQ0QsT0FBTyxFQUFFLFdBQUssQ0FBQyxZQUFZLENBQUM7WUFDMUIsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDO0tBQ0g7SUFDRCxzRUFBc0U7SUFDdEU7UUFDRSxJQUFJLEVBQUUseUNBQXlDO1FBQy9DLE1BQU0sRUFBRTtZ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QU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDZCxPQUFPLEVBQUUsV0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNqQztDQUNGLENBQUM7QUFFRixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUNoQixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLEtBQUssTUFBTSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMxRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTbmFwc2hvdCB0ZXN0cyB0byBhc3NlcnQgdGhhdCB0aGUgcmVuZGVyaW5nIHN0eWxlcyBvZiB0aGUgZGVlcCBtaXNtYXRjaCByZW5kZXJpbmcgbWFrZSBzZW5zZVxuICovXG5cbmltcG9ydCB7IE1hdGNoZXIsIE1hdGNoIH0gZnJvbSAnLi4vbGliJztcblxuaW50ZXJmYWNlIENhc2Uge1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IG5vdGU/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IG1hdGNoZXI6IE1hdGNoZXI7XG4gIHJlYWRvbmx5IHRhcmdldDogYW55O1xufVxuXG5jb25zdCBDQVNFUzogQ2FzZVtdID0gW1xuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIHtcbiAgICBuYW1lOiAnTWF0Y2gub2JqZWN0TGlrZSB3aXRoIG1pc21hdGNoZWQgc3RyaW5nIHZhbHVlJyxcbiAgICB0YXJnZXQ6IHtcbiAgICAgIFZhbHVlOiAnQmFsdWUnLFxuICAgICAgT3RoZXI6ICdPdGhlcicsXG4gICAgfSxcbiAgICBtYXRjaGVyOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgIFZhbHVlOiAnVmFsdWUnLFxuICAgIH0pLFxuICB9LFxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIHtcbiAgICBuYW1lOiAnRGVlcCBNYXRjaC5vYmplY3RMaWtlIHdpdGggbWlzbWF0Y2hlZCBzdHJpbmcgdmFsdWUnLFxuICAgIHRhcmdldDoge1xuICAgICAgRGVlcDoge1xuICAgICAgICBWYWx1ZTogJ0JhbHVlJyxcbiAgICAgICAgT3RoZXI6ICdPdGhlcicsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbWF0Y2hlcjogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICBEZWVwOiB7XG4gICAgICAgIFZhbHVlOiAnVmFsdWUnLFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSxcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICB7XG4gICAgbmFtZTogJ01hdGNoLm9iamVjdEVxdWFscyB3aXRoIHVuZXhwZWN0ZWQga2V5JyxcbiAgICB0YXJnZXQ6IHtcbiAgICAgIFZhbHVlOiAnVmFsdWUnLFxuICAgICAgT3RoZXI6ICdPdGhlcicsXG4gICAgfSxcbiAgICBtYXRjaGVyOiBNYXRjaC5vYmplY3RFcXVhbHMoe1xuICAgICAgVmFsdWU6ICdWYWx1ZScsXG4gICAgfSksXG4gIH0sXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAge1xuICAgIG5hbWU6ICdNYXRjaC5vYmplY3RFcXVhbHMgd2l0aCBtaXNzaW5nIGtleScsXG4gICAgdGFyZ2V0OiB7XG4gICAgfSxcbiAgICBtYXRjaGVyOiBNYXRjaC5vYmplY3RFcXVhbHMoe1xuICAgICAgVmFsdWU6ICdWYWx1ZScsXG4gICAgfSksXG4gIH0sXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAge1xuICAgIG5hbWU6ICdNYXRjaC5vYmplY3RMaWtlIGxvb2tpbmcgZm9yIGFic2VudCBrZXknLFxuICAgIHRhcmdldDoge1xuICAgICAgVmFsdWU6ICdWYWx1ZScsXG4gICAgfSxcbiAgICBtYXRjaGVyOiBNYXRjaC5vYmplY3RFcXVhbHMoe1xuICAgICAgVmFsdWU6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pLFxuICB9LFxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIHtcbiAgICBuYW1lOiAnQWJyaWRnZWQgcmVuZGVyaW5nIG9mIHVuaW50ZXJlc3Rpbmcga2V5cyAoc2hvd2luZyBPdGhlciknLFxuICAgIHRhcmdldDoge1xuICAgICAgT3RoZXI6IHsgT25lS2V5OiAnVmlzaWJsZScgfSxcbiAgICAgIFZhbHVlOiAnVmFsdWUnLFxuICAgIH0sXG4gICAgbWF0Y2hlcjogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICBWYWx1ZTogJ0JhbHVlJyxcbiAgICB9KSxcbiAgfSxcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICB7XG4gICAgbmFtZTogJ0FicmlkZ2VkIHJlbmRlcmluZyBvZiB1bmludGVyZXN0aW5nIGtleXMgKGhpZGluZyBPdGhlciknLFxuICAgIHRhcmdldDoge1xuICAgICAgT3RoZXI6IHsgT25lS2V5OiAnVmlzaWJsZScsIFRvb01hbnk6ICdLZXlzJyB9LFxuICAgICAgVmFsdWU6ICdWYWx1ZScsXG4gICAgfSxcbiAgICBtYXRjaGVyOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgIFZhbHVlOiAnQmFsdWUnLFxuICAgIH0pLFxuICB9LFxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIHtcbiAgICBuYW1lOiAnRW5jb2RlZGpzb24gbWF0Y2hlcicsXG4gICAgdGFyZ2V0OiB7XG4gICAgICBKc29uOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIFZhbHVlOiAnVmFsdWUnLFxuICAgICAgfSksXG4gICAgfSxcbiAgICBtYXRjaGVyOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgIEpzb246IE1hdGNoLnNlcmlhbGl6ZWRKc29uKHtcbiAgICAgICAgVmFsdWU6ICdCYWx1ZScsXG4gICAgICB9KSxcbiAgICB9KSxcbiAgfSxcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICB7XG4gICAgbmFtZTogJ0FycmF5V2l0aCBtYXRjaGVyJyxcbiAgICBub3RlOiAnTW9zdCBlbnRyaWVzIHNob3VsZCBiZSBjb2xsYXBzZWQgYnV0IGF0IGxlYXN0IG9uZSBzaG91bGQgZm9yIGEgZGVlcCBjb21wYXJpc29uJyxcbiAgICB0YXJnZXQ6IHtcbiAgICAgIExpc3Q6IFtcbiAgICAgICAgeyBWYWx1ZTogJzEnLCBNYWtlSXRCaWc6IHRydWUgfSxcbiAgICAgICAgeyBWYWx1ZTogJzInLCBNYWtlSXRCaWc6IHRydWUgfSxcbiAgICAgICAgeyBWYWx1ZTogJzMnLCBNYWtlSXRCaWc6IHRydWUgfSxcbiAgICAgICAgeyBWYWx1ZTogJzQnLCBNYWtlSXRCaWc6IHRydWUgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBtYXRjaGVyOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgIExpc3Q6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2UoeyBWYWx1ZTogJzUnIH0pLFxuICAgICAgXSksXG4gICAgfSksXG4gIH0sXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAge1xuICAgIG5hbWU6ICdBcnJheVdpdGggcGFydGlhbCBtYXRjaCcsXG4gICAgbm90ZTogJ01vc3QgZW50cmllcyBzaG91bGQgYmUgY29sbGFwc2VkIGJ1dCBhdCBsZWFzdCBvbmUgc2hvdWxkIGZvciBhIGRlZXAgY29tcGFyaXNvbiwgYW5kIHNob3VsZCBzaG93IGEgcGxhY2UgZm9yIHByZXZpb3VzIG1hdGNoZXMnLFxuICAgIHRhcmdldDoge1xuICAgICAgTGlzdDogW1xuICAgICAgICB7IFZhbHVlOiAnMScsIE1ha2VJdEJpZzogdHJ1ZSB9LFxuICAgICAgICB7IFZhbHVlOiAnMicsIE1ha2VJdEJpZzogdHJ1ZSB9LFxuICAgICAgICB7IFZhbHVlOiAnMycsIE1ha2VJdEJpZzogdHJ1ZSB9LFxuICAgICAgICB7IFZhbHVlOiAnNCcsIE1ha2VJdEJpZzogdHJ1ZSB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIG1hdGNoZXI6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgTGlzdDogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7IFZhbHVlOiAnMicgfSksXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2UoeyBWYWx1ZTogJzUnIH0pLFxuICAgICAgXSksXG4gICAgfSksXG4gIH0sXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAge1xuICAgIG5hbWU6ICdBcnJheVdpdGggb3V0LW9mLW9yZGVyIG1hdGNoJyxcbiAgICB0YXJnZXQ6IFs1LCAzXSxcbiAgICBtYXRjaGVyOiBNYXRjaC5hcnJheVdpdGgoWzMsIDVdKSxcbiAgfSxcbl07XG5cbkNBU0VTLmZvckVhY2goYyA9PiB7XG4gIHRlc3QoYy5uYW1lLCAoKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYy5tYXRjaGVyLnRlc3QoYy50YXJnZXQpO1xuICAgIGV4cGVjdChgJHtjLm5vdGUgPz8gJyd9XFxuJHtyZXN1bHQucmVuZGVyTWlzbWF0Y2goKX1gKS50b01hdGNoU25hcHNob3QoKTtcbiAgfSk7XG59KTsiXX0=