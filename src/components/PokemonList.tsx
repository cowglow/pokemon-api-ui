import {useDispatch, useSelector} from "react-redux";
import {
    getPokemonNames,
    getPokemons,
    getSelectedPokemonIndex,
    isLoading,
    setSelectedPokemon
} from "../redux/reducers/pokemons.ts";
import {Box, capitalize, List, ListItemButton, ListItemText} from "@mui/material";
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
        (el: HTMLButtonElement) => itemRefs.current[index] = el

    return (
        <Box sx={{width: 360, contain: "content", overflow: "auto"}}>
            <List component="nav" disablePadding dense tabIndex={-1}>
                {labels.map((label, index) => (
                    <ListItemButton
                        key={`pokemon-${index}`}
                        component="button"
                        sx={{width: "100%"}}
                        ref={assignRef(index)}
                        onKeyDown={(event) => onKeyDown(event, index)}
                        onClick={() => dispatch(setSelectedPokemon(pokemons[index]))}
                        onFocus={() => dispatch(setSelectedPokemon(pokemons[index]))}
                        selected={selectedTab === index}
                    >
                        <PokemonListIcon label={label} pokemonIndex={index + 1}/>
                        <ListItemText primary={capitalize(label)}/>
                    </ListItemButton>
                ))}
                {loading && <Loader loading={loading} isMobile={false}/>}
            </List>
        </Box>
    )
}
