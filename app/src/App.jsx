import { Navbar, NavDropdown, Container, Card } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';

const Box = ({ text, image }) => (
    <Card className="me-3" style={{ minWidth: '200px' }}>
        <Card.Img variant="top" src={image} />
        <Card.Body className="text-center">
            <Card.Text>{text}</Card.Text>
        </Card.Body>
    </Card>
);

const SwimLane = ({ title, items }) => {
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

    return (
        <div className="mb-5">
            <h5 className="mb-3">{title}</h5>
            <Carousel
                responsive={responsive}
                infinite
                arrows
                containerClass="carousel-container"
                itemClass="carousel-item-padding-40-px"
            >
                {items.map((item, idx) => (
                    <Box key={idx} text={item.text} image={item.image} />
                ))}
            </Carousel>
        </div>
    );
};

function App() {
    
    const [recommendations, setRecommendations] = useState([]);
    const [shows, setShows] = useState([]);

    const defaultImage = "https://images.unsplash.com/photo-1741704751367-e276706e530d?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const fetchShowDetails = (recommendationIds) => {
        fetch("http://localhost:8000/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recommendations: recommendationIds })
        })
            .then(response => response.json())
            .then(data => {
                const images = data.map((prev, idx) => {
                    const imgObj = prev.data.attributes.images.find(img => img.profile === 'asset-mezzanine-16x9'); // TODO: change to #show if needed
                    return {
                        text: prev.data.attributes.title, // TODO: figure out which titles/images to display. could do a combo of assets and shows, could also just make show ids be unique
                        image: imgObj?.image || defaultImage
                    };
                    // TODO: decide between sims and all 3 solutions
                    // TODO: can we figure out how to play videos???
                });
                setShows(images);
            })
            .catch(error => {
                console.error("Error fetching show details:", error);
            });
    }

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
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#">PBS</Navbar.Brand>
                    <NavDropdown title="Menu" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action2">Another action</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action3">Something else</NavDropdown.Item>
                    </NavDropdown>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <SwimLane title="Trending Now" items={shows} />
                <SwimLane title="New Releases" items={generateBoxes('New')} />
                <SwimLane title="Watch Again" items={generateBoxes('Watch')} />
            </Container>
        </>
    );
}

export default App;
