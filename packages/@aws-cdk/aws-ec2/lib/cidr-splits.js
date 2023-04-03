"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCidrSplits = void 0;
/**
 * Return the splits necessary to allocate the given sequence of cidrs in the given order
 *
 * The entire block is of size 'rootNetmask', and subsequent blocks will be allocated
 * from it sized according to the sizes in the 'netmasks' array.
 *
 * The return value is a list of `CidrSplit` objects, which represent
 * invocations of a pair of `Fn.select(Fn.cidr(...))` operations.
 *
 * Strategy: walk through the IP block space, clipping to the next possible
 * start of a block of the given size, then allocate it. Here is an unrealistic
 * example (with a weird ordering of the netmasks to show how clipping and hence
 * space wasting plays out in practice):
 *
 *                               root space  /16
 * ┌──────────────────────────────────────────────────────────────────────────────────────────────┐
 * │                                                                                              │
 *   A  /21             B  /19
 * ┌───┬───┬───┬───┬───────────────┬───────────────┬───┬───────────┬───────────────┬──────────────┐
 * │ A │ A │ A │###│       B       │       B       │ A │###########│       B       │     ....     │
 * └───┴───┴───┴───┴───────────────┴───────────────┴───┴───────────┴───────────────┴──────────────┘
 *              ^^^______ wasted space _________________^^^^^^
 */
