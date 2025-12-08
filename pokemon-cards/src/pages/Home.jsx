import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";

export default function Home() {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function fetchPokemons(p) {
        setLoading(true);
        setErrorMsg("");

        try {
            const response = await axios.get(
                `https://pokeapi.co/api/v2/pokemon?page=${p}&limit=18`
            );

            if (!response.data.results || response.data.results.length === 0) {
                setErrorMsg("Página inválida! Tente outra.");
                setPokemons([]);
            } else {
                const pokemonDetails = await Promise.all(
                    response.data.results.map(async (pokemon) => {
                        const details = await axios.get(pokemon.url);
                        return details.data;
                    })
                );
                setPokemons(pokemonDetails);
            }
        } catch (error) {
            setErrorMsg("Erro ao buscar pokémons!");
        }
        setLoading(false);
    }

    useEffect(() => {
        async function loadFirstPage() {
            setLoading(true);
            setErrorMsg("");

            try {
                const response = await axios.get(
                    "https://pokeapi.co/api/v2/pokemon?page=1&limit=18"
                );
                
                const pokemonDetails = await Promise.all(
                    response.data.results.map(async (pokemon) => {
                        const details = await axios.get(pokemon.url);
                        return details.data;
                    })
                );
                setPokemons(pokemonDetails);
            } catch (error) {
                setErrorMsg("Erro ao buscar pokémons!");
            }
            setLoading(false);
        }
        loadFirstPage();
    }, []);

    function handleSearch() {
        if (!page || page < 1) {
            setErrorMsg("Digite um número de página válido");
            return;
        }
        fetchPokemons(page);
    }

    return (
        <div className="container">
            <h1>Pokémon Cards</h1>

            <div className="search-box">
                <input
                    type="number"
                    placeholder="Digite uma página"
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>

            {loading && <p className="loading">Carregando...</p>}
            {errorMsg && <p className="loading">{errorMsg}</p>}

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
        </div>
    );
}