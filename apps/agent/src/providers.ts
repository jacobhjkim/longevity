import { randomUUID } from 'node:crypto'
import { PostgresDatabaseAdapter } from '@elizaos/adapter-postgres'
import {
  AgentRuntime,
  CacheManager,
  type Character,
  DbCacheAdapter,
  type IDatabaseCacheAdapter,
  ModelProviderName,
} from '@elizaos/core'
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap'
import { character } from './character'

export async function getAgentRuntime() {
  const databaseAdapter = await getDBProvider()
  const token = getJWTToken()
  const cacheManager = await getCacheManager(character, databaseAdapter)

  return new AgentRuntime({
    databaseAdapter,
    token,
    modelProvider: ModelProviderName.OPENAI,
    character,

    // Extension points
    plugins: [bootstrapPlugin],
    providers: [],
    actions: [],
    services: [],
    managers: [],
    cacheManager,

    // Optional settings
    conversationLength: 32,
    // agentId: getAgentId(),
  })
}

// TODO
async function getCacheManager(character: Character, db: IDatabaseCacheAdapter) {
  const id = character.id
  if (!id) {
    throw new Error('Character ID not set')
  }

  return new CacheManager(new DbCacheAdapter(db, id))
}

async function getDBProvider() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL not set')
  }

  const db = new PostgresDatabaseAdapter({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // getKnowledge: async () => [],
  })

  await db.testConnection()

  return db
}

function getJWTToken() {
  const token = process.env.OPENAI_API_KEY
  if (!token) {
    throw new Error('OPENAI_API_KEY not set')
  }

  return token
}

function getAgentId() {
  const customId = process.env.AGENT_ID
  return customId || randomUUID().toString()
}
