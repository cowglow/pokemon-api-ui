import {AppBar, IconButton, Menu, MenuItem, Toolbar} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {MouseEvent, useState} from "react";
import Branding from "../components/Branding.tsx";

export type AppView = "pokemons" | "collection"

type HeaderProps = {
    view: AppView
    onViewChange: (view: AppView) => void
}

export default function Header({view, onViewChange}: HeaderProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    const openMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
    const closeMenu = () => setAnchorEl(null)

    const selectView = (next: AppView) => {
        onViewChange(next)
        closeMenu()
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton color="inherit" edge="start" onClick={openMenu} aria-label="navigation menu">
                    <MenuRoundedIcon/>
                </IconButton>
                <Branding/>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                    <MenuItem selected={view === "pokemons"} onClick={() => selectView("pokemons")}>
                        Pokémon
                    </MenuItem>
                    <MenuItem selected={view === "collection"} onClick={() => selectView("collection")}>
                        My Collection
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}
