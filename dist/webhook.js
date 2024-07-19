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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const models_1 = require("./models");
const webhook_helper_1 = require("./webhook-helper");
const frameReply_helper_1 = require("./frameReply-helper");
const config_1 = require("./config");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4343;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server || GET");
});
app.post("/subscribe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    try {
        if (((_a = body === null || body === void 0 ? void 0 : body.data) === null || _a === void 0 ? void 0 : _a.mentioned_profiles) &&
            body.data.mentioned_profiles.filter((profile) => profile.fid === 792715).length > 0) {
            console.log({
                authorFid: body.data.author.fid,
                parentAuthorFid: body.data.parent_author.fid,
            });
            const { author: { fid: authorFid }, parent_author: { fid: parentAuthorFid }, } = body.data;
            const parent_author = yield config_1.neynarClient.fetchBulkUsers([
                parentAuthorFid,
            ]);
            if (parentAuthorFid === authorFid) {
                yield (0, frameReply_helper_1.frameReply)(body.data.hash, `gm ${body.data.author.username}, you can't subscribe to yourself`);
                throw new Error(`Webhook ignored: Author and Parent Author are the same,
          ${authorFid},
          ${parentAuthorFid}`);
            }
            const userData = yield models_1.UserToSubscribes.findById(authorFid);
            const subscribesData = yield models_1.SubscribeToUsers.findById(parentAuthorFid);
            if (userData === null) {
                const userSub = new models_1.UserToSubscribes({
                    _id: authorFid,
                    subscribes: [parentAuthorFid],
                });
                yield userSub.save();
                console.log("User subscribed:", authorFid, parentAuthorFid);
            }
            if (subscribesData === null) {
                const subUser = new models_1.SubscribeToUsers({
                    _id: parentAuthorFid,
                    users: [authorFid],
                });
                yield subUser.save();
                console.log("User subscribed:", authorFid, parentAuthorFid);
            }
            if ((userData === null || userData === void 0 ? void 0 : userData.subscribes.indexOf(parentAuthorFid)) === -1) {
                userData === null || userData === void 0 ? void 0 : userData.subscribes.push(parentAuthorFid);
                yield (userData === null || userData === void 0 ? void 0 : userData.save());
                console.log("User updated:", authorFid, parentAuthorFid);
            }
            if ((subscribesData === null || subscribesData === void 0 ? void 0 : subscribesData.users.indexOf(authorFid)) === -1) {
                subscribesData === null || subscribesData === void 0 ? void 0 : subscribesData.users.push(authorFid);
                yield (subscribesData === null || subscribesData === void 0 ? void 0 : subscribesData.save());
                console.log("User updated:", authorFid, parentAuthorFid);
            }
            yield (0, webhook_helper_1.addSubscribesToWebhook)(parentAuthorFid);
            yield (0, frameReply_helper_1.frameReply)(body.data.hash, `gm ${body.data.author.username}, You've have subscribed to receive Casts from ${parent_author.users[0].username} to your Direct Casts. Note that all Subscriptions are automatically deleted after 1 day.
        To receive Casts directly from me, Ensure you follow @subcasterbot
        `);
            console.log({ userData, subscribesData });
            console.log({
                message: "Webhook received: ",
            });
        }
        else {
            throw new Error("Webhook ignored");
        }
    }
    catch (error) {
        console.error(error);
    }
    res.send("Express + TypeScript Server || POST Subscribe");
}));
app.post("/watch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { author: { fid: authorFid, username: authorUsername, display_name: authorDisplayName, }, } = body.data;
        if (authorFid === 792715) {
            throw new Error("Webhook ignored: Author is Bot");
        }
        const subscribesData = yield models_1.SubscribeToUsers.findById(authorFid);
        if (subscribesData === null) {
            throw new Error("Webhook ignored: Author is not subscribed");
        }
        const { users } = subscribesData;
        const userData = yield config_1.neynarClient.fetchBulkUsers(users);
        const dcMessage = `
    New Cast from ${authorDisplayName}

    https://warpcast.com/${authorUsername}/${body.data.hash.slice(0, 10)}
    `;
        Promise.all(users.map((user) => {
            (0, frameReply_helper_1.sendDirectCast)(user, dcMessage);
        })).then(() => {
            console.log({
                message: `Watcher Webhook received from ${authorUsername} and sent:  `,
                users,
            });
        });
        res.send("Express + TypeScript Server || POST Watch");
    }
    catch (error) {
        console.error(error);
    }
}));
(0, db_1.default)()
    .then(() => {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
})
    .catch((err) => {
    console.error(err);
});
