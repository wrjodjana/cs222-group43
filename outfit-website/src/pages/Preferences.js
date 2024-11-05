import React, { useContext } from 'react';
import { useState } from 'react';

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

    const [materialsSelected, setMaterialsSelected] = useState([]);

    const handleMaterialsChange = (selectedOptions) => {
        setMaterialsSelected(selectedOptions);
    };

    const storepreferences = (event) => {
        event.preventDefault();
        let form = event.target;
        let formData = new FormData(form);
        let formDataObj = Object.fromEntries(formData.entries());
        formDataObj.materials = materialsSelected.map(option => option.value);
        let formJSON = JSON.stringify(formDataObj);
        // console.log(formDataObj);
        console.log(formJSON);

        // event.preventDefault();
        // // console.log(event.target)
        // let form = event.target;
        // var value = [];
        // for (var i = 0, l = options.length; i < l; i++) {
        //     if (options[i].selected) {
        //         value.push(options[i].value);
        //     }
        // }
        // let formData = new FormData(form);
        // let formDataObj = Object.fromEntries(formData.entries());
        // let formJSON = JSON.stringify(formDataObj)
        // console.log(formDataObj)
        // console.log(formJSON)
    }

    return (
        <div style={divStyle} className='user preferences'>
            <section id="section">
                <h1 style={h1style}> Preferences </h1>
                <Form onSubmit={storepreferences}>
                    {/* <Form.Label style={textStyle} className ="title" for="location"> Location </Form.Label> 
                    <br/>
                    <Form.Control style={inputStyle} type="location" name="location"/>
                    <br/> */}
                    <Form.Label style={textStyle} className ="title" for="materials"> Materials </Form.Label> 
                    <br/>
                    <Select style={inputStyle} isMulti name="materials" options={options} className="basic-multi-select" classNamePrefix="select" onChange={handleMaterialsChange}/>
                    <br/>
                    <Form.Label style={textStyle} className ="title" for="controls">Ideal Conditions</Form.Label> 
                    <br/>
                    <Form.Control style={inputStyle} keyboardType="numeric" type="controls" name="temperature"/>
                    <br/>
                    <Button style={buttonStyle} type="submit">submit</Button>
                </Form>
            </section>
        </div>
    )
};