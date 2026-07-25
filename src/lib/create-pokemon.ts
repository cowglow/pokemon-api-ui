import {Pokemon, PokemonResponse} from "./PokemonType.ts";
import {getSpriteFrames} from "./sprite-frames.ts";

export default function createPokemon(data: PokemonResponse): Pokemon {
    return {
        id: data.id,
        name: data.name,
        order: data.order,
        avatar: data.sprites.front_default,
        experience: data.base_experience,
        height: data.height,
        weight: data.weight,
        spriteFrames: getSpriteFrames(data.sprites)
    }
}
