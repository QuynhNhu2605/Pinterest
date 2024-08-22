import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

function ResetPassword() {
    const navigate = useNavigate();
    const { key } = useParams();
    const [email, setEmail] = useState("");
    const [data, setData] = useState([]);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/users/${key}`);
                const data = response.data;
                setEmail(data.account.email);
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [key]);
    const handleResetPassword = async (event) => {
        event.preventDefault();
        if (password.trim === "" || repeatPassword.trim() === "") {
            setError("Please enter new password");
            return;
        }
        if (password !== repeatPassword) {
            setError("Password not match");
            return;
        }
        await axios.put(`http://localhost:9999/users/${data.id}`, {
            ...data,
            account: {
                ...data.account,
                password: password
            }
        });
        navigate("/auth/login");

    }
    return (
        <Container style={{ marginTop: "50px" }}>
            <h3 className='text-center'>Reset Password</h3>
            <p style={{ textAlign: "center", color: "green", fontWeight: "bold" }}>{email}</p>
            <Form onSubmit={handleResetPassword}>
                <Form.Group style={{ width: '50%', margin: 'auto' }}>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)} />
                    <Form.Label>Repeat New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" onChange={(e) => setRepeatPassword(e.target.value)} />
                    <p style={{ color: "red" }}>{error}</p>
                    <Button variant="primary" type="submit" style={{ marginBlockStart: "10px", marginBlockEnd: "10px" }}>Enter</Button>
                </Form.Group>

            </Form>
        </Container>
    )
}

export default ResetPassword