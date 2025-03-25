import dotenv from 'dotenv';
import { v2 as cloudinaryV2 } from 'cloudinary';

// Load env file
dotenv.config();


// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the CloudinaryResult interface because result.url was unknown
export interface CloudinaryResult {
  url: string;
  public_id: string;
}

// Function to upload images to Cloudinary
export const uploadToCloudinary = (file: Buffer, folder: string): Promise<CloudinaryResult> => {
  return new Promise((resolve, reject) => {
    cloudinaryV2.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error('Failed to upload to Cloudinary'));
        }
        if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    ).end(file);
  });
};

export default cloudinaryV2;
