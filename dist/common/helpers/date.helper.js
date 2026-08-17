"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
class DateHelper {
    static now() {
        return new Date().toISOString();
    }
    static toSqlTimestamp(date) {
        return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    }
    static format(date) {
        return new Date(date).toISOString().replace(/\.\d{3}Z$/, 'Z');
    }
}
exports.DateHelper = DateHelper;
//# sourceMappingURL=date.helper.js.map