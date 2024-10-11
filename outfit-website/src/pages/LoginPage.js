import React, { useContext } from 'react';
import { Form, Image, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';


export const LoginPage = () => {
  // let {loginuser} = useContext(AuthContext)
    return (
        <div className='outer loginPage'>
            <section id="section">
                <Image src="https://cdn-icons-png.flaticon.com/128/1163/1163661.png" className="d-block mx-auto img-fluid w-120"></Image>
                <Form onSubmit/*={loginuser}*/>
                    <Form.Label className ="title" for="user"> Username </Form.Label> 
                    <Form.Control type="user" name="username"/>
                    <Form.Label className = 'title'for="pass"> Password </Form.Label> 
                    <Form.Control type="password" name="password"/>
                    <br />
                    <Button type="submit">SIGN IN</Button>
                </Form>
            </section>
        </div>
        
    )
};