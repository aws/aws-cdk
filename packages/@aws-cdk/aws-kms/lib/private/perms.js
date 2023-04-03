"use strict";
// https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFY_HMAC_ACTIONS = exports.GENERATE_HMAC_ACTIONS = exports.DECRYPT_ACTIONS = exports.ENCRYPT_ACTIONS = exports.ADMIN_ACTIONS = void 0;
exports.ADMIN_ACTIONS = [
    'kms:Create*',
    'kms:Describe*',
    'kms:Enable*',
    'kms:List*',
    'kms:Put*',
    'kms:Update*',
    'kms:Revoke*',
    'kms:Disable*',
    'kms:Get*',
    'kms:Delete*',
    'kms:TagResource',
    'kms:UntagResource',
    'kms:ScheduleKeyDeletion',
    'kms:CancelKeyDeletion',
];
exports.ENCRYPT_ACTIONS = [
    'kms:Encrypt',
    'kms:ReEncrypt*',
    'kms:GenerateDataKey*',
];
exports.DECRYPT_ACTIONS = [
    'kms:Decrypt',
];
exports.GENERATE_HMAC_ACTIONS = [
    'kms:GenerateMac',
];
exports.VERIFY_HMAC_ACTIONS = [
    'kms:VerifyMac',
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEVBQTBFOzs7QUFFN0QsUUFBQSxhQUFhLEdBQUc7SUFDM0IsYUFBYTtJQUNiLGVBQWU7SUFDZixhQUFhO0lBQ2IsV0FBVztJQUNYLFVBQVU7SUFDVixhQUFhO0lBQ2IsYUFBYTtJQUNiLGNBQWM7SUFDZCxVQUFVO0lBQ1YsYUFBYTtJQUNiLGlCQUFpQjtJQUNqQixtQkFBbUI7SUFDbkIseUJBQXlCO0lBQ3pCLHVCQUF1QjtDQUN4QixDQUFDO0FBRVcsUUFBQSxlQUFlLEdBQUc7SUFDN0IsYUFBYTtJQUNiLGdCQUFnQjtJQUNoQixzQkFBc0I7Q0FDdkIsQ0FBQztBQUVXLFFBQUEsZUFBZSxHQUFHO0lBQzdCLGFBQWE7Q0FDZCxDQUFDO0FBRVcsUUFBQSxxQkFBcUIsR0FBRztJQUNuQyxpQkFBaUI7Q0FDbEIsQ0FBQztBQUVXLFFBQUEsbUJBQW1CLEdBQUc7SUFDakMsZUFBZTtDQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2ttcy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUva2V5LXBvbGljaWVzLmh0bWxcblxuZXhwb3J0IGNvbnN0IEFETUlOX0FDVElPTlMgPSBbXG4gICdrbXM6Q3JlYXRlKicsXG4gICdrbXM6RGVzY3JpYmUqJyxcbiAgJ2ttczpFbmFibGUqJyxcbiAgJ2ttczpMaXN0KicsXG4gICdrbXM6UHV0KicsXG4gICdrbXM6VXBkYXRlKicsXG4gICdrbXM6UmV2b2tlKicsXG4gICdrbXM6RGlzYWJsZSonLFxuICAna21zOkdldConLFxuICAna21zOkRlbGV0ZSonLFxuICAna21zOlRhZ1Jlc291cmNlJyxcbiAgJ2ttczpVbnRhZ1Jlc291cmNlJyxcbiAgJ2ttczpTY2hlZHVsZUtleURlbGV0aW9uJyxcbiAgJ2ttczpDYW5jZWxLZXlEZWxldGlvbicsXG5dO1xuXG5leHBvcnQgY29uc3QgRU5DUllQVF9BQ1RJT05TID0gW1xuICAna21zOkVuY3J5cHQnLFxuICAna21zOlJlRW5jcnlwdConLFxuICAna21zOkdlbmVyYXRlRGF0YUtleSonLFxuXTtcblxuZXhwb3J0IGNvbnN0IERFQ1JZUFRfQUNUSU9OUyA9IFtcbiAgJ2ttczpEZWNyeXB0Jyxcbl07XG5cbmV4cG9ydCBjb25zdCBHRU5FUkFURV9ITUFDX0FDVElPTlMgPSBbXG4gICdrbXM6R2VuZXJhdGVNYWMnLFxuXTtcblxuZXhwb3J0IGNvbnN0IFZFUklGWV9ITUFDX0FDVElPTlMgPSBbXG4gICdrbXM6VmVyaWZ5TWFjJyxcbl07Il19