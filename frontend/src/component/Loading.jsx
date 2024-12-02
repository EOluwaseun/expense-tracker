import { FaSpinner } from 'react-icons/fa';
const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center py-2">
      <FaSpinner className="animate-spin text-violet-600" size={24} />
    </div>
  );
};

export default Loading;
