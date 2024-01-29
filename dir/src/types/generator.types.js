"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GeneratorTypes;
(function (GeneratorTypes) {
    ;
    var SyntaxError = /** @class */ (function (_super) {
        __extends(SyntaxError, _super);
        function SyntaxError(message, info) {
            return _super.call(this, "".concat(message, ". (line: ").concat(info.line, ", char: ").concat(info.char, ")")) || this;
        }
        ;
        return SyntaxError;
    }(Error));
    GeneratorTypes.SyntaxError = SyntaxError;
    ;
    var LexerError = /** @class */ (function (_super) {
        __extends(LexerError, _super);
        function LexerError(message) {
            return _super.call(this, message) || this;
        }
        ;
        return LexerError;
    }(Error));
    GeneratorTypes.LexerError = LexerError;
    ;
})(GeneratorTypes || (GeneratorTypes = {}));
;
exports.default = GeneratorTypes;
