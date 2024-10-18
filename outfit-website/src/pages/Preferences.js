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

const MyComponent = () => (
  <Select options={options} />
)

export const Preferences = () => {
    return (
        <div className='user preferences'>
            <section id="section">
                <Form onSubmit/*={storepreferences}*/>
                    <Form.Label className ="title" for="location"> Location </Form.Label> 
                    <Form.Control type="location" name="location"/>
                    <br/>
                    <Form.Label className ="title" for="materials"> Materials </Form.Label> 
                    {/* <Form.Control type="materials" name="materials"/> */}
                    {/* <Select options={options} /> */}
                    <Select
                        isMulti
                        name="colors"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    <br/>
                    <Form.Label className ="title" for="temperature">Ideal Temperature</Form.Label> 
                    <Form.Control type="temperature" name="temperature"/>
                    <br/>
                    <Button type="submit">submit</Button>
                </Form>
            </section>
        </div>
    )
};