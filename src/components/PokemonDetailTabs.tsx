import {ReactNode, SyntheticEvent, useState} from "react";
import {Box, Divider, Paper, Tab, Tabs} from "@mui/material";

type TabDef = {
    label: string
    content: ReactNode
}

type PokemonDetailTabsProps = {
    tabs: TabDef[]
}

export default function PokemonDetailTabs({tabs}: PokemonDetailTabsProps) {
    const [activeTab, setActiveTab] = useState(0)

    const onChange = (_: SyntheticEvent, index: number) => {
        setActiveTab(index)
    }

    return (
        <Box>
            <Tabs value={activeTab} onChange={onChange} aria-label="Pokémon detail tabs"
                  variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                {tabs.map((tab, index) => (
                    <Tab
                        key={tab.label}
                        label={tab.label}
                        id={`pokemon-tab-${index}`}
                        aria-controls={`pokemon-tabpanel-${index}`}
                    />
                ))}
            </Tabs>
            <Divider/>
            <Paper sx={{p: 2}}>
                {tabs.map((tab, index) => activeTab === index && (
                    <Box
                        key={tab.label}
                        role="tabpanel"
                        id={`pokemon-tabpanel-${index}`}
                        aria-labelledby={`pokemon-tab-${index}`}
                    >
                        {tab.content}
                    </Box>
                ))}
            </Paper>
        </Box>
    )
}
