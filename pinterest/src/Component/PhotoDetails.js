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
import StarRating from "./StarRating";
import { FaShareAlt, FaStar } from "react-icons/fa";
function PhotoDetails() {
  const { photoid } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hover, setHover] = useState(null);
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
      rate: newRating,
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

  const handleShareClick = (photo) => {
    const ngrokUrl = "https://f622-14-232-132-61.ngrok-free.app";
    const shareUrl = `${ngrokUrl}/photo/${photo?.photoId}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this photo!",
          text: "I found this amazing photo, take a look!",
          url: shareUrl,
        })
        .then(() => console.log("Photo shared successfully!"))
        .catch((error) => console.error("Error sharing photo:", error));
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
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

  const combinedImageUrls = [
    photo.image.thumbnail,
    ...(Array.isArray(photo.image.url) ? photo.image.url : [photo.image.url]),
  ];
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
              borderRadius: "30px",
            }}
          >
            <Row className="photo-details-content">
              <Col md={6} sm={12} className="photo-section">
                <Row style={{ marginLeft: "0px" }}>
                  <Card className="photo-card" style={{ borderRadius: "30px" }}>
                    <Card.Img
                      style={{
                        objectFit: "cover",
                        maxHeight: "600px",
                        borderTopLeftRadius: "30px",
                        width: "100%",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      variant="top"
                      src={`/assets/images/${displayedImageUrl}`}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </Card>
                </Row>
                <Row
                  className="mt-3"
                  style={{ marginBottom: "20px", marginRight: "10px" }}
                >
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
                          borderRadius: "10px",
                          transition: "transform 0.3s ease-in-out",
                        }}
                        onClick={() => {
                          setCurrentImageIndex(thumbnailStartIndex + index);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                    ))}
                  </Col>

                  <Col md={1}>
                    <Button
                      variant="link"
                      onClick={handleNextImage}
                      disabled={
                        currentImageIndex === combinedImageUrls.length - 1
                      }
                      style={{ fontSize: "30px", textDecoration: "none" }}
                    >
                      &rarr;
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col md={6} sm={12} className="info-section">
                <div style={{ marginTop: "20px" }}></div>
                <div
                  style={{
                    overflowY: "scroll",
                    maxheight: "500px",
                    padding: "0px 20px 0px 20px",
                  }}
                >
                  <Card className="info-card">
                    <Card.Body>
                      {/* <h3>Id: {photo.photoId}</h3> */}
                      <h3>{photo.title}</h3>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleShareClick(photo)}
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "25px",
                          borderRadius: "50%",

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          justifyItems: "center",
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        <FaShareAlt size={20} />
                      </Button>
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
                  <h5 style={{ padding: "0px 20px 0px 20px" }}>
                    Comments ({comments.length})
                  </h5>
                  <ListGroup
                    variant="flush"
                    style={{ padding: "0px 20px 0px 20px" }}
                  >
                    {comments.map((comment) => (
                      <ListGroup.Item key={comment.id}>
                        <Row>
                          <Col>
                            <strong>User {comment.userId}:</strong>{" "}
                            {comment.text}
                          </Col>
                          <Col
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <StarRating rating={comment.rate} />
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>

                {JSON.parse(localStorage.getItem("user")) ? (
                  <>
                    <Form
                      className="mt-4"
                      style={{
                        padding: "0px 20px 0px 20px",
                        alignContent: "center",
                      }}
                    >
                      <Form.Group controlId="commentText">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          style={{
                            height: "50px",
                            borderRadius: "20px",
                            padding: "10px",
                          }}
                        />
                      </Form.Group>
                      <Row>
                        <Col>
                          <div>
                            {[...Array(5)].map((star, index) => {
                              const ratingValue = index + 1;
                              return (
                                <label key={index}>
                                  <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    onClick={() => setNewRating(ratingValue)}
                                    style={{ display: "none" }}
                                  />
                                  <FaStar
                                    size={20}
                                    color={
                                      ratingValue <= (hover || newRating)
                                        ? "#ffc107"
                                        : "#e4e5e9"
                                    }
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(null)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </Col>
                        <Col
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            className="mt-3 btnSub SubCmt"
                            onClick={handleCommentSubmit}
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginBottom: "20px",
                            }}
                          >
                            Comment
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PhotoDetails;
