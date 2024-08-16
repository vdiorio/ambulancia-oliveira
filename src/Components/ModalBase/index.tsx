import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import useStyles from "./style";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  open?: boolean;
  onClose?: () => void;
  editingBase: string;
  createEditBase: (name: string) => void;
}

export default function ModalBase({
  open = false,
  onClose,
  editingBase,
  createEditBase,
}: Props) {
  const style = useStyles();

  const { handleSubmit, reset, watch, register } = useForm<{ name: string }>({
    defaultValues: { name: editingBase },
  });

  useEffect(() => {
    reset({ name: editingBase });
  }, [editingBase, reset]); // Inclua 'reset' como dependência

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style.container}>
        <Typography variant="h5" color={"black"}>
          Adicionar base
        </Typography>
        <form onSubmit={handleSubmit((data) => createEditBase(data.name))}>
          <TextField
            sx={{ width: "100%" }}
            label="Nome da base"
            variant="outlined"
            value={watch("name")}
            {...register("name")}
          />
          <Box display="flex" justifyContent="flex-end" gap="8px">
            <Button type="submit" variant="contained">
              Adicionar
            </Button>
            <Button variant="contained" color="error" onClick={onClose}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
