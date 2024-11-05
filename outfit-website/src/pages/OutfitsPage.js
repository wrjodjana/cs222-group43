import React, { useContext } from 'react';
import { Form, Image, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

export const OutfitsPage = () => {
    const divStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        };
    
    const h1style = {
        fontSize: "60px",
    };

    return (
        <div style={divStyle} className='outfits'>
            <section id="section">
                <h1 style={h1style}> Let's pick out your outfit for today! </h1>
            </section>
        </div>
    )
  };