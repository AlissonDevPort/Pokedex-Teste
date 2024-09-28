
export interface PokeSearch {
    typedPoke: string;
    pokeList: Array<{ name: string }>;
  }
  
  export const searchPokemonByName = ({ typedPoke, pokeList }: PokeSearch) => {
    const trimmedPokeName = typedPoke.trim();
    if (!trimmedPokeName) {
      return;
    }
    const filteredPoke = pokeList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(trimmedPokeName.toLowerCase())
  );

  const pokeNamesArray = filteredPoke.map((pokemon) => pokemon.name);

  console.log(pokeNamesArray)

  return pokeNamesArray;
  };