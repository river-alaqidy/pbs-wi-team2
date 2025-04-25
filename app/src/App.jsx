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


const SwimLane = ({ title, items, itemName, loading = false, index = 0 }) => {
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
                {loading ? (
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <Placeholder animation="wave">
                            <Placeholder
                                xs={6}
                                style={{
                                    height: '1.5rem',
                                    width: '30%',
                                    backgroundColor: '#0A145A'
                                }}
                            />
                        </Placeholder>
                    </div>
                ) : (
                    <h5 style={{ color: '#0A145A', marginBottom: '20px', textAlign: 'left' }}>
                        {title} {itemName && <span style={{ fontStyle: 'italic', color: '#0A145A' }}>{itemName}</span>}
                    </h5>
                )}
                <Carousel
                    // key={items.length}
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
                            genre={item.genre}
                            premiered={item.premiered}
                        />
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

function App() {
    const users = [
        {
            name: "Alice",
            userId: "25a82ccb-f473-4f87-8ba3-c0cfc3d4f104",
            sims1: "90c586b3-f9d5-4f2d-905e-6b52c6eed01f",
            sims1name: "New Scandinavian Cooking",
            sims2: "4dcd2fc5-4662-42b9-bd74-713d34ec09a2",
            sims2name: "Jamaica Inn"

        },
        {
            name: "Richard",
            userId: "03665f13-643c-4aca-be92-8572d98b3473",
            sims1: "0f957b9c-4775-4b74-8192-3c60d9172f64",
            sims1name: "American Experience",
            sims2: "5abd1675-ebf4-428f-afc1-3ee40ec19299",
            sims2name: "Finding Your Roots"
        },
        {
            name: "Lindsay",
            userId: "c7b760fe-5013-45cc-b195-548950276f33",
            sims1: "46573fe1-546d-4cc6-8421-de4f4fd6db47",
            sims1name: "NOVA",
            sims2: "2ee500b2-3d17-4576-8f79-448a998c9ab8",
            sims2name: "FRONTLINE"
        }
    ];

    const [currentUser, setCurrentUser] = useState(users[0]);

    const [loadingShows, setLoadingShows] = useState(true);
    const [shows, setShows] = useState([]);

    const [loadingSims, setLoadingSims] = useState(true);
    const [simsItemIds, setSimsItemIds] = useState([]);

    const [loadingSims2, setLoadingSims2] = useState(true);
    const [sims2ItemIds, setSims2ItemIds] = useState([]);

    const allLanesLoaded = !(loadingShows || loadingSims || loadingSims2);

    const fetchUsePersDetails = (recommendationIds) => {
        setLoadingShows(true);
        fetch("http://localhost:8000/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recommendations: recommendationIds })
        })
            .then(response => response.json())
            .then(data => {
                console.log("user pers api resp:")
                console.log(data)
                const images = data.map(prev => ({
                    text: prev.show_name,
                    image: prev.show_image,
                    episode: prev.episode_name,
                    genre: prev.show_genre,
                    duration: prev.episode_duration,
                    premiered: prev.episode_premiered_on
                }));
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
                console.log("sims1 api resp:")
                console.log(data)
                const images = data.map(prev => ({
                    text: prev.show_name,
                    image: prev.show_image,
                    episode: prev.episode_name,
                    genre: prev.show_genre,
                    duration: prev.episode_duration,
                    premiered: prev.episode_premiered_on
                }));
                setSimsItemIds(images);
                setLoadingSims(false);
            })
            .catch(error => {
                console.error("Error fetching sims:", error);
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
                console.log("sims2 api resp:")
                console.log(data)
                const images = data.map(prev => ({
                    text: prev.show_name,
                    image: prev.show_image,
                    episode: prev.episode_name,
                    genre: prev.show_genre,
                    duration: prev.episode_duration,
                    premiered: prev.episode_premiered_on
                }));
                setSims2ItemIds(images);
                setLoadingSims2(false);
            })
            .catch(error => {
                console.error("Error fetching sims2:", error);
                setLoadingSims2(false);
            });
    };

    useEffect(() => {
        const { userId, sims1, sims2 } = currentUser;

        fetch("https://8v7afwqlb1.execute-api.us-east-1.amazonaws.com/dev/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        })
        .then(res => res.json())
        .then(data => {
            const recommendationIds = data.map(i => i.itemId);
            fetchUsePersDetails(recommendationIds);
        });

        fetch("https://8v7afwqlb1.execute-api.us-east-1.amazonaws.com/dev/sims", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: sims1 })
        })
        .then(res => res.json())
        .then(data => {
            const simItemIds = data.map(i => i.itemId);
            fetchSimsDetails(simItemIds);
        });

        fetch("https://8v7afwqlb1.execute-api.us-east-1.amazonaws.com/dev/sims", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: sims2 })
        })
        .then(res => res.json())
        .then(data => {
            const sim2ItemIds = data.map(i => i.itemId);
            fetchSims2Details(sim2ItemIds);
        });

    }, [currentUser]);

    return (
        <>
            <Navbar
                style={{ backgroundColor: '#2638c4', fontSize: '16px', height: '78px', marginBottom: '20px', paddingLeft: '120px', paddingRight: '120px' }}
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
                            title={`Select User (${currentUser.name})`}
                            id="user-nav-dropdown"
                            className="text-white custom-dropdown"
                            style={{ fontWeight: 'bold' }}
                        >
                            {users.map((user, idx) => (
                                <NavDropdown.Item key={idx} onClick={() => setCurrentUser(user)}>
                                    {user.name}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>

            <Container fluid className="px-0 mb-5">
                <SwimLane 
                    title="Your Personalized Picks" 
                    items={shows} 
                    loading={!allLanesLoaded} 
                    index={1} 
                />
                <SwimLane 
                    title={`Because You Watched`} 
                    items={simsItemIds} 
                    loading={!allLanesLoaded} 
                    itemName={currentUser.sims1name}
                    index={2} 
                />
                <SwimLane 
                    title={`More Like`} 
                    items={sims2ItemIds} 
                    loading={!allLanesLoaded}
                    itemName={currentUser.sims2name}
                    index={3} 
                />
            </Container>
        </>
    );
}


export default App;
