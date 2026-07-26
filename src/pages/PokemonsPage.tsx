import {useDispatch, useSelector} from "react-redux";
import {useMediaQuery, useTheme} from "@mui/material";
import {getSelectedPokemon, setSelectedPokemon} from "../redux/reducers/pokemons.ts";
import SelectedPokemon from "../components/SelectedPokemon.tsx";
import AddToCollection from "../components/Fab/AddToCollection.tsx";
import PokemonList from "../components/PokemonList.tsx";

export default function PokemonsPage() {
    const dispatch = useDispatch()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const selectedPokemon = useSelector(getSelectedPokemon)

    const showDetail = !isMobile || Boolean(selectedPokemon)
    const showList = !isMobile || !selectedPokemon

    return (
        <>
            <PokemonList hidden={!showList}/>
            {showDetail && (
                <>
                    <SelectedPokemon
                        pokemon={selectedPokemon}
                        onBack={isMobile ? () => dispatch(setSelectedPokemon(null)) : undefined}
                    />
                    <AddToCollection pokemon={selectedPokemon}/>
                </>
            )}
        </>
    )
}
