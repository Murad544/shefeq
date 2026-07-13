import { useState } from "react";

export const useResultDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const openDialog = (type, message) => {
    setDialogType(type);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType("");
    setDialogMessage("");
  };

  const onOpenProfile = () => {
    closeDialog();
  };

  return {
    dialogOpen,
    dialogType,
    dialogMessage,
    openDialog,
    closeDialog,
    onOpenProfile,
  };
};

export default useResultDialog;
