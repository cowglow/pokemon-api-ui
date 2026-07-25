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
        spriteFrames: getSpriteFrames(data.sprites),
        cries: data.cries,
        types: [...data.types]
            .sort((a, b) => a.slot - b.slot)
            .map(({type}) => type.name),
        abilities: [...data.abilities]
            .sort((a, b) => a.slot - b.slot)
            .map(({ability, is_hidden}) => ({name: ability.name, isHidden: is_hidden})),
        stats: data.stats.map(({stat, base_stat, effort}) => ({name: stat.name, baseStat: base_stat, effort}))
    }
}
