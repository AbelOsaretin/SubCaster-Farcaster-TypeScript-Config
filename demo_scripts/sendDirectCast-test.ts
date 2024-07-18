import { sendDirectCast } from "../src/frameReply-helper";

const user = 671935;
const message = `
Hello World

This is a test

https://moralis.io

https://warpcast.com
`;

sendDirectCast(user, message)
  .then(() => {
    console.log("Direct Cast sent successfully");
  })
  .catch((error) => {
    console.error("Error sending Direct Cast:", error);
  });
