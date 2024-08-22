import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Row, Image, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAlbums } from "../Component/AlbumContext";

function Header() {
  // const [albums, setAlbums] = useState([]);
  const { albums, setAlbums } = useAlbums(); 
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const checkUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:9999/albums")
      .then((res) => setAlbums(res.data))
      .catch((err) => console.error(err));

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [localStorage.getItem("user"), navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth/login");
  };

  return (
    <Container fluid>
      <Row
        style={{
          padding: "10px 0",
          borderBottom: "1px solid #ddd",
          boxShadow: "10px 10px 10px #f5f5f5",
        }}
      >
        <Col
          xs={12}
          className="top"
          style={{
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div></div>
          {/* <Link to={"/"}>
                    <Image src="logo.png" rounded style={{ width: "70%" }} />
                </Link> */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link
              to={"/"}
              rounded
              style={{
                textDecoration: "none",
                color: "#007bff",
                fontWeight: "bold",
                width: "70%",
              }}
            >
              Home
            </Link>

            {user ? (
              <>
                <Image
                  src="https://img.lovepik.com/free-png/20211207/lovepik-flat-male-avatar-png-image_401374442_wh1200.png"
                  roundedCircle
                  style={{ width: "50px", height: "50px", cursor: "pointer" }}
                  onClick={() => navigate(`/profile`)}
                />
                {checkUser.name}
                <Button
                  variant="link"
                  style={{
                    textDecoration: "none",
                    color: "#007bff",
                    fontWeight: "bold",
                  }}
                  onClick={() => navigate(`/profile`)}
                >
                  Profile
                </Button>
                <Button
                  variant="link"
                  style={{
                    textDecoration: "none",
                    color: "#007bff",
                    fontWeight: "bold",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to={"/auth/login"}
                  style={{
                    textDecoration: "none",
                    color: "#007bff",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Link>
                <Link
                  to={"/auth/register"}
                  style={{
                    textDecoration: "none",
                    color: "#007bff",
                    fontWeight: "bold",
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </Col>
        <Col xs={12} className="menu" style={{ paddingTop: "10px" }}>
          <ul
            style={{
              listStyleType: "none",
              paddingLeft: 0,
              margin: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {albums?.map((a) => ( a.isActive &&
              <li
                key={a.id}
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                <Link
                  to={`/photo?album=${a.albumId}`}
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    fontWeight: "bold",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    transition: "background-color 0.3s",
                  }}
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Header;
