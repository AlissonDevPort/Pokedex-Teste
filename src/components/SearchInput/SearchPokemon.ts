export interface PokeSearch {
  typedPoke: string;
  pokeList: Array<{ name: string; url: string }>;
}

export const searchPokemonByName = ({ typedPoke, pokeList }: PokeSearch) => {
  const trimmedPokeName = typedPoke.trim();
  if (!trimmedPokeName) {
    return [];
  }

  const filteredPoke = pokeList.filter((poke) =>
    poke.name.toLowerCase().includes(trimmedPokeName.toLowerCase())
  );

  return filteredPoke.map((pokemon) => ({
    name: pokemon.name,
    url: pokemon.url,
  }));
};

