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
                    </div>
                ))}
            </div>
        </div>
    );
};

const PokemonCaughtScreen = (props) => {
    const { pokemonData, onClose } = props;
    if (!pokemonData) return null;
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
    const { item, onRevealPokeball, onCollectPokeball, gameDimensions } = props;
    const itemX = gameDimensions ? item.xPercent * gameDimensions.width : item.x;
    const itemY = gameDimensions ? item.yPercent * gameDimensions.height : item.y;
    
    const itemSize = gameDimensions ? gameDimensions.width * 0.0625 : 50; 
    const pokeballVisualSize = itemSize / 2; // Visual size of the Pokeball sprite

    // Make tappable area larger than visual sprite, e.g., 1.5x the visual size, minimum 20px
    const pokeballTappableSize = Math.max(pokeballVisualSize * 1.5, 20); 
    // Calculate padding needed to achieve tappable size around visual sprite
    const pokeballPadding = (pokeballTappableSize - pokeballVisualSize) / 2;


    const itemStyle = {
        position: 'absolute',
        left: itemX + 'px',
        top: itemY + 'px',
        width: itemSize + 'px', 
        height: itemSize + 'px', 
    };

    // Wrapper for the Pokeball to increase tappable area
    const pokeballWrapperStyle = {
        position: 'absolute',
        left: (itemX + itemSize / 2 - pokeballPadding) + 'px', // Adjust left for padding
        top: (itemY + itemSize / 2 - pokeballPadding) + 'px',   // Adjust top for padding
        width: pokeballTappableSize + 'px', 
        height: pokeballTappableSize + 'px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10 
        // For debugging tappable area:
        // backgroundColor: 'rgba(255, 0, 0, 0.3)', 
    };
    
    const pokeballImageStyle = {
        width: pokeballVisualSize + 'px', 
        height: pokeballVisualSize + 'px',
    };


    return (
        <div>
            <img src={item.spriteUrl} alt="Background item" style={itemStyle} />
            {item.hasPokeball && item.pokeballRevealed && (
                <div style={pokeballWrapperStyle} onClick={() => onCollectPokeball(item.id)}>
                    <img 
                        src="/static/sprites/pokeball.png" 
                        alt="Pokeball" 
                        style={pokeballImageStyle} 
                    />
                </div>
            )}
        </div>
    );
};

const Trainer = (props) => {
    const { x, y, gameDimensions } = props.position; 
    const trainerSize = gameDimensions ? gameDimensions.width * 0.0625 : 50; 

    const style = {
        position: 'absolute',
        left: gameDimensions ? (x * gameDimensions.width) + 'px' : '50px', 
        top: gameDimensions ? (y * gameDimensions.height) + 'px' : '50px',  
        width: trainerSize + 'px', 
        height: trainerSize + 'px',
        zIndex: 5 
    };
    return <img src="/static/sprites/ash.png" alt="Trainer" style={style} />;
};

