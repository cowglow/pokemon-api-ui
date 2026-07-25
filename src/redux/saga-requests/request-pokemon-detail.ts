export async function requestPokemonDetail(url: string) {
    const response = await fetch(url);
    return await response.json();
}
