// frontend/src/components/common/Pagination.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className = '',
  size = 'md'
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    // Adjust if we're near the beginning
    if (currentPage <= half) {
      end = Math.min(totalPages, maxVisiblePages);
    }

    // Adjust if we're near the end
    if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const PageButton = ({ 
    page, 
    isActive = false, 
    isDisabled = false, 
    children, 
    ariaLabel 
  }) => (
    <button
      onClick={() => !isDisabled && !isActive && onPageChange(page)}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={`
        ${sizeClasses[size]}
        border border-gray-300 font-medium transition-colors duration-150
        ${isActive 
          ? 'bg-blue-600 text-white border-blue-600 z-10 relative' 
          : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-500'
        }
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
        }
        ${isActive || isDisabled ? '' : 'hover:z-10 hover:relative'}
        focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
    >
      {children}
    </button>
  );

  const EllipsisSpan = () => (
    <span className={`${sizeClasses[size]} border border-gray-300 bg-white text-gray-500`}>
      ...
    </span>
  );

  return (
    <nav 
      className={`flex items-center justify-center ${className}`}
      aria-label="Pagination"
    >
      <div className="flex -space-x-px">
        {/* First page button */}
        {showFirstLast && currentPage > 1 && (
          <PageButton
            page={1}
            isDisabled={currentPage === 1}
            ariaLabel={t('pagination.first')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </PageButton>
        )}

        {/* Previous page button */}
        {showPrevNext && (
          <PageButton
            page={currentPage - 1}
            isDisabled={currentPage === 1}
            ariaLabel={t('pagination.previous')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </PageButton>
        )}

        {/* Page numbers */}
        {showPageNumbers && (
          <>
            {/* Show ellipsis if there are hidden pages at the beginning */}
            {visiblePages[0] > 1 && (
              <>
                <PageButton page={1} ariaLabel={`${t('pagination.page')} 1`}>
                  1
                </PageButton>
                {visiblePages[0] > 2 && <EllipsisSpan />}
              </>
            )}

            {/* Visible page numbers */}
            {visiblePages.map(page => (
              <PageButton
                key={page}
                page={page}
                isActive={page === currentPage}
                ariaLabel={`${t('pagination.page')} ${page}${page === currentPage ? ` (${t('pagination.current')})` : ''}`}
              >
                {page}
              </PageButton>
            ))}

            {/* Show ellipsis if there are hidden pages at the end */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && <EllipsisSpan />}
                <PageButton 
                  page={totalPages} 
                  ariaLabel={`${t('pagination.page')} ${totalPages}`}
                >
                  {totalPages}
                </PageButton>
              </>
            )}
          </>
        )}

        {/* Next page button */}
        {showPrevNext && (
          <PageButton
            page={currentPage + 1}
            isDisabled={currentPage === totalPages}
            ariaLabel={t('pagination.next')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </PageButton>
        )}

        {/* Last page button */}
        {showFirstLast && currentPage < totalPages && (
          <PageButton
            page={totalPages}
            isDisabled={currentPage === totalPages}
            ariaLabel={t('pagination.last')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </PageButton>
        )}
      </div>
    </nav>
  );
};

// Simple pagination with just prev/next
export const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
  className = ''
}) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('pagination.previous')}
      </button>

      {showPageInfo && (
        <span className="text-sm text-gray-700">
          {t('pagination.pageInfo', { current: currentPage, total: totalPages })}
        </span>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('pagination.next')}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// Pagination with items per page selector
export const PaginationWithPageSize = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = ''
}) => {
  const { t } = useTranslation();

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4 text-sm text-gray-700">
        <span>
          {t('pagination.showing')} {startItem} {t('pagination.to')} {endItem} {t('pagination.of')} {totalItems} {t('pagination.results')}
        </span>
        
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm font-medium">
            {t('pagination.perPage')}:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Pagination;