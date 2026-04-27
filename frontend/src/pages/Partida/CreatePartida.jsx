import { useEffect } from "react";
import { centerContent } from "../../js/auxiliarFunctions";
import FormPartida from "../../components/forms/FormPartida";

function CreatePartida() {
  useEffect(() => {
    centerContent();
  }, []);

  return (
    <div id="center-content">
      <FormPartida />
    </div>
  );
}

export default CreatePartida;
