import { sendDirectCast } from "../src/frameReply-helper";

const user = 763053;
const message = "Hello World";

sendDirectCast(user, message)
  .then(() => {
    console.log("Direct Cast sent successfully");
  })
  .catch((error) => {
    console.error("Error sending Direct Cast:", error);
  });
