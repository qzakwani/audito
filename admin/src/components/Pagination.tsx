import React from "react";
import styled from "styled-components";

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 36px;
  padding: 0 8px;
  margin: 0 4px;
  border-radius: 4px;
  border: 1px solid ${({ isActive }) => (isActive ? "#4945ff" : "#dcdce4")};
  background-color: ${({ isActive }) => (isActive ? "#4945ff" : "#ffffff")};
  color: ${({ isActive }) => (isActive ? "#ffffff" : "#32324d")};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#3933e4" : "#f6f6f9")};
    border-color: ${({ isActive }) => (isActive ? "#3933e4" : "#d9d8ff")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f6f6f9;
    color: #666687;
    border-color: #dcdce4;
  }
`;

const PageEllipsis = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 36px;
  padding: 0 8px;
  margin: 0 4px;
  color: #666687;
  font-size: 14px;
`;

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageCount,
  onPageChange,
}) => {
  if (pageCount <= 1) return null;

  const generatePageNumbers = () => {
    let pages = [];
    const maxVisiblePages = 5;

    // Always show first and last page
    if (pageCount <= maxVisiblePages) {
      // Less than max pages, show all
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // More than max pages, show with ellipsis
      pages.push(1);

      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(pageCount - 1, currentPage + 1);

      // Adjust to always show 3 middle pages when possible
      if (startPage === 2) endPage = Math.min(pageCount - 1, 4);
      if (endPage === pageCount - 1) startPage = Math.max(2, pageCount - 3);

      // Add ellipsis before middle pages if needed
      if (startPage > 2) pages.push("ellipsis1");

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis after middle pages if needed
      if (endPage < pageCount - 1) pages.push("ellipsis2");

      // Add last page
      pages.push(pageCount);
    }
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </PageButton>

      {pages.map((page, index) => {
        if (page === "ellipsis1" || page === "ellipsis2") {
          return <PageEllipsis key={`ellipsis-${index}`}>...</PageEllipsis>;
        }

        return (
          <PageButton
            key={`page-${page}`}
            isActive={page === currentPage}
            onClick={() => page !== currentPage && onPageChange(page as number)}
          >
            {page}
          </PageButton>
        );
      })}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        Next
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
