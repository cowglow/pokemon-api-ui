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
    TextField,
    ToggleButton
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Loader from "./Loader.tsx";
import React, {useCallback, useMemo, useRef, useState} from "react";
import PokemonListIcon from "./PokemonListIcon.tsx";
import {useCollectedNames} from "../redux/reducers/collection.ts";

export default function PokemonList() {
    const dispatch = useDispatch()
    const loading = useSelector(isLoading)
    const labels = useSelector(getPokemonNames)
    const pokemons = useSelector(getPokemons)
    const selectedTab = useSelector(getSelectedPokemonIndex)
    const collectedNames = useCollectedNames()
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [search, setSearch] = useState("")
    const [collectionOnly, setCollectionOnly] = useState(false)

    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase()
        return labels
            .map((label, index) => ({label, index}))
            .filter(({label}) => !query || label.includes(query))
            .filter(({label}) => !collectionOnly || collectedNames.has(label))
    }, [labels, search, collectionOnly, collectedNames])

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
        if (e.key === "Enter") {
            e.preventDefault();
            const {index} = filteredItems[localIndex];
            dispatch(setSelectedPokemon(pokemons[index]));
        }
    }, [filteredItems, dispatch, pokemons]);

    const assignRef = (localIndex: number) =>
        (el: HTMLButtonElement | null) => {
            itemRefs.current[localIndex] = el
        }

    return (
        <Paper sx={{display: "flex", flexDirection: "column", width: 360, contain: "content"}}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1, p: 1}}>
                <TextField
                    size="small"
                    placeholder="Search pokémon"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    fullWidth
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
                <ToggleButton
                    value="collectionOnly"
                    selected={collectionOnly}
                    onChange={() => setCollectionOnly((value) => !value)}
                    size="small"
                    aria-label="show only collection"
                >
                    <StarRoundedIcon fontSize="small"/>
                </ToggleButton>
            </Box>
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
                            selected={selectedTab === index}
                        >
                            <PokemonListIcon label={label} pokemonIndex={index + 1}
                                             collected={collectedNames.has(label)}/>
                            <ListItemText primary={capitalize(label)}/>
                        </ListItemButton>
                    ))}
                    {loading && <Loader loading={loading} isMobile={false}/>}
                </List>
            </Box>
        </Paper>
    )
}
