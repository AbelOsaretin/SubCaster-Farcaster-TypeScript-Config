"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.startPolling = startPolling;
const nodejs_sdk_1 = require("@neynar/nodejs-sdk");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let allNotifications = [];
// make sure to set your NEYNAR_API_KEY in .env
const client = new nodejs_sdk_1.NeynarAPIClient(process.env.Neynar_Api_Key);
// fetch info about a Farcaster user
const fid = 671935;
function fetchUserMentions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield client.fetchMentionAndReplyNotifications(fid);
            const notifications = user.result.notifications;
            const filteredNotifications = notifications
                .filter((notification) => notification.type === "cast-mention")
                .map((notification) => {
                return {
                    type: notification.type,
                    timestamp: notification.timestamp,
                    authorFid: notification.author.fid,
                    parentAuthorFid: notification.parentAuthor.fid,
                };
            });
            const newNotification = filteredNotifications; // Display filtered results as JSON with indentation
            if (newNotification.length > allNotifications.length) {
                allNotifications = newNotification;
                console.log("New notification:", newNotification);
            }
        }
        catch (error) {
            console.error("Error fetching user:", error);
        }
    });
}
function startPolling() {
    void fetchUserMentions();
    setInterval(() => fetchUserMentions(), 10 * 1000);
}
startPolling();
