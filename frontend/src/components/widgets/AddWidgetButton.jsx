import React from 'react';
import { Plus } from 'lucide-react';

const AddWidgetButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition duration-150 ease-in-out"
      onClick={onClick}
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Widget
    </button>
  );
};

export default AddWidgetButton;
