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
exports.frameDirectCast = void 0;
const config_1 = require("./config");
const frameDirectCast = (hookData, message) => __awaiter(void 0, void 0, void 0, function* () {
    const creationRequest = {
        name: `New Cast from ${hookData}`,
        pages: [
            {
                image: {
                    url: "",
                    aspect_ratio: "1:1",
                },
                title: message,
                buttons: [],
                input: {
                    text: {
                        enabled: false,
                    },
                },
                uuid: "gm",
                version: "vNext",
            },
        ],
    };
    const frame = yield config_1.neynarClient.publishNeynarFrame(creationRequest);
    //   const reply = await neynarClient.publishCast(signerUuid, message, {
    //     replyTo,
    //   });
    //   console.log("reply:", reply);
    // };
    // const creationRequest: NeynarFrameCreationRequest = {
    //   name: `gm ${hookData.data.author.username}`,
    //   pages: [
    //     {
    //       image: {
    //         url: "https://moralis.io/wp-content/uploads/web3wiki/638-gm/637aeda23eca28502f6d3eae_61QOyzDqTfxekyfVuvH7dO5qeRpU50X-Hs46PiZFReI.jpeg",
    //         aspect_ratio: "1:1",
    //       },
    //       title: "Page title",
    //       buttons: [],
    //       input: {
    //         text: {
    //           enabled: false,
    //         },
    //       },
    //       uuid: "gm",
    //       version: "vNext",
    //     },
    //   ],
    // };
    // const frame = await neynarClient.publishNeynarFrame(creationRequest);
});
exports.frameDirectCast = frameDirectCast;
