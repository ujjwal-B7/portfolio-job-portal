// import { Controller, Get, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { AppService } from './app.service';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { MongoClient, ObjectId } from 'mongodb';
// import { Response } from 'express';
// import * as fs from 'fs';
// import * as path from 'path';
// import { extname } from 'path';

// @Controller('images')
// export class ImageController {
//   @Post('/image')
//   @UseInterceptors(FileInterceptor('image', {
//     storage: diskStorage({
//       destination: (req, file, cb) => {
//         const dir = './images';
//         if (!fs.existsSync(dir)) {
//           fs.mkdirSync(dir, { recursive: true });
//           console.log("not exist")
//         }
//         console.log(dir)
//         cb(null, dir);
//       },
//       filename: (req, file, callback) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const ext = extname(file.originalname);
//         const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
//         callback(null, filename);
//       },
//     }),
//     fileFilter: (req, file, callback) => {
//       if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//         return callback(new Error('Only image files are allowed!'), false);
//       }
//       callback(null, true);
//     },
//   }))
//   async handleImageUpload(@UploadedFile() image: Express.Multer.File, @Res() res: Response) {
//     try {
//       // Connect to MongoDB
//       const client = await MongoClient.connect('mongodb://192.168.0.214:27017');
//       // console.log(client)
//       const db = client.db('dwit_job_portal');
//       // console.log(db)
//       const collection = db.collection('images');
//       // console.log(collection)
//       const imageUrl = `${process.env.SERVER}/images/${image.filename}`;
//       // console.log(imageUrl)

//       // Create a new document with the image data
//       const imageDoc = {
//         filename: image.filename,
//         contentType: image.mimetype,
//         imageUrl: imageUrl
//       };

//       // Insert the image document into the database
//       await collection.insertOne(imageDoc);
//       console.log('Image saved to MongoDB');

//       // Close the MongoDB connection
//       await client.close();

//       console.log(imageUrl);
//       return res.status(HttpStatus.OK).json({ imageUrl: imageUrl });
//     } catch (err) {
//       console.error('Error saving image to MongoDB:', err);
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error saving image to MongoDB' });
//     }
//   }

//   @Get('/images/:filename')
//   async serveImage(@Param('filename') filename: string, @Res() res: Response) {
//     const filePath = path.join(__dirname, '..', 'images', filename);
//     if (fs.existsSync(filePath)) {
//       res.sendFile(filePath);
//     } else {
//       res.status(HttpStatus.NOT_FOUND).json({ error: 'File not found' });
//     }
//   }
// }
