import { Ambulancia } from "../types/Ambulancia";
import { v4 as uuidv4 } from "uuid";

export const createSampleBases = () => [{ name: "Base 1" }, { name: "Base 2" }];

export const createAmbulancia = ({
  name,
  color,
  driver,
}: Omit<Ambulancia, "id">) => {
  return {
    id: uuidv4().substring(0, 3),
    name,
    color,
    driver,
  };
};

export const createSampleAmbulancias = () => [
  [
    createAmbulancia({
      name: "Ambulância 1",
      color: "red",
      driver: "Joaquim",
    }),
    createAmbulancia({
      name: "Ambulância 3",
      color: "green",
      driver: "Pedro",
    }),
  ],
  [
    createAmbulancia({
      name: "Ambulância 2",
      color: "blue",
      driver: "Maria",
    }),
    createAmbulancia({
      name: "Ambulância 4",
      color: "yellow",
      driver: "Antonio",
    }),
  ],
];
