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

function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [folders, setFolders] = useState<FolderResponse[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const authToken = localStorage.getItem("OauthAccessToken");

  useEffect(() => {
    if (authToken === null) {
      navigate("/auth")
      return;
    }
    const url = "https://api.dropboxapi.com/2/sharing/list_folders";

    axios.post(
      url,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    ).then(result => {
      console.log(result.data)
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
