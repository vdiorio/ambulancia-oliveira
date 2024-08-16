import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import DroppableBase from "./Components/DroppableBase";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Ambulancia } from "./types/Ambulancia";
import ModalBase from "./Components/ModalBase";
import { createSampleAmbulancias, createSampleBases } from "./helpers";
import ModalAmbulancia from "./Components/ModalAmbulancia";
const reorder = (list: Ambulancia[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: Ambulancia[],
  destination: Ambulancia[],
  droppableSource: { index: number; droppableId: string },
  droppableDestination: { index: number; droppableId: string }
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function App() {
  const [bases, setBases] = useState<{ name: string }[]>([]);
  const [ambulancias, setAmbulancia] = useState<Ambulancia[][]>([]);

  const [editingBase, setEditingBase] = useState<number>(-1);
  const [editingAmbulancia, setEditingAmbulancia] = useState<number[]>([
    -1, -1,
  ]);
  const [baseModalOpen, setBaseModalOpen] = useState(false);
  const [ambulanciaModalOpen, setAmbulanciaBaseModalOpen] = useState(false);

  const onClose = () => {
    setBaseModalOpen(false);
    setAmbulanciaBaseModalOpen(false);
    setEditingBase(-1);
    setEditingAmbulancia([-1, -1]);
  };

  const onDragEnd: OnDragEndResponder = ({ source, destination }) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const sInd = parseInt(source.droppableId);
    const dInd = parseInt(destination.droppableId);

    const updatedAmbulancias = [...ambulancias];

    if (sInd === dInd) {
      updatedAmbulancias[sInd] = reorder(
        ambulancias[sInd],
        source.index,
        destination.index
      );
    } else {
      const result = move(
        ambulancias[sInd],
        ambulancias[dInd],
        source,
        destination
      );
      updatedAmbulancias[sInd] = result[sInd];
      updatedAmbulancias[dInd] = result[dInd];
    }

    setAmbulancia(updatedAmbulancias);
  };

  const createEditBase = (name: string) => {
    if (editingBase >= 0) {
      const newState = [...bases];
      newState[editingBase] = { name };
      setBases(newState);
    } else {
      setAmbulancia([...ambulancias, []]);
      setBases([...bases, { name }]);
    }

    setBaseModalOpen(false);
    setEditingBase(-1);
  };

  useEffect(() => {
    if (!bases.length || !ambulancias.length) return;
    localStorage.setItem("bases", JSON.stringify(bases));
    localStorage.setItem("ambulancias", JSON.stringify(ambulancias));
  }, [bases, ambulancias]);

  useEffect(() => {
    const storedAmbulancia = localStorage.getItem("ambulancias");
    const storedBases = localStorage.getItem("bases");

    if (!!storedBases?.length && !!storedAmbulancia?.length) {
      setAmbulancia(JSON.parse(storedAmbulancia));
      setBases(JSON.parse(storedBases));
    } else {
      localStorage.clear();
      setAmbulancia(createSampleAmbulancias);
      setBases(createSampleBases);
    }
  }, []);

  const deleteAmbulancia = (baseId: number, ambId: number) => {
    const newState = [...ambulancias];
    newState[baseId] = newState[baseId].filter((_a, index) => index !== ambId);
    setAmbulancia(newState);
  };

  const editBase = (baseIndex: number) => {
    setBaseModalOpen(true);
    setEditingBase(baseIndex);
  };

  const deleteBase = (index: number) => {
    if (ambulancias[index].length) return;

    const newBaseState = [...bases];
    newBaseState.splice(index, 1);

    const newAmbulanciaState = [...ambulancias];
    newAmbulanciaState.splice(index, 1);

    setAmbulancia(newAmbulanciaState);
    setBases(newBaseState);
  };

  const createEditAmbulancia = (ambulancia: Ambulancia) => {
    const newState = [...ambulancias];
    const [baseIndex, ambulanciaIndex] = editingAmbulancia;
    if (ambulanciaIndex >= 0) newState[baseIndex][ambulanciaIndex] = ambulancia;
    else newState[baseIndex].push(ambulancia);
    setAmbulancia(newState);
    setAmbulanciaBaseModalOpen(false);
  };

  const editAmbulancia = (baseIndex: number, ambIndex?: number) => {
    const ind = ambIndex === undefined ? -1 : ambIndex;
    setAmbulanciaBaseModalOpen(true);
    setEditingAmbulancia([baseIndex, ind]);
    console.log([baseIndex, ind]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {bases.map((base, baseIndex) => (
          <DroppableBase
            key={baseIndex}
            droppableId={String(baseIndex)}
            name={base.name}
            ambulancias={ambulancias[baseIndex] || []}
            edit={(i: number) => editAmbulancia(baseIndex, i)}
            delete={(i: number) => deleteAmbulancia(baseIndex, i)}
            editBase={() => editBase(baseIndex)}
            deleteBase={() => deleteBase(baseIndex)}
            disableDelete={!!ambulancias[baseIndex]?.length}
            handleAddAmbulancia={() => editAmbulancia(baseIndex)}
          />
        ))}
      </DragDropContext>
      <Box display={"flex"} justifyContent={"flex-end"} mt={2} mr={2}>
        <Button variant="contained" onClick={() => setBaseModalOpen(true)}>
          Adicionar Base
        </Button>
      </Box>
      <ModalBase
        open={baseModalOpen}
        editingBase={bases[editingBase]?.name || ""}
        onClose={onClose}
        createEditBase={createEditBase}
      />
      <ModalAmbulancia
        editingAmbulancia={
          ambulancias[editingAmbulancia[0]]?.[editingAmbulancia[1]]
        }
        open={ambulanciaModalOpen}
        createEditAmbulancia={createEditAmbulancia}
        onClose={onClose}
      />
    </Box>
  );
}

export default App;
