import { getClients } from './clients'
import { getAgentRuntime } from './providers'

async function main() {
  const runtime = await getAgentRuntime()
  await runtime.initialize()

  const clients = await getClients({ runtime })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
