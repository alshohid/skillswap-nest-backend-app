"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get PUBLIC_KEY () {
        return PUBLIC_KEY;
    },
    get Public () {
        return Public;
    }
});
const _common = require("@nestjs/common");
const PUBLIC_KEY = 'isPublic';
const Public = ()=>(0, _common.SetMetadata)(PUBLIC_KEY, true);

//# sourceMappingURL=public.guard.js.map