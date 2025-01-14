import { TelegramClientInterface } from '@elizaos/client-telegram'
import { TwitterClientInterface } from '@elizaos/client-twitter'
import type { Character, IAgentRuntime } from '@elizaos/core'

export async function getClients({
  runtime,
}: {
  runtime: IAgentRuntime
}) {
  const clients = []
  const clientTypes = runtime.character.clients?.map((str) => str.toLowerCase()) || []

  if (clientTypes.includes('auto')) {
    throw new Error('Auto client type is not supported')
  }

  if (clientTypes.includes('discord')) {
    throw new Error('Discord client type is not supported')
  }

  if (clientTypes.includes('telegram')) {
    const telegramClients = await TelegramClientInterface.start(runtime)
    clients.push(telegramClients)
  }

  if (clientTypes.includes('twitter')) {
    const twitterClients = await TwitterClientInterface.start(runtime)
    clients.push(twitterClients)
  }

  if (runtime.character.plugins?.length > 0) {
    for (const plugin of runtime.character.plugins) {
      if (plugin.clients) {
        for (const client of plugin.clients) {
          clients.push(await client.start(runtime))
        }
      }
    }
  }

  return clients
}
