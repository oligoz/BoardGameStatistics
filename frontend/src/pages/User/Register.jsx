import { useEffect } from "react";
import { centerContent } from "../../js/auxiliarFunctions";
import FormRegister from "../../components/forms/FormRegister";

function Register() {
  useEffect(() => {
    centerContent();
  }, []);
  return (
    <div id="center-content">
      <FormRegister />
    </div>
  );
}

export default Register;
