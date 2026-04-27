import { useState, useEffect } from "react";
import usePagination from "../../hooks/usePagination";
import JogoCard from "../cards/JogoCard";
import { CPagination, CPaginationItem } from "@coreui/react";

function JogoPaginatedList({ items }) {
  const windowWidth = window.innerWidth;
  const cardMaxWidth =
    20 * parseFloat(getComputedStyle(document.documentElement).fontSize);
  let itemsPerPage = 18;
  if (windowWidth < 2 * cardMaxWidth) {
    itemsPerPage = 6;
  } else if (windowWidth < 4 * cardMaxWidth) {
    itemsPerPage = 12;
  } else {
    itemsPerPage = 18;
  }
  const { currentItems, currentPage, maxPage, goToPage } = usePagination({
    items,
    itemsPerPage,
  });

  return (
    <div className="border rounded mt-3 p-3 bg-dark">
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {items.length === 0 && <h2>Nenhum jogo encontrado</h2>}
        {items.map((jogo) => (
          <JogoCard
            key={jogo.id}
            id={jogo.id}
            nome={jogo.name}
            anoLancamento={jogo.yearpublished}
            expansao={jogo.is_expansion}
            style={
              currentItems.some((item) => item.id === jogo.id)
                ? null
                : {
                    display: "none",
                  }
            }
          />
        ))}
      </div>
      {items.length > itemsPerPage && (
        <div className="d-flex justify-content-center mt-3">
          <CPagination
            className="jogo-pagination"
            aria-label="Page navigation example"
          >
            <CPaginationItem
              aria-label="Previous"
              onClick={() => goToPage(currentPage - 1)}
            >
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            {maxPage <= 8 ? (
              [...Array(maxPage)].map((_, index) => (
                <CPaginationItem
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => goToPage(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))
            ) : (
              <>
                {currentPage >= 3 && (
                  <CPaginationItem
                    active={currentPage === 1}
                    onClick={() => goToPage(1)}
                  >
                    1
                  </CPaginationItem>
                )}
                {currentPage >= 4 && (
                  <CPaginationItem disabled>...</CPaginationItem>
                )}
                {currentPage === 1 ? (
                  <>
                    <CPaginationItem key={1} active={true}>
                      {1}
                    </CPaginationItem>
                    <CPaginationItem key={2} onClick={() => goToPage(2)}>
                      2
                    </CPaginationItem>
                    <CPaginationItem key={3} onClick={() => goToPage(3)}>
                      3
                    </CPaginationItem>
                  </>
                ) : currentPage === maxPage ? (
                  <>
                    <CPaginationItem
                      key={maxPage - 2}
                      onClick={() => goToPage(maxPage - 2)}
                    >
                      {maxPage - 2}
                    </CPaginationItem>
                    <CPaginationItem
                      key={maxPage - 1}
                      onClick={() => goToPage(maxPage - 1)}
                    >
                      {maxPage - 1}
                    </CPaginationItem>
                    <CPaginationItem key={maxPage} active={true}>
                      {maxPage}
                    </CPaginationItem>
                  </>
                ) : (
                  [...Array(3)].map((_, index) => (
                    <CPaginationItem
                      key={currentPage + index - 1}
                      active={currentPage + index - 1 === currentPage}
                      onClick={() => goToPage(currentPage + index - 1)}
                    >
                      {currentPage + index - 1}
                    </CPaginationItem>
                  ))
                )}
                {currentPage <= maxPage - 3 && (
                  <CPaginationItem disabled>...</CPaginationItem>
                )}
                {currentPage <= maxPage - 2 && (
                  <CPaginationItem
                    active={currentPage === maxPage}
                    onClick={() => goToPage(maxPage)}
                  >
                    {maxPage}
                  </CPaginationItem>
                )}
              </>
            )}
            <CPaginationItem
              aria-label="Next"
              onClick={() => goToPage(currentPage + 1)}
            >
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </div>
      )}
    </div>
  );
}

export default JogoPaginatedList;
