import { Injectable } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class MeiliSearchService {
  private client: MeiliSearch;

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILISEARCH,
      apiKey: process.env.MEILISEARCH_kEY,
    });
  }

  async createIndexIfNotExists(indexUid: string): Promise<void> {
    const existingIndexes = await this.client.getIndexes(); // Fetch the existing indexes

    if (
      Array.isArray(existingIndexes) &&
      existingIndexes.some((i) => i.uid === indexUid)
    ) {
      console.log(`Index "${indexUid}" already exists.`);
    } else {
      // Create the index with the primary key
      await this.client.createIndex(indexUid, {
        primaryKey: '_id',
      });
      console.log(`Index "${indexUid}" created with primary key _id".`);
    }
  }

  // Add documents (jobs) to MeiliSearch index
  async indexJobs(jobs: any) {
    const index = this.client.index('indexed_jobs');
    return index.addDocuments(jobs);
  }

  async indexCompanies(companies: any) {
    const index = this.client.index('indexed_companies');
    return index.addDocuments(companies);
  }

  async getIndexedJobs() {
    // const index = await this.client.getIndexes();
    // console.log(index);

    const index = this.client.index('indexed_jobs');
    const stats = await index.getStats();
    console.log(stats); // This will show how many documents are indexed
  }

  // Search for jobs from MeiliSearch
  async searchJobs(query: string): Promise<any> {
    // // const settings = await index.getSettings();

    // const index = this.client.index('jobs');
    // const searchResults = await index.search('');
    // console.log(searchResults);

    // const index = this.client.index('jobs');
    // const stats = await index.getStats();
    // console.log(stats); // This will show how many documents are indexed

    // const taskStatus = await this.client.getTask(2); // 2 is the taskUid from your log
    // console.log(taskStatus);

    const jobIndex = this.client.index('indexed_jobs');
    const companyIndex = this.client.index('indexed_companies');

    // Perform search in both indexes
    const [jobResults, companyResults] = await Promise.all([
      jobIndex.search(query, { limit: 1 }),
      companyIndex.search(query, { limit: 1 }),
    ]);
    return {
      jobs: jobResults.hits,
      companies: companyResults.hits,
    };

    // const index = this.client.index('indexed_jobs');
    // return index.search(query, {
    //   limit: 1,
    // });
  }
}
