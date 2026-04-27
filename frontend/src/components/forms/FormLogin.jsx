import { useState } from "react";
import "../../styles/Form.css";
import api from "../../api";
import { ACCESS_TOKEN } from "../../constants";
import { CButton, CFormInput, CSpinner } from "@coreui/react";
import { useNavigate, NavLink } from "react-router-dom";
import useUserStore from "../../store/userStore";

function FormLogin() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();
  const fetchUser = useUserStore((state) => state.fetchUser);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await api.post("api/auth/login/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.token);
      fetchUser();
      navigate("/");
    } catch (error) {
      formEl.reset();
      setErro(true);
      // alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="form-container bg-darkgray">
      <h1>Login</h1>
      {erro ? (
        <div className="alert alert-danger form-input text-center m-0">
          Usuario ou senha inválidos.
        </div>
      ) : null}
      <CFormInput
        id="username"
        name="username"
        className="bg-secondary mt-2"
        type="text"
        placeholder="Username"
        aria-label="Username"
        required
      />
      <CFormInput
        id="password"
        name="password"
        className="bg-secondary mt-2"
        type="password"
        placeholder="Password"
        aria-label="Password"
        required
      />
      {loading ? (
        <CSpinner color="light" />
      ) : (
        <>
          <CButton
            color="cornflowerblue"
            className="form-button fw-bold mt-3"
            type="submit"
          >
            Login
          </CButton>
          <NavLink to="/register" className="mt-0">
            Não tem uma conta? Registre-se aqui.
          </NavLink>
        </>
      )}
    </form>
  );
}

export default FormLogin;
