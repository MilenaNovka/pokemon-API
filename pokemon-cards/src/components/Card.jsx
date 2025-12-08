import React from "react";

export default function Card({name, image, id, types}){
    return(
        <div className="card">
            <img src={image} alt={name} />
            <h2>{name}</h2>
            <p><strong>Pokédex</strong> #{id}</p>
            <p><strong>Tipo:</strong> {types}</p>
        </div>
    );
}