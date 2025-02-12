"use client";

import { useState, useEffect } from "react";
import AlbumCover from "@/components/album/album-cover";
import { extractColors } from "extract-colors";
import axios from "axios";
import AlbumData from "./album-data";
import AlbumTracks from "./album-tracks";
import AlbumBtn from "./album-btn";

export default function AlbumMain({ album_id }: { album_id: string | null }) {
    const [album, setAlbum] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");

    // no firefox, o extractColors funciona mas pode crashar na hora de pegar a cor de algumas fotos por motivos que eu desconheço
    // aparentemente funcionar normal nos demais navegadores
    // o erro é Uncaught DOMException: The operation is insecure.
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

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/spot/album/${album_id}`);
            console.log(response.data);
            setAlbum(response.data);
            setLoading(false);
            extractColors(response.data.images[0]?.url)
                .then((colors) => {
                    updateColor(colors);
                })
                .catch(console.error);
        };

        fetchData();
    }, [album_id]);

    return (
        <>
            <div
                className={`
                        absolute h-[30rem] w-lvw -z-50 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                    `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${currentColor}, transparent)`,
                }}
            ></div>
            <AlbumCover album={album} loading={loading} />
            <AlbumData album={album} loading={loading} />
            <AlbumBtn album={album} loading={loading} />
            {album.tracks ? (
                <AlbumTracks album={album} loading={loading} />
            ) : null}
        </>
    );
}
