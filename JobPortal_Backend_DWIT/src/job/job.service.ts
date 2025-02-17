import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schema/job.schema';
import mongoose, { Types, ObjectId } from 'mongoose';

// meilisearch service
import { MeiliSearchService } from './meiliSearch.service';
import { Company } from 'src/company/schema/company.schema';
import { Profile } from 'src/profile/schema/profile.schema';
import { CacheService } from './nodecache.service';

const excelToJson = require('convert-excel-to-json');

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: mongoose.Model<Job>,
    @InjectModel(Company.name)
    private CompanyModel: mongoose.Model<Company>,
    @InjectModel(Profile.name)
    private ProfileModel: mongoose.Model<Profile>,
    private meiliSearchService: MeiliSearchService,
    private nodeCacheService: CacheService,
  ) {}

  async searchJobsByUser(q: string): Promise<Job[] | string[]> {
    
    // main search logic for jobs collection
    const searchResults = await this.searchLogic(q);

    // this.meiliSearchService.getIndexedJobs();

    /*
    Using meilisearch only for word suggesting for now. Will be refactored late
    if no search result then checking for typo error in meilisearch
    */
    if (!searchResults?.length) {
      // it returns the document with typotolerance
      const meiliSearchResults = await this.meiliSearchService.searchJobs(q);

      // from the document, making the title field an array for iterating to extract the word that may be the best match for the search query

      let suggestedWordFromTitle: [];
      let suggestedWordFromTechnology: [];
      let suggestedCompany: [];

      // if meilisearch returns job result, then from the document extract related word
      function suggestWordByFiltering(data: [], key: string) {
        return data?.[key]
          ?.split(/[ ,/]+/)
          ?.filter(
            (keyword: string) =>
              keyword?.trim()?.toLowerCase()[0] === q?.trim()?.toLowerCase()[0],
          );
      }

      if (meiliSearchResults.jobs.length) {
        suggestedWordFromTitle = suggestWordByFiltering(
          meiliSearchResults?.jobs[0],
          'title',
        );
        suggestedWordFromTechnology = suggestWordByFiltering(
          meiliSearchResults?.jobs[0],
          'technology',
        );
      }

      if (meiliSearchResults.companies.length) {
        suggestedCompany = suggestWordByFiltering(
          meiliSearchResults?.companies[0],
          'company',
        );
      }

      // from the document, making the technology field an array for iterating to extract the word that may be the best match for the search query
      const arraySet = new Set();

      // checking if suggestedWordFromTitle is array or not, for iterating and pushing the value in set for only keeping the unique value
      if (
        Array.isArray(suggestedWordFromTitle) &&
        suggestedWordFromTitle.length
      ) {
        for (let i of suggestedWordFromTitle) {
          arraySet.add(i);
        }
      }

      // checking if suggestedWordFromTechnology is array or not, for iterating and pushing the value in set for only keeping the unique value
      if (
        Array.isArray(suggestedWordFromTechnology) &&
        suggestedWordFromTechnology.length
      ) {
        for (let i of suggestedWordFromTechnology) {
          arraySet.add(i);
        }
      }

      // checking if suggestedWordFromCompany is array or not, for iterating and pushing the value in set for only keeping the unique value
      if (Array.isArray(suggestedCompany) && suggestedCompany.length) {
        for (let i of suggestedCompany) {
          arraySet.add(i);
        }
      }

      // console.log('joined array', Array.from(arraySet));
      return Array.from(arraySet) as string[];
      // await this.indexAllJobsInMeiliSearch();
    }

    return searchResults;
  }

  async searchJobsByAdminAndCompany(
    q: string,
    id: Types.ObjectId,
    role: string,
  ): Promise<Job[]> {
    const searchResults = await this.searchLogic(q, id, role);

    return searchResults;
  }

  // search query to database
  async searchLogic(
    q: string,
    id?: Types.ObjectId,
    role?: string,
  ): Promise<Job[]> {
    const today = new Date();
    const jobs = await this.jobModel.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyId',
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'profileId',
          foreignField: '_id',
          as: 'profileId',
        },
      },
      {
        $addFields: {
          companyId: {
            $cond: {
              if: { $gt: [{ $size: '$companyId' }, 0] },
              then: { $arrayElemAt: ['$companyId', 0] },
              else: null,
            },
          },
          profileId: {
            $cond: {
              if: { $gt: [{ $size: '$profileId' }, 0] },
              then: { $arrayElemAt: ['$profileId', 0] },
              else: null,
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { title: { $regex: `^${q}`, $options: 'i' } },
            { role: { $regex: `^${q}`, $options: 'i' } },
            { type: { $regex: `^${q}`, $options: 'i' } },
            { domain: { $regex: `^${q}`, $options: 'i' } },
            { location: { $regex: `^${q}`, $options: 'i' } },
            { technology: { $regex: `^${q}`, $options: 'i' } },
            { description: { $regex: `^${q}`, $options: 'i' } },
            {
              'companyId.company': {
                $regex: `^${q}`,
                $options: 'i',
              },
            },
            {
              'profileId.name': {
                $regex: `^${q}`,
                $options: 'i',
              },
            },
          ],
          ...(id && {
            creatorId: id, // Filter jobs based on creatorId
          }),
          // ...(!role && {
          //   applicationDeadline: { $gte: today },
          // }),
        },
      },
      {
        $project: {
          title: 1,
          technology: 1,
          domain: 1,
          salary: 1,
          role: 1,
          type: 1,
          description: 1,
          location: 1,
          companyId: {
            company: 1,
            logo: 1,
          },
          profileId: {
            name: 1,
            logo: 1,
          },
          applicationStart: 1,
          applicationDeadline: 1,
        },
      },
    ]);
    return jobs;
  }

  async findAllJobsByUser(): Promise<Job[]> {
    const jobs = await this.jobModel
      .find()
      .populate('companyId')
      .populate('profileId', '_id name description logo')
      .sort({ createdAt: -1 });

    return jobs;
  }

  /*
  show all jobs in user side
  - with pagination
  - removed for now
  */
  // async findAllJobsByUser(
  //   page: string,
  // ): Promise<{ jobs: Job[]; jobsCount: number }> {
  //   const today = new Date();

  //   const jobsPerPage = 15;
  //   const skipJobs = jobsPerPage * (Number(page) - 1);

  //   const jobsCount = await this.jobModel.countDocuments({
  //     applicationDeadline: { $gte: today },
  //   });
  //   const jobs = await this.jobModel
  //     .find({ applicationDeadline: { $gte: today } })
  //     .populate('companyId')
  //     .populate('profileId', '_id name description logo')
  //     .limit(jobsPerPage)
  //     .skip(skipJobs)
  //     .sort({ createdAt: -1 });

  //   return { jobs, jobsCount };
  // }

  async findAll(
    id: ObjectId,
    page: string,
  ): Promise<{ jobs: Job[]; jobsCount: number }> {
    const jobsPerPage = 15;
    const skipJobs = jobsPerPage * (Number(page) - 1);

    const jobsCount = await this.jobModel.countDocuments({ creatorId: id });
    const jobs = await this.jobModel
      .find({ creatorId: id })
      .populate('companyId')
      .populate('profileId', '_id name description logo')
      .limit(jobsPerPage)
      .skip(skipJobs)
      .sort({
        applicationDeadline: -1,
      });

    return { jobs, jobsCount };
  }
  // async indexExistingDocument():any{

  // }

  // // Method to index all jobs in MeiliSearch for the first time
  // async indexAllJobsInMeiliSearch(): Promise<void> {
  //   const allJobs = await this.jobModel.find(); // Fetch all existing jobs from MongoDB

  //   // If no jobs exist, don't attempt indexing
  //   if (allJobs.length === 0) {
  //     console.log('No jobs to index.');
  //     return;
  //   }

  //   // Ensure the index exists with the correct primary key
  //   await this.meiliSearchService.createIndexIfNotExists('indexed_jobs'); // '_id' or another unique field

  //   // Index all jobs into MeiliSearch
  //   await this.meiliSearchService.indexJobs(allJobs);
  //   console.log(`${allJobs.length} jobs have been indexed in MeiliSearch.`);
  // }

  // async indexExistingDocument():any{

  // }

  // bulk job upload
  async createBulkJobs(
    file: Express.Multer.File,
    userId,
    role: string,
  ): Promise<Job[]> {
    const adminColumnToKey = {
      A: 'title',
      B: 'technology',
      C: 'salary',
      D: 'company',
      E: 'role',
      F: 'domain',
      G: 'experience in years (0.5,1,2 etc)',
      H: 'location',
      I: 'type',
      J: 'description',
      K: 'qualification',
      L: 'applicationStart (mm/dd/yyyy)',
      M: 'applicationDeadline (mm/dd/yyyy)',
    };

    const companyColumnToKey = {
      A: 'title',
      B: 'technology',
      C: 'salary',
      D: 'role',
      E: 'domain',
      F: 'experience in years (0.5,1,2 etc)',
      G: 'location',
      H: 'type',
      I: 'description',
      J: 'qualification',
      K: 'applicationStart (mm/dd/yyyy)',
      L: 'applicationDeadline (mm/dd/yyyy)',
    };

    // converting the csv file to json format
    const excelJson = excelToJson({
      source: file.buffer,
      header: {
        rows: 1,
      },
      columnToKey: role === 'admin' ? adminColumnToKey : companyColumnToKey,
    });

    // making jobsArray from excelJson for iteration
    const jobsArray: Job[] = excelJson[Object.keys(excelJson)[0]];

    // validating whether there is empty fields or not in the excel file

    for (let job of jobsArray) {
      // excel to json only parses the fields with value, so if any field is empty in excel then it makes that field undefined, so we are checking count of fieds, and throwing error if not matched
      if (role === 'admin' && Object.keys(job)?.length !== 13) {
        throw new BadRequestException('Missing field value in file.');
      }
      if (role === 'company' && Object.keys(job)?.length !== 12) {
        throw new BadRequestException('Missing field value in file.');
      }
      // checking the validity of start date and deadline
      if (job['applicationStart (mm/dd/yyyy)']) {
        isDateValid(job['applicationStart (mm/dd/yyyy)'], 'start date');
      }

      if (job['applicationDeadline (mm/dd/yyyy)']) {
        isDateValid(job['applicationDeadline (mm/dd/yyyy)'], 'deadline');
      }
    }

    // checking date validity
    function isDateValid(value: Date, type: string) {
      value.setUTCDate(value.getUTCDate() + 1);

      const inputUTC = Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate(),
      );

      const currentDate = new Date();
      const currentUTC = Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
      );

      if (type === 'start date') {
        if (inputUTC < currentUTC) {
          throw new BadRequestException(
            `Application start date cannot be a past date.`,
          );
        }
      } else if (type === 'deadline') {
        if (inputUTC <= currentUTC) {
          throw new BadRequestException(
            `Deadline date must be a future date. It cannot be today or a past date.`,
          );
        }
      }
    }

    /*
     for each job added by admin, we manually add company details from admin dashboard, 
     so based on the company name we are extracting from excel file we are finding id of the company from company collection to store the company id in the job uploaded by admin to populate the company details from company collection
    */
    let companyIdAddedByAdmin: { _id: Types.ObjectId }[];
    if (role === 'admin') {
      companyIdAddedByAdmin = await Promise.all(
        jobsArray.map(async (job: any) => {
          const company = await this.CompanyModel.findOne({
            company: {
              $regex: `^\\s*${job.company.trim().toLowerCase()}\\s*$`,
              $options: 'i',
            },
          }).select('_id');

          return company ? { _id: company._id } : null;
        }),
      );
    }

    // extracting the company profileId to store in job created by company to later on populate the details to show in frontend
    let profileId: { _id: Types.ObjectId };
    if (role === 'company') {
      profileId = await this.ProfileModel.findOne({
        creatorId: userId,
      }).select('_id');
    }

    /*
    here we are mutating each object inside jobsArray with creatorId to know the creator of the job, 
    company id incase of admin to know the company details for that particular job, and
    updating the object key experience in years (0.5,1,2 etc) with experience only
    */
    for (let i = 0; i < jobsArray.length; i++) {
      // replacing the experience in years (0.5,1,2 etc) from excel file to experience to save in database and deleting the old key and same steps for application dates
      jobsArray[i]['experience'] =
        jobsArray[i]['experience in years (0.5,1,2 etc)'];
      delete jobsArray[i]['experience in years (0.5,1,2 etc)'];

      // replacing applicationStart (mm/dd/yyyy) with applicationStart
      jobsArray[i]['applicationStart'] =
        jobsArray[i]['applicationStart (mm/dd/yyyy)'];
      delete jobsArray[i]['applicationStart (mm/dd/yyyy)'];

      // replacing applicationDeadline (mm/dd/yyyy) with applicationDeadline
      jobsArray[i]['applicationDeadline'] =
        jobsArray[i]['applicationDeadline (mm/dd/yyyy)'];
      delete jobsArray[i]['applicationDeadline (mm/dd/yyyy)'];

      role === 'admin'
        ? (jobsArray[i].companyId = companyIdAddedByAdmin[
            i
          ]._id.toString() as any)
        : (jobsArray[i].profileId = profileId._id.toString() as any);

      // registered company or admin id
      jobsArray[i].creatorId = userId;
    }

    const jobs = await this.jobModel.insertMany(jobsArray);

    await this.meiliSearchService.indexJobs(jobs);

    return jobs;
  }

  async create(job: Job): Promise<Job> {
    // Convert the ISO string to a Date object
    // job.applicationDeadline = new Date(job.applicationDeadline);
    // job.applicationStart = new Date(job.applicationStart);
    // Save the job to MongoDB
    const res = await this.jobModel.create(job);

    await this.meiliSearchService.indexJobs([res]);

    return res;
  }

  async findById(_id: Types.ObjectId): Promise<Job> {
    const job = await this.jobModel
      .findById(_id)
      .populate('companyId')
      .populate('profileId', '_id name description logo');

    if (!job) {
      throw new NotFoundException('Job Not Found');
    }

    return job;
  }

  async updateById(_id: Types.ObjectId, job: Job): Promise<Job> {
    return await this.jobModel.findByIdAndUpdate(_id, job, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(_id: Types.ObjectId): Promise<Job> {
    return await this.jobModel.findByIdAndDelete(_id);
  }
}
function ISODate(arg0: string) {
  throw new Error('Function not implemented.');
}
