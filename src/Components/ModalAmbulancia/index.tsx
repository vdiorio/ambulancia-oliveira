import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import useStyles from "./style";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HexColorPicker } from "react-colorful";
import { Ambulancia } from "../../types/Ambulancia";
import { createAmbulancia } from "../../helpers";

interface Props {
  open?: boolean;
  onClose?: () => void;
  editingAmbulancia: Ambulancia;
  createEditAmbulancia: (ambulancia: Ambulancia) => void;
}

export default function ModalAmbulancia({
  open = false,
  onClose,
  editingAmbulancia = {
    id: "",
    name: "",
    color: "",
    driver: "",
  },
  createEditAmbulancia,
}: Props) {
  const style = useStyles();
  const { name, color, driver } = editingAmbulancia;

  const { handleSubmit, reset, watch, register, setValue } = useForm<{
    name: string;
    color: string;
    driver: string;
  }>({
    defaultValues: {
      name,
      color,
      driver,
    },
  });

  useEffect(() => {
    reset({ name, color, driver });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
        <form
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          onSubmit={handleSubmit((data) =>
            createEditAmbulancia(
              createAmbulancia({ ...data, color: `#${data.color}` })
            )
          )}
        >
          <TextField
            sx={{ width: "100%" }}
            label="Nome da Ambulancia"
            variant="outlined"
            {...register("name")}
          />
          <HexColorPicker
            color={watch("color")}
            onChange={(color) =>
              setValue("color", color.replace(/[^0-9a-fA-F]/g, ""))
            }
          />
          <TextField
            sx={{ width: "100%" }}
            label="Cor"
            variant="outlined"
            value={watch("color").replace(/[^0-9a-fA-F]/g, "")}
            InputProps={{
              startAdornment: (
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    marginRight: "4px",
                  }}
                >
                  #
                </Typography>
              ),
            }}
            onChange={(e) => {
              const cleanValue = e.target.value
                .replace(/[^0-9a-fA-F]/g, "")
                .slice(0, 6);
              setValue("color", cleanValue);
            }}
          />
          <TextField
            sx={{ width: "100%" }}
            label="Motorista"
            variant="outlined"
            placeholder="(Opcional)"
            {...register("driver")}
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
