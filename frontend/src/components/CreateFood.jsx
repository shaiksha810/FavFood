import React, { useState, useRef } from "react";
import "../styles/createfood.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL; // 👈 ye env se aayega


const FoodCreationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    video: null,
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          video: "File size must be less than 50MB",
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("video/")) {
        setErrors((prev) => ({
          ...prev,
          video: "Please select a valid video file",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        video: file,
      }));

      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);

      // Clear video error
      if (errors.video) {
        setErrors((prev) => ({
          ...prev,
          video: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Recipe name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Recipe name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    if (!formData.video) {
      newErrors.video = "Video is required";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // console.log("Form submitted:", {
      //   name: formData.name,
      //   description: formData.description,
      //   video: formData.video.name,
      //   // videoSize: formData.video.size,
      // });


      const response = await axios.post(`${API_URL}/api/food`,
      formData,
      {withCredentials:true,
        headers: {
          "Content-Type": "multipart/form-data", // important!
        },
      })
      
      console.log(response.data);
      
     navigate('/')
      // alert("Recipe created successfully! 🎉");

      // Reset form
      setFormData({ name: "", description: "", video: null });
      setVideoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerVideoUpload = () => {
    fileInputRef.current?.click();
  };

  // Cleanup video URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="header-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 011.05-1.54 5 5 0 018.07 0A5.11 5.11 0 0117.59 6 4 4 0 0119 13.87V21H5v-7.13z" />
            <line x1="6" y1="17" x2="18" y2="17" />
            <line x1="6" y1="13" x2="18" y2="13" />
          </svg>
        </div>
        <h1 className="title">Create Your Recipe</h1>
        <p className="subtitle">Share your delicious creation with the world</p>
      </div>

      {/* Form */}
      <div className="food-form">
        {/* Video Upload */}
        <div className="form-group">
          <label className="form-label">
            <span className="label-text">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Recipe Video
            </span>
            <span className="label-hint">
              Upload a video of your cooking process
            </span>
          </label>

          <div className="video-input-wrapper">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="video-input"
            />

            <div
              onClick={triggerVideoUpload}
              className={`video-preview ${errors.video ? "error" : ""}`}
            >
              {videoPreview ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <video
                    src={videoPreview}
                    className="video-display"
                    muted
                    autoPlay
                    loop
                    playsInline
                    controls
                  />

                  <div className="video-overlay">
                    <p className="overlay-text">Click to change video</p>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <svg
                    className="upload-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <path d="M12 18v-6" />
                    <path d="M9 15l3-3 3 3" />
                  </svg>
                  <p className="upload-text">Click to upload video</p>
                  <p className="upload-subtext">MP4, MOV, AVI up to 50MB</p>
                </div>
              )}
            </div>
          </div>

          {errors.video && (
            <div className="error-message">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {errors.video}
            </div>
          )}
        </div>

        {/* Recipe Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <span className="label-text">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
              Recipe Name
            </span>
            <span className="label-hint">Give your recipe a catchy name</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Grandma's Secret Pasta"
            className={`form-input ${
              errors.name
                ? "error"
                : formData.name.trim().length > 0
                ? "success"
                : ""
            }`}
          />
          {errors.name && (
            <div className="error-message">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {errors.name}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            <span className="label-text">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
              Description
            </span>
            <span className="label-hint">
              Describe your recipe and cooking tips
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Share the story behind your recipe, key ingredients, cooking tips, or what makes it special..."
            className={`form-textarea ${
              errors.description
                ? "error"
                : formData.description.trim().length > 0
                ? "success"
                : ""
            }`}
          />
          <p
            className={`character-counter ${
              formData.description.length > 500 ? "error" : ""
            }`}
          >
            {formData.description.length}/500 characters
          </p>
          {errors.description && (
            <div className="error-message">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {errors.description}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`submit-btn ${isSubmitting ? "loading" : ""}`}
        >
          {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
        </button>
      </div>

      {/* Footer */}
      <div className="footer-text">
        <p>
          By creating a recipe, you agree to share your culinary creation with
          our community.
        </p>
      </div>
    </div>
  );
};

export default FoodCreationForm;
