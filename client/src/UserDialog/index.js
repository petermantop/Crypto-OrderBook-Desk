import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useSocket } from "../SocketContext";

const IdentificationDialog = ({ open, onClose }) => {
  const { socket } = useSocket();
  const [name, setName] = useState("");

  const handleIdentification = () => {
    socket.emit("identify", name);
    onClose(); // Close the dialog after sending the identification
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Identify Yourself</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to crypto pairs, please enter your name.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleIdentification}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdentificationDialog;
