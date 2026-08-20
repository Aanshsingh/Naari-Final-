export async function uploadImageToCloudinary(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "naari_product_images");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/zvlutffk/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  console.log("Cloudinary response:", data);

  if (!res.ok) {
    throw new Error(
      data.error?.message || "Image upload failed"
    );
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}