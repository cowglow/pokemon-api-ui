import {useDispatch, useSelector} from "react-redux";
import {
    getPokemonNames,
    getPokemons,
    getSelectedPokemonIndex,
    isLoading,
    setSelectedPokemon
} from "../redux/reducers/pokemons.ts";
import {
    Box,
    capitalize,
    Divider,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    TextField
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Loader from "./Loader.tsx";
import React, {useCallback, useMemo, useRef, useState} from "react";
import PokemonListIcon from "./PokemonListIcon.tsx";

export default function PokemonList() {
    const dispatch = useDispatch()
    const loading = useSelector(isLoading)
    const labels = useSelector(getPokemonNames)
    const pokemons = useSelector(getPokemons)
    const selectedTab = useSelector(getSelectedPokemonIndex)
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [search, setSearch] = useState("")

    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase()
        return labels
            .map((label, index) => ({label, index}))
            .filter(({label}) => !query || label.includes(query))
    }, [labels, search])

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, localIndex: number) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = (localIndex + 1) % filteredItems.length;
            itemRefs.current[next]?.focus();
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = (localIndex - 1 + filteredItems.length) % filteredItems.length;
            itemRefs.current[prev]?.focus();
        }
    }, [filteredItems]);

    const assignRef = (localIndex: number) =>
        (el: HTMLButtonElement | null) => {
            itemRefs.current[localIndex] = el
        }

    return (
        <Paper sx={{display: "flex", flexDirection: "column", width: 360, contain: "content"}}>
            <TextField
                size="small"
                placeholder="Search pokémon"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                fullWidth
                sx={{p: 1}}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon fontSize="small"/>
                            </InputAdornment>
                        )
                    }
                }}
            />
            <Divider/>
            <Box sx={{overflow: "auto"}}>
                <List component="nav" disablePadding dense tabIndex={-1}>
                    {filteredItems.map(({label, index}, localIndex) => (
                        <ListItemButton
                            key={`pokemon-${index}`}
                            component="button"
                            sx={{width: "100%"}}
                            ref={assignRef(localIndex)}
                            onKeyDown={(event) => onKeyDown(event, localIndex)}
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
        </Paper>
    )
}
