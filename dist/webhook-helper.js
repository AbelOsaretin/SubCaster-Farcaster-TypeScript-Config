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
exports.addSubscribesToWebhook = void 0;
const config_1 = require("./config");
const addSubscribesToWebhook = (fid) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const data = yield config_1.neynarClient.lookupWebhook(config_1.watcherWebhookId);
        const oldSubscribes = ((_c = (_b = (_a = data.webhook) === null || _a === void 0 ? void 0 : _a.subscription) === null || _b === void 0 ? void 0 : _b.filters["cast.created"]) === null || _c === void 0 ? void 0 : _c.author_fids) || [];
        if (!oldSubscribes.includes(fid)) {
            oldSubscribes.push(fid);
            yield config_1.neynarClient.updateWebhook(config_1.watcherWebhookId, config_1.watcherWebhookName, config_1.watcherWebhookUrl, {
                subscription: {
                    "cast.created": {
                        author_fids: oldSubscribes,
                    },
                },
            });
            console.log("Subscribes added to webhook:", fid);
        }
        else {
            console.log("Subscribes already added to webhook:", fid);
        }
    }
    catch (error) {
        console.error("Error adding subscribes to webhook:", error);
    }
});
exports.addSubscribesToWebhook = addSubscribesToWebhook;
