import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import "./MessageInput.css";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      console.log("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    onSend({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="message-input-container">
      {imagePreview && (
        <div className="message-preview">
          <div className="preview-image-container">
            <img
              src={imagePreview}
              alt="Preview"
              className="preview-image"
            />
            <button
              onClick={removeImage}
              className="remove-image-btn"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          className="message-text-input"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="file-input"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="message-action-btn image-btn"
        >
          <Image size={20} />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="message-action-btn send-btn"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput; 