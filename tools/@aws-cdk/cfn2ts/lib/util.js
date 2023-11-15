"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinIf = exports.upcaseFirst = exports.downcaseFirst = void 0;
/**
 * Downcase the first character in a string.
 *
 * @param str the string to be processed.
 */
function downcaseFirst(str) {
    if (str === '') {
        return str;
    }
    return `${str[0].toLocaleLowerCase()}${str.slice(1)}`;
}
exports.downcaseFirst = downcaseFirst;
/**
 * Upcase the first character in a string.
 *
 * @param str the string to be processed.
 */
function upcaseFirst(str) {
    if (str === '') {
        return str;
    }
    return `${str[0].toLocaleUpperCase()}${str.slice(1)}`;
}
exports.upcaseFirst = upcaseFirst;
/**
 * Join two strings with a separator if they're both present, otherwise return the present one
 */
function joinIf(left, sep, right) {
    if (!left) {
        return right || '';
    }
    if (!right) {
        return left || '';
    }
    return left + sep + right;
}
exports.joinIf = joinIf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7R0FJRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxHQUFXO0lBQ3ZDLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDO0tBQUU7SUFDL0IsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN4RCxDQUFDO0FBSEQsc0NBR0M7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLEdBQVc7SUFDckMsSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUM7S0FBRTtJQUMvQixPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3hELENBQUM7QUFIRCxrQ0FHQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsTUFBTSxDQUFDLElBQXdCLEVBQUUsR0FBVyxFQUFFLEtBQXlCO0lBQ3JGLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFBRSxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUM7S0FBRTtJQUNsQyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQUUsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFDO0tBQUU7SUFDbEMsT0FBTyxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUM1QixDQUFDO0FBSkQsd0JBSUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERvd25jYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXIgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHN0ciB0aGUgc3RyaW5nIHRvIGJlIHByb2Nlc3NlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvd25jYXNlRmlyc3Qoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoc3RyID09PSAnJykgeyByZXR1cm4gc3RyOyB9XG4gIHJldHVybiBgJHtzdHJbMF0udG9Mb2NhbGVMb3dlckNhc2UoKX0ke3N0ci5zbGljZSgxKX1gO1xufVxuXG4vKipcbiAqIFVwY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSBzdHIgdGhlIHN0cmluZyB0byBiZSBwcm9jZXNzZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGNhc2VGaXJzdChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChzdHIgPT09ICcnKSB7IHJldHVybiBzdHI7IH1cbiAgcmV0dXJuIGAke3N0clswXS50b0xvY2FsZVVwcGVyQ2FzZSgpfSR7c3RyLnNsaWNlKDEpfWA7XG59XG5cbi8qKlxuICogSm9pbiB0d28gc3RyaW5ncyB3aXRoIGEgc2VwYXJhdG9yIGlmIHRoZXkncmUgYm90aCBwcmVzZW50LCBvdGhlcndpc2UgcmV0dXJuIHRoZSBwcmVzZW50IG9uZVxuICovXG5leHBvcnQgZnVuY3Rpb24gam9pbklmKGxlZnQ6IHN0cmluZyB8IHVuZGVmaW5lZCwgc2VwOiBzdHJpbmcsIHJpZ2h0OiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWxlZnQpIHsgcmV0dXJuIHJpZ2h0IHx8ICcnOyB9XG4gIGlmICghcmlnaHQpIHvCoHJldHVybiBsZWZ0IHx8ICcnOyB9XG4gIHJldHVybiBsZWZ0ICsgc2VwICsgcmlnaHQ7XG59XG4iXX0=