"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const command_1 = require("./utils/command");
exports.setResult = (message) => {
    core_1.setOutput('message', message);
    const envName = core_1.getInput('SET_ENV_NAME');
    if (envName) {
        core_1.exportVariable(envName, message);
    }
};
exports.dumpResult = (message, logger) => {
    logger.startProcess('Dump output');
    console.log('message: ', message);
    logger.endProcess();
};
exports.execute = (logger, context) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield command_1.getCommitMessage(context);
    exports.setResult(message);
    exports.dumpResult(message, logger);
});
