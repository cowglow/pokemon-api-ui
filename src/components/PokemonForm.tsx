import {Box, capitalize, Skeleton, styled, Typography} from "@mui/material";
import {StyledForm, StyledTextInput} from "./RHF/FormComponet.Styled.ts";
import {usePokemonDetail} from "./usePokemonDetail.ts";
import PokemonHeader from "./PokemonHeader.tsx";
import PokemonDetailTabs from "./PokemonDetailTabs.tsx";
import AbilitiesAndTypes from "./AbilitiesAndTypes.tsx";
import Cries from "./Cries.tsx";
import Stats from "./Stats.tsx";
import Moves from "./Moves.tsx";

const StyledPokemonForm = styled(StyledForm)`
    width: 100%;
    display: flex;
    padding: 0 ${({theme}) => theme.spacing(1.73)};
`;

const displayFields = ["height", "weight", "experience"] as const

type PokemonFormProps = {
    name: string
    url: string
    onBack?: () => void
}
export default function PokemonForm({name: pokemonName, url, onBack}: PokemonFormProps) {
    const {data: cachedDetails, loading, error: detailError} = usePokemonDetail(pokemonName, url)

    return (
        <StyledPokemonForm>
            <PokemonHeader name={pokemonName} loading={loading} spriteFrames={cachedDetails?.spriteFrames}
                           onBack={onBack}/>
            {detailError && (
                <Typography color="error" variant="body2">
                    Failed to load {capitalize(pokemonName)}.
                </Typography>
            )}
            {loading && displayFields.map((key) => (
                <Skeleton key={key} width="100%" height={56}/>
            ))}
            {cachedDetails && (
                <PokemonDetailTabs
                    tabs={[
                        {
                            label: "Overview",
                            content: (
                                <Box sx={{display: "flex", flexDirection: "column", gap: 4, my: 2}}>
                                    {displayFields.map((key) => (
                                        <StyledTextInput
                                            key={key}
                                            label={capitalize(key)}
                                            variant="standard"
                                            disabled
                                            value={cachedDetails[key]}
                                        />
                                    ))}
                                </Box>
                            )
                        },
                        {
                            label: "Abilities & Types",
                            content: (
                                <AbilitiesAndTypes types={cachedDetails.types}
                                                   abilities={cachedDetails.abilities}/>
                            )
                        },
                        {
                            label: "Cries",
                            content: <Cries cries={cachedDetails.cries}/>
                        },
                        {
                            label: "Stats",
                            content: <Stats stats={cachedDetails.stats}/>
                        },
                        {
                            label: "Moves",
                            content: <Moves moves={cachedDetails.moves}/>
                        }
                    ]}
                />
            )}
        </StyledPokemonForm>
    );
};
