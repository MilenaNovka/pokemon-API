import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";

export default function Home() {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    async function fetchPokemons(p) {
        if (loading) return;
        
        setLoading(true);

        try {
            const offset = (p - 1) *20;
            const response = await axios.get(
                `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`
            );

            if (!response.data.results || response.data.results.length === 0) {
                setHasMore(false);
            } else {
                const pokemonDetails = await Promise.all(
                    response.data.results.map(async (pokemon) => {
                        const details = await axios.get(pokemon.url);
                        return details.data;
                    })
                );
                setPokemons((prev) => [...prev, ...pokemonDetails]);
            }
        } catch (error) {
            console.error("Erro ao buscar pokémons!");
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchPokemons(page);
    }, [page]);

    useEffect(() => {
        function handleScroll() {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                if (hasMore && !loading) {
                    setPage((prev) => prev + 1);
                }
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return (
        <div className="container">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1280px-International_Pok%C3%A9mon_logo.svg.png" alt="Logo do Pokémon"/>

            <div className="cards-grid">
                {pokemons.map((poke) => (
                    <Card
                        key={poke.id}
                        name={poke.name}
                        image={poke.sprites.other['official-artwork'].front_default}
                        id={poke.id}
                        types={poke.types.map(t => t.type.name).join(', ')}
                    />
                ))}
            </div>

            {loading && <p className="loading">Carregando mais pokémons...</p>}
            {!hasMore && <p className="loading">Todos os pokémons foram carregados!</p>}
        </div>
    );
}