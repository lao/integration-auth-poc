import React, { useEffect, useState } from "react";
import { Grid, List, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FolderListItem from "../components/FolderLIstItem";
import FolderInfo from "../components/FolderInfo";

interface FolderResponse {
  id: string
  label: string
}

const URLS = {
  dropbox: 'https://api.dropboxapi.com/2/sharing/list_folders',
  googleDrive: 'https://www.googleapis.com/drive/v3/files'
}

const methods = {
  dropbox: 'post',
  googleDrive: 'get'
}

function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [folders, setFolders] = useState<FolderResponse[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const authToken = localStorage.getItem("OauthAccessToken");
  const service = localStorage.getItem("Service");
  const clientId = localStorage.getItem("ClientId");

  useEffect(() => {
    if (authToken === null || service === null) {
      localStorage.removeItem("OauthAccessToken")
      localStorage.removeItem("Service")
      navigate("/auth")
      return;
    }
    const url = URLS[service];
    const method = axios[methods[service]];

    method(
      url,
      {},
      { headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' } }
    ).then(result => {
      console.log(result.data)
      if (!result.data.entries) {
        return;
      }
      setFolders(result.data.entries.map((e) => {
        return {
          label: e.name,
          id: e.shared_folder_id
        }
      }));
    })
  }, [navigate, authToken]);

  const onSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const onSelectFolder = (name: string) => {
    setSelectedFolder(name)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Typography variant="h4">Search</Typography>
        <TextField
          placeholder="Search for your shared dropbox folders"
          onChange={onSearch}
        />
        <List>
          {folders
            .filter((folder) => {
              return searchTerm !== "" && folder.label.includes(searchTerm);
            })
            .map((f) => {
              return (
                <FolderListItem
                  key={f.id}
                  id={f.id}
                  label={f.label}
                  onClick={onSelectFolder}
                />
              );
            })}
        </List>
        {selectedFolder !== "" && <FolderInfo name={selectedFolder} />}
      </Grid>
    </Grid>
  );
}

export default HomePage;
