import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import emailjs from '@emailjs/browser';

function ActiveEmail() {
    const location = useLocation();
    const email = location.state?.email;
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState('');
    const [activeCode, setActiveCode] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9999/users');
                const user = response.data.find(item => item.account.email == email);
                console.log(user);


                if (user) {
                    const activeCode = Math.random().toString(36).substring(2, 9).toUpperCase();
                    const updatedUser = {
                        ...user,
                        account: {
                            ...user.account,
                            activeCode: activeCode
                        }
                    };
                    console.log(updatedUser);


                    await axios.put(`http://localhost:9999/users/${user.id}`, updatedUser);
                    setUserData(updatedUser);

                    await emailjs.send('service_8p9ujuc', 'template_tect6kh', {
                        to_name: user.account.name,
                        to_email: email,
                        verification_code: activeCode,
                    }, '2b-qdQZ3aibs-cDap');
                } else {
                    console.log('User not found.');
                }
            } catch (err) {
                if (err.response) {
                    console.log('Error updating user data or sending email.');
                } else {
                    console.log('Error fetching user data.');
                }
            }
        };

        fetchData();
    }, [email]);
    console.log(userData);

    const handleSendAgain = async (event) => {
        event.preventDefault();
        try {
            const activeCode = Math.random().toString(36).substring(2, 9).toUpperCase();
            const updateData = {
                ...userData,
                account: {
                    ...userData.account,
                    activeCode: activeCode
                }
            };

            await axios.put(`http://localhost:9999/users/${userData.id}`, updateData);
            setUserData(updateData);

            await emailjs.send('service_8p9ujuc', 'template_tect6kh', {
                to_name: userData.account.name,
                to_email: email,
                verification_code: activeCode,
            }, '2b-qdQZ3aibs-cDap');



        } catch (err) {
            console.error('Error sending email or updating user:', err);
        }
    };

    const handleSubmitActive = async (event) => {
        event.preventDefault();
        if (activeCode.trim() === '') {
            setError('Hãy nhập active code');
            return;
        } else {
            if (activeCode != userData.account.activeCode) {
                setError('Active code không chính xác');
                return;
            } else {
                await axios.put(`http://localhost:9999/users/${userData.id}`, {
                    ...userData,
                    account: {
                        ...userData.account,
                        activeCode: '',
                        isActive: true
                    }
                }).then(response => {
                    if (response.data) {
                        navigate('/auth/login');
                    }
                })

            }

        }
    }

    return (
        <Row className="content" style={{marginBlockStart: "50px", marginBlockEnd: "100px"}}>
            <Col xs={12}>
                <h3 className="text-center">You need to activate your email</h3>
                <Form style={{ margin: "0px auto", width: "50%" }}>
                    <p style={{ textAlign: "center", color: "green" }}>Check your email for the activation code</p>
                    <Form.Group as={Row} className="align-items-center">
                        <Col xs={9}>
                            <Form.Control type="text" value={email} disabled />
                        </Col>
                        <Col xs={3}>
                            <Button variant="primary" type="button" style={{ width: "100%" }} onClick={handleSendAgain}>Send again</Button>
                        </Col>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Control type="text" placeholder="Enter code" onChange={(e) => setActiveCode(e.target.value)} />
                        <p style={{ color: "red" }}>{error}</p>
                        <Button variant="primary" type="submit" onClick={handleSubmitActive}>Verify</Button>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    );
}

export default ActiveEmail;
