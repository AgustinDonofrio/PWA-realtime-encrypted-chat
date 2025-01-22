import axios from "axios";

export const uploadToCloudinary = async (
  file: File
): Promise<string | false> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudPreset = file.type.startsWith("image/")
    ? import.meta.env.VITE_CLOUDINARY_UPLOAD_IMG_PRESET
    : import.meta.env.VITE_CLOUDINARY_UPLOAD_VIDEO_PRESET;

  console.log(cloudName);
  console.log(cloudPreset);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudPreset);

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    console.error("El archivo no es una imagen ni un video");
    return false;
  }

  try {
    const uploadUrl = isImage
      ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("--------->", response, "<---------------");

    if (response.status === 200) {
      // Si la carga fue exitosa, devolvemos la URL segura
      return response.data.secure_url;
    } else {
      console.error("Error al subir el archivo:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error al subir el archivo: ", error);
    return false;
  }
};
