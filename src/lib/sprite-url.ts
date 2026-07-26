// The list endpoint's `url` is like "https://pokeapi.co/api/v2/pokemon/25/" - the
// trailing segment is the real pokemon id. Past the base ~1025 species, alternate
// forms (mega/gmax/regional) are appended out of dex order, so this id can't be
// assumed to equal a pokemon's position in the list.
export function getPokemonIdFromUrl(url: string): string {
    return url.replace(/\/$/, "").split("/").pop() ?? ""
}

export function getPokemonSpriteUrl(id: string): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}
