import { Navbar, NavDropdown, Container, Card, Nav } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import './App.css';

const Box = ({ text, image }) => (
    <Card className="me-3" style={{ minWidth: '200px' }}>
        <div style={{ height: '175px', overflow: 'hidden' }}>
            <Card.Img
                variant="top"
                src={image}
                style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                }}
            />
        </div>
        <Card.Body className="text-center">
            <Card.Text className="text-truncate">{text}</Card.Text>
        </Card.Body>
    </Card>
);

const SwimLane = ({ title, items, loading = false, index = 0 }) => {
    const backgroundColor = index % 2 === 0 ? "#F6F8FA" : "#ffffff"; // white / light grey

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1200 },
            items: 4,
            slidesToSlide: 4,
        },
        desktop: {
            breakpoint: { max: 1200, min: 992 },
            items: 3,
            slidesToSlide: 3,
        },
        tablet: {
            breakpoint: { max: 992, min: 768 },
            items: 2,
            slidesToSlide: 2,
        },
        mobile: {
            breakpoint: { max: 768, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };

    const placeholderItems = Array.from({ length: 4 }, (_, idx) => (
        <Card key={idx} className="me-3" style={{ minWidth: '200px' }}>
            <div style={{ height: '175px', overflow: 'hidden' }}>
                <Placeholder as="div" animation="wave" className="w-100 h-100 bg-secondary" />
            </div>
            <Card.Body className="text-center">
                <Placeholder as={Card.Text} animation="wave">
                    <Placeholder xs={8} />
                </Placeholder>
            </Card.Body>
        </Card>
    ));

    return (
        <div className="swim-lane" style={{ backgroundColor, paddingTop: '50px', paddingBottom: '50px', margin: '0 -15px' }}>
            <div style={{ paddingLeft: '120px', paddingRight: '120px' }}>
                <h5 style={{ color: '#0A145A', marginBottom: '20px', textAlign: 'left' }}>{title}</h5>
                <Carousel
                    key={items.length}
                    responsive={responsive}
                    infinite
                    arrows
                    containerClass="carousel-container px-3"
                    itemClass="carousel-item-padding-40-px"
                >
                    {loading ? placeholderItems : items.map((item, idx) => (
                        <Box key={idx} text={item.text} image={item.image} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

function App() {
    const [loadingShows, setLoadingShows] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [shows, setShows] = useState([]);

    const defaultImage = "https://images.unsplash.com/photo-1741704751367-e276706e530d?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const fetchShowDetails = (recommendationIds) => {
        setLoadingShows(true);
        fetch("http://localhost:8000/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recommendations: recommendationIds })
        })
            .then(response => response.json())
            .then(data => {
                const images = data.map((prev, idx) => {
                    const imgObj = prev.data.attributes.images.find(img => img.profile === 'show-mezzanine16x9');
                    return {
                        text: prev.data.attributes.title,
                        image: imgObj?.image || defaultImage
                    };
                });
                setShows(images);
                setLoadingShows(false);
            })
            .catch(error => {
                console.error("Error fetching show details:", error);
                setLoadingShows(false);
            });
    };

    useEffect(() => {
        fetch("https://8v7afwqlb1.execute-api.us-east-1.amazonaws.com/dev/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: "03665f13-643c-4aca-be92-8572d98b3473" })
        })
            .then(response => response.json())
            .then(data => {
                const recommendationIds = data.map(prev => prev.itemId);
                setRecommendations(recommendationIds);
                fetchShowDetails(recommendationIds);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }, []);

    const generateBoxes = (laneName) =>
        Array.from({ length: 12 }, (_, i) => ({
            text: `${laneName} - Box ${i + 1}`,
            image: defaultImage
        }));

    return (
        <>
            <Navbar
                style={{
                    backgroundColor: '#2638c4',
                    fontSize: '16px',
                    height: '78px',
                    marginBottom: '20px',
                    paddingLeft: '120px', 
                    paddingRight: '120px'
                }}
                variant='dark'
                expand='lg'
            >
                <Container className="d-flex align-items-center">
                    <Navbar.Brand href="#">
                        <img
                            src="https://wisconsinpublictv.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/08/pbs-wisconsin-wblue-rgb-2-412x62.png"
                            alt="PBS Logo"
                            height="30"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    <Nav className="ms-3 d-flex align-items-center">
                        <NavDropdown
                            title="Select User"
                            id="user-nav-dropdown"
                            className="text-white custom-dropdown"
                            style={{fontWeight: 'bold'}}
                        >
                            <NavDropdown.Item href="#user1">User 1</NavDropdown.Item>
                            <NavDropdown.Item href="#user2">User 2</NavDropdown.Item>
                            <NavDropdown.Item href="#user3">User 3</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="mb-4" style={{ paddingLeft: '45px' }}>
                <h2 style={{ color: '#0A145A', textAlign: 'left', fontWeight: 'bold'}}>Welcome Back User 1</h2>
            </Container>
            {/* TODO: maybe put a your next watch with show description?? */}

            <Container fluid className="px-0 mb-5">
                <SwimLane title="Trending Now" items={shows} loading={loadingShows} index={0} />
                <SwimLane title="New Releases" items={generateBoxes('New')} index={1} />
                <SwimLane title="Watch Again" items={generateBoxes('Watch')} index={2} />
            </Container>
        </>
    );
}

export default App;
