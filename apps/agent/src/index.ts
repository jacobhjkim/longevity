import { getClients } from './clients'
import { getAgentRuntime } from './providers'

async function main() {
  const runtime = await getAgentRuntime()
  await runtime.initialize()
  await getClients({ runtime })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
