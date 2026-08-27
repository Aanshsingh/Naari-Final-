// admin/src/utils/uploadVideo.js
export async function uploadVideoToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "naari_product_images"); // same unsigned preset works for both, unless you set video-specific limits

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/zvlutffk/video/upload`, 
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.message || "Video upload failed");
  }

  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}
