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
exports.sendDirectCast = exports.frameReply = void 0;
const config_1 = require("./config");
// const body = await req.text();
// const hookData = JSON.parse(body);
const frameReply = (replyTo, message) => __awaiter(void 0, void 0, void 0, function* () {
    // const creationRequest: NeynarFrameCreationRequest = {
    //   name: `gm ${hookData.data.author.username}`,
    //   pages: [
    //     {
    //       image: {
    //         url: "https://moralis.io/wp-content/uploads/web3wiki/638-gm/637aeda23eca28502f6d3eae_61QOyzDqTfxekyfVuvH7dO5qeRpU50X-Hs46PiZFReI.jpeg",
    //         aspect_ratio: "1:1",
    //       },
    //       title: "Hello World",
    //       buttons: [],
    //       input: {
    //         text: {
    //           enabled: false,
    //         },
    //       },
    //       uuid: "Hello",
    //       version: "v0.0.1",
    //     },
    //   ],
    // };
    // const frame = await neynarClient.publishNeynarFrame(creationRequest);
    const reply = yield config_1.neynarClient.publishCast(config_1.signerUuid, message, {
        replyTo,
    });
    console.log("reply:", reply);
});
exports.frameReply = frameReply;
const sendDirectCast = (recipientFid, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const directCastRequest = {
            recipientFid,
            message,
            idempotencyKey: Math.random().toString(36).substring(7),
        };
        const response = yield config_1.warpcastApiClient.put("/ext-send-direct-cast", directCastRequest);
        if (response.status === 200) {
            console.log("Direct Cast sent successfully:", response.data);
        }
        else {
            console.error("Error sending Direct Cast:", response.status, response.statusText);
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
});
exports.sendDirectCast = sendDirectCast;
