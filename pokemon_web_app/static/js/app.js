// React components will be defined here

const CapturedPokemonList = (props) => {
    const { capturedPokemon } = props;

    if (!capturedPokemon || capturedPokemon.length === 0) {
        return <div className="captured-pokemon-bar"><p>No Pokemon caught yet!</p></div>;
    }

    return (
        <div className="captured-pokemon-bar">
            <h3>Captured Pokemon:</h3>
            <div className="pokemon-list-items">
                {capturedPokemon.map((pokemon, index) => (
                    <div key={index} className="captured-pokemon-item" title={pokemon.name}>
                        <img src={pokemon.sprite_url} alt={pokemon.name} />
                        {/* Optional: Display name below sprite
                        <p>{pokemon.name}</p> 
                        */}
                    </div>
                ))}
            </div>
        </div>
    );
};

const PokemonCaughtScreen = (props) => {
    const { pokemonData, onClose } = props;

    if (!pokemonData) {
        return null; 
    }

    const hp = pokemonData.stats?.hp || 'N/A';
    const attack = pokemonData.stats?.attack || 'N/A';
    const defense = pokemonData.stats?.defense || 'N/A';

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>You caught {pokemonData.name}!</h2>
                <img 
                    src={pokemonData.sprite_url} 
                    alt={`Sprite of ${pokemonData.name}`} 
                    className="pokemon-sprite-caught" 
                />
                <div>
                    <p><strong>HP:</strong> {hp}</p>
                    <p><strong>Attack:</strong> {attack}</p>
                    <p><strong>Defense:</strong> {defense}</p>
                </div>
                <button onClick={onClose}>Continue</button>
            </div>
        </div>
    );
};


const BackgroundItem = (props) => {
    const { item, onRevealPokeball, onCollectPokeball } = props;
    const itemStyle = {
        position: 'absolute',
        left: item.x + 'px',
        top: item.y + 'px',
        width: '50px', 
        height: '50px', 
    };

    const pokeballStyle = {
        position: 'absolute',
        left: (item.x + 25) + 'px', 
        top: (item.y + 25) + 'px',  
        width: '25px', 
        height: '25px',
        cursor: 'pointer',
        zIndex: 10 
    };

    return (
        <div>
            <img src={item.spriteUrl} alt="Background item" style={itemStyle} />
            {item.hasPokeball && item.pokeballRevealed && (
                <img 
                    src="/static/sprites/pokeball.png" 
                    alt="Pokeball" 
                    style={pokeballStyle} 
                    onClick={() => onCollectPokeball(item.id)}
                />
            )}
        </div>
    );
};


