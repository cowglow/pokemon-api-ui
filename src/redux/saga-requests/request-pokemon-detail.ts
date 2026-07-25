export async function requestPokemonDetail(url: string) {
    const randomDelay = Math.floor(Math.random() * (1200 - 800 + 1)) + 800;
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    const response = await fetch(url);
    return await response.json();
}
