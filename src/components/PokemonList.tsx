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
import {useCallback} from "react";

export default function PokemonList() {
    const dispatch = useDispatch()
    const loading = useSelector(isLoading)
    const labels = useSelector(getPokemonNames)
    const pokemons = useSelector(getPokemons)
    const selectedTab = useSelector(getSelectedPokemonIndex)

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (!labels || labels.length === 0) return;

        const current = typeof selectedTab === "number" ? selectedTab : -1;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = current < labels.length - 1 ? current + 1 : current;
            if (next !== current && pokemons[next]) {
                dispatch(setSelectedPokemon(pokemons[next]));
            } else if (current === -1 && pokemons[0]) {
                dispatch(setSelectedPokemon(pokemons[0]));
            }
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = current > 0 ? current - 1 : current;
            if (prev !== current && pokemons[prev]) {
                dispatch(setSelectedPokemon(pokemons[prev]));
            }
        }
    }, [labels, pokemons, selectedTab, dispatch]);

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Box onKeyDown={onKeyDown} sx={{width: 250, overflow: "auto"}}>
            <List disablePadding dense>
                {labels.map((label, index) => (
                    <Box key={`pokemon-${index}`}>
                        <ListItem disablePadding>
                            <ListItemButton
                                sx={{fontSize: 20}}
                                onClick={() => dispatch(setSelectedPokemon(pokemons[index]))}
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
