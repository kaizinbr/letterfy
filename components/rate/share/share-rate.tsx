"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { extractColors } from "extract-colors";
import axios from "axios";
import { toPng, getFontEmbedCSS } from "html-to-image";
import { AlbumRate, Review } from "@/lib/utils/types";
import Card from "./card";

export default function ShareRate({ id, rate }: { id?: string; rate: Review }) {
    const [album, setAlbum] = useState<any>();
    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");

    function updateColor(colors: { hex: string; intensity: number }[]) {
        if (setCurrentColor) {
            const maxIntensityColor = colors.reduce((prev, current) => {
                const prevIntensity = prev.intensity;
                const currentIntensity = current.intensity;
                return currentIntensity > prevIntensity ? current : prev;
            });
            setCurrentColor(maxIntensityColor.hex);
            console.log("Color:", maxIntensityColor.hex);
        }
    }

    const ref = useRef<HTMLDivElement>(null);

    const onButtonClick = useCallback(async () => {
        if (ref.current === null) {
            console.error("Ref is null");
            return;
        }
        const fontEmbedCSS = await getFontEmbedCSS(ref.current);

        toPng(ref.current, {
            canvasWidth: 1080,
            canvasHeight: 1920,
            cacheBust: true,
            pixelRatio: 2,
            quality: 1,
        })
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = `spotfaker-${rate.shorten}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `/api/spot/album/${rate.album_id}`
            );
            console.log(response.data);
            setAlbum(response.data);
            setTracks(response.data.tracks.items);

            if (response.data.total_tracks > 50) {
                console.log("Mais de 50 músicas");

                const offsetTimes = Math.ceil(response.data.total_tracks / 50);

                let tracks2: any[] = response.data.tracks.items;

                for (let i = 0; i < offsetTimes; i++) {
                    if (i === 0) {
                        null;
                    } else {
                        const response = await axios.get(
                            `/api/spot/album/${id}/tracks?offset=${i * 50}`
                        );
                        tracks2 = [...tracks2, ...response.data.items];
                        console.log("Offset:", i * 50);
                    }
                }
                console.log("Tracks:", tracks2);
                setTracks(tracks2);
            }

            setLoading(false);
            extractColors(response.data.images[0]?.url)
                .then((colors) => {
                    updateColor(colors);
                })
                .catch(console.error);
        };

        fetchData();
    }, [id]);

    return (
        <>
            {album && (
                <>
                    <div
                        className={` 
                        transition-all duration-500 text-white
                        bg-black
                        aspect-[9/16] w-8/12 rounded-xl 
                        shadow-lg
                        relative overflow-hidden
                        flex flex-col items-center justify-center px-8
                    `}
                        ref={ref}
                    >
                        <Card
                            currentColor={currentColor}
                            album={album}
                            rate={rate}
                        />
                    </div>
                    <button
                        className={`
                            bg-orange-600 text-neutral-100 px-8 py-2 rounded-full border border-orenge-600
                            transition duration-500
                            hover:bg-neutral-600
                        `}
                        onClick={async () => {
                            await onButtonClick();
                        }
                        }
                    >
                        Baixar
                    </button>
                    {/* <AlbumCover album={album} loading={loading}
                    <AlbumData
                        album={album}
                        tracks={tracks}
                        loading={loading}
                    />
                    <UserRate album={rate} loading={loading} /> */}
                </>
            )}
        </>
    );
}
