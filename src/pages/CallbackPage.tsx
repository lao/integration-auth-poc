import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CallbackPage() {
  const search = useLocation().search;
  const code = new URLSearchParams(search).get("code");
  const navigate = useNavigate();

  useEffect(() => {
    if (code === null) {
      console.log("empty code")
      return
    } else {
      console.log("code = ", code)
    }

    axios
      .post(`http://localhost:3001/integration/oauth2/token?code=${code}`)
      .then(function (response) {
        console.log(response.data)
        const accessToken = response.data.access_token;

        localStorage.setItem("DropboxAccessToken", accessToken)
        navigate("/")
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [code])

  return <CircularProgress />;
}

export default CallbackPage;
