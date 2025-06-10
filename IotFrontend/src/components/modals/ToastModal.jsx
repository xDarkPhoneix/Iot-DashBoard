// Toast.jsx
import { useEffect } from "react";
import { X } from "lucide-react";

const Toast = ({ type = "success", message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  }[type];

  return (
    <div className={`fixed top-5 right-5 z-50 text-white shadow-xl rounded-xl px-5 py-3 flex items-center gap-3 ${bgColor}`}>
      <span>{message}</span>
      <button onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
