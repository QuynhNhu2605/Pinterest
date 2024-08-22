import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        // Reset error message
        setError("");

        // Input validation
        if (!email) {
            setError("Email không được trống.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Email không đúng định dạng.");
            return;
        }
        if (!password) {
            setError("Mật khẩu không được trống.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:9999/users?account.email=${email}&account.password=${password}`);
            const user = response.data[0];

            if (user) {
                // if (user.account.isActive) {
                    // Save user info to localStorage
                    localStorage.setItem("user", JSON.stringify(user));
                    // Successful login, navigate to home page
                    navigate("/");  
                // } else {
                    // setError("Tài khoản của bạn chưa được kích hoạt.");
                // }
            } else {
                setError("Email hoặc mật khẩu không đúng.");
            }
        } catch (error) {
            console.error("Login error", error);
            setError("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };

    return (
        <Row className="content">
            <Col xs={12}>
                <h3 style={{ textAlign: "center" }}>Login</h3>
                <Form style={{ margin: "0px auto", width: "50%" }}>
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
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <Form.Group className="mb-3">
                        <Button variant="primary" onClick={handleLogin}>Login</Button>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    );
}
