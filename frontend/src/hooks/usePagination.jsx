import { use } from "react";
import { useMemo, useState, useEffect } from "react";

function usePagination({ items, itemsPerPage = 18 }) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [items, itemsPerPage]);

  const maxPage = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage],
  );

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  function goToPage(page) {
    const valid = Math.min(Math.max(page, 1), maxPage);
    setCurrentPage(valid);
  }

  return { currentItems, currentPage, maxPage, goToPage };
}

export default usePagination;
