import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Card, Button, Form, Modal, Image } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaPen } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAlbums } from './AlbumContext';

function UserPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(null);
    // const [albums, setAlbums] = useState([]);
    const { albums, setAlbums } = useAlbums(); 
    const [countAlbums, setCountAlbums] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [selectedAlbumTitle, setSelectedAlbumTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isEditPassword, setIsEditPassword] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [errors, setErrors] = useState({});
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [showEditAlbumModal, setShowEditAlbumModal] = useState(false);
    const [showDelAlbumModal, setShowDelAlbumModeal] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState("");
    const [newAlbumTitleErr, setNewAlbumTitleErr] = useState("");
    const [editAlbumTitle, setEditAlbumTitle] = useState("");
    const [editAlbumTitleErr, setEditAlbumTitleErr] = useState("");
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [isRender, setIsRender] = useState(null);
    const [allPhoto, setAllPhoto] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [indexPhoto, setIndexPhoto] = useState({});
    const [newPhoto, setNewPhoto] = useState({
        title: "",
        imageUrl: "",
        thumbnail: "",
        tag: ""
    });

    useEffect(() => {
        if (selectedAlbumId !== null || isRender === 1) {
            axios.get(`http://localhost:9999/photos`)
                .then(res => setAllPhoto(res.data))
                .catch(err => console.error(err));
            setIsRender(0);
        }
    }, [selectedAlbumId, isRender]);

    useEffect(() => {
        const checkUser = JSON.parse(localStorage.getItem("user"));

        if (!checkUser) {
            navigate('/');
        } else {
            setUser(checkUser);
            setEditedUser(checkUser);

            const fetchAlbums = async () => {
                try {
                    const albumResponse = await axios.get(`http://localhost:9999/albums`)
                    setAlbums(albumResponse.data?.filter(a => a.userId == checkUser.userId));
                    setCountAlbums(albumResponse.data.length);
                }
                catch (error) {
                    console.log(error);
                }
            }

            fetchAlbums();
        }
    }, [navigate]);

    useEffect(() => {
        if (selectedAlbumId !== null) {
            const fetchPhotos = async () => {
                try {
                    const resPhoto = await axios.get(`http://localhost:9999/photos?albumId=${selectedAlbumId}`)
                    setPhotos(resPhoto.data);
                } catch (err) {
                    console.log(err);
                }
            }
            setIsRender(0);
            fetchPhotos();
        }
    }, [selectedAlbumId, isRender]);

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
        if (!editedUser.account.password) formErrors.password = "Password is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleDeletePhoto = async (photoid) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa ảnh này không?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:9999/photos/${photoid}`);
                setIsRender(1);
            } catch (error) {
                alert("Có lỗi xảy ra khi xóa ảnh. Vui lòng thử lại sau.");
            }
        }
    };
    const handleSave = () => {
        if (validateForm()) {
            axios.put(`http://localhost:9999/users/${user.id}`, editedUser)
                .then(() => {
                    setUser(editedUser);
                    localStorage.setItem("user", JSON.stringify(editedUser));
                    setIsEditing(false);
                    setErrors({});
                    setIsEditPassword(false);
                })
                .catch(err => console.error(err));
        }
    };

    const handleAddAlbum = () => {
        let isValid = true;

        if (newAlbumTitle.length == 0) {
            isValid = false;
            setNewAlbumTitleErr("Title must not empty");
        } else {
            isValid = true;
            setNewAlbumTitleErr("");
        }

        if (isValid) {

            const newAlbum = {
                id: (countAlbums + 1).toString(),
                albumId: countAlbums + 1,
                title: newAlbumTitle,
                userId: user.userId,
                isActive: true,
            };
            axios.post('http://localhost:9999/albums', newAlbum)
                .then(() => {
                    setAlbums([...albums, newAlbum]);
                    setShowAlbumModal(false);
                    // localStorage.setItem('albums', JSON.stringify(albums));
                    // window.location.reload(); //To reload the header, remove if no need
                })
                .catch(err => console.error(err));
        }
    };

    const handleShowEditAlbumModal = (albumId) => {
        const foundAlb = albums?.find(a => a.id == albumId)

        if(foundAlb) {
            setSelectedAlbumTitle(foundAlb.title);
        }

        setShowEditAlbumModal(true);
    }

    const handleUpdateAlbum = () => {
        let isValid = true;

        if (editAlbumTitle.length == 0) {
            isValid = false;
            setEditAlbumTitleErr("Title must not empty");
        } else {
            isValid = true;
            setEditAlbumTitleErr("");
        }

        if (isValid) {
            const editAlbum = {
                title: editAlbumTitle
            };
            axios.patch(`http://localhost:9999/albums/${selectedAlbumId}`, editAlbum)
                .then(() => {
                    // Cập nhật danh sách album trong context
                    setAlbums((prevAlbums) =>
                        prevAlbums.map((album) =>
                            album.albumId === selectedAlbumId ? { ...album, title: editAlbumTitle } : album
                        )
                    );
                    setShowEditAlbumModal(false);
                })
                .catch(err => console.error(err));
        }
    };

    const handleDelAlbum = () => {
        const disableAlbum = async () => {
            try {
                await axios.patch(`http://localhost:9999/albums/${selectedAlbumId}`, { isActive: false })
                setAlbums((prevAlbums) =>
                    prevAlbums.filter((album) => album.albumId !== selectedAlbumId)
                  );
                  setShowDelAlbumModeal(false);
            } catch (error) {
                console.log(error);

            }
        }

        disableAlbum();
    }
    const handleSaveEdit = () => {
        axios.put(`http://localhost:9999/photos/${indexPhoto.id}`, indexPhoto)
            .then(() => {
                setIsRender(1);
                setShowEditModal(false);
            })
            .catch(err => console.error(err));
    }
    const handleEditPhoto = (e) => {
        setShowEditModal(true);
        setIndexPhoto(e);
    }
    const handleAddPhoto = () => {
        const input = newPhoto.tag;
        const newTag = input.split(',').map(t => t.trim()).filter(t => t !== '');
        const newPhotoData = {
            // id: allPhoto.length + 1,
            photoId: allPhoto.length + 1,
            title: newPhoto.title,
            image: {
                url: newPhoto.imageUrl,
                thumbnail: newPhoto.thumbnail
            },
            albumId: selectedAlbumId,
            tags: newTag
        };
        axios.post('http://localhost:9999/photos', newPhotoData)
            .then(() => {
                setPhotos([...photos, newPhotoData]);
                setShowPhotoModal(false);
                setIsRender(1);
                setNewPhoto(null);
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

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">Password</Form.Label>
                        <Col sm="2">
                            <Form.Control
                                type={isEditPassword ? "text" : "password"}
                                isInvalid={!!errors.city}
                                plaintext={!isEditPassword}
                                readOnly={!isEditPassword}
                                value={editedUser.account?.password || ''}
                                name="account.password"
                                onChange={handleInputChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Col>
                        <Col sm="8">
                            {
                                isEditing && (
                                    <FaPen onClick={() => setIsEditPassword(!isEditPassword)} style={{ cursor: 'pointer' }} />
                                )
                            }

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
                    {albums?.map(album => album.isActive && (
                        <ListGroup.Item
                            key={album.albumId}
                            action
                            active={selectedAlbumId === album.albumId}
                            onClick={() => setSelectedAlbumId(album.albumId)}
                            className='p-2'
                        >
                            <ul className='d-flex mb-0' style={{ listStyle: "none" }}>
                                <li >
                                    {album.title}
                                </li>
                                <li className='ms-auto'>
                                    <Button variant='warning' onClick={() => handleShowEditAlbumModal(album.id)}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                                </li>
                                <li className='ps-2'>
                                    <Button variant='danger' onClick={() => setShowDelAlbumModeal(true)}><FontAwesomeIcon icon={faTrash} /></Button>
                                </li>
                            </ul>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Button variant="success" onClick={() => setShowAlbumModal(true)} style={{ marginTop: '10px' }}>Add New Album</Button>
            </Col>
            <Col md={8}>
                {selectedAlbumId && (
                    <>
                        <Button variant="primary" onClick={() => setShowPhotoModal(true)} style={{ marginBottom: '10px' }}>Add New Photo</Button>
                        <Row>
                            {photos.map(p => (
                                <Col md={4} key={p.photoId}>
                                    <Card style={{ width: '95%', marginBottom: "10px" }} key={p.id} >
                                        <Card.Img variant="top" src={"/assets/images/" + p.image.thumbnail} />
                                        <Card.Body style={{ textAlign: "center" }}>
                                            <Card.Title>
                                                <Link to={`/photo/${p.photoId}`} style={{ color: "gray", textDecoration: "none", fontWeight: "initial" }}>
                                                    {p.title}
                                                </Link>
                                            </Card.Title>
                                            <Button onClick={(e) => handleEditPhoto(p)}>
                                                <FaEdit />
                                            </Button>
                                            <Button onClick={() => handleDeletePhoto(p.id)} style={{ marginLeft: '15px' }}>
                                                <MdDelete />
                                            </Button>
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
                        <ListGroup.Item action active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setSelectedAlbumId(null); }} className='p-2'>
                            User Profile
                        </ListGroup.Item>
                        <ListGroup.Item action active={activeTab === 'albums'} onClick={() => { setActiveTab('albums'); setSelectedAlbumId(null); }} className='p-2'>
                            Albums
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={9}>
                    {user ? renderContent() : <p>Loading...</p>}
                </Col>
            </Row>

            {/* Modal for adding new album */}
            <Modal show={showAlbumModal} onHide={() => setShowAlbumModal(false)}>
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
                        {newAlbumTitleErr && <span style={{ color: "red" }}>{newAlbumTitleErr}</span>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAlbumModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddAlbum}>Add Album</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for updating new album */}
            <Modal show={showEditAlbumModal} onHide={() => setShowEditAlbumModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Album</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Album Title</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={selectedAlbumTitle}
                            onChange={(e) => setEditAlbumTitle(e.target.value)}
                        />
                        {editAlbumTitleErr && <span style={{ color: "red" }}>{editAlbumTitleErr}</span>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditAlbumModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdateAlbum}>Save Change</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for disable album */}
            <Modal show={showDelAlbumModal} onHide={() => setShowDelAlbumModeal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete album!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure want to delete this Album?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDelAlbumModeal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelAlbum}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for adding new photo */}
            <Modal show={showPhotoModal} onHide={() => setShowPhotoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Photo Title</Form.Label>
                        <Form.Control
                            type="text"
                           
                            onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Photo Thumbnail</Form.Label>
                        
                        <Form.Control
                            style={{ marginTop: '10px' }}
                            type="file"
                            onChange={(e) => setNewPhoto({ ...newPhoto, thumbnail: e.target.files[0].name })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Photo Detail</Form.Label>
                        
                        <Form.Control
                            style={{ marginTop: '10px' }}
                            type="file"
                            onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.files[0].name })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Photo Tag</Form.Label>
                        <Form.Control
                            type="text"
                           
                            placeholder='Nhập tên tag, mỗi tag cách nhau bởi dấu ,'
                            onChange={(e) => setNewPhoto({ ...newPhoto, tag: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddPhoto}>Add Photo</Button>
                </Modal.Footer>
            </Modal>
            {showEditModal &&
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Photo {indexPhoto.id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Photo Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={indexPhoto.title}
                                onChange={(e) => setIndexPhoto({ ...indexPhoto, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Photo Thumbnail </Form.Label>
                            <br />
                            <Image
                                src={"/assets/images/" + indexPhoto.image.thumbnail}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                    cursor: "pointer"
                                }}
                            />
                            <Form.Control
                                style={{ marginTop: '10px' }}
                                type="file"
                                onChange={(e) => setIndexPhoto({
                                    ...indexPhoto, image: {
                                        url: indexPhoto.image?.url,
                                        thumbnail: e.target.files[0].name
                                    }
                                })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Photo Detail </Form.Label>
                            <br />
                            <Image
                                src={"/assets/images/" + indexPhoto.image.url}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                    cursor: "pointer"
                                }}
                            />
                            <Form.Control
                                style={{ marginTop: '10px' }}
                                type="file"
                                onChange={(e) => setIndexPhoto({
                                    ...indexPhoto, image: {
                                        url: e.target.files[0].name,
                                        thumbnail: indexPhoto.image?.thumbnail
                                    }
                                })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Photo Tag</Form.Label>
                            <Form.Control
                                type="text"
                                value={indexPhoto.tags}
                                onChange={(e) => setIndexPhoto({ ...indexPhoto, tag: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveEdit}>Save Photo</Button>
                    </Modal.Footer>
                </Modal>
            }
        </Container>
    );
}

export default UserPage;
