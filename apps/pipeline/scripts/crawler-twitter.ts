import { Client } from 'twitter-api-sdk'

const token = process.env.TWITTER_BEARER_TOKEN
const userId = '17468569'

async function getUserId(client: Client) {
  const response = await client.users.findUsersByUsername({
    usernames: ['bryan_johnson'],
  })
  console.log(JSON.stringify(response, null, 2))
}

async function main() {
  if (!token) {
    throw new Error('TWITTER_BEARER_TOKEN not set')
  }
  const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)

  const response = await client.tweets.usersIdTweets(userId, {
    max_results: 100,
    exclude: ['retweets'],
    'tweet.fields': ['referenced_tweets', 'conversation_id', 'in_reply_to_user_id', 'source', 'text'],
    'user.fields': ['username'],
    expansions: ['author_id'],
  })

  const nextToken = response.meta?.next_token
  while (nextToken) {}

  console.log(JSON.stringify(response, null, 2))
  return
}

main()
