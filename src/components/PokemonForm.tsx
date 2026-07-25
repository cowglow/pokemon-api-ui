import {FieldName, FormProvider, useForm} from "react-hook-form";
import {Box, Button, capitalize, Skeleton, styled, Typography} from "@mui/material";
import {StyledForm, StyledTextInput} from "./RHF/FormComponet.Styled.ts";
import createPokemon from "../lib/create-pokemon.ts";
import {Pokemon} from "../lib/PokemonType.ts";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getPokemonDetails, setPokemonDetails} from "../redux/reducers/pokemons.ts";
import {RootState} from "../redux/store-config.ts";

const StyledPokemonForm = styled(StyledForm)`
    width: 100%;
    display: flex;
    padding: 0 ${({theme}) => theme.spacing(1.73)};
`;

const Image = styled('img')`
    padding: 0;
    margin: 0;
`

type PokemonFormSchema = Partial<Pokemon>

type PokemonFormProps = {
    name: string
    url: string
}
export default function PokemonForm({name: pokemonName, url}: PokemonFormProps) {
    const editableFields = ["name", "height", "weight", "base_experience"] as const
    const [isEditing, setIsEditing] = useState(false)
    const dispatch = useDispatch()
    const cachedDetails = useSelector((state: RootState) => getPokemonDetails(state, pokemonName))
    const methods = useForm<PokemonFormSchema>({
        defaultValues: async () => {
            if (cachedDetails) return cachedDetails
            const randomDelay = Math.floor(Math.random() * (1200 - 800 + 1)) + 800;
            const pokemonData = await fetch(url)
            const json = await pokemonData.json()
            await new Promise(resolve => setTimeout(resolve, randomDelay))
            const pokemon = createPokemon(json)
            dispatch(setPokemonDetails(pokemon))
            return pokemon
        }
    })

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
                <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <Typography variant="h4" component="h1">
                        {capitalize(pokemonName)}
                    </Typography>
                    {methods.formState.isLoading
                        ? <Skeleton
                            width={96}
                            height={96}
                        />
                        : <Image src={`${methods.getValues("avatar")}`} alt=""/>
                    }
                </Box>
                {editableFields.map((key: FieldName<PokemonFormSchema>) => {
                    const fieldName = key as FieldName<PokemonFormSchema>
                    return methods.formState.isLoading
                        ? <Skeleton
                            key={key}
                            width="100%"
                            height={56}
                        />
                        : <StyledTextInput
                            key={key}
                            label={capitalize(key)}
                            disabled={!isEditing}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            {...methods.register(fieldName)}
                        />
                })}
                {!methods.formState.isLoading && (
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
