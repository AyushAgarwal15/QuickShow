import React from "react";
import BlurCircle from "./BlurCircle";
import { motion as Motion } from "framer-motion";
import { FileQuestionIcon } from "lucide-react";

const EmptyState = ({ title = "Nothing here", subtitle = "Please check back later." }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-screen relative text-center max-w-screen"
    >
      <BlurCircle top="-40px" left="-40px" />
      <BlurCircle bottom="-40px" right="-40px" />
      <FileQuestionIcon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </Motion.div>
  );
};

export default EmptyState; 