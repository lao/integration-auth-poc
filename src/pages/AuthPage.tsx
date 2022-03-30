import { Button } from "@mui/material";
import React from "react";

function AuthPage() {
  const authUrl = `http://localhost:3001/redirect/dropbox/auth`;

  return (
    <div>
      <Button variant="outlined" href={authUrl}>Authorize Dropbox</Button>
    </div>
  )
}

export default AuthPage
