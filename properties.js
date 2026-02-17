const properties = [
    {
        id: 1,
        title: "Loft en Palermo Soho",
        price: 1200000,
        location: "Palermo, Buenos Aires",
        type: "Penthouse",
        bedrooms: 3,
        bathrooms: 2,
        area: 250,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_Xhyur7U8Fyn4-fQ5H9CpT_J4U9OUNKgCqf1usBqE1Yu4cW_jXB1lil_BOh87Zz0WB4UyDcBJb9LIyed2787vYTzYPdUgTG1RkL1HT6OyKBOPKPek5k5ilFxeAgpjntsyzklsNrYiLz9u2Xd0MLQbqCjnw1tFRPOh07WAUxXijIom2_vW8CcDXDSM2Mv0v3cm1qYHXS_m5UvrhPSaJNvGHBiNdCPANt3NrVH1W10xmRzKfqNwg-huRYFEnb93AUNmRt2VVWDmrUzX",
        description: "Un loft impresionante en el corazón de Palermo Soho, con techos altos, comodidades modernas y una amplia terraza.",
        amenities: ["Terraza", "Cocina Moderna", "Techos Altos"],
        agent: {
            name: "Sofia Martinez",
            phone: "+54 9 11 1234 5678",
            email: "sofia@maisonargent.com",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        featured: false
    },
    {
        id: 2,
        title: "Estancia Francesa en Recoleta",
        price: 3500000,
        location: "Recoleta, Buenos Aires",
        type: "Casco Histórico",
        bedrooms: 5,
        bathrooms: 4,
        area: 480,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSL3oKbNjrv-m1NZwPAZ3SSC6RX7OyhCJXBi5jwpS9KjVO-s279yBgbD_s6T5V6FcPBsSGvXF9__739aWm66JfQw2OTRux0ths2Y7b2TDXPWjd3fxxxpYNHdab1IOn4Iu8k5M8rMhvgXQPQ3RHv0H9vywsFD-5M4X-y-UHR2yocTENc9NGUyLZ5DgDdkktpmXUSHZy40yXbTapdwYAVVhX4HVt3retrPBfDFGgzbAQaaPFP7xQ0uvIoEhUkNgKsvARrQS25_IXCiEp",
        description: "Una exclusiva residencia de estilo francés en Recoleta, que ofrece vida de lujo con arquitectura clásica y confort moderno.",
        amenities: ["Jardín", "Pileta", "Cava", "Dependencia de Servicio"],
        agent: {
            name: "Rodrigo Alvear",
            phone: "+54 9 11 8765 4321",
            email: "rodrigo@maisonargent.com",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        featured: true
    },
    {
        id: 3,
        title: "Refugio en el Lago Patagónico",
        price: 5200000,
        location: "Bariloche, Rio Negro",
        type: "Villa Moderna",
        bedrooms: 4,
        bathrooms: 3,
        area: 320,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHU55sqa1a7GE4r1sCzAc1MjehaSMD4zOlV5Y9KIoWEI6S0oZYRiXp8ZS0VGmtaFx4AdAo7pJf2AIJdW0R56c2THLGE6W5McipHegRxjkIMWzmlSQuqszmUUjONp6Y7gWPKTicInxDDBEbmUZQSQSDk4zPFcbjypRA2-_UCWlxupMCranAD75W5FLOG0xVNtv0A5yxCZqHVcwDv9350-PegGuKUqlrDWdjI12APbT7NQbmmM7neZ6tMFtSnQS1GlCYDf3drrkglqXN",
        description: "Impresionantes vistas al lago desde esta moderna villa en Bariloche. Perfecta para amantes de la naturaleza que buscan lujo y privacidad.",
        amenities: ["Vista al Lago", "Muelle Privado", "Hogar a Leña", "Spa"],
        agent: {
            name: "Camila Osorio",
            phone: "+54 9 294 456 7890",
            email: "camila@maisonargent.com",
            image: "https://randomuser.me/api/portraits/women/68.jpg"
        },
        featured: false
    },
    {
        id: 4,
        title: "Moderno Puerto Madero",
        price: 950000,
        location: "Puerto Madero, Buenos Aires",
        type: "Penthouse",
        bedrooms: 2,
        bathrooms: 2,
        area: 180,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPeLYWiLFwdSEYrx3diyLagjOLZd6WNrD2RujE4Vcmb_i4fArpECMdXE-I6RVkNelI-qFusEz31HTTR3bNi4U51YDvvAewZOErmal9ZIkhtrZqUcuy07SFtJnMG26NkfoVZDD4YM8glUNQdk8Z3nWVnPVuwQBZ_GjyfNkYwbmruTTmhMNHTuThVlxpty1ZS1lM8BT3gto0W-iDnelCx1Q1vhtgIOEp_qkaF2LKs8WUCdXYWO0inGtwais6V7ep1v0M8Rp-61__0ki2",
        description: "Penthouse elegante y sofisticado en Puerto Madero con vistas panorámicas de la ciudad y el río.",
        amenities: ["Gimnasio", "Pileta", "Seguridad 24hs", "Balcón"],
        agent: {
            name: "Lucas Mendez",
            phone: "+54 9 11 2345 6789",
            email: "lucas@maisonargent.com",
            image: "https://randomuser.me/api/portraits/men/55.jpg"
        },
        featured: false
    },
    {
        id: 5,
        title: "Clásico de Belgrano",
        price: 1850000,
        location: "Belgrano R, Buenos Aires",
        type: "Casco Histórico",
        bedrooms: 4,
        bathrooms: 3,
        area: 290,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfEkCKtN-FKgD59zLwC2OqvhLIu91j7KT8-qQ8FrsVdwNmdKm_6HF0lW-X8Sorl6z1jefuBR8HrbVSUYv-1NL8dx_0fDW0Q-0kpotMN4VbfaxlWXPsQFuaAgWpZVBKEtiBLGoJQvxLTvfBU6ZAnXbxglTZwGVizdBGs0d_553yDK508YUZMM2VpUSqfBrY1qY7lrnejSZwCfIQ_YRLZyEWjv4sIVDkz6pBZWOK484MESci6aQNx-Vg_T2lDgdRlFVTZUHVBU3U_Uhf",
        description: "Una casa clásica bellamente conservada en el prestigioso barrio de Belgrano R, con un jardín exuberante.",
        amenities: ["Jardín", "Parrilla", "Cochera", "Pisos de Pinotea"],
        agent: {
            name: "Valentina Ricci",
            phone: "+54 9 11 3456 7890",
            email: "valentina@maisonargent.com",
            image: "https://randomuser.me/api/portraits/women/22.jpg"
        },
        featured: false
    },
    {
        id: 6,
        title: "Viñedo en Valle de Uco",
        price: 2700000,
        location: "Tunuyán, Mendoza",
        type: "Viñedo",
        bedrooms: 3,
        bathrooms: 3,
        area: 410,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWnjEc6jBSVzpEQphxbJFmLXKNWuh-LFrg2GlcVSZ02ezRGY0VbAZEy-I5FwPfkap5Ff-MgJDf1kdUK8VseoZVl3kt4hCrqhjL_GthC5u-vCP62kS9zs2ig0dxSf_Ddh4fK82SQVZmW5EYPUkGGuNUY6TpuK-bXGO3I1H5jj0cy9uRUhCWb8lgea3nmMsSvpRcACtOZD5QEzEhTYacNHbxO6R24IfmdqguT5kU4CsDBahOGs8w3EnwsJc83RWVJhXDYxNoCAd0xCqm",
        description: "Sea dueño de una parte de la región vinícola de Mendoza. Esta propiedad incluye un viñedo en producción y una residencia de lujo con vistas a la montaña.",
        amenities: ["Viñedo", "Vista a la Montaña", "Casa de Huéspedes", "Cava"],
        agent: {
            name: "Mateo Fernandez",
            phone: "+54 9 261 567 8901",
            email: "mateo@maisonargent.com",
            image: "https://randomuser.me/api/portraits/men/86.jpg"
        },
        featured: false
    }
];

// Export for use in other files (if using modules) or just global variable for simple include
if (typeof module !== 'undefined' && module.exports) {
    module.exports = properties;
}
