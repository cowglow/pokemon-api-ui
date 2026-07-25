import {useDispatch, useSelector} from "react-redux";
import {
    getPokemonNames,
    getPokemons,
    getSelectedPokemonIndex,
    isLoading,
    setSelectedPokemon
} from "../redux/reducers/pokemons.ts";
import {Box, capitalize, Divider, List, ListItem, ListItemButton} from "@mui/material";
import Loader from "./Loader.tsx";
import React, {useCallback, useRef} from "react";
import PokemonListIcon from "./PokemonListIcon.tsx";

export default function PokemonList() {
    const dispatch = useDispatch()
    const loading = useSelector(isLoading)
    const labels = useSelector(getPokemonNames)
    const pokemons = useSelector(getPokemons)
    const selectedTab = useSelector(getSelectedPokemonIndex)
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = (index + 1) % labels.length;
            itemRefs.current[next]?.focus();
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = (index - 1 + labels.length) % labels.length;
            itemRefs.current[prev]?.focus();
        }
    }, [labels]);

    const assignRef = (index: number) =>
        (el: HTMLButtonElement | null) => { itemRefs.current[index] = el }

    return (
        <Box sx={{minWidth: '340px', contain: "content", overflow: "auto"}}>
            <List disablePadding dense tabIndex={-1}>
                {labels.map((label, index) => (
                    <Box key={`pokemon-${index}`}>
                        <ListItem disablePadding>
                            <PokemonListIcon label={label} pokemonIndex={index + 1}/>
                            <ListItemButton
                                component="button"
                                sx={{fontSize: 20}}
                                ref={assignRef(index)}
                                onKeyDown={(event) => onKeyDown(event, index)}
                                onClick={() => dispatch(setSelectedPokemon(pokemons[index]))}
                                onFocus={() => dispatch(setSelectedPokemon(pokemons[index]))}
                                selected={selectedTab === index}
                            >
                                {capitalize(label)}
                            </ListItemButton>
                        </ListItem>
                        {index < labels.length - 1 && <Divider/>}
                    </Box>
                ))}
                {loading && <Loader loading={loading} isMobile={false}/>}
            </List>
        </Box>
    )
}
