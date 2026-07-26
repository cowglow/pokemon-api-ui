import {useState} from "react";
import {Box, ButtonBase, Dialog} from "@mui/material";

type PokemonSpriteGalleryProps = {
    spriteFrames: string[]
}

export default function PokemonSpriteGallery({spriteFrames}: PokemonSpriteGalleryProps) {
    const [zoomedSrc, setZoomedSrc] = useState<string | null>(null)

    return (
        <Box sx={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 2}}>
            {spriteFrames.map((src) => (
                <ButtonBase
                    key={src}
                    onClick={() => setZoomedSrc(src)}
                    aria-label="Zoom sprite"
                    sx={{aspectRatio: "1", borderRadius: 1}}
                >
                    <Box
                        component="img"
                        src={src}
                        alt=""
                        loading="lazy"
                        sx={{width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated"}}
                    />
                </ButtonBase>
            ))}
            <Dialog open={Boolean(zoomedSrc)} onClose={() => setZoomedSrc(null)}>
                <Box
                    component="img"
                    src={zoomedSrc ?? undefined}
                    alt=""
                    onClick={() => setZoomedSrc(null)}
                    sx={{
                        width: 280,
                        height: 280,
                        objectFit: "contain",
                        imageRendering: "pixelated",
                        cursor: "pointer",
                        p: 2
                    }}
                />
            </Dialog>
        </Box>
    )
}
