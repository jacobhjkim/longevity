<div align="center">
  <a href="https://longevities.fun">
    <img src="https://github.com/jacobhjkim/longevity/blob/master/images/banner.png" style="margin: 12px; max-width: 1500px" width="100%" alt="Banner">
  </a>
</div>

# Decentralized Longevity Research A.I. Agent

Can an autonomous DeSci (Decentralized Science) AI agent improve Bryan Johnson's Blueprint Protocol by reading 
every single research paper published in bioRxiv & medRxiv?

**This project is not affiliated with Bryan Johnson.**

## Setup

Run the following command:

```sh
bun i
```

## What's inside?

This repo is a monorepo managed by [Turborepo](https://turbo.build/repo/docs/). It contains a few apps and packages

### Apps and Packages

- `apps/agent`: Twitter bot powered by [Eliza OS](https://elizaos.ai/)
- `apps/web`: A [Next.js](https://nextjs.org/) app that displays research results from the agent
- `apps/pipeline`: Pipelines for scraping, sorting, and analyzing research papers from bioRxiv & medRxiv with LLM.
- `@repo/db`: A [Drizzle ORM](https://orm.drizzle.team/) package for managing the Postgres database
- `@repo/protocol-data`: Bryan Johnson's Blueprint Protocol in a markdown format and images. This is the baseline of our longevity protocol.
- `@repo/ui`: A stub React component library shared by `apps/web`. Mostly from [shadcn/ui](https://ui.shadcn.com/)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Build

To build the web app, run the following command:

```
turbo build
```

### Develop

To develop the web app, run the following command:

```
turbo dev
```

## The Pipeline
The pipeline is current running on a cron job.
1. The bioRxiv & medRxiv scrapper is running every 24 hours.
2. Then with the Batch API from OpenAI, we analyze if the paper is relevant to our longevity protocol.
3. Store the results in the Postgres database.
4. Finally, we only process the relevant papers to the final pipeline to get the results.
5. The results are then displayed on the web app.

## The Agent
The agent has two functions

### 1. Tweet the results
The agent tweets the results from the pipeline.
Since there are a lot of papers, I hand-pick the most interesting ones to tweet.
In the future, I would like to automate this process and let the agent tweet the most interesting papers.

### 2. Twitter Persona with Eliza OS
Whenever someone tweets at the agent about longevity, the agent will respond with a response.
In the future, I will add RAG functionality to the agent so that it can generate responses based on the research papers.

## Roadmap
1. Automate the tweet selection process
2. Add RAG functionality to the agent
3. Add more data sources to the pipeline (PubMed, etc...)
4. Add more functionality to the web app (search, filter, etc...)

