import axios from 'axios';
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [activeCode, setActiveCode] = useState('');
    const [messageEmail, setMessageEmail] = useState('');
    const [successEmail, setSuccessEmail] = useState('');
    const [userCheck, setUserCheck] = useState([]);
    const [messageActiveCode, setMessageActiveCode] = useState('');
    const handleSubmitEmail = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get('http://localhost:9999/users');
            const data = response.data;

            if (email.trim() === '') {
                setMessageEmail('Hãy nhâp email');
                return;
            }

            const checkUser = data.find(user => user.account.email === email);

            if (checkUser) {
                const activeCode = Math.random().toString(36).substring(2, 9).toUpperCase();

                const updatedUser = {
                    ...checkUser,
                    account: {
                        ...checkUser.account,
                        activeCode: activeCode
                    }
                };

                await axios.put(`http://localhost:9999/users/${checkUser.id}`, updatedUser);
                setUserCheck(updatedUser);

                await emailjs.send('service_8p9ujuc', 'template_h0s2gpt', {
                    to_name: userCheck.name,
                    to_email: email,
                    verification_code: activeCode,
                }, '2b-qdQZ3aibs-cDap');

                setMessageEmail('');
                setSuccessEmail('Active code đã gửi tới email');
            } else {
                setMessageEmail('Email không tồn tại');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setMessageEmail('An error occurred while processing your request.');
        }
    };

    const handleSubmitActiveCode = async (event) => {
        event.preventDefault();
        if (activeCode.trim() === '') {
            setMessageActiveCode('Hãy nhập active code');
            return;
        }

        if (userCheck && userCheck.account.activeCode === activeCode) {
            await axios.put(`http://localhost:9999/users/${userCheck.id}`, {
                ...userCheck,
                account: {
                    ...userCheck.account,
                    activeCode: ''
                }
            });
            setMessageActiveCode('');
            navigate('/auth/resetpassword/' + userCheck.id);
        } else {
            setMessageActiveCode('Active code không chính xác');
        }
    }


    return (
        <Row className="content" style={{ marginBlockStart: "50px", marginBlockEnd: "100px" }} >
            <Col md={12}>
                <Container>
                    <h4 className='text-center'>Forgot Password</h4>
                    <Form onSubmit={handleSubmitEmail}>
                        <Form.Group style={{ width: '50%', margin: 'auto' }}>
                            <Form.Label>Email: </Form.Label>
                            <Form.Control type="email" placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)} />
                            <p style={{ color: 'green' }}>{successEmail}</p>
                            <p style={{ color: 'red' }}>{messageEmail}</p>
                            <Button variant="primary" type="submit" style={{ marginBlockStart: '10px', marginBlockEnd: '10px' }}>Get Active Code</Button>
                        </Form.Group>
                    </Form>
                    <Form onSubmit={handleSubmitActiveCode}>
                        <Form.Group style={{ width: '50%', margin: 'auto' }}>
                            <Form.Label>Active Code: </Form.Label>
                            <Form.Control type="text" placeholder="Enter code" onChange={(e) => setActiveCode(e.target.value)} />
                            <p style={{ color: 'red' }}>{messageActiveCode}</p>
                            <Button variant="primary" type="submit" style={{ marginBlockStart: '10px', marginBlockEnd: '10px' }}>Send</Button>
                        </Form.Group>
                    </Form>
                </Container>
            </Col>

        </Row>

    )
}

export default ForgotPassword