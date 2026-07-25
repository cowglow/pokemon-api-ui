import {FormProvider, Path, useForm} from "react-hook-form";
import {Box, Button, capitalize, Skeleton, styled, Typography} from "@mui/material";
import {StyledForm, StyledTextInput} from "./RHF/FormComponet.Styled.ts";
import {Pokemon} from "../lib/PokemonType.ts";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setPokemonDetails} from "../redux/reducers/pokemons.ts";
import {usePokemonDetail} from "./usePokemonDetail.ts";
import PokemonHeader from "./PokemonHeader.tsx";
import PokemonDetailTabs from "./PokemonDetailTabs.tsx";
import AbilitiesAndTypes from "./AbilitiesAndTypes.tsx";
import Cries from "./Cries.tsx";
import Stats from "./Stats.tsx";

const StyledPokemonForm = styled(StyledForm)`
    width: 100%;
    display: flex;
    padding: 0 ${({theme}) => theme.spacing(1.73)};
`;

type PokemonFormSchema = Partial<Pokemon>

type PokemonFormProps = {
    name: string
    url: string
}
export default function PokemonForm({name: pokemonName, url}: PokemonFormProps) {
    const editableFields = ["height", "weight", "experience"] as const
    const [isEditing, setIsEditing] = useState(false)
    const dispatch = useDispatch()
    const methods = useForm<PokemonFormSchema>()
    const {data: cachedDetails, loading, error: detailError} = usePokemonDetail(pokemonName, url, methods.reset)

    const handleCancel = () => {
        methods.reset()
        setIsEditing(false)
    }

    const handleSave = methods.handleSubmit((data) => {
        const base = cachedDetails ?? (methods.getValues() as Pokemon)
        dispatch(setPokemonDetails({...base, ...data}))
        setIsEditing(false)
    })

    return (
        <FormProvider {...methods}>
            <StyledPokemonForm>
                <PokemonHeader name={pokemonName} loading={loading} spriteFrames={cachedDetails?.spriteFrames}/>
                {detailError && (
                    <Typography color="error" variant="body2">
                        Failed to load {capitalize(pokemonName)}.
                    </Typography>
                )}
                {loading && editableFields.map((key) => (
                    <Skeleton key={key} width="100%" height={56}/>
                ))}
                {cachedDetails && (
                    <PokemonDetailTabs
                        tabs={[
                            {
                                label: "Overview",
                                content: (
                                    <>
                                        {editableFields.map((key: Path<PokemonFormSchema>) => (
                                            <StyledTextInput
                                                key={key}
                                                label={capitalize(key)}
                                                disabled={!isEditing}
                                                {...methods.register(key)}
                                            />
                                        ))}
                                    </>
                                )
                            },
                            {
                                label: "Abilities & Types",
                                content: (
                                    <AbilitiesAndTypes types={cachedDetails.types} abilities={cachedDetails.abilities}/>
                                )
                            },
                            {
                                label: "Cries",
                                content: <Cries cries={cachedDetails.cries}/>
                            },
                            {
                                label: "Stats",
                                content: <Stats stats={cachedDetails.stats}/>
                            }
                        ]}
                    />
                )}
                {cachedDetails && (
                    <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}>
                        {isEditing ? (
                            <>
                                <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                                <Button variant="contained" onClick={handleSave}>Save</Button>
                            </>
                        ) : (
                            <Button variant="outlined" onClick={() => setIsEditing(true)}>Edit</Button>
                        )}
                    </Box>
                )}
            </StyledPokemonForm>
        </FormProvider>
    );
};
