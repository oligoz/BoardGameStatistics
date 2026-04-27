import { useEffect } from "react";
import FormLogin from "../../components/forms/FormLogin";
import { centerContent } from "../../js/auxiliarFunctions";

function Login() {
  useEffect(() => {
    centerContent();
  }, []);

  return (
    <div id="center-content">
      <FormLogin />
    </div>
  );
}

export default Login;
