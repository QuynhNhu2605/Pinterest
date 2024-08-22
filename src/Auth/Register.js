import { Row, Col, Form, Button } from "react-bootstrap";

export default function Register(){
    return (
        <Row className="content">
            <Col xs={12}>
                <h3 style={{textAlign:"center"}}>Register Form</h3>
                <Form style={{margin: "0px auto", width:"50%"}}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control placeholder="Please enter name"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control placeholder="Please enter email"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password *</Form.Label>
                        <Form.Control type="password" placeholder="Please enter password"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label></Form.Label>
                        <Button variant="primary">Register</Button>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    )
}