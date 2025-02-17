import { diskStorage } from 'multer';
import { extname } from 'path';
import * as multer from 'multer';

export const imageUploadOptions = (destination: string) => {
  return {
    storage: diskStorage({
      destination,
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
    limits: {
      fileSize: 5 * 1024 * 1024, // Optional: 5MB file size limit
    },
  };
};

export const pdfUploadOptions = (destination: string) => {
  return {
    storage: diskStorage({
      destination,
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf)$/)) {
        return callback(new Error('Only pdf files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // Optional: 5MB file size limit
    },
  };
};

export const bulkUpload = () => {
  return {
    storage: multer?.memoryStorage(), // Use memory storage for keeping file temporarily
    fileFilter: (req, file, callback) => {
      // Validate file type
      if (!file.originalname.match(/\.(csv|xlsx)$/)) {
        return callback(
          new Error('Only csv or xlsx files are allowed!'),
          false,
        );
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // Optional: 5MB file size limit
    },
  };
};
