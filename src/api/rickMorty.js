import axios from "axios";

const URL = "https://rickandmortyapi.com/api";

export const getCharacters = async (page = 1, name = "") => {
  const response = await axios.get(
    `${URL}/character?page=${page}&name=${name}`
  );
  return response.data;
};

export const getCharacterById = async (id) => {
  const response = await axios.get(`${URL}/character/${id}`);
  return response.data;
};