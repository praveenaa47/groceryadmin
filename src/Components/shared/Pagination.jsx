import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = '',
  size = 'medium' 
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const sizeClasses = {
    small: {
      button: 'h-8 w-8 text-sm',
      icon: 'h-3 w-3'
    },
    medium: {
      button: 'h-10 w-10 text-sm',
      icon: 'h-4 w-4'
    },
    large: {
      button: 'h-12 w-12 text-base',
      icon: 'h-5 w-5'
    }
  };

  const currentSizeClasses = sizeClasses[size];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const visiblePages = getVisiblePages();

  const baseButtonClasses = `
    ${currentSizeClasses.button}
    flex items-center justify-center
    border border-gray-300 
    text-gray-500 
    hover:bg-gray-50 hover:text-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500
    transition-colors duration-200
  `;

  const activeButtonClasses = `
    ${currentSizeClasses.button}
    flex items-center justify-center
    bg-blue-600 border-blue-600 text-white
    hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-colors duration-200
  `;

  if (totalPages <= 1) {
    return null; 
  }

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* First page button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`${baseButtonClasses} rounded-l-md`}
          aria-label="Go to first page"
        >
          <ChevronsLeft className={currentSizeClasses.icon} />
        </button>
      )}

      {/* Previous page button */}
      {showPrevNext && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${baseButtonClasses} ${!showFirstLast ? 'rounded-l-md' : ''}`}
          aria-label="Go to previous page"
        >
          <ChevronLeft className={currentSizeClasses.icon} />
        </button>
      )}

      {/* Show ellipsis if there are hidden pages at the beginning */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={baseButtonClasses}
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page number buttons */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={page === currentPage ? activeButtonClasses : baseButtonClasses}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Show ellipsis if there are hidden pages at the end */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={baseButtonClasses}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next page button */}
      {showPrevNext && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${baseButtonClasses} ${!showFirstLast ? 'rounded-r-md' : ''}`}
          aria-label="Go to next page"
        >
          <ChevronRight className={currentSizeClasses.icon} />
        </button>
      )}

      {/* Last page button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${baseButtonClasses} rounded-r-md`}
          aria-label="Go to last page"
        >
          <ChevronsRight className={currentSizeClasses.icon} />
        </button>
      )}
    </div>
  );
};


export default Pagination;