"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeModule = void 0;
const os = require("os");
const path = require("path");
const fs = require("fs-extra");
class FakeModule {
    constructor(props = {}) {
        this.props = props;
        this.cleanedUp = false;
    }
    async tmpdir() {
        var _a;
        if (this.cleanedUp) {
            throw new Error('Cannot re-create cleaned up fake module');
        }
        if (!this._tmpdir) {
            this._tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'pkglint-rules-test-'));
            for (const [key, value] of Object.entries((_a = this.props.files) !== null && _a !== void 0 ? _a : {})) {
                await fs.mkdirp(path.join(this._tmpdir, path.dirname(key)));
                const toWrite = typeof value === 'string' ? value : JSON.stringify(value);
                await fs.writeFile(path.join(this._tmpdir, key), toWrite, { encoding: 'utf8' });
            }
        }
        return this._tmpdir;
    }
    async cleanup() {
        if (!this.cleanedUp && this._tmpdir) {
            await fs.emptyDir(this._tmpdir);
            await fs.rmdir(this._tmpdir);
        }
        this.cleanedUp = true;
    }
}
exports.FakeModule = FakeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmYWtlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtCQUErQjtBQVkvQixNQUFhLFVBQVU7SUFJckIsWUFBNkIsUUFBeUIsRUFBRTtRQUEzQixVQUFLLEdBQUwsS0FBSyxDQUFzQjtRQUZoRCxjQUFTLEdBQVksS0FBSyxDQUFDO0lBR25DLENBQUM7SUFFTSxLQUFLLENBQUMsTUFBTTs7UUFDakIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztTQUM1RDtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQztZQUMvRSxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sT0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssbUNBQUksRUFBRSxDQUFDLEVBQUU7Z0JBQ2pFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sT0FBTyxHQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxRSxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQ2pGO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDbkMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBN0JELGdDQTZCQyJ9