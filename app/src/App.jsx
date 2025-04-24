import { Navbar, NavDropdown, Container, Card, Nav } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import './App.css';

const Box = ({ text, image, episode, duration, genre, premiered }) => (
    <div style={{ minWidth: '200px', marginRight: '1rem' }}>
        <div style={{ height: '175px', overflow: 'hidden', borderRadius: '8px' }}>
            <img
                src={image}
                alt={text}
                style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    display: 'block',
                }}
            />
        </div>
        <div style={{ paddingTop: '8px', color: '#0A145A' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '600' }} className="text-truncate">{text}</div>
            {episode && <div style={{ fontSize: '0.8rem' }} className="text-truncate">{episode}</div>}
            {duration && <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop:'5px'}}>{Math.floor(duration / 60)}m | {new Date(premiered).toLocaleDateString()} | {genre}</div>}
        </div>
    </div>
);


const SwimLane = ({ title, items, loading = false, index = 0 }) => {
    const backgroundColor = index % 2 === 0 ? "#F6F8FA" : "#ffffff";

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
        <div key={idx} style={{ minWidth: '200px', marginRight: '1rem' }}>
            <div style={{ height: '175px', overflow: 'hidden', borderRadius: '8px' }}>
                <Placeholder animation="wave">
                    <Placeholder
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'block',
                            borderRadius: '8px',
                            backgroundColor: '#5227cc'
                        }}
                    />
                </Placeholder>
            </div>
            <div style={{ paddingTop: '8px' }}>
                <Placeholder animation="wave">
                    <Placeholder
                        xs={7}
                        style={{
                            height: '0.95rem',
                            marginBottom: '6px',
                            display: 'block',
                            backgroundColor: '#8540f5'
                        }}
                    />
                </Placeholder>
                <Placeholder animation="wave">
                    <Placeholder
                        xs={5}
                        style={{
                            height: '0.8rem',
                            marginBottom: '5px',
                            display: 'block',
                            backgroundColor: '#a370f7'
                        }}
                    />
                </Placeholder>
                <Placeholder animation="wave">
                    <Placeholder
                        xs={4}
                        style={{
                            height: '0.75rem',
                            backgroundColor: '#c29ffa'
                        }}
                    />
                </Placeholder>
            </div>
        </div>
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
                        <Box
                            key={idx}
                            text={item.text}
                            image={item.image}
                            episode={item.episode}
                            duration={item.duration}
                            genre = {item.genre}
                            premiered={item.premiered}
                        />
                    ))
                    }
                </Carousel>
            </div>
        </div>
    );
};

function App() {
    const [loadingShows, setLoadingShows] = useState(true);
    const [shows, setShows] = useState([]);

    const [loadingSims, setLoadingSims] = useState(true);
    const [simsItemIds, setSimsItemIds] = useState([]);

    const [loadingSims2, setLoadingSims2] = useState(true);
    const [sims2ItemIds, setSims2ItemIds] = useState([]);



    const defaultImage = "https://images.unsplash.com/photo-1741704751367-e276706e530d?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const fetchUsePersDetails = (recommendationIds) => {
        setLoadingShows(true);
        fetch("http://localhost:8000/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recommendations: recommendationIds })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const images = data.map((prev, idx) => {
                    return {
                        text: prev.show_name,
                        image: prev.show_image || defaultImage,
                        episode: prev.episode_name,
                        genre: prev.show_genre,
                        duration: prev.episode_duration,
                        premiered: prev.episode_premiered_on
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

    const fetchSimsDetails = (recommendationIds) => {
        setLoadingSims(true);
        fetch("http://localhost:8000/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recommendations: recommendationIds })
        })
            .then(response => response.json())
            .then(data => {
                console.log("sims api resp")
                console.log(data)
                const images = data.map((prev, idx) => {
                    return {
                        text: prev.show_name,
                        image: prev.show_image || defaultImage,
                        episode: prev.episode_name,
                        genre: prev.show_genre,
                        duration: prev.episode_duration,
                        premiered: prev.episode_premiered_on
                    };
                });
                
                setSimsItemIds(images);
                setLoadingSims(false);
            })
            .catch(error => {
                console.error("Error fetching show details:", error);
                setLoadingSims(false);
            });
    };

    const fetchSims2Details = (recommendationIds) => {
        setLoadingSims2(true);
        fetch("http://localhost:8000/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recommendations: recommendationIds })
        })
            .then(response => response.json())
            .then(data => {
                const images = data.map((prev, idx) => {
                    return {
                        text: prev.show_name,
                        image: prev.show_image || defaultImage,
                        genre: prev.show_genre,
                        episode: prev.episode_name,
                        duration: prev.episode_duration,
                        premiered: prev.episode_premiered_on
                    };
                });
    
                setSims2ItemIds(images);
                setLoadingSims2(false);
            })
            .catch(error => {
                console.error("Error fetching sims2 show details:", error);
                setLoadingSims2(false);
            });
    };
    

    useEffect(() => {
        const userId = "03665f13-643c-4aca-be92-8572d98b3473";
        const sims1 = "3c4017d8-1647-4ee6-86d6-7e2f36972e08"; // Already defined above
        const sims2 = "65545559-4cc4-44f3-83c3-a30b40e50a38";
    
        // Fetch User Personalization
        fetch("https://8v7afwqlb1.execute-api.us-east-1.amazonaws.com/dev/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        })
        .then(res => res.json())
        .then(data => {
            const recommendationIds = data.map(i => i.itemId);
            fetchUsePersDetails(recommendationIds);
        })
        .catch(err => console.error("UserPers Error:", err));
    
        // Fetch Sims Recommendations
        fetch("https://8v7afwqlb1.execute-api.us-east-1.amazonaws.com/dev/sims", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: sims1 })
        })
        .then(res => res.json())
        .then(data => {
            console.log("sims data:")
            console.log(data)
            const simItemIds = data.map(i => i.itemId);
            fetchSimsDetails(simItemIds);
        })
        .catch(err => console.error("Sims Error:", err));

        fetch("https://8v7afwqlb1.execute-api.us-east-1.amazonaws.com/dev/sims", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: sims2 })
        })
        .then(res => res.json())
        .then(data => {
            const sim2ItemIds = data.map(i => i.itemId);
            fetchSims2Details(sim2ItemIds);
        })
        .catch(err => console.error("Sims2 Error:", err));
        
    
    }, []);
    

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
                <SwimLane title="Trending Now" items={shows} loading={loadingShows} index={1} />
                <SwimLane title="Because You Watched..." items={simsItemIds} loading={loadingSims} index={2} />
                <SwimLane title="More Like That" items={sims2ItemIds} loading={loadingSims2} index={3} />
            </Container>
        </>
    );
}

export default App;
