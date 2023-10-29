import { SlackApp, SlackEdgeAppEnv } from "slack-cloudflare-workers";

export default {
  async fetch(
    request: Request,
    env: SlackEdgeAppEnv,
    ctx: ExecutionContext
  ): Promise<Response> {
    const app = new SlackApp({ env });

    app.event("app_mention", async ({ context }) => {
        const response = await fetch("https://db.ygoprodeck.com/api/v7/randomcard.php", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        const data = await response.json();
        const cardName = data["name"];        
        const imageUrl = data["card_images"][0].image_url;

        await context.say({text: `<${imageUrl}|${cardName}>`});
    });
    
    return await app.run(request, ctx);
  },
};
