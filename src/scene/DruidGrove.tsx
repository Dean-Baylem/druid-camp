import DruidPortal from "./DruidPortal";
import DruidRune from "./DruidRune";
import { useState, useEffect } from "react";

export default function DruidGrove() {
    const [activeRune, setActiveRune] = useState<string>("earthRune");

    useEffect(() => {
        console.log(`Current Active Rune: ${activeRune}`);
    }, [activeRune]);

    const runes: { name: string; color: [number, number, number]; position: [number, number, number] }[] = [
        {
            name: "earthRune",
            color: [0.3, 0.5, 0.1],
            position: [-8.7, -1.7, -4.95],
        },
        {
            name: "fireRune",
            color: [1.0, 0.3, 0.05],
            position: [-4.95, -1.7, -4.38],
        },
        {
            name: "waterRune",
            color: [0.05, 0.4, 1.0],
            position: [-4.25, -1.18, -6.05],
        },
        {
            name: "windRune",
            color: [0.8, 0.95, 1.0],
            position: [-7.72, -1.26, -6.26],
        },
    ];

    return (
        <>
            {runes.map((rune, index) => (
                <DruidRune
                    key={`rune-${index}`}
                    color={rune.color}
                    runeName={rune.name}
                    position={rune.position}
                    activeSwitch={(name: string) => {
                        setActiveRune(name);
                    }}
                />
            ))}
            <DruidPortal portalType={activeRune}/>
        </>
    );
}
