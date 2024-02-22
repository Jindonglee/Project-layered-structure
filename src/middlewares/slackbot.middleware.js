import { WebClient } from "@slack/web-api";
const token = process.env.SLACK_TOKEN;
const channel = process.env.SLACK_CHANNEL;
const slackBot = new WebClient(token);

const sendTodayData = async (req, res, next) => {
  try {
    const start = new Date();
    next();
    res.on("finish", async () => {
      const end = new Date();
      console.log("api-finish", end - start);

      if (end - start > 3000) {
        const message = "api가 느려요.";
        await slackBot.chat.postMessage({
          channel: channel,
          text: message,
        });
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};
export default sendTodayData;
