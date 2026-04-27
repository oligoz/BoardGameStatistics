import { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCardFooter,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCheckAlt } from "@coreui/icons";

function JogoCard({ id, nome, anoLancamento, expansao, handleClick, style }) {
  const [selected, setSelected] = useState(false);

  const handleSelectCardClick = () => {
    setSelected(!selected);
    const checkbox = document.getElementById(`id-${id}`);
    checkbox.checked = selected;
  };

  return (
    <CCard
      id={id}
      className={
        (selected
          ? "border-cornflowerblue position-relative"
          : "border-granite") + " flex-1"
      }
      textBgColor="dark"
      style={{
        minWidth: "15rem",
        maxWidth: "20rem",
        cursor: "pointer",
        ...style,
      }}
      onClick={handleClick ? handleClick : handleSelectCardClick}
    >
      <CCardBody>
        <CCardTitle>{nome}</CCardTitle>
        <CCardText className="mt-auto">{anoLancamento}</CCardText>
      </CCardBody>
      <CCardFooter className="fst-italic mt-auto">
        {expansao ? "expansão" : "Jogo base"}
      </CCardFooter>
      {selected && (
        <CBadge position="top-end" shape="rounded-circle">
          <CIcon icon={cilCheckAlt} className="text-success" size="xxl" />
        </CBadge>
      )}
      <input
        id={`id-${id}`}
        type="checkbox"
        checked={selected}
        onChange={handleSelectCardClick}
        hidden
        data-values={JSON.stringify({
          bggId: id,
          nome: nome,
          anoLancamento: anoLancamento,
          isExpansao: expansao,
        })}
      />
    </CCard>
  );
}

export default JogoCard;
