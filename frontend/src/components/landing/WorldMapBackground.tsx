"use client"

import { motion } from "framer-motion"

export function WorldMapBackground() {
    // Simplified World Map SVG Path (Abstract representation)
    // We can use a dotted pattern or abstract lines to represent the map

    const width = 1200
    const height = 600

    // Coordinates for some major cities (approximate relative to 1200x600 viewBox)
    const cities = [
        { name: "New York", x: 320, y: 180 },
        { name: "London", x: 580, y: 140 },
        { name: "Berlin", x: 620, y: 130 },
        { name: "Delhi", x: 830, y: 240 },
        { name: "Singapore", x: 920, y: 320 },
        { name: "Sydney", x: 1050, y: 480 },
        { name: "Tokyo", x: 1020, y: 200 },
        { name: "San Francisco", x: 180, y: 190 },
        { name: "Toronto", x: 300, y: 160 },
    ]

    // Routes connecting source (e.g., India/Delhi) to destinations
    const routes = [
        { from: "Delhi", to: "London" },
        { from: "Delhi", to: "New York" },
        { from: "Delhi", to: "Berlin" },
        { from: "Delhi", to: "Toronto" },
        { from: "Delhi", to: "Sydney" },
        { from: "New York", to: "London" },
        { from: "London", to: "Singapore" },
    ]

    const getCity = (name: string) => cities.find(c => c.name === name)

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
            <svg
                viewBox="0 0 1200 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full object-cover"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* World Map Outline (Simplified Dotted) */}
                <defs>
                    <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" className="text-blue-500/20" />
                    </pattern>
                </defs>
                <rect width="1200" height="600" fill="url(#dot-pattern)" />

                {/* Connection Lines (Arcs) */}
                {routes.map((route, i) => {
                    const start = getCity(route.from)
                    const end = getCity(route.to)
                    if (!start || !end) return null

                    // Calculate Control Point for Arc (Quadratic Bezier)
                    const midX = (start.x + end.x) / 2
                    const midY = (start.y + end.y) / 2 - 100 // Curve upwards

                    return (
                        <g key={i}>
                            {/* Background Line */}
                            <path
                                d={`M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`}
                                stroke="url(#line-gradient)"
                                strokeWidth="1"
                                className="text-white/10"
                                fill="none"
                            />

                            {/* Animated Dash */}
                            <motion.path
                                d={`M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`}
                                stroke="url(#line-gradient)"
                                strokeWidth="2"
                                fill="none"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: [0, 1],
                                    opacity: [0, 1, 0],
                                    pathOffset: [0, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.5,
                                    repeatDelay: 1
                                }}
                            />
                        </g>
                    )
                })}

                {/* Cities Dots */}
                {cities.map((city, i) => (
                    <g key={i}>
                        <motion.circle
                            cx={city.x}
                            cy={city.y}
                            r="3"
                            className="fill-blue-400"
                            initial={{ scale: 0.5, opacity: 0.5 }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                        <circle cx={city.x} cy={city.y} r="8" className="fill-blue-500/10" />
                    </g>
                ))}

                <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                        <stop offset="50%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}
