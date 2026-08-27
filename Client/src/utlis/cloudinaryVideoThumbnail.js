export function getCloudinaryVideoThumbnail(videoUrl) {
  if (!videoUrl) return "";

  return videoUrl
    .replace("/video/upload/", "/video/upload/so_0/")
    .replace(/\.(mp4|webm|mov|m4v)$/i, ".jpg");
}