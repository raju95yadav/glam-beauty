import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:border-pink-600 hover:text-pink-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <ChevronLeft className="size-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`size-10 rounded-lg border font-bold text-sm transition-all ${
            currentPage === page
              ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-100'
              : 'border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:border-pink-600 hover:text-pink-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
};

export default Pagination;
