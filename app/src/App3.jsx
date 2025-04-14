import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container, Spinner, ListGroup } from "react-bootstrap";

function App() {
    const [recommendations, setRecommendations] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [loading, setLoading] = useState(false);

    const userIds = [
        { id: "57864159-e946-4dcf-9833-e08a6c567cef", user: "Amy", genres: ["Drama", "Food"] },
        { id: "ffd8f42c-5466-4dd5-aaa7-697a8e99fd0a", user: "Rebecca", genres: ["Drama"] },
        { id: "a8153bce-d97c-4368-a464-7ff2fba291b0", user: "Richard", genres: ["History", "Drama"] },
        { id: "66e4dccc-1a69-4d2f-ac51-b1aa4554ddf0", user: "Lindsay", genres: ["Arts and Music", "Science and Nature", "Drama"] },
    ];

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
                    const user = userIds.find(user => user.user === selectedUserName);
                    if (user) {
                        const assignedRecommendations = assignGenresToRecommendations(data, user.genres);
                        setRecommendations(assignedRecommendations);
                    } else {
                        setRecommendations(data);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching recommendations:", error);
                    setLoading(false);
                });
        }
    }, [selectedUserId]);

    const handleButtonClick = (userId, userName) => {
        setSelectedUserId(userId);
        setSelectedUserName(userName);
    };

    const assignGenresToRecommendations = (recommendations, genres) => {
        if (genres.length === 0) return recommendations.map(rec => ({ ...rec, genre: "Unknown" }));
        
        return recommendations.map((rec, index) => ({
            ...rec,
            genre: genres[index % genres.length], // Distributes genres evenly across recommendations
        }));
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
                                <h6>Watch History Genres:</h6>
                                <p>{user.genres.join(", ")}</p>
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
                            <Row className="justify-content-center">
                                <Spinner animation="border" variant="primary" />
                            </Row>
                        ) : (
                            <ListGroup>
                                {recommendations.map((rec, index) => (
                                    <ListGroup.Item key={index}>
                                        <strong>Item ID:</strong> {rec.itemId} <br />
                                        <strong>Score:</strong> {rec.score.toFixed(6) * 10} <br />
                                        <strong>Genre:</strong> {rec.genre}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Container>
                </div>
            )}
        </Container>
    );
}

export default App;

