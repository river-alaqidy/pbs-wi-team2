import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container, Image, Spinner } from "react-bootstrap";

function App() {
    const [recommendations, setRecommendations] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [shows, setShows] = useState([]);

    // for now displaying users will be hardcoded, but recommendations will be real
    const userIds = [
        { id: "77da964d-7732-41f1-bce3-30e566da53ea", user: "Amy" },
        { id: "622d3358-3689-4482-bb59-25422634bb7a", user: "Rebecca" },
        { id: "a8153bce-d97c-4368-a464-7ff2fba291b0", user: "Richard" },
        { id: "c7bb225a-90a3-4953-9e88-87ec1e62a925", user: "Lindsay" },
    ];

    // get shows from api based on recommendations
    const fetchShowDetails = (recommendationIds) => {
        setLoading(true);
        fetch("http://localhost:8000/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recommendations: recommendationIds })
        })
        .then(response => response.json())
        .then(data => {
            // console.log("Show details:", data);
            setShows(data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching show details:", error);
            setLoading(false);
        });
    }

    // get recommendations
    useEffect(() => {
        if (selectedUserId) {
            setLoading(true);
            fetch("https://8v7afwqlb1.execute-api.us-east-1.amazonaws.com/prod/recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedUserId })
            })
                .then(response => response.json())
                .then(data => {
                    const recommendationIds = data.map(prev => prev.itemId);
                    setRecommendations(recommendationIds);
                    fetchShowDetails(recommendationIds);
                })
                .catch(error => {
                    console.error("Error:", error);
                    setLoading(false);
                });
        }
    }, [selectedUserId]);

    const handleButtonClick = (userId, userName) => {
        setSelectedUserId(userId);
        setSelectedUserName(userName);
    };

    return (
        <Container>
            <h1>Returning Users</h1>
            <Row>
                {userIds.map((user, index) => (
                    <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
                        <Card className="h-100">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{user.user}</Card.Title>
                                {(user.user === "Amy") ? 
                                  <div>
                                    <h6>
                                      Watch History Genres:
                                    </h6>
                                    <p>
                                      Drama, Food
                                    </p>
                                  </div> : 
                                    (user.user === "Rebecca") ? 
                                    <div>
                                      <h6>
                                        Watch History Genres:
                                      </h6>
                                      <p>
                                        Drama
                                      </p>
                                  </div> :
                                    (user.user === "Richard") ? 
                                    <div>
                                      <h6>
                                        Watch History Genres:
                                      </h6>
                                      <p>
                                        History, Drama
                                      </p>
                                  </div> :
                                      <div>
                                      <h6>
                                        Watch History Genres:
                                      </h6>
                                      <p>
                                        Arts and Music, Science and Nature, Drama
                                      </p>
                                    </div>
                                }
                                <div className="mt-auto">
                                  <Button onClick={() => handleButtonClick(user.id, user.user)}>
                                      Get Recommendations
                                  </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {recommendations.length > 0 && selectedUserName && (
                <div>
                    <h2>Recommendations for {selectedUserName}</h2>
                    <Container>
                        {loading ? (
                            // Show the loading spinner when loading is true
                            <Row className="justify-content-center">
                                <Spinner animation="border" variant="primary" />
                            </Row>
                        ) : (
                            // Once loading is false, show the images in cards
                            <Row>
                                {shows.map((show, index) => (
                                    <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
                                        <Card>
                                            <Card.Img variant="top" src={show.data.attributes.images.find(image => image.profile === 'show-mezzanine16x9').image} alt={`image ${index}`} />
                                            <Card.Body>
                                              <Card.Title style={{ marginBottom: '0.1rem' }}>Genre:</Card.Title>
                                              <Card.Text style={{ marginTop: '0', marginBottom: '0.5rem' }}>
                                                {show.data.attributes.genre.title}
                                              </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Container>
                </div>
            )}
        </Container>
    );
}

export default App;