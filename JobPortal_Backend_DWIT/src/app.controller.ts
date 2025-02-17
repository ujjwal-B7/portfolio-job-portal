import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MongoClient } from 'mongodb';
import { AuthGuard } from './authentication/auth.guard';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // @UseGuards(AuthGuard)
  @Post('/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  // @UseGuards(AuthGuard)
  async handleImageUpload(@UploadedFile() image: Express.Multer.File) {
    try {
      console.log(image);

      // Connect to MongoDB
      // const client = await MongoClient.connect('mongodb://localhost:27017');
      // const db = client.db('dwit_job_portal');
      // const collection = db.collection('images');
      const imageUrl = `${process.env.SERVER}/${image.filename}`;
      // Create a new document with the image data
      const imageDoc = {
        filename: image.filename,
        contentType: image.mimetype,
        data: image.buffer,
        imageUrl: imageUrl,
      };
      // Insert the image document into the database
      // await collection.insertOne(imageDoc);
      // console.log('Image saved to MongoDB');
      // // Close the MongoDB connection
      // await client.close();
      console.log(imageUrl);
      return `${process.env.SERVER}/${image.filename}`;
    } catch (err) {
      console.error('Error saving image to MongoDB:', err);
      throw err;
    }
  }
  // async handleImageUpload(@UploadedFile() image: Express.Multer.File) {
  //   try {
  //     console.log(image);

  //     // Connect to MongoDB
  //     const client = await MongoClient.connect('mongodb://localhost:27017');
  //     const db = client.db('dwit_job_portal');
  //     const collection = db.collection('images');
  //     const imageUrl = `${process.env.SERVER}/${image.filename}`
  //     // Create a new document with the image data
  //     const imageDoc = {
  //       filename: image.filename,
  //       contentType: image.mimetype,
  //       data: image.buffer,
  //       imageUrl: imageUrl
  //     };
  //     // Insert the image document into the database
  //     await collection.insertOne(imageDoc);
  //     console.log('Image saved to MongoDB');
  //     // Close the MongoDB connection
  //     await client.close();
  //     console.log(imageUrl)
  //     return `${process.env.SERVER}/${image.filename}`;
  //   } catch (err) {
  //     console.error('Error saving image to MongoDB:', err);
  //     throw err;
  //   }
  // }
  // @UseGuards(AuthGuard)
  @Get('/images')
  async getImages(@Res() res): Promise<void> {
    try {
      // Connect to MongoDB
      const client = await MongoClient.connect('mongodb://localhost:27017');
      const db = client.db('dwit_job_portal');
      const collection = db.collection('images');
      // Fetch all images from the database
      const images = await collection.find({}).toArray();
      // Set the appropriate response headers and send the images
      res.setHeader('Content-Type', 'application/json');
      res.status(HttpStatus.OK).json(images);
      // Close the MongoDB connection
      await client.close();
    } catch (err) {
      console.error('Error fetching images from MongoDB:', err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error fetching images' });
    }
  }
  //   @Get('/images/:filename')
  //   async getImageByFilename(@Param('filename') filename: string, @Res() res) {
  //     try {
  //       // Connect to MongoDB
  //       const client = await MongoClient.connect('mongodb://localhost:27017');
  //       const db = client.db('dwit_job_portal');
  //       const collection = db.collection('images');
  //       // Fetch the image document by its filename
  //       const image = await collection.findOne({ filename });
  //       if (!image) {
  //         return res.status(404).json({ error: 'Image not found' });
  //       }
  //       // Set the appropriate response headers and send the image data
  //       res.setHeader('Content-Type', image.contentType);
  //       res.send(image.data);
  //       // Close the MongoDB connection
  //       await client.close();
  //     } catch (err) {
  //       console.error('Error fetching image from MongoDB:', err);
  //       res.status(500).json({ error: 'Error fetching image' });
  //     }
  //   }
  // }
}
