import {AppBar, Toolbar} from "@mui/material";
import Branding from "../components/Branding.tsx";
import PokemonSearch from "../components/PokemonSearch.tsx";

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar sx={{justifyContent: "space-between"}}>
                <Branding/>
                <PokemonSearch/>
            </Toolbar>
        </AppBar>
    )
}
