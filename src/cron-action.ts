import {
  neynarClient,
  watcherWebhookId,
  watcherWebhookName,
  watcherWebhookUrl,
} from "./config";
import { SubscribeToUsers, UserToSubscribes } from "./models";

export const resetSubscribesAndDb = async () => {
  const userData = await UserToSubscribes.find();
  const subscribesData = await SubscribeToUsers.find();

  if (userData.length > 0) {
    UserToSubscribes.deleteMany({});
  }

  if (subscribesData.length > 0) {
    SubscribeToUsers.deleteMany({});
  }

  await neynarClient.updateWebhook(
    watcherWebhookId,
    watcherWebhookName,
    watcherWebhookUrl,
    {
      subscription: {
        "cast.created": {
          author_fids: [792715],
        },
      },
    }
  );

  console.log({ userData, subscribesData });
};
