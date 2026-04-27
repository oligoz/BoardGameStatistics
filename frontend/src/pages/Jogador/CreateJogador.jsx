import { useEffect } from "react";
import { centerContent } from "../../js/auxiliarFunctions";
import FormJogador from "../../components/forms/FormJogador";

function CreateJogador() {
  useEffect(() => {
    centerContent();
  }, []);

  return (
    <div id="center-content">
      <FormJogador type={"Criar"} />
    </div>
  );
}

export default CreateJogador;
