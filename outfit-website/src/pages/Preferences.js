import React, { useContext } from 'react';
import { Form, Image, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
// import React from 'react'
import Select from 'react-select'

const options = [
    { value: 'cotton', label: 'Cotton' },
    { value: 'linen', label: 'Linen' },
    { value: 'polyester', label: 'Polyester' },
    { value: 'wool', label: 'Wool' },
    { value: 'nylon', label: 'Nylon' },
    { value: 'denim', label: 'Denim' },
    { value: 'jersey', label: 'Jersey' }
]

// const MyComponent = () => (
//   <Select options={options} />
// )

export const Preferences = () => {
    const divStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        };
    
    const h1style = {
        fontSize: "40px",
    };

    const textStyle = {
        fontSize: "32px",
        borderRadius: "40px",
        padding: "0px 0px 0px 0px",
        margin: "20px 20px 20px 0px",
        borderWidth: "3",
    };
    
    const inputStyle = {
        width: "400px",
        height: "50px",
        borderRadius: "20px",
        padding: "10px 10px 10px 20px",
        fontSize: "18px",
    };

    const buttonStyle = {
        width: "200px",
        height: "50px",
        borderRadius: "20px",
        padding: "10px 10px 10px 20px",
        margin: "auto",
        fontSize: "18px",
    };

    return (
        <div style={divStyle} className='user preferences'>
            <section id="section">
                <h1 style={h1style}> Preferences </h1>
                <Form onSubmit/*={storepreferences}*/>
                    <Form.Label style={textStyle} className ="title" for="location"> Location </Form.Label> 
                    <br/>
                    <Form.Control style={inputStyle} type="location" name="location"/>
                    <br/>
                    <Form.Label style={textStyle} className ="title" for="materials"> Materials </Form.Label> 
                    <br/>
                    <Select style={inputStyle} isMulti name="colors" options={options} className="basic-multi-select" classNamePrefix="select"/>
                    <br/>
                    <Form.Label style={textStyle} className ="title" for="temperature">Ideal Temperature</Form.Label> 
                    <br/>
                    <Form.Control style={inputStyle} type="temperature" name="temperature"/>
                    <br/>
                    <Button style={buttonStyle} type="submit">submit</Button>
                </Form>
            </section>
        </div>
    )
};