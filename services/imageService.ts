import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (
  file: any,
  folderName: string
): Promise<{ success: boolean; data?: any }> => {
  try {
    if (!file) {
      return { success: true, data: null };
    }
    if (typeof file === "string") {
      return { success: true, data: file };
    }
    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name || "image",
        type: file.type || "image/jpeg",
      } as any);

      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return { success: true, data: data.secure_url };
    }

    return { success: false, data: null };
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return { success: false, data: null };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object" && file.uri) return file.uri;
  return require("@/assets/images/defaultAvatar.png");
};

export const getFilePath = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object" && file.uri) return { uri: file.uri };
  return require("@/assets/images/defaultAvatar.png");
};
