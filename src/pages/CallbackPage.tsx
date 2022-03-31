import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function CallbackPage() {
  let { service } = useParams();
  const search = new URLSearchParams(useLocation().search);
  const code = search.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    if (code === null) {
      console.log("empty code")
      return
    } else {
      console.log("code = ", code)
    }

    axios
      .post(`http://localhost:3001/integration/oauth2/token/${service}?code=${code}`)
      .then(function (response) {
        //TODO change this functionality to take into account differnet services
        console.log(response.data)
        const accessToken = response.data.access_token;

        localStorage.setItem("OauthAccessToken", accessToken)
        localStorage.setItem("Service", service || '')
        navigate(`/${service}`)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [code])

  return <CircularProgress />;
}

export default CallbackPage;
