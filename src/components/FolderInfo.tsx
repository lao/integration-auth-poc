import React, { useState } from "react";
import { Button, CircularProgress, Container, Input, Select, TextField, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { ContentPasteOffSharp } from "@mui/icons-material";

interface FolderInfoProps {
  name: string
}

function FolderInfo({ name }: FolderInfoProps) {
  const chunkSize = 64 * 1024;
  const authToken = localStorage.getItem("OauthAccessToken");
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadInProgress, setUploadInProgress] = useState(false)
  const [offset, setOffset] = useState(0)
  const [fileSize, setFileSize] = useState(100)
  const [sessionId, setSessionId] = useState('')

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files === null) {
      return;
    }
    const file = e.target.files[0]
    setFileSize(file.size)

    uploadInChunks(file)
  }

  const uploadInChunks = async (file: File): Promise<void> => {
    await startUploadSession();
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = onChunk;

    while (offset <= file.size) {
      console.log("offset: ", offset)
      const blob: Blob = file.slice(offset, offset + chunkSize);

      fileReader.readAsText(blob);
    }

    await finishUploadSession(`${name}/${file.name}`)
  }

  const startUploadSession = async() => {
    const result = await axios.post(
      "https://content.dropboxapi.com/2/files/upload_session/start",
      "",
      {
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log("started");
    console.log(result.data);

    setUploadComplete(false);
    setUploadInProgress(true);
    setSessionId(result.data.session_id);
  }

  const finishUploadSession = async(path: string) => {
    const apiArg = {
      cursor: {
        session_id: sessionId
      },
      commit: {
        path,
        mode: "add"
      }
    }
    const result = await axios.post(
      "https://content.dropboxapi.com/2/files/upload_session/finish",
      "",
      {
        headers: {
          "Dropbox-API-Arg": JSON.stringify(apiArg),
          "Content-Type": "application/octet-stream",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log("finished")
    console.log(result)

    setUploadComplete(true);
    setUploadInProgress(false);
    setSessionId(result.data.session_id);
  }

  const onChunk = async (event: ProgressEvent<FileReader>): Promise<void> => {
    const target = (event.target) as FileReader;
    if (target.error === null) {
      const result = (target.result) as string;
      await uploadChunk(result)
      setOffset(prevOffset => prevOffset + result.length)
    } else {
      console.log(target.error)
    }
  };

  const uploadChunk = async (chunk: string): Promise<void> => {
    const apiArg = {
      cursor: {
        session_id: sessionId,
        offset
      }
    };

    try {
      await axios.post(
        "https://content.dropboxapi.com/2/files/upload_session/append_v2",
        chunk,
        {
          headers: {
            "Dropbox-API-Arg": JSON.stringify(apiArg),
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("chunk uploaded", offset)
    } catch (error) {
      console.log(error)
    }
  }

  // const onFileSelected = async (fileSelectedEvent) => {
  //   const reader = new FileReader();
  //   const file = fileSelectedEvent.target.files[0]

  //   reader.addEventListener("load", async (readerEvent: ProgressEvent) => {
  //     const target: FileReader = readerEvent.target as FileReader;
  //     const apiArg = {
  //       path: `/${name}/${file.name}`,
  //       mode: "add"
  //     };
  //     if (target.error !== null) {
  //       return;
  //     }
  //     if (target.result === null) {
  //       return;
  //     }
  //     setUploadComplete(false)
  //     setUploadInProgress(true)

  //     const result = await axios.post(
  //       "https://content.dropboxapi.com/2/files/upload",
  //       target.result,
  //       {
  //         headers: {
  //           "Dropbox-API-Arg": JSON.stringify(apiArg),
  //           "Content-Type": "application/octet-stream",
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );
  //     setUploadComplete(true)
  //     setUploadInProgress(false);
  //   })
  //   reader.readAsText(file);

  // }

  return (
    <Container>
      <Button variant="contained" component="label">
        <input hidden type="file" onChange={onSelectFile} />
        <AddIcon />
        <Typography variant="h6">Add File to '{name}'</Typography>
      </Button>
      <br />
      {uploadInProgress ? (
        <CircularProgress value={offset / fileSize} />
      ) : (
        uploadComplete && <CheckIcon />
      )}
    </Container>
  );
}

export default FolderInfo;
