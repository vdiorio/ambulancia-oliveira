import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import { Droppable } from "@hello-pangea/dnd";
import useStyles from "./style";
import { Ambulancia } from "../../types/Ambulancia";
import DraggableAmbulancia from "../DraggableAmbulancia";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  droppableId: string;
  name: string;
  ambulancias: Ambulancia[];
  edit: (index: number) => void;
  delete: (index: number) => void;
  editBase: () => void;
  deleteBase: () => void;
  disableDelete?: boolean;
  handleAddAmbulancia: () => void;
}

export default function DroppableBase({
  droppableId,
  name,
  ambulancias,
  edit,
  delete: deleteAmbulancia,
  editBase,
  deleteBase,
  disableDelete,
  handleAddAmbulancia,
}: Props) {
  const style = useStyles();
  return (
    <Card sx={style.container} variant="outlined">
      <Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">{name}:</Typography>
          <Box>
            <IconButton onClick={editBase}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={deleteBase} disabled={disableDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              <Box sx={style.list}>
                {ambulancias.map((ambulancia, index) => (
                  <DraggableAmbulancia
                    key={ambulancia.id}
                    ambulancia={ambulancia}
                    index={index}
                    edit={edit}
                    delete={deleteAmbulancia}
                  />
                ))}
                {provided.placeholder}
              </Box>
            </Box>
          )}
        </Droppable>
        <Box display={"flex"} justifyContent={"flex-end"} padding={"8px"}>
          <Button variant="contained" onClick={handleAddAmbulancia}>
            Adicionar Ambulancia
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
