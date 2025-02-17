import crypto from 'node:crypto'
import { type Update, db, papersTable, tweetTable } from '@repo/db'
import { and, eq } from 'drizzle-orm'
import TwitterApi from 'twitter-api-v2'

const appKey = process.env.TWITTER_API_KEY
const appSecret = process.env.TWITTER_API_SECRET
const accessToken = process.env.TWITTER_ACCESS_TOKEN
const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET

if (!appKey || !appSecret || !accessToken || !accessSecret) {
  throw new Error('Please add your API keys in the .env file')
}

const postDelay = 1000 * 60 * 60 // 1 hour

const client = new TwitterApi({
  appKey: appKey,
  appSecret: appSecret,
  accessToken: accessToken,
  accessSecret: accessSecret,
})

function parseUpdates(updates: Update[]) {
  let builder = ''
  for (const update of updates) {
    switch (update.changeType) {
      case 'add':
        builder += `Add:
${update.newProtocol}

Reasoning:
${update.reason}
`
        break
      case 'update':
        builder += `Update:
${update.oldProtocol} -> ${update.newProtocol}

Reasoning:
${update.reason}
`
        break
      case 'remove':
        builder += `Remove:
${update.oldProtocol}

Reasoning:
${update.reason}
`
        break
    }
  }
  return builder
}

async function main() {
  const papers = await db
    .select({
      title: papersTable.title,
      doi: papersTable.doi,
      eat: papersTable.eat,
      measurements: papersTable.measurements,
      exercise: papersTable.exercise,
      females: papersTable.females,
      pregnancy: papersTable.pregnancy,
    })
    .from(papersTable)
    .where(and(eq(papersTable.isRelevant, 1), eq(papersTable.isProcessed, true)))

  console.log(`Found ${papers.length} papers`)

  for (const paper of papers) {
    if (!paper.eat && !paper.measurements && !paper.exercise && !paper.females && !paper.pregnancy) {
      continue
    }

    const alreadyTweeted = await db.query.tweetTable.findFirst({
      where: eq(paper.doi, tweetTable.paperDoi),
    })
    if (alreadyTweeted) {
      console.log(`Already tweeted ${paper.doi}`)
      continue
    }

    let builder = `📄 ${paper.title}
(${paper.doi})

`

    if (paper.eat && paper.eat.length > 0) {
      builder += `🍽️ 𝐔𝐩𝐝𝐚𝐭𝐞 𝐨𝐧 𝐄𝐀𝐓
`
      builder += parseUpdates(paper.eat)
    }

    if (paper.measurements && paper.measurements.length > 0) {
      builder += `📏 𝗨𝗽𝗱𝗮𝘁𝗲 𝗼𝗻 𝗠𝗲𝗮𝘀𝘂𝗿𝗲𝗺𝗲𝗻𝘁𝘀
`
      builder += parseUpdates(paper.measurements)
    }

    if (paper.exercise && paper.exercise.length > 0) {
      builder += `🏋️ 𝗨𝗽𝗱𝗮𝘁𝗲 𝗼𝗻 𝗘𝘅𝗲𝗿𝗰𝗶𝘀𝗲
`
      builder += parseUpdates(paper.exercise)
    }

    if (paper.females && paper.females.length > 0) {
      builder += `🚺 𝗨𝗽𝗱𝗮𝘁𝗲 𝗼𝗻 𝗙𝗲𝗺𝗮𝗹𝗲𝘀
`
      builder += parseUpdates(paper.females)
    }

    await client.v2.tweet(builder)
    await db.insert(tweetTable).values({
      id: crypto.randomBytes(16).toString('hex'),
      paperDoi: paper.doi,
      content: builder,
      postedAt: new Date(),
    })

    console.log(`Tweeted ${paper.doi}`)
    console.log(builder)
    await delay(postDelay) // 1 hour
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
