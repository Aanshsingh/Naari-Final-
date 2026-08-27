// admin/src/components/BannerFormModal.jsx

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Upload } from "lucide-react";

import { createBannerApi } from "../api/adminBannerApi";
import { uploadImageToCloudinary } from "../utils/uploadImage";
import { uploadVideoToCloudinary } from "../utils/uploadVideo";

export default function BannerFormModal({ onClose }) {
  const queryClient = useQueryClient();

  const [mediaType, setMediaType] = useState("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // HANDLE IMAGE / VIDEO UPLOAD
  // ============================================

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");

    try {
      let uploaded;

      if (mediaType === "video") {
        uploaded = await uploadVideoToCloudinary(file);
      } else {
        uploaded = await uploadImageToCloudinary(file);
      }

      console.log("Uploaded media:", uploaded);

      setMediaUrl(uploaded.url);
    } catch (err) {
      console.error("Media upload error:", err);

      setError(
        err.message ||
          `Failed to upload ${
            mediaType === "video" ? "video" : "image"
          }`
      );
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  };

  // ============================================
  // REMOVE MEDIA
  // ============================================

  const removeMedia = () => {
    setMediaUrl("");
  };

  // ============================================
  // CHANGE MEDIA TYPE
  // ============================================

  const changeMediaType = (type) => {
    setMediaType(type);
    setMediaUrl("");
    setError("");
  };

  // ============================================
  // SUBMIT BANNER
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!mediaUrl) {
      setError(
        `Upload ${
          mediaType === "video" ? "a video" : "an image"
        } first`
      );

      return;
    }

    const title = e.target.title.value.trim();
    const subtitle = e.target.subtitle.value.trim();
    const buttonText = e.target.buttonText.value.trim();
    const link = e.target.link.value.trim();

    const payload = {
      title,
      subtitle,
      buttonText,

      mediaType,

      image:
        mediaType === "image"
          ? mediaUrl
          : "",

      video:
        mediaType === "video"
          ? mediaUrl
          : "",

      link: link || "/shop",

      position: "hero",

      order: 0,

      isActive: true,
    };

    // IMPORTANT:
    // Check exactly what is being sent to backend
    console.log("BANNER PAYLOAD:", payload);

    setSaving(true);

    try {
      const response = await createBannerApi(payload);

      console.log(
        "Banner created successfully:",
        response.data
      );

      // Refresh admin banner list
      await queryClient.invalidateQueries({
        queryKey: ["admin-banners"],
      });

      // Close modal
      onClose();
    } catch (err) {
      console.error("CREATE BANNER ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not save banner"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0e12] border border-white/10 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6">

        {/* ============================================
            HEADER
        ============================================ */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg">
            Change Homepage Banner
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* ============================================
              MEDIA TYPE
          ============================================ */}

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                changeMediaType("image")
              }
              className={`flex-1 py-2 rounded text-xs transition ${
                mediaType === "image"
                  ? "bg-[#D4A34E] text-black"
                  : "border border-white/20 text-gray-300"
              }`}
            >
              IMAGE
            </button>

            <button
              type="button"
              onClick={() =>
                changeMediaType("video")
              }
              className={`flex-1 py-2 rounded text-xs transition ${
                mediaType === "video"
                  ? "bg-[#D4A34E] text-black"
                  : "border border-white/20 text-gray-300"
              }`}
            >
              VIDEO
            </button>

          </div>

          {/* ============================================
              MEDIA UPLOAD
          ============================================ */}

          <div>

            {mediaUrl ? (

              <div className="relative w-full h-40 bg-black rounded overflow-hidden">

                {mediaType === "video" ? (

                  <video
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />

                ) : (

                  <img
                    src={mediaUrl}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />

                )}

                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X
                    size={13}
                    className="text-white"
                  />
                </button>

              </div>

            ) : (

              <label className="w-full h-40 border border-dashed border-white/20 rounded flex flex-col items-center justify-center cursor-pointer hover:border-[#D4A34E]/60">

                {uploading ? (

                  <span className="text-xs text-gray-500">
                    Uploading...
                  </span>

                ) : (

                  <>
                    <Upload
                      size={20}
                      className="text-gray-500"
                    />

                    <span className="text-[10px] text-gray-500 mt-2">
                      Upload{" "}
                      {mediaType === "video"
                        ? "Video"
                        : "Image"}
                    </span>
                  </>

                )}

                <input
                  type="file"
                  accept={
                    mediaType === "video"
                      ? "video/*"
                      : "image/*"
                  }
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />

              </label>

            )}

          </div>

          {/* ============================================
              TITLE
          ============================================ */}

          <div>

            <label className="text-xs tracking-widest text-gray-400">
              TITLE
            </label>

            <input
              name="title"
              placeholder="Heading, e.g. Festive Edit — New In"
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />

          </div>

          {/* ============================================
              SUBTITLE
          ============================================ */}

          <div>

            <label className="text-xs tracking-widest text-gray-400">
              SUBTITLE
            </label>

            <textarea
              name="subtitle"
              placeholder="Subtext, e.g. Curated craftsmanship for the modern woman..."
              rows={2}
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E] resize-none"
            />

          </div>

          {/* ============================================
              BUTTON TEXT
          ============================================ */}

          <div>

            <label className="text-xs tracking-widest text-gray-400">
              BUTTON TEXT
            </label>

            <input
              name="buttonText"
              placeholder="SHOP NEW ARRIVALS"
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />

          </div>

          {/* ============================================
              LINK
          ============================================ */}

          <div>

            <label className="text-xs tracking-widest text-gray-400">
              BUTTON LINK
            </label>

            <input
              name="link"
              placeholder="/shop"
              defaultValue="/shop"
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />

            <p className="text-[10px] text-gray-600 mt-1">
              Example: /shop or /product/banarasi-silk-saree
            </p>

          </div>

          {/* ============================================
              ERROR
          ============================================ */}

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          {/* ============================================
              SUBMIT
          ============================================ */}

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60"
          >
            {saving
              ? "SAVING..."
              : "SET AS BANNER"}
          </button>

        </form>
      </div>
    </div>
  );
}