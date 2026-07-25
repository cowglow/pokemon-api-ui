import {Box, Tab, Tabs, useMediaQuery, useTheme} from "@mui/material";
import {SyntheticEvent} from "react";
import {getPokemonNames, getPokemons, isLoading} from "../redux/reducers/pokemons.ts";
import {useSelector} from "react-redux";
import Loader from "./Loader.tsx";
import {useUrlSearchParam} from "../hooks/useUrlSearchParam.ts";

export default function PokemonTabs() {
    const loading = useSelector(isLoading)
    const labels = useSelector(getPokemonNames)
    const pokemons = useSelector(getPokemons)
    const [selectedName, setSelectedName] = useUrlSearchParam("pokemon")
    const selectedTab = labels.indexOf(selectedName ?? "")

    const onTabChange = (_: SyntheticEvent<Element, Event>, index: number) => {
        setSelectedName(pokemons[index].name)
    }

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    return (
        <Box sx={{minWidth: 120}}>
            <Tabs
                role="navigation"
                orientation={isMobile ? "horizontal" : "vertical"}
                variant="scrollable"
                visibleScrollbar
                value={selectedTab}
                onChange={onTabChange}
                aria-label="Pokemon Forms"
                sx={{borderRight: 1, borderColor: 'divider', minWidth: 120}}
            >
                {labels.map((label, index) => (
                    <Tab key={`pokemon-${index}`} label={label}/>
                ))}
            </Tabs>
            {loading && <Loader loading={loading} isMobile={isMobile}/>}
        </Box>
    );
}
