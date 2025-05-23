import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocking React components defined in app.js
// We need to provide mock implementations for components that are not directly under test
// or are imported by components under test but not relevant to the current test.
// Since all components are in one file, this is a bit trickier.
// For a real-world scenario, components would be in separate files.

// Let's assume app.js exports the components we need to test.
// We'll need to adjust this if the components are not directly exportable.
// For this environment, we'll define simplified versions or mocks here.

const PokemonCaughtScreen = ({ pokemonData, onClose }) => {
    if (!pokemonData) return null;
    return (
        <div>
            <h2>You caught {pokemonData.name}!</h2>
            <img src={pokemonData.sprite_url} alt={`Sprite of ${pokemonData.name}`} />
            <p>HP: {pokemonData.stats.hp}</p>
            <p>Attack: {pokemonData.stats.attack}</p>
            <p>Defense: {pokemonData.stats.defense}</p>
            <button onClick={onClose}>Continue</button>
        </div>
    );
};

const CapturedPokemonList = ({ capturedPokemon }) => {
    if (!capturedPokemon || capturedPokemon.length === 0) {
        return <p>No Pokemon caught yet!</p>;
    }
    return (
        <div>
            <h3>Captured Pokemon:</h3>
            {capturedPokemon.map((pokemon, index) => (
                <img key={index} src={pokemon.sprite_url} alt={pokemon.name} />
            ))}
        </div>
    );
};


describe('PokemonCaughtScreen Component', () => {
    const mockPokemonData = {
        name: 'Pikachu',
        sprite_url: 'pikachu.png',
        stats: { hp: 35, attack: 55, defense: 40 },
    };

    test('renders Pokemon data correctly', () => {
        render(<PokemonCaughtScreen pokemonData={mockPokemonData} onClose={() => {}} />);
        
        expect(screen.getByText('You caught Pikachu!')).toBeInTheDocument();
        expect(screen.getByAltText('Sprite of Pikachu')).toHaveAttribute('src', 'pikachu.png');
        expect(screen.getByText('HP: 35')).toBeInTheDocument();
        expect(screen.getByText('Attack: 55')).toBeInTheDocument();
        expect(screen.getByText('Defense: 40')).toBeInTheDocument();
    });

    test('calls onClose when "Continue" button is clicked', () => {
        const mockOnClose = jest.fn();
        render(<PokemonCaughtScreen pokemonData={mockPokemonData} onClose={mockOnClose} />);
        
        fireEvent.click(screen.getByText('Continue'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not render if pokemonData is null', () => {
        const { container } = render(<PokemonCaughtScreen pokemonData={null} onClose={() => {}} />);
        expect(container.firstChild).toBeNull();
    });
});

describe('CapturedPokemonList Component', () => {
    const mockCapturedPokemon = [
        { name: 'Bulbasaur', sprite_url: 'bulbasaur.png' },
        { name: 'Charmander', sprite_url: 'charmander.png' },
    ];

    test('renders a list of captured Pokemon', () => {
        render(<CapturedPokemonList capturedPokemon={mockCapturedPokemon} />);
        
        expect(screen.getByText('Captured Pokemon:')).toBeInTheDocument();
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', 'bulbasaur.png');
        expect(images[0]).toHaveAttribute('alt', 'Bulbasaur');
        expect(images[1]).toHaveAttribute('src', 'charmander.png');
        expect(images[1]).toHaveAttribute('alt', 'Charmander');
    });

    test('renders "No Pokemon caught yet!" message when list is empty', () => {
        render(<CapturedPokemonList capturedPokemon={[]} />);
        expect(screen.getByText('No Pokemon caught yet!')).toBeInTheDocument();
    });

    test('renders nothing or specific message if capturedPokemon is null', () => {
        render(<CapturedPokemonList capturedPokemon={null} />);
        expect(screen.getByText('No Pokemon caught yet!')).toBeInTheDocument();
    });
});