const Game = () => {
    const initialTrainerWidth = 50; 
    const initialItemSize = 50; 
    const numBackgroundItems = 10;
    const numPokeballs = 4;
    const maxCapturedPokemon = 6;

    const gameAreaRef = React.useRef(null);
    const [gameDimensions, setGameDimensions] = React.useState({ width: 800, height: 600 }); 

    const [trainerPosition, setTrainerPosition] = React.useState({ x: 0.1, y: 0.1 }); 
    const [trainerTargetPosition, setTrainerTargetPosition] = React.useState({ x: 0.1, y: 0.1 });
    
    const [backgroundItems, setBackgroundItems] = React.useState([]);
    const [showPokemonCaughtScreen, setShowPokemonCaughtScreen] = React.useState(false);
    const [caughtPokemonData, setCaughtPokemonData] = React.useState(null);
    const [capturedPokemonList, setCapturedPokemonList] = React.useState([]);

    React.useEffect(() => {
        const updateDimensions = () => {
            if (gameAreaRef.current) {
                setGameDimensions({
                    width: gameAreaRef.current.offsetWidth,
                    height: gameAreaRef.current.offsetHeight,
                });
            }
        };
        updateDimensions(); 
        const resizeObserver = new ResizeObserver(updateDimensions);
        if (gameAreaRef.current) {
            resizeObserver.observe(gameAreaRef.current);
        }
        return () => {
            if (gameAreaRef.current) {
                resizeObserver.unobserve(gameAreaRef.current);
            }
        };
    }, []);

    React.useEffect(() => {
        const items = [];
        const pokeballIndices = new Set();
        while(pokeballIndices.size < numPokeballs) {
            pokeballIndices.add(Math.floor(Math.random() * numBackgroundItems));
        }
        for (let i = 0; i < numBackgroundItems; i++) {
            items.push({
                id: `item-${i}`,
                xPercent: Math.random(), 
                yPercent: Math.random(), 
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
                setCaughtPokemonData(data);
                setShowPokemonCaughtScreen(true);
            })
            .catch(error => console.error("Error fetching Pokemon for caught screen:", error));
    };
    
    const handleCloseCaughtScreen = () => {
        if (caughtPokemonData) {
            setCapturedPokemonList(prevList => {
                const newList = [caughtPokemonData, ...prevList];
                return newList.length > maxCapturedPokemon ? newList.slice(0, maxCapturedPokemon) : newList;
            });
        }
        setShowPokemonCaughtScreen(false);
        setCaughtPokemonData(null); 
    };

    React.useEffect(() => {
        if (!gameDimensions.width || !gameDimensions.height) return; 

        const currentTrainerWidth = gameDimensions.width * 0.0625; 
        const currentItemSize = gameDimensions.width * 0.0625;    

        backgroundItems.forEach(item => {
            if (item.hasPokeball && !item.pokeballRevealed) {
                const trainerCenterX = trainerPosition.x * gameDimensions.width + currentTrainerWidth / 2;
                const trainerCenterY = trainerPosition.y * gameDimensions.height + currentTrainerWidth / 2; 
                
                const itemCenterX = item.xPercent * gameDimensions.width + currentItemSize / 2;
                const itemCenterY = item.yPercent * gameDimensions.height + currentItemSize / 2;

                const dx = trainerCenterX - itemCenterX;
                const dy = trainerCenterY - itemCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const revealDistance = (currentTrainerWidth / 2) + (currentItemSize / 2) - (gameDimensions.width * 0.01); 

                if (distance < revealDistance) {
                    revealPokeball(item.id);
                }
            }
        });
    }, [trainerPosition, backgroundItems, gameDimensions]); 

    const gameAreaStyle = {
        position: 'relative', 
        width: '100%', 
        height: '100%', 
    };

    const handleClickOnGameArea = (event) => {
        if (showPokemonCaughtScreen || event.target.closest('.modal-content') || !gameAreaRef.current || event.target.closest('[style*="cursor: pointer"]')) { // Prevent click if clicking on Pokeball wrapper
            return;
        }
        const rect = gameAreaRef.current.getBoundingClientRect(); 
        const currentTrainerWidth = gameDimensions.width * 0.0625;

        let clickXPercent = (event.clientX - rect.left) / gameDimensions.width;
        let clickYPercent = (event.clientY - rect.top) / gameDimensions.height;

        clickXPercent -= (currentTrainerWidth / 2) / gameDimensions.width;
        clickYPercent -= (currentTrainerWidth / 2) / gameDimensions.height; 

        const trainerWidthPercent = currentTrainerWidth / gameDimensions.width;
        clickXPercent = Math.max(0, Math.min(clickXPercent, 1 - trainerWidthPercent));
        clickYPercent = Math.max(0, Math.min(clickYPercent, 1 - trainerWidthPercent)); 
        
        setTrainerTargetPosition({ x: clickXPercent, y: clickYPercent });
    };

    React.useEffect(() => {
        let animationFrameId;
        const moveTrainer = () => {
            setTrainerPosition(currentPos => {
                const dx = trainerTargetPosition.x - currentPos.x; 
                const dy = trainerTargetPosition.y - currentPos.y; 
                
                const pseudoDistX = dx * gameDimensions.width;
                const pseudoDistY = dy * gameDimensions.height;
                const pseudoDist = Math.sqrt(pseudoDistX * pseudoDistX + pseudoDistY * pseudoDistY);

                const speedPixelsPerFrame = 5; 
                const speedPercentX = speedPixelsPerFrame / gameDimensions.width;
                const speedPercentY = speedPixelsPerFrame / gameDimensions.height;

                if (pseudoDist < speedPixelsPerFrame) { 
                    return trainerTargetPosition; 
                } else {
                    const nextX = currentPos.x + (pseudoDistX / pseudoDist) * (speedPixelsPerFrame / gameDimensions.width);
                    const nextY = currentPos.y + (pseudoDistY / pseudoDist) * (speedPixelsPerFrame / gameDimensions.height);
                    return { x: nextX, y: nextY };
                }
            });
            if (Math.abs(trainerPosition.x - trainerTargetPosition.x) > 0.001 || Math.abs(trainerPosition.y - trainerTargetPosition.y) > 0.001) {
                animationFrameId = requestAnimationFrame(moveTrainer);
            }
        };
        if (Math.abs(trainerPosition.x - trainerTargetPosition.x) > 0.001 || Math.abs(trainerPosition.y - trainerTargetPosition.y) > 0.001) {
            animationFrameId = requestAnimationFrame(moveTrainer);
        }
        return () => cancelAnimationFrame(animationFrameId); 
    }, [trainerTargetPosition, trainerPosition, gameDimensions]); 

    return (
        <div>
            <h1>Pokemon Game</h1>
            <div className="game-area-container">
                <div ref={gameAreaRef} style={gameAreaStyle} className="game-area-main" onClick={handleClickOnGameArea}>
                    {backgroundItems.map(item => (
                        <BackgroundItem 
                            key={item.id} 
                            item={item} 
                            onRevealPokeball={revealPokeball} 
                            onCollectPokeball={collectPokeball}
                            gameDimensions={gameDimensions}
                        />
                    ))}
                    <Trainer position={{...trainerPosition, gameDimensions}} />
                </div>
            </div>
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
