import { Draggable } from "@hello-pangea/dnd";
import { Ambulancia } from "../../types/Ambulancia";
import { Box, IconButton, Typography } from "@mui/material";
import useStyles from "./style";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DraggableAmbulancia({
  ambulancia,
  index,
  edit,
  delete: _delete,
}: {
  ambulancia: Ambulancia;
  index: number;
  edit: (index: number) => void;
  delete: (index: number) => void;
}) {
  const style = useStyles();
  return (
    <Draggable draggableId={"draggable-" + ambulancia.id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          sx={style.root}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Box
              sx={{
                backgroundColor: ambulancia.color,
                height: "8px",
                width: "8px",
                borderRadius: "8px",
                border: "solid 1px black",
              }}
            />
            <Typography>{ambulancia.name}</Typography>
          </Box>
          <Box>
            <IconButton onClick={() => edit(index)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => _delete(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Draggable>
  );
}
