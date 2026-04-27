import { useEffect } from "react";
import FormLocal from "../../components/forms/FormLocal";
import { centerContent } from "../../js/auxiliarFunctions";

function CreateLocal() {
  useEffect(() => {
    centerContent();
  }, []);

  return (
    <div id="center-content">
      <FormLocal type="Criar" />
    </div>
  );
}

export default CreateLocal;
