"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warpcastApiClient = exports.neynarClient = exports.WARPCAST_API_KEY = exports.watcherWebhookUrl = exports.watcherWebhookName = exports.watcherWebhookId = exports.FARCASTER_BOT_MNEMONIC = exports.signerUuid = void 0;
const nodejs_sdk_1 = require("@neynar/nodejs-sdk");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
if (!process.env.NEYNAR_API_KEY) {
    throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
}
if (!process.env.SIGNER_UUID) {
    throw new Error("Make sure you set SIGNER_UUID in your .env file");
}
exports.signerUuid = process.env.SIGNER_UUID;
exports.FARCASTER_BOT_MNEMONIC = process.env.FARCASTER_BOT_MNEMONIC;
exports.watcherWebhookId = process.env.WATCHER_WEBHOOK_ID;
exports.watcherWebhookName = "watcher";
exports.watcherWebhookUrl = process.env.WATCHER_WEBHOOK_URL;
exports.WARPCAST_API_KEY = process.env.WARPCAST_API_KEY;
exports.neynarClient = new nodejs_sdk_1.NeynarAPIClient(process.env.NEYNAR_API_KEY);
exports.warpcastApiClient = axios_1.default.create({
    baseURL: "https://api.warpcast.com/v2",
    headers: {
        Authorization: `Bearer ${exports.WARPCAST_API_KEY}`,
        "Content-Type": "application/json",
    },
});
