export type Server = 'biorxiv' | 'medrxiv'
export type Format = 'json' | 'xml' | 'csv'
export type IntervalUsage = 'm' | 'y'

export interface BiorxivMessage {
  status: string
  interval: string
  cursor: number
  count: number
  count_new_paper: string
  total: string
}

export interface BiorxivDetailsItem {
  doi: string
  title: string
  authors: string
  author_corresponding: string
  author_corresponding_institution: string
  date: string
  version: number
  category: string
  abstract: string
  published: string
}

export interface BiorxivDetailsResponse {
  messages: BiorxivMessage[]
  collection: BiorxivDetailsItem[]
}

export interface BiorxivPubItem {
  biorxiv_doi: string
  published_doi?: string
  published_journal?: string
  preprint_platform?: string
  preprint_title?: string
  preprint_authors?: string
  preprint_date?: string
  published_date?: string
  preprint_abstract?: string
}

export interface BiorxivPubsResponse {
  messages: BiorxivMessage[]
  collection: BiorxivPubItem[]
}

export interface BiorxivPubSimpleItem {
  biorxiv_doi: string
  published_doi: string
  preprint_title: string
  preprint_category: string
  preprint_date: string
  published_date: string
}

export interface BiorxivPubSimpleResponse {
  messages: BiorxivMessage[]
  collection: BiorxivPubSimpleItem[]
}

export interface BiorxivPublisherItem {
  biorxiv_doi: string
  published_doi: string
  preprint_title: string
  preprint_category: string
  preprint_date: string
  published_date: string
  published_citation_count?: number
}

export interface BiorxivPublisherResponse {
  messages: BiorxivMessage[]
  collection: BiorxivPublisherItem[]
}

export interface BiorxivSumItem {
  month?: string
  new_papers?: number
  new_papers_cumulative?: number
  revised_papers?: number
  revised_papers_cumulative?: number
}

export interface BiorxivSumResponse {
  messages: BiorxivMessage[]
  collection: BiorxivSumItem[]
}

export interface BiorxivUsageItem {
  month?: string
  abstract_views?: number
  full_text_views?: number
  pdf_downloads?: number
  abstract_cumulative?: number
  full_text_cumulative?: number
  pdf_cumulative?: number
}

export interface BiorxivUsageResponse {
  messages: BiorxivMessage[]
  collection: BiorxivUsageItem[]
}

export class BiorxivAPI {
  private readonly baseURL: string

  constructor(baseURL = 'https://api.biorxiv.org') {
    this.baseURL = baseURL
  }

  public getDetails(
    server: Server,
    interval: string,
    cursor?: number,
    format: Exclude<Format, 'csv'> = 'json',
  ): Promise<BiorxivDetailsResponse> {
    const path = this.buildPath(['details', server, interval], cursor, format)
    return this.fetchAndParse<BiorxivDetailsResponse>(path, format)
  }

  public getDetailsByDOI(
    server: Server,
    doi: string,
    format: Exclude<Format, 'csv'> = 'json',
  ): Promise<BiorxivDetailsResponse> {
    const path = `details/${server}/${doi}/na/${format}`
    return this.fetchAndParse<BiorxivDetailsResponse>(path, format)
  }

  public getPubs(server: Server, interval: string, cursor?: number): Promise<BiorxivPubsResponse> {
    const path = this.buildPath(['pubs', server, interval], cursor)
    return this.fetchAndParse<BiorxivPubsResponse>(path, 'json')
  }

  public getPubsByDOI(
    server: Server,
    doi: string,
    format: Exclude<Format, 'csv' | 'xml'> = 'json',
  ): Promise<BiorxivPubsResponse> {
    const path = `pubs/${server}/${doi}/na/${format}`
    return this.fetchAndParse<BiorxivPubsResponse>(path, format)
  }

  public getPub(
    interval: string,
    cursor?: number,
    format: Format = 'json',
  ): Promise<BiorxivPubSimpleResponse | string> {
    const path = this.buildPath(['pub', interval], cursor, format)
    return this.fetchAndParse<BiorxivPubSimpleResponse>(path, format)
  }

  public getPublisher(publisherPrefix: string, interval: string, cursor?: number): Promise<BiorxivPublisherResponse> {
    const path = this.buildPath(['publisher', publisherPrefix, interval], cursor)
    return this.fetchAndParse<BiorxivPublisherResponse>(path, 'json')
  }

  public getSum(
    interval: IntervalUsage,
    format: Exclude<Format, 'xml'> = 'json',
  ): Promise<BiorxivSumResponse | string> {
    const path = `sum/${interval}`
    return this.fetchAndParse<BiorxivSumResponse>(path, format)
  }

  public getUsage(
    interval: IntervalUsage,
    format: Exclude<Format, 'xml'> = 'json',
  ): Promise<BiorxivUsageResponse | string> {
    const path = `usage/${interval}`
    return this.fetchAndParse<BiorxivUsageResponse>(path, format)
  }

  private buildPath(segments: (string | number)[], cursor?: number, format?: Format): string {
    let finalPath = segments.join('/')
    if (cursor !== undefined) finalPath += `/${cursor}`
    if (format && format !== 'json') finalPath += `/${format}`
    return finalPath
  }

  private async fetchAndParse<T>(path: string, format: Format): Promise<T | string> {
    const url = `${this.baseURL}/${path}`
    let response: Response
    try {
      response = await fetch(url)
    } catch (err) {
      throw new Error(`Network error when fetching: ${url}\n${(err as Error).message}`)
    }

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText} at ${url}`)
    }

    if (format === 'csv') {
      return response.text()
    }

    const rawText = await response.text()

    if (format === 'json') {
      // If the response starts with a typical HTML doctype or any HTML tag,
      // we can suspect it's not valid JSON. This is just a simple check.
      if (rawText.trim().startsWith('<')) {
        throw new Error(`Unexpected HTML response from ${url} (truncated):\n${rawText.slice(0, 2000)}`)
      }
      return this.parseJsonOrThrow<T>(rawText, url)
    }

    return rawText // for 'xml' or other unknown formats
  }

  private parseJsonOrThrow<T>(rawText: string, url: string): T {
    try {
      return JSON.parse(rawText) as T
    } catch (err) {
      const truncated = rawText.slice(0, 2000)
      throw new Error(
        `Failed to parse JSON from ${url}\n` +
        `Error: ${(err as Error).message}\n` +
        `Response (truncated to 2000 chars):\n${truncated}`,
      )
    }
  }
}
