import { Button } from "@mui/material";
import React from "react";

function AuthPage() {
  const authDropboxUrl = `http://localhost:3001/integration/authorize/dropbox`;
  const authGoogleUrl = `http://localhost:3001/integration/authorize/googledrive`;

  return (
    <div>
      <Button variant="outlined" href={authDropboxUrl}>Authorize Dropbox</Button>
      <Button variant="outlined" href={authGoogleUrl}>Authorize GoogleDrive</Button>
    </div>
  )
}

export default AuthPage
