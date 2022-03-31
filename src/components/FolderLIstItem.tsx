import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import axios from "axios";

interface FolderListItemProps {
  id: string;
  label: string;
  onClick: Function;
}

function FolderListItem({ id, label, onClick }: FolderListItemProps) {
  const [emails, setEmails] = useState<string>("");

  useEffect(() => {
    const url = "https://api.dropboxapi.com/2/sharing/list_folder_members";
    const authToken = localStorage.getItem("OauthAccessToken");
    setEmails("")

    axios
      .post(
        url,
        { shared_folder_id: id },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((result) => {
        console.log(result.data);
        const invitees: string[] = result.data.invitees.map(
          (inv) => inv.invitee.email
        );
        const users: string[] = result.data.users.map(
          (user) => user.user.email
        );
        setEmails([...invitees, ...users].join(", "))
      });
  }, [id, label])


  return (
    <ListItem>
      <ListItemButton href="#" onClick={() => onClick(label, id)}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={label} secondary={emails === '' ? '---' : emails} />
      </ListItemButton>
    </ListItem>
  );
}

export default FolderListItem;
