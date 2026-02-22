import { SlackApp, type SlackEdgeAppEnv } from 'slack-cloudflare-workers'

export default {
  async fetch(
    request: Request,
    env: SlackEdgeAppEnv,
    ctx: ExecutionContext
  ): Promise<Response> {
    const app = new SlackApp({ env })

    app.event('app_mention', async ({ context }) => {
      const response = await fetch(
        'https://db.ygoprodeck.com/api/v7/cardinfo.php?num=1&offset=0&sort=random&cachebust',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (!response.ok) {
        throw new Error('failed to fetch card data')
      }

      const data: {
        data: { name: string; card_images: { image_url: string }[] }[]
      } = await response.json()
      if (!data.data[0]) {
        throw new Error('failed to get card data')
      }

      const cardName = data.data[0].name
      const imageUrl = data.data[0].card_images[0].image_url
      await context.say({ text: `<${imageUrl}|${cardName}>` })
    })

    return await app.run(request, ctx)
  }
}
