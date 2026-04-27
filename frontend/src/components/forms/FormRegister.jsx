import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { CButton, CFormInput, CSpinner } from "@coreui/react";
import "../../styles/Form.css";

function FormRegister() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    // const local = formData.get("local");
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const codigo_convite = formData.get("codigo_convite");

    try {
      const res = await api.post("api/auth/register/", {
        username,
        password,
        email,
        first_name,
        last_name,
        codigo_convite,
      });
      navigate("/login");
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container  bg-darkgray">
      <h1>Register</h1>
      <CFormInput
        id="username"
        name="username"
        className="bg-secondary mt-2"
        type="text"
        placeholder="Username"
        required
        {...(errors.username
          ? {
              invalid: true,
              feedback: errors.username.join(" "),
            }
          : null)}
      />
      <CFormInput
        id="password"
        name="password"
        className="bg-secondary mt-2"
        type="password"
        placeholder="Senha"
        required
        {...(errors.password
          ? {
              invalid: true,
              feedback: errors.password.join(" "),
            }
          : null)}
      />
      <CFormInput
        id="email"
        name="email"
        className="bg-secondary mt-2"
        type="email"
        placeholder="Email"
        {...(errors.email
          ? {
              invalid: true,
              feedback: errors.email.join(" "),
            }
          : null)}
      />
      <CFormInput
        id="first_name"
        name="first_name"
        className="bg-secondary mt-2"
        type="text"
        placeholder="Nome"
        required
        {...(errors.first_name
          ? {
              invalid: true,
              feedback: errors.first_name.join(" "),
            }
          : null)}
      />
      <CFormInput
        id="last_name"
        name="last_name"
        className="bg-secondary mt-2"
        type="text"
        placeholder="Sobrenome"
        {...(errors.last_name
          ? {
              invalid: true,
              feedback: errors.last_name.join(" "),
            }
          : null)}
      />
      <CFormInput
        id="codigo_convite"
        name="codigo_convite"
        className="bg-secondary mt-2"
        type="text"
        placeholder="Código de Convite"
        required
        {...(errors.codigo_convite
          ? {
              invalid: true,
              feedback: errors.codigo_convite,
            }
          : null)}
      />
      {loading ? (
        <CSpinner color="light" />
      ) : (
        <CButton
          color="cornflowerblue"
          className="form-button fw-bold mt-3"
          type="submit"
        >
          Criar conta
        </CButton>
      )}
    </form>
  );
}

export default FormRegister;
