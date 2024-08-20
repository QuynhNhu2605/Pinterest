import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Card, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function UserPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [errors, setErrors] = useState({});
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState("");
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [newPhoto, setNewPhoto] = useState({
        title: "",
        imageUrl: ""
    });

    useEffect(() => {
        const checkUser = JSON.parse(localStorage.getItem("user"));

        if (!checkUser) {
            navigate('/');
        } else {
            setUser(checkUser);
            setEditedUser(checkUser);

            axios.get(`http://localhost:9999/albums?userId=${checkUser.userId}`)
                .then(res => setAlbums(res.data))
                .catch(err => console.error(err));
        }
    }, [navigate]);

    useEffect(() => {
        if (selectedAlbumId !== null) {
            axios.get(`http://localhost:9999/photos?albumId=${selectedAlbumId}`)
                .then(res => setPhotos(res.data))
                .catch(err => console.error(err));
        }
    }, [selectedAlbumId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        if (keys.length === 1) {
            setEditedUser({ ...editedUser, [name]: value });
        } else {
            setEditedUser(prev => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value
                }
            }));
        }
    };

    const validateForm = () => {
        let formErrors = {};

        if (!editedUser.name) formErrors.name = "Name is required";
        if (!editedUser.account.email) formErrors.email = "Email is required";
        if (!editedUser.address.street) formErrors.street = "Street is required";
        if (!editedUser.address.city) formErrors.city = "City is required";
        if (!editedUser.address.zipCode) formErrors.zipCode = "Zip code is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            axios.put(`http://localhost:9999/users/${user.id}`, editedUser)
                .then(() => {
                    setUser(editedUser);
                    localStorage.setItem("user", JSON.stringify(editedUser));
                    setIsEditing(false);
                    setErrors({});
                })
                .catch(err => console.error(err));
        }
    };

    const handleAddAlbum = () => {
        const newAlbum = {
            id: albums.length + 1,
            albumId: albums.length + 1,
            title: newAlbumTitle,
            userId: user.userId
        };
        axios.post('http://localhost:9999/albums', newAlbum)
            .then(() => {
                setAlbums([...albums, newAlbum]);
                setShowAlbumModal(false);
            })
            .catch(err => console.error(err));
    };

    const handleAddPhoto = () => {
        const newPhotoData = {
            id: photos.length + 1,
            photoId: photos.length + 1,
            title: newPhoto.title,
            image: {
                url: newPhoto.imageUrl,
                thumbnail: newPhoto.imageUrl
            },
            albumId: selectedAlbumId
        };
        axios.post('http://localhost:9999/photos', newPhotoData)
            .then(() => {
                setPhotos([...photos, newPhotoData]);
                setShowPhotoModal(false);
            })
            .catch(err => console.error(err));
    };

    const renderProfile = () => (
        <Card>
            <Card.Body>
                <h3>Information</h3>
                <hr></hr>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">User ID</Form.Label>
                        <Col sm="10">
                            <Form.Control 
                                plaintext={!isEditing}  
                                readOnly 
                                value={user.userId} 
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">Name</Form.Label>
                        <Col sm="10">
                            <Form.Control 
                                isInvalid={!!errors.name}
                                plaintext={!isEditing} 
                                readOnly={!isEditing} 
                                value={editedUser.name} 
                                name="name" 
                                onChange={handleInputChange} 
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">Email</Form.Label>
                        <Col sm="10">
                            <Form.Control 
                                type="email"
                                plaintext={!isEditing} 
                                readOnly
                                value={editedUser.account?.email || ''} 
                                name="account.email" 
                                onChange={handleInputChange} 
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">Street</Form.Label>
                        <Col sm="10">
                            <Form.Control 
                                isInvalid={!!errors.street}
                                plaintext={!isEditing} 
                                readOnly={!isEditing} 
                                value={editedUser.address?.street || ''} 
                                name="address.street" 
                                onChange={handleInputChange} 
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.street}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">City</Form.Label>
                        <Col sm="10">
                            <Form.Control 
                                isInvalid={!!errors.city}
                                plaintext={!isEditing} 
                                readOnly={!isEditing} 
                                value={editedUser.address?.city || ''} 
                                name="address.city" 
                                onChange={handleInputChange} 
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.city}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    
                </Form>

                <Button variant={isEditing ? "success" : "primary"} onClick={isEditing ? handleSave : () => setIsEditing(true)}>
                    {isEditing ? "Save" : "Edit"}
                </Button>
            </Card.Body>
        </Card>
    );

    const renderAlbums = () => (
        <Row>
            <Col md={4}>
                <ListGroup>
                    {albums.map(album => (
                        <ListGroup.Item 
                            key={album.albumId} 
                            action 
                            active={selectedAlbumId === album.albumId}
                            onClick={() => setSelectedAlbumId(album.albumId)}
                        >
                            {album.title}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Button variant="primary" onClick={() => setShowAlbumModal(true)} style={{ marginTop: '10px' }}>Add New Album</Button>
            </Col>
            <Col md={8}>
                {selectedAlbumId && (
                    <>
                        <Button variant="primary" onClick={() => setShowPhotoModal(true)} style={{ marginBottom: '10px' }}>Add New Photo</Button>
                        <Row>
                            {photos.map(p => (
                                <Col md={4} key={p.photoId}>
                                    <Card  style={{ width: '95%', marginBottom:"10px" }} key={p.id} >
                                                <Card.Img variant="top" src={"/assets/images/" + p.image.thumbnail} />
                                                <Card.Body style={{ textAlign: "center" }}>
                                                    <Card.Title>
                                                        <Link to={`/photo/${p.photoId}`} style={{color:"gray", textDecoration:"none", fontWeight:"initial"}}>
                                                            {p.title}
                                                        </Link>
                                                    </Card.Title>
                                                </Card.Body>
                                            </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Col>
        </Row>
    );

    const renderContent = () => {
        if (activeTab === 'profile') {
            return renderProfile();
        } else if (activeTab === 'albums') {
            return renderAlbums();
        }
    };

    return (
        <Container fluid>
            <Row style={{ marginTop: "20px" }}>
                <Col md={3}>
                    <ListGroup>
                        <ListGroup.Item action active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setSelectedAlbumId(null); }}>
                            User Profile
                        </ListGroup.Item>
                        <ListGroup.Item action active={activeTab === 'albums'} onClick={() => { setActiveTab('albums'); setSelectedAlbumId(null); }}>
                            Albums
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={9}>
                    {user ? renderContent() : <p>Loading...</p>}
                </Col>
            </Row>

            {/* Modal for adding new album */}
            {/* <Modal show={showAlbumModal} onHide={() => setShowAlbumModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Album</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Album Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={newAlbumTitle} 
                            onChange={(e) => setNewAlbumTitle(e.target.value)} 
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAlbumModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddAlbum}>Add Album</Button>
                </Modal.Footer>
            </Modal> */}

            {/* Modal for adding new photo */}
            {/* <Modal show={showPhotoModal} onHide={() => setShowPhotoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Photo Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={newPhoto.title} 
                            onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })} 
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Photo URL</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={newPhoto.imageUrl} 
                            onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })} 
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddPhoto}>Add Photo</Button>
                </Modal.Footer>
            </Modal> */}
        </Container>
    );
}

export default UserPage;
