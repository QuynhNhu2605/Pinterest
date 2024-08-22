import { Button, Col, Form, Row } from "react-bootstrap";
import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async (event) => {
        event.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            setError('Please enter email and password');
        } else {
            await axios.get("http://localhost:9999/users")
                .then(response => {
                    let user = response.data.find(u => u.account.email === email && u.account.password === password);
                    if (user) {
                        if (user.account.isActive) {
                            localStorage.setItem('user', JSON.stringify(user));
                            window.location.href = '/';
                        } else {
                            navigate('/auth/activate', {state: {email: email}});
                        }
                    } else {
                        setError('Invalid email or password');
                    }
                })
                .catch(err => console.log("Error: " + err));
        }

    }

    return (
        <Row className="content" style={{marginBlockStart: "50px", marginBlockEnd: "100px"}}>
            <Col xs={12}>
                <h3 style={{textAlign:"center"}}>Login Form</h3>
                <Form style={{margin: "0px auto", width:"50%"}} onSubmit={handleLogin}>
                    <Form.Group className="mb-3" >
                        <Form.Label>Email *</Form.Label>
                        <Form.Control placeholder="Please enter email" onChange={e => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password *</Form.Label>
                        <Form.Control type="password" placeholder="Please enter password" onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Link to={"/auth/forgotPassword"}><p style={{ cursor: 'pointer' , color: 'blue', textDecoration: 'underline', textAlign: 'right'}}>Forgot password</p></Link>
                    <p style={{ color: 'red' }}>{error}</p>
                    <Form.Group className="mb-3">
                        <Form.Label></Form.Label>
                        <Button variant="primary" type="submit">Login</Button>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    )
}