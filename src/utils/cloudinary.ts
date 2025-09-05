import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { logger } from "./logger";

const svgToDataUrl = (svgContent: string): string => {
  const encodedSvg = Buffer.from(svgContent).toString("base64");
  return `data:image/svg+xml;base64,${encodedSvg}`;
};

cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

export const uploadToCloudinary = async (
  file: string,
  isSvg: boolean = false
): Promise<UploadApiResponse> => {
  try {

    if (isSvg) {
      const dataUrl = svgToDataUrl(file);

      return await cloudinary.uploader.upload(dataUrl, {
        folder: "church/profiles",
        public_id: `avatar_${Date.now()}`,
        resource_type: "image",
        format: "svg",
      });
    };
    return await cloudinary.uploader.upload(file, {
        folder: "coroute/profiles",
      });
  } catch (error) {
    logger.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

export default cloudinary;
