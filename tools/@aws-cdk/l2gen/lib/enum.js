"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enum = void 0;
const generatable_1 = require("./generatable");
const type_1 = require("./type");
const cm2_1 = require("./cm2");
const source_module_1 = require("./source-module");
class Enum {
    constructor(enumName) {
        this.enumName = enumName;
        this.members = new Array();
        this.typeRefName = enumName;
        this.definingModule = new source_module_1.SourceFile(generatable_1.fileFor(this.typeRefName));
    }
    addMember(props) {
        this.members.push(props);
        return {
            type: this,
            toString: () => {
                return `${this.typeRefName}.${props.name}`;
            },
            render: (code) => {
                code.add(this, '.', props.name);
            }
        };
    }
    generateFiles() {
        const code = new cm2_1.CM2(generatable_1.fileFor(this.enumName));
        code.openBlock(`export enum ${this.enumName}`);
        for (const mem of this.members) {
            code.docBlock([
                mem.summary,
                '',
                mem.details ?? '',
            ]);
            code.line(`${mem.name},`);
        }
        code.closeBlock();
        return [code];
    }
    render(code) {
        return type_1.standardTypeRender(this, code);
    }
    diagnostics() {
        return [];
    }
}
exports.Enum = Enum;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXNEO0FBQ3RELGlDQUFtRDtBQUNuRCwrQkFBNEI7QUFFNUIsbURBQTREO0FBRTVELE1BQWEsSUFBSTtJQUtmLFlBQTRCLFFBQWdCO1FBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFGM0IsWUFBTyxHQUFHLElBQUksS0FBSyxFQUFlLENBQUM7UUFHbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLDBCQUFVLENBQUMscUJBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU0sU0FBUyxDQUFDLEtBQWtCO1FBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLE9BQU87WUFDTCxJQUFJLEVBQUUsSUFBSTtZQUNWLFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0JBQ2IsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzdDLENBQUM7WUFDRCxNQUFNLEVBQUUsQ0FBQyxJQUFTLEVBQUUsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxhQUFhO1FBQ1gsTUFBTSxJQUFJLEdBQUcsSUFBSSxTQUFHLENBQUMscUJBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDL0MsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ1osR0FBRyxDQUFDLE9BQU87Z0JBQ1gsRUFBRTtnQkFDRixHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUU7YUFDbEIsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRU0sTUFBTSxDQUFDLElBQVM7UUFDckIsT0FBTyx5QkFBa0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0NBQ0Y7QUE5Q0Qsb0JBOENDIn0=