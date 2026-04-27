import "../../styles/Form.css";
import { CSpinner, CButton, CFormInput } from "@coreui/react";

function FormJogo({ handleSearch, loading }) {
  return (
    <form onSubmit={handleSearch} className="d-flex gap-3">
      <CFormInput
        id="nome"
        name="nome"
        type="text"
        size="sm"
        placeholder="Nome do Jogo"
        aria-label="Nome do Jogo"
        className="bg-secondary"
        required
      />
      {loading ? (
        <CSpinner color="light" />
      ) : (
        <>
          <CButton color="dark" type="submit">
            Buscar
          </CButton>
        </>
      )}
    </form>
  );
}

export default FormJogo;
