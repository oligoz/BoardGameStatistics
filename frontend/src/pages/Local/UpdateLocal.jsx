import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { centerContent } from "../../js/auxiliarFunctions";
import api from "../../api";
import FormLocal from "../../components/forms/FormLocal";

function UpdateLocal() {
  const [local, setLocal] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    centerContent();
  }, []);

  useEffect(() => {
    api
      .get("/api/local/detail/" + id + "/")
      .then((res) => res.data)
      .then((data) => {
        setLocal(data);
      })
      .catch((error) => alert(error));
  }, [id]);

  return (
    <div id="center-content">
      <FormLocal type={"Atualizar"} local={local} />
    </div>
  );
}

export default UpdateLocal;
