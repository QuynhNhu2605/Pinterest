import { useEffect, useState } from "react";
import { Col, Container, Row, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Masonry from "react-responsive-masonry";
import { FaShareAlt } from "react-icons/fa";
import './Home.css'

function Home() {
    const [photos, setPhotos] = useState([]);
    const [filterPhoto, setFilterPhoto] = useState([]);
    const [search, setSearch] = useState("");
    const location = useLocation();
    const urlElement = new URLSearchParams(location.search);
    const album = urlElement.get("album");

    const navigate = useNavigate();

    useEffect(() => {
        // Call API -> get all photos
        axios.get("http://localhost:9999/photos")
            .then(response => {
                setFilterPhoto(response.data);

                let tempPhoto = response.data;

                if (search.length !== 0) {
                    tempPhoto = tempPhoto?.filter(p => 
                        p.title.toUpperCase().includes(search.toUpperCase()) ||
                        p.tags.includes(search.toLowerCase())
                    );
                }

                if (album) {
                    tempPhoto = tempPhoto?.filter(p => p.albumId == album);
                }

                setPhotos(tempPhoto);
            })
            .catch(err => console.log("Error: " + err));
    }, [search, album]);

    function filterByTag(tag) {
        navigate("/photo");
        if (tag !== "all") {
            setPhotos(filterPhoto?.filter(p => p.tags.includes(tag.toLowerCase())));
        } else {
            setPhotos(filterPhoto);
        }
    }

    const handleShareClick = (photo) => {
        // Replace this with your ngrok URL
        const ngrokUrl = "  https://f622-14-232-132-61.ngrok-free.app"; 
        const shareUrl = `${ngrokUrl}/photo/${photo?.photoId}`;
    
        if (navigator.share) {
            navigator.share({
                title: "Check out this photo!",
                text: "I found this amazing photo, take a look!",
                url: shareUrl,  // Use ngrok URL here
            })
            .then(() => console.log("Photo shared successfully!"))
            .catch((error) => console.error("Error sharing photo:", error));
        } else {
            // Fallback to copying link
            navigator.clipboard.writeText(shareUrl)
                .then(() => alert("Link copied to clipboard!"))
                .catch(err => console.error("Could not copy text: ", err));
        }
    };
    

    // Get all Tags
    let tagsList = [];
    filterPhoto?.map(p => {
        let photoTags = p.tags; // ["summer", "hot", "new"]
        tagsList = [...tagsList, ...photoTags];
    });

    // Iteration tagsList -> add to new Set
    let tagsSet = new Set();
    tagsList.forEach(t => tagsSet.add(t));

    // Push all elements to newArray
    let newTags = [];
    tagsSet?.forEach(t => newTags.push(t));

    return (
        <Row className="content">
            <Col>
                <Container fluid>
                    <Row>
                        <Col md={{ span: 6, offset: 3 }} style={{ margin: "10px auto" }}>
                            <div>
                                <Form>
                                    <Form.Group>
                                        <Form.Control
                                            className="search"
                                            placeholder="Enter photo title or tags"
                                            style={{ border: "1px solid gray" }}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </Form.Group>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} md={10}>
                            <Container fluid className="body">
                                <Masonry columnsCount={5}>
                                    {
                                        photos.length > 0 ?
                                            photos?.map(p => (
                                                <Card style={{ width: '95%', marginBottom: "10px" }} key={p.id}>
                                                        <Button
                                                            variant="light"
                                                            style={{
                                                                position: "absolute",
                                                                top: "5px",
                                                                right: "5px",
                                                                borderRadius: "50%",
                                                                padding: "10px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                justifyItems: "center",
                                                                width: "30px",
                                                                height: "30px"
                                                              }}
                                                            onClick={() => handleShareClick(p)}
                                                        >
                                                            <FaShareAlt /> 
                                                        </Button>
                                                    <Card.Img variant="top" src={"/assets/images/" + p.image.thumbnail} />
                                                    <Card.Body style={{ textAlign: "center" }}>
                                                        <Card.Title>
                                                            <Link to={`/photo/${p.photoId}`} style={{ color: "gray", textDecoration: "none", fontWeight: "initial" }}>
                                                                {p.title}
                                                            </Link>
                                                        </Card.Title>
                                                    </Card.Body>
                                                </Card>
                                            ))
                                            :
                                            <div style={{ marginBottom: "10px", color: "red" }}> Photos not found</div>
                                    }
                                </Masonry>
                            </Container>
                        </Col>
                        <Col className="d-none d-sm-none d-md-block" md={2}>
                            <div>Tags:</div>
                            <Button style={{ margin: "5px" }} key={"all"} onClick={() => filterByTag("all")}>All</Button>
                            {
                                newTags?.map(t => (
                                    <Button style={{ margin: "5px" }} key={t}
                                        onClick={() => filterByTag(t)}>
                                        {t}
                                    </Button>
                                ))
                            }
                        </Col>
                    </Row>
                </Container>
            </Col>
        </Row>
    );
}

export default Home;
