import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useParams,useNavigate } from 'react-router-dom'


function Verify() {
    const { key } = useParams();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [saveData, setSaveData] = useState({});
    const [saveEmail, setSaveEmail] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:9999/users/${key}`).then(response => {
            const data = response.data;
            setSaveData(data);
            if (data) {
                setSaveEmail(data.account.email);
            }
        })
    }, []);
    const handleVerify = async (event) => {
        event.preventDefault();
        if (code.trim() === '') {
            setErrorCode('Hãy nhập active code');
            return;
        } else {
            if (code != saveData.account.activeCode){
                setErrorCode('Active code không chính xác');
                return;
            } else{
                await axios.put(`http://localhost:9999/users/${key}`, {
                    ...saveData,
                    account: {
                        ...saveData.account,
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
            <Row className="content">
                <Col xs={12}>
                    <h3 className="text-center">Verify Account</h3>
                    <Form style={{ margin: "0px auto", width: "50%" }} onSubmit={handleVerify}>
                        <p style={{ textAlign: "center", fontWeight: "bold" }}>{saveEmail}</p>
                        <p style={{ textAlign: "center", color: "green" }}>Check your email for active code</p>
                        <Form.Group className="mb-3">
                            <Form.Label>Active code</Form.Label>
                            <Form.Control
                                placeholder="Enter active code"
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </Form.Group>
                        <p style={{ color: "red" }}>{errorCode}</p>
                        <Form.Group className="mb-3">
                            <Button variant="primary" type="submit">Verify</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        )
    }

    export default Verify