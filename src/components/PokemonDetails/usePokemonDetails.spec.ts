import { describe, it, expect, beforeEach } from "vitest";
import { ref } from "vue";

describe("isFavorite", () => {
  const favoriteIds = ref<number[]>([]);
  const pokemon = ref<{ id: number; name: string } | null>(null);

  const isFavorite = () => {
    return pokemon.value ? favoriteIds.value.includes(pokemon.value.id) : false;
  };

  beforeEach(() => {
    favoriteIds.value = [];
    pokemon.value = null;
  });

  it("deve retornar false quando não houver Pokémon selecionado", () => {
    const result = isFavorite();
    expect(result).toBe(false);
  });

  it("deve retornar false quando o Pokémon não estiver nos favoritos", () => {
    pokemon.value = { id: 1, name: "Bulbasaur" };
    const result = isFavorite();
    expect(result).toBe(false);
  });

  it("deve retornar true quando o Pokémon estiver nos favoritos", () => {
    pokemon.value = { id: 1, name: "Bulbasaur" };
    favoriteIds.value.push(1);
    const result = isFavorite();
    expect(result).toBe(true);
  });
});
