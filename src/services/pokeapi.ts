import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

interface PokemonListResponse {
  data: any;
  results: { name: string; url: string }[];
}

export const getPokemonList = async (
  offset = 0,
  limit = 20
): Promise<PokemonListResponse> => {
  //response com offset e limit para controle de renderização
  //seguindo a boa pratica da APPI
  const response = await api.get<PokemonListResponse>(
    `pokemon?offset=${offset}&limit=${limit}`
  );
  return response.data;
};

export const getPokemonDetails = async (name: string) => {
  //retorno apenas com detalhes do poke
  return api.get(`pokemon/${name}`);
};