const PokemonDisplay = () => {
    const [pokemon, setPokemon] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    // This component is currently a bit redundant as the main Pokemon display
    // is now the "Pokemon Caught Screen". It could be repurposed or removed.
    // For now, it just shows one random Pokemon at the start.
    React.useEffect(() => {
        fetch('/api/random_pokemon')
            .then(response => response.json())
            .then(data => {
                setPokemon(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching initial Pokemon:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading initial Pokemon data...</p>;
    }

    if (!pokemon) {
        return <p>Error loading initial Pokemon data.</p>;
    }

    return (
        <div className="pokemon-display">
            <h2>Random Encounter Example:</h2>
            <img src={pokemon.sprite_url} alt={`Sprite of ${pokemon.name}`} />
            <p>{pokemon.name}</p>
        </div>
    );
};

const Trainer = (props) => {
    const { x, y } = props.position;
    const style = {
        position: 'absolute',
        left: x + 'px',
        top: y + 'px',
        width: '50px', 
        height: '50px',
        zIndex: 5 
    };
    return <img src="/static/sprites/ash.png" alt="Trainer" style={style} />;
};

const Game = () => {
    const gameAreaWidth = 800;
    const gameAreaHeight = 600;
    const trainerWidth = 50; 
    const trainerHeight = 50;
    const itemSize = 50; 
    const numBackgroundItems = 10;
    const numPokeballs = 4;
    const maxCapturedPokemon = 6; // Max Pokemon in the list

    const [trainerPosition, setTrainerPosition] = React.useState({ x: 50, y: 50 });
    const [trainerTargetPosition, setTrainerTargetPosition] = React.useState({ x: 50, y: 50 });
    const [backgroundItems, setBackgroundItems] = React.useState([]);
    const [showPokemonCaughtScreen, setShowPokemonCaughtScreen] = React.useState(false);
    const [caughtPokemonData, setCaughtPokemonData] = React.useState(null);
    const [capturedPokemonList, setCapturedPokemonList] = React.useState([]);


    React.useEffect(() => {
        const items = [];
        const pokeballIndices = new Set();
        while(pokeballIndices.size < numPokeballs) {
            pokeballIndices.add(Math.floor(Math.random() * numBackgroundItems));
        }

        for (let i = 0; i < numBackgroundItems; i++) {
            items.push({
                id: `item-${i}`,
                x: Math.random() * (gameAreaWidth - itemSize),
                y: Math.random() * (gameAreaHeight - itemSize),
                spriteUrl: '/static/sprites/tree-green.png',
                hasPokeball: pokeballIndices.has(i),
                pokeballRevealed: false,
            });
        }
        setBackgroundItems(items);
    }, []);

    const revealPokeball = (itemId) => {
        setBackgroundItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, pokeballRevealed: true } : item
            )
        );
    };

    const collectPokeball = (itemId) => {
        setBackgroundItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, hasPokeball: false, pokeballRevealed: false } : item
            )
        );

        fetch('/api/random_pokemon')
            .then(response => response.json())
            .then(data => {
                setCaughtPokemonData(data); // Store for the modal
                setShowPokemonCaughtScreen(true);
            })
            .catch(error => {
                console.error("Error fetching Pokemon for caught screen:", error);
            });
    };
    
    const handleCloseCaughtScreen = () => {
        if (caughtPokemonData) {
            setCapturedPokemonList(prevList => {
                const newList = [caughtPokemonData, ...prevList]; // Add to the beginning
                if (newList.length > maxCapturedPokemon) {
                    return newList.slice(0, maxCapturedPokemon); // Keep only the newest 6
                }
                return newList;
            });
        }
        setShowPokemonCaughtScreen(false);
        setCaughtPokemonData(null); 
    };

    React.useEffect(() => {
        backgroundItems.forEach(item => {
            if (item.hasPokeball && !item.pokeballRevealed) {
                const trainerCenterX = trainerPosition.x + trainerWidth / 2;
                const trainerCenterY = trainerPosition.y + trainerHeight / 2;
                const itemCenterX = item.x + itemSize / 2;
                const itemCenterY = item.y + itemSize / 2;

                const dx = trainerCenterX - itemCenterX;
                const dy = trainerCenterY - itemCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const revealDistance = (trainerWidth / 2) + (itemSize / 2) - 10;

                if (distance < revealDistance) {
                    revealPokeball(item.id);
                }
            }
        });
    }, [trainerPosition, backgroundItems]); 


    const gameAreaStyle = {
        width: gameAreaWidth + 'px',
        height: gameAreaHeight + 'px',
        // border: '1px solid black', // Border is now handled by .game-area-container or .game-area-main
        position: 'relative', 
        // backgroundColor: '#90ee90' // Moved to CSS via .game-area-main
    };

    const handleClickOnGameArea = (event) => {
        if (showPokemonCaughtScreen || event.target.closest('.modal-content')) {
            return;
        }
        const rect = event.target.getBoundingClientRect();
        let newX = event.clientX - rect.left - (trainerWidth / 2); 
        let newY = event.clientY - rect.top - (trainerHeight / 2);

        newX = Math.max(0, Math.min(newX, gameAreaWidth - trainerWidth));
        newY = Math.max(0, Math.min(newY, gameAreaHeight - trainerHeight));
        
        setTrainerTargetPosition({ x: newX, y: newY });
    };

    React.useEffect(() => {
        let animationFrameId;
        const moveTrainer = () => {
            setTrainerPosition(currentPos => {
                const dx = trainerTargetPosition.x - currentPos.x;
                const dy = trainerTargetPosition.y - currentPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const speed = 5;

                if (dist < speed) {
                    return trainerTargetPosition; 
                } else {
                    const nextX = currentPos.x + (dx / dist) * speed;
                    const nextY = currentPos.y + (dy / dist) * speed;
                    return { x: nextX, y: nextY };
                }
            });
            if (trainerPosition.x !== trainerTargetPosition.x || trainerPosition.y !== trainerTargetPosition.y) {
                animationFrameId = requestAnimationFrame(moveTrainer);
            }
        };
        if (trainerPosition.x !== trainerTargetPosition.x || trainerPosition.y !== trainerTargetPosition.y) {
            animationFrameId = requestAnimationFrame(moveTrainer);
        }
        return () => {
            cancelAnimationFrame(animationFrameId); 
        };
    }, [trainerTargetPosition, trainerPosition]); 

    return (
        <div>
            <h1>Pokemon Game</h1>
            <div className="game-area-container">
                <div style={gameAreaStyle} className="game-area-main" onClick={handleClickOnGameArea}>
                    {backgroundItems.map(item => (
                        <BackgroundItem 
                            key={item.id} 
                            item={item} 
                            onRevealPokeball={revealPokeball} 
                            onCollectPokeball={collectPokeball}
                        />
                    ))}
                    <Trainer position={trainerPosition} />
                </div>
            </div>
            
            {/* PokemonDisplay is now more of a demo/placeholder, could be removed or integrated differently */}
            {/* <PokemonDisplay />  */}

            <CapturedPokemonList capturedPokemon={capturedPokemonList} />

            {showPokemonCaughtScreen && (
                <PokemonCaughtScreen 
                    pokemonData={caughtPokemonData} 
                    onClose={handleCloseCaughtScreen} 
                />
            )}
        </div>
    );
};

ReactDOM.render(<Game />, document.getElementById('root'));
