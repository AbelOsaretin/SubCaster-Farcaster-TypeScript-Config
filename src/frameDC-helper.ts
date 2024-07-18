import { neynarClient, signerUuid, warpcastApiClient } from "./config";
import { NeynarFrameCreationRequest } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { TCast } from "./types";

export const frameDirectCast = async (hookData: string, message: string) => {
  const creationRequest: NeynarFrameCreationRequest = {
    name: `New Cast from ${hookData}`,
    pages: [
      {
        image: {
          url: "https://moralis.io/wp-content/uploads/web3wiki/638-gm/637aeda23eca28502f6d3eae_61QOyzDqTfxekyfVuvH7dO5qeRpU50X-Hs46PiZFReI.jpeg",
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

  const frame = await neynarClient.publishNeynarFrame(creationRequest);

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
};
