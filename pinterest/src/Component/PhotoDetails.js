import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import axios from "axios";
import "./PhotoDetails.css";

function PhotoDetails() {
  const { photoid } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0); 

  useEffect(() => {
    axios
      .get(`http://localhost:9999/photos?photoId=${photoid}`)
      .then((response) => {
        if (response.data.length > 0) {
          setPhoto(response.data[0]);
          setCurrentImageIndex(0); 
          setThumbnailStartIndex(0);
        }
      })
      .catch((err) => console.log("Error: " + err));

    axios
      .get(`http://localhost:9999/comments?photoId=${photoid}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => console.log("Error: " + err));
  }, [photoid]);

  const handleCommentSubmit = () => {
    const comment = {
      id: comments.length + 1,
      photoId: parseInt(photoid),
      userId: JSON.parse(localStorage.getItem("user")).userId,
      text: newComment,
      rate: 0,
    };

    axios
      .post("http://localhost:9999/comments", comment)
      .then((response) => {
        setComments([...comments, response.data]);
        setNewComment("");
        setNewRating(0);
      })
      .catch((err) => console.log("Error: " + err));
  };

  const handleNextImage = () => {
    if (photo) {
      const nextIndex = currentImageIndex + 1;
      if (nextIndex < combinedImageUrls.length) {
        setCurrentImageIndex(nextIndex);
        if (nextIndex >= thumbnailStartIndex + 4) {
          setThumbnailStartIndex(thumbnailStartIndex + 1);
        }
      }
    }
  };

  const handlePreviousImage = () => {
    if (photo) {
      const prevIndex = currentImageIndex - 1;
      if (prevIndex >= 0) {
        setCurrentImageIndex(prevIndex);
        if (prevIndex < thumbnailStartIndex) {
          setThumbnailStartIndex(thumbnailStartIndex - 1);
        }
      }
    }
  };

  if (!photo) {
    return (
      <Container fluid className="photo-details-page">
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <div className="text-center" style={{ margin: "50px 0" }}>
              Loading...
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  const combinedImageUrls = [photo.image.thumbnail, ...(Array.isArray(photo.image.url) ? photo.image.url : [photo.image.url])];
  const displayedImageUrl = combinedImageUrls[currentImageIndex];
  const displayedThumbnails = combinedImageUrls.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + 4
  );

  return (
    <Container fluid className="photo-details-page">
      <Row>
        <Col md={1}>
          <div
            style={{ fontSize: "40px", cursor: "pointer", padding: "10px" }}
            onClick={() => navigate(-1)}
          >
            ←
          </div>
        </Col>
        <Col md={11}>
          <Card
            className="photo-card"
            style={{
              boxShadow: "0px 0px 20px rgba(0,0,0,0.2)",
              marginTop: "20px",
            }}
          >
            <Row>
              <h3
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "20px",
                }}
              >
                Photo Details
              </h3>
            </Row>
            <Row className="photo-details-content">
              <Col md={6} sm={12} className="photo-section">
                <Row style={{ marginLeft: "15px" }}>
                  <Card className="photo-card">
                    <Card.Img
                      style={{
                        objectFit: "contain",
                        maxHeight: "450px",
                        width: "100%",
                      }}
                      variant="top"
                      src={`/assets/images/${displayedImageUrl}`}
                    />
                  </Card>
                </Row>
                <Row className="mt-3">
                  <Col md={1}>
                    <Button
                      variant="link"
                      onClick={handlePreviousImage}
                      disabled={currentImageIndex === 0}
                      style={{ fontSize: "30px", textDecoration: "none" }}
                    >
                      &larr;
                    </Button>
                  </Col>

                  <Col className="d-flex flex-wrap" md={10}>
                    {displayedThumbnails.map((imageUrl, index) => (
                      <Image
                        key={index}
                        src={`/assets/images/${imageUrl}`}
                        thumbnail
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          marginRight: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setCurrentImageIndex(thumbnailStartIndex + index);
                        }}
                      />
                    ))}
                  </Col>

                  <Col md={1}>
                    <Button
                      variant="link"
                      onClick={handleNextImage}
                      disabled={currentImageIndex === combinedImageUrls.length - 1}
                      style={{ fontSize: "30px", textDecoration: "none" }}
                    >
                      &rarr;
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col md={6} sm={12} className="info-section">
                <Card className="info-card">
                  <Card.Body>
                    <h3>Id: {photo.photoId}</h3>
                    <h3>Title: {photo.title}</h3>
                    <div className="tags">
                      {photo.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          pill
                          bg="secondary"
                          style={{ marginRight: "5px" }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <hr />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row style={{ width: "98%" }}>
              <div style={{ margin: "20px" }}>
                <h5>Comments ({comments.length})</h5>
                {JSON.parse(localStorage.getItem("user")) ? (
                  <>
                    <Form className="mt-4">
                      <Form.Group controlId="commentText">
                        <Form.Label>Add a Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button
                        className="mt-3 btnSub"
                        onClick={handleCommentSubmit}
                      >
                        Submit Comment
                      </Button>
                    </Form>
                  </>
                ) : (
                  <></>
                )}

                <ListGroup variant="flush">
                  {comments.map((comment) => (
                    <ListGroup.Item key={comment.id}>
                      <strong>User {comment.userId}:</strong> {comment.text}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PhotoDetails;
