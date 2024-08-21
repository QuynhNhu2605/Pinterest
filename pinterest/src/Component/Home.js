import { useEffect, useState } from "react";
import { Col, Container, Row, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import "./Home.css";
import { FiShare2 } from "react-icons/fi";

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
    axios
      .get("http://localhost:9999/photos")
      .then((response) => {
        setFilterPhoto(response.data);

        let tempPhoto = response.data;

        if (search.length != 0) {
          tempPhoto = tempPhoto?.filter(
            (p) =>
              p.title.toUpperCase().includes(search.toUpperCase()) ||
              p.tags.includes(search.toLowerCase())
          );
        }

        if (album) {
          tempPhoto = tempPhoto?.filter((p) => p.albumId == album);
        }

        setPhotos(tempPhoto);
      })
      .catch((err) => console.log("Error: " + err));
  }, [search, album]);

  function filterByTag(tag) {
    navigate("/photo");
    if (tag != "all") {
      setPhotos(filterPhoto?.filter((p) => p.tags.includes(tag.toLowerCase())));
    } else {
      setPhotos(filterPhoto);
    }
  }

  // Get all Tags
  let tagsList = [];
  filterPhoto?.map((p) => {
    let photoTags = p.tags; // ["summer", "hot", "new"]
    tagsList = [...tagsList, ...photoTags];
  });

  // Iteration tagsList -> add to new Set
  let tagsSet = new Set();
  tagsList.forEach((t) => tagsSet.add(t));
  // Push all elements to newArray
  let newTags = [];
  tagsSet?.forEach((t) => newTags.push(t));

  return (
    <Container fluid className="content">
      <Col>
        <Container fluid>
          <div
            style={{
              listStyleType: "none",
              paddingLeft: 0,
              margin: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{ margin: "10px" }}
              key={"all"}
              onClick={() => filterByTag("all")}
            >
              #All
            </div>
            {newTags?.map((t) => (
              <div
                style={{ margin: "10px" }}
                key={t}
                onClick={() => filterByTag(t)}
              >
                #{t}
              </div>
            ))}
          </div>
          <Row>
            <Col md={{ span: 6, offset: 3 }} style={{ margin: "10px auto" }}>
              <div>
                <Form>
                  <Form.Group>
                    <Form.Control
                      className="search"
                      placeholder="Enter photo title or tags"
                      style={{ border: "1px solid gray" }}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </div>
            </Col>
          </Row>
          <Row>
            {/* <Col sm={12} md={10}> */}
            <Col>
              <Container fluid className="body">
                <Masonry columnsCount={6}>
                  {photos.length > 0 ? (
                    photos?.map((p) => (
                      <Card
                        style={{ width: "95%", marginBottom: "10px" }}
                        key={p.id}
                      >
                        <Link
                          to={`/photo/${p.photoId}`}
                          style={{
                            color: "gray",
                            textDecoration: "none",
                            fontWeight: "initial",
                          }}
                        >
                          <div className="image-container">
                            <Card.Img
                              variant="top"
                              src={"/assets/images/" + p.image.thumbnail}
                            />
                            <div className="share-icon">
                              <FiShare2 size={24} color="white" />
                            </div>
                            <div className="image-overlay">
                              <div className="title">{p.title}</div>
                            </div>
                          </div>
                        </Link>

                        {/* <Card.Body style={{ textAlign: "center" }}>
                          <Card.Title>
                            <Link
                              to={`/photo/${p.photoId}`}
                              style={{
                                color: "gray",
                                textDecoration: "none",
                                fontWeight: "initial",
                              }}
                            >
                              {p.title}
                            </Link>
                          </Card.Title>
                        </Card.Body> */}
                      </Card>
                    ))
                  ) : (
                    <div style={{ marginBottom: "10px", color: "red" }}>
                      {" "}
                      Photos not found
                    </div>
                  )}
                </Masonry>
              </Container>
            </Col>
            {/* <Col className="d-none d-sm-none d-md-block" md={2}>
              <div>Tags:</div>
              <Button
                style={{ margin: "5px" }}
                key={"all"}
                onClick={() => filterByTag("all")}
              >
                All
              </Button>
              {newTags?.map((t) => (
                <Button
                  style={{ margin: "5px" }}
                  key={t}
                  onClick={() => filterByTag(t)}
                >
                  {t}
                </Button>
              ))}
            </Col> */}
          </Row>
        </Container>
      </Col>
    </Container>
  );
}

export default Home;