function calculateCidrSplits(rootNetmask, netmasks) {
    const ret = new Array();
    let offset = 0;
    for (const netmask of netmasks) {
        const size = Math.pow(2, 32 - netmask);
        // Clip offset to the next block of the given size
        offset = nextMultiple(offset, size);
        const count = Math.pow(2, netmask - rootNetmask);
        ret.push({
            count,
            netmask,
            index: offset / size,
        });
        // Consume
        offset += size;
    }
    if (offset > Math.pow(2, 32 - rootNetmask)) {
        throw new Error(`IP space of size /${rootNetmask} not big enough to allocate subnets of sizes ${netmasks.map(x => `/${x}`)}`);
    }
    return ret;
}
exports.calculateCidrSplits = calculateCidrSplits;
function nextMultiple(current, multiple) {
    return Math.ceil(current / multiple) * multiple;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lkci1zcGxpdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaWRyLXNwbGl0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLFdBQW1CLEVBQUUsUUFBa0I7SUFDekUsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQWEsQ0FBQztJQUVuQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFFdkMsa0RBQWtEO1FBQ2xELE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXBDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQztRQUNqRCxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1AsS0FBSztZQUNMLE9BQU87WUFDUCxLQUFLLEVBQUUsTUFBTSxHQUFHLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsVUFBVTtRQUNWLE1BQU0sSUFBSSxJQUFJLENBQUM7S0FDaEI7SUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsV0FBVyxDQUFDLEVBQUU7UUFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsV0FBVyxnREFBZ0QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDL0g7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUExQkQsa0RBMEJDO0FBRUQsU0FBUyxZQUFZLENBQUMsT0FBZSxFQUFFLFFBQWdCO0lBQ3JELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQ2xELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJldHVybiB0aGUgc3BsaXRzIG5lY2Vzc2FyeSB0byBhbGxvY2F0ZSB0aGUgZ2l2ZW4gc2VxdWVuY2Ugb2YgY2lkcnMgaW4gdGhlIGdpdmVuIG9yZGVyXG4gKlxuICogVGhlIGVudGlyZSBibG9jayBpcyBvZiBzaXplICdyb290TmV0bWFzaycsIGFuZCBzdWJzZXF1ZW50IGJsb2NrcyB3aWxsIGJlIGFsbG9jYXRlZFxuICogZnJvbSBpdCBzaXplZCBhY2NvcmRpbmcgdG8gdGhlIHNpemVzIGluIHRoZSAnbmV0bWFza3MnIGFycmF5LlxuICpcbiAqIFRoZSByZXR1cm4gdmFsdWUgaXMgYSBsaXN0IG9mIGBDaWRyU3BsaXRgIG9iamVjdHMsIHdoaWNoIHJlcHJlc2VudFxuICogaW52b2NhdGlvbnMgb2YgYSBwYWlyIG9mIGBGbi5zZWxlY3QoRm4uY2lkciguLi4pKWAgb3BlcmF0aW9ucy5cbiAqXG4gKiBTdHJhdGVneTogd2FsayB0aHJvdWdoIHRoZSBJUCBibG9jayBzcGFjZSwgY2xpcHBpbmcgdG8gdGhlIG5leHQgcG9zc2libGVcbiAqIHN0YXJ0IG9mIGEgYmxvY2sgb2YgdGhlIGdpdmVuIHNpemUsIHRoZW4gYWxsb2NhdGUgaXQuIEhlcmUgaXMgYW4gdW5yZWFsaXN0aWNcbiAqIGV4YW1wbGUgKHdpdGggYSB3ZWlyZCBvcmRlcmluZyBvZiB0aGUgbmV0bWFza3MgdG8gc2hvdyBob3cgY2xpcHBpbmcgYW5kIGhlbmNlXG4gKiBzcGFjZSB3YXN0aW5nIHBsYXlzIG91dCBpbiBwcmFjdGljZSk6XG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdCBzcGFjZSAgLzE2XG4gKiDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJBcbiAqIOKUgiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDilIJcbiAqICAgQSAgLzIxICAgICAgICAgICAgIEIgIC8xOVxuICog4pSM4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQXG4gKiDilIIgQSDilIIgQSDilIIgQSDilIIjIyPilIIgICAgICAgQiAgICAgICDilIIgICAgICAgQiAgICAgICDilIIgQSDilIIjIyMjIyMjIyMjI+KUgiAgICAgICBCICAgICAgIOKUgiAgICAgLi4uLiAgICAg4pSCXG4gKiDilJTilIDilIDilIDilLTilIDilIDilIDilLTilIDilIDilIDilLTilIDilIDilIDilLTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLTilIDilIDilIDilLTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJhcbiAqICAgICAgICAgICAgICBeXl5fX19fX18gd2FzdGVkIHNwYWNlIF9fX19fX19fX19fX19fX19fXl5eXl5eXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVDaWRyU3BsaXRzKHJvb3ROZXRtYXNrOiBudW1iZXIsIG5ldG1hc2tzOiBudW1iZXJbXSk6IENpZHJTcGxpdFtdIHtcbiAgY29uc3QgcmV0ID0gbmV3IEFycmF5PENpZHJTcGxpdD4oKTtcblxuICBsZXQgb2Zmc2V0ID0gMDtcbiAgZm9yIChjb25zdCBuZXRtYXNrIG9mIG5ldG1hc2tzKSB7XG4gICAgY29uc3Qgc2l6ZSA9IE1hdGgucG93KDIsIDMyIC0gbmV0bWFzayk7XG5cbiAgICAvLyBDbGlwIG9mZnNldCB0byB0aGUgbmV4dCBibG9jayBvZiB0aGUgZ2l2ZW4gc2l6ZVxuICAgIG9mZnNldCA9IG5leHRNdWx0aXBsZShvZmZzZXQsIHNpemUpO1xuXG4gICAgY29uc3QgY291bnQgPSBNYXRoLnBvdygyLCBuZXRtYXNrIC0gcm9vdE5ldG1hc2spO1xuICAgIHJldC5wdXNoKHtcbiAgICAgIGNvdW50LFxuICAgICAgbmV0bWFzayxcbiAgICAgIGluZGV4OiBvZmZzZXQgLyBzaXplLFxuICAgIH0pO1xuXG4gICAgLy8gQ29uc3VtZVxuICAgIG9mZnNldCArPSBzaXplO1xuICB9XG5cbiAgaWYgKG9mZnNldCA+IE1hdGgucG93KDIsIDMyIC0gcm9vdE5ldG1hc2spKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJUCBzcGFjZSBvZiBzaXplIC8ke3Jvb3ROZXRtYXNrfSBub3QgYmlnIGVub3VnaCB0byBhbGxvY2F0ZSBzdWJuZXRzIG9mIHNpemVzICR7bmV0bWFza3MubWFwKHggPT4gYC8ke3h9YCl9YCk7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBuZXh0TXVsdGlwbGUoY3VycmVudDogbnVtYmVyLCBtdWx0aXBsZTogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLmNlaWwoY3VycmVudCAvIG11bHRpcGxlKSAqIG11bHRpcGxlO1xufVxuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgYSBwYWlyIG9mIGBGbi5zZWxlY3QoRm4uY2lkcigpKWAgaW52b2NhdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDaWRyU3BsaXQge1xuICAvKipcbiAgICogVGhlIG5ldG1hc2sgb2YgdGhpcyBibG9jayBzaXplXG4gICAqXG4gICAqIFRoaXMgaXMgdGhlIGludmVyc2UgbnVtYmVyIG9mIHdoYXQgeW91IG5lZWQgdG8gcGFzcyB0byBGbi5jaWRyIChwYXNzIGAzMiAtXG4gICAqIG5ldG1hc2tgIHRvIEZuLmNpZHIpYC5cbiAgICovXG4gIHJlYWRvbmx5IG5ldG1hc2s6IG51bWJlcjtcblxuICAvKipcbiAgICogSG93IG1hbnkgcGFydHMgdGhlIG1hc2sgbmVlZHMgdG8gYmUgc3BsaXQgaW50b1xuICAgKi9cbiAgcmVhZG9ubHkgY291bnQ6IG51bWJlcjtcblxuICAvKipcbiAgICogV2hhdCBzdWJuZXQgaW5kZXggdG8gc2VsZWN0IGZyb20gdGhlIHNwbGl0XG4gICAqL1xuICByZWFkb25seSBpbmRleDogbnVtYmVyO1xufSJdfQ==