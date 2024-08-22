import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import emailjs from '@emailjs/browser';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorUser, setErrorUser] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');
        setErrorUser('');

        if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
            setError('Hãy nhập tên, email, và mật khẩu');
            return;
        }

        try {
            const response = await axios.get("http://localhost:9999/users");
            const users = response.data;
            if (users.some(user => user.account.email === email)) {
                setErrorUser('Tài khoản đã tôn tại');
                return;
            }
            const lastUserId = users.length > 0 ? users[users.length - 1].id : 0;
            const newUserId = parseInt(lastUserId) + 1;
            const activeCode = Math.random().toString(36).substring(2, 9).toUpperCase();

            const newUser = {
                id: newUserId.toString(),
                userId: newUserId,
                name: name,
                account: {
                    email: email,
                    password: password,
                    activeCode: activeCode,
                    isActive: false
                },
                address: {
                    street: "",
                    city: "",
                    zipCode: "10000"
                }
            };
            console.log(newUser);
            

            await axios.post("http://localhost:9999/users", newUser);

            //gửi mail xác nhận
            await emailjs.send('service_kfmki4n', 'template_ssq8bhf', {
                to_name: name,
                to_email: email,
                verification_code: activeCode,
            }, 'UtSpjgYyHQ0WusakY')
            .then((result) => {
                console.log('Email sent: ', result.text);
                
            }, (error) => {
                console.log('Email failed to send: ', error.text);
            });

            navigate(`/auth/active-account/${newUserId}`);

        } catch (error) {
            console.log("Error: ", error);
            setError('Failed to register the user');
        }
    };

    return (
        <Row className="content" style={{marginBlockStart: "50px", marginBlockEnd: "100px"}}>
            <Col xs={12}>
                <h3 className="text-center">Register Form</h3>
                {errorUser && <p className="text-center text-danger">{errorUser}</p>}
                <Form style={{ margin: "0px auto", width: "50%" }} onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            placeholder="Please enter name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Please enter email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password *</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Please enter password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </Form.Group>
                    {error && <p className="text-danger">{error}</p>}
                    <Form.Group className="mb-3">
                        <Button variant="primary" type="submit">Register</Button>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    );
}
