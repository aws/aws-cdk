"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.meta = void 0;
const is_prod_file_1 = require("../private/is-prod-file");
exports.meta = {
    messages: {
        hardcodedArn: 'There are more partitions than just \'aws\'. Silence this message if you are sure this is safe, or switch to using \'Aws.PARTITION\'',
    },
};
function create(context) {
    return {
        // `node` is a type from @typescript-eslint/typescript-estree, but using 'any' for now
        // since it's incompatible with eslint.Rule namespace. Waiting for better compatibility in
        // https://github.com/typescript-eslint/typescript-eslint/tree/1765a178e456b152bd48192eb5db7e8541e2adf2/packages/experimental-utils#note
        // Meanwhile, use a debugger to explore the AST node.
        Literal(node) {
            if (!(0, is_prod_file_1.isProdFile)(context.getFilename())) {
                return;
            }
            if (typeof node.value === 'string' && node.value.includes('arn:aws:')) {
                context.report({ node, messageId: 'hardcodedArn' });
            }
        },
        TemplateLiteral(node) {
            if (!(0, is_prod_file_1.isProdFile)(context.getFilename())) {
                return;
            }
            for (const quasi of node.quasis) {
                const value = quasi.value.cooked;
                if (typeof value === 'string' && value.includes('arn:aws:')) {
                    context.report({ node: quasi, messageId: 'hardcodedArn' });
                }
            }
        }
    };
}
exports.create = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tbGl0ZXJhbC1wYXJ0aXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuby1saXRlcmFsLXBhcnRpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwwREFBcUQ7QUFFeEMsUUFBQSxJQUFJLEdBQUc7SUFDbEIsUUFBUSxFQUFFO1FBQ1IsWUFBWSxFQUFFLHNJQUFzSTtLQUNySjtDQUNGLENBQUM7QUFFRixTQUFnQixNQUFNLENBQUMsT0FBeUI7SUFDOUMsT0FBTztRQUVMLHNGQUFzRjtRQUN0RiwwRkFBMEY7UUFDMUYsd0lBQXdJO1FBQ3hJLHFEQUFxRDtRQUVyRCxPQUFPLENBQUMsSUFBUztZQUNmLElBQUksQ0FBQyxJQUFBLHlCQUFVLEVBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDdkMsT0FBTztZQUNULENBQUM7WUFFRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDdEUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0gsQ0FBQztRQUVELGVBQWUsQ0FBQyxJQUFTO1lBQ3ZCLElBQUksQ0FBQyxJQUFBLHlCQUFVLEVBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDdkMsT0FBTztZQUNULENBQUM7WUFDRCxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDaEMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBRWpDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztvQkFDNUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzdELENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztLQUNGLENBQUE7QUFDSCxDQUFDO0FBL0JELHdCQStCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnO1xuaW1wb3J0IHsgaXNQcm9kRmlsZSB9IGZyb20gJy4uL3ByaXZhdGUvaXMtcHJvZC1maWxlJztcblxuZXhwb3J0IGNvbnN0IG1ldGEgPSB7XG4gIG1lc3NhZ2VzOiB7XG4gICAgaGFyZGNvZGVkQXJuOiAnVGhlcmUgYXJlIG1vcmUgcGFydGl0aW9ucyB0aGFuIGp1c3QgXFwnYXdzXFwnLiBTaWxlbmNlIHRoaXMgbWVzc2FnZSBpZiB5b3UgYXJlIHN1cmUgdGhpcyBpcyBzYWZlLCBvciBzd2l0Y2ggdG8gdXNpbmcgXFwnQXdzLlBBUlRJVElPTlxcJycsXG4gIH0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKGNvbnRleHQ6IFJ1bGUuUnVsZUNvbnRleHQpOiBSdWxlLk5vZGVMaXN0ZW5lciB7XG4gIHJldHVybiB7XG5cbiAgICAvLyBgbm9kZWAgaXMgYSB0eXBlIGZyb20gQHR5cGVzY3JpcHQtZXNsaW50L3R5cGVzY3JpcHQtZXN0cmVlLCBidXQgdXNpbmcgJ2FueScgZm9yIG5vd1xuICAgIC8vIHNpbmNlIGl0J3MgaW5jb21wYXRpYmxlIHdpdGggZXNsaW50LlJ1bGUgbmFtZXNwYWNlLiBXYWl0aW5nIGZvciBiZXR0ZXIgY29tcGF0aWJpbGl0eSBpblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90eXBlc2NyaXB0LWVzbGludC90eXBlc2NyaXB0LWVzbGludC90cmVlLzE3NjVhMTc4ZTQ1NmIxNTJiZDQ4MTkyZWI1ZGI3ZTg1NDFlMmFkZjIvcGFja2FnZXMvZXhwZXJpbWVudGFsLXV0aWxzI25vdGVcbiAgICAvLyBNZWFud2hpbGUsIHVzZSBhIGRlYnVnZ2VyIHRvIGV4cGxvcmUgdGhlIEFTVCBub2RlLlxuXG4gICAgTGl0ZXJhbChub2RlOiBhbnkpIHtcbiAgICAgIGlmICghaXNQcm9kRmlsZShjb250ZXh0LmdldEZpbGVuYW1lKCkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlLnZhbHVlID09PSAnc3RyaW5nJyAmJiBub2RlLnZhbHVlLmluY2x1ZGVzKCdhcm46YXdzOicpKSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZSwgbWVzc2FnZUlkOiAnaGFyZGNvZGVkQXJuJyB9KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgVGVtcGxhdGVMaXRlcmFsKG5vZGU6IGFueSkge1xuICAgICAgaWYgKCFpc1Byb2RGaWxlKGNvbnRleHQuZ2V0RmlsZW5hbWUoKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBxdWFzaSBvZiBub2RlLnF1YXNpcykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHF1YXNpLnZhbHVlLmNvb2tlZDtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5pbmNsdWRlcygnYXJuOmF3czonKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZTogcXVhc2ksIG1lc3NhZ2VJZDogJ2hhcmRjb2RlZEFybicgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==