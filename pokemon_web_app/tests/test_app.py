import pytest
from pokemon_web_app.app import app as flask_app # Renamed to avoid conflict

@pytest.fixture
def app():
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_random_pokemon(client):
    """Test the /api/random_pokemon endpoint."""
    response = client.get('/api/random_pokemon')
    assert response.status_code == 200
    
    json_data = response.get_json()
    assert json_data is not None
    
    assert 'name' in json_data
    assert 'id' in json_data
    assert 'sprite_url' in json_data
    assert 'stats' in json_data
    
    assert isinstance(json_data['id'], int)
    assert isinstance(json_data['name'], str)
    assert isinstance(json_data['sprite_url'], str)
    
    assert isinstance(json_data['stats'], dict)
    assert 'hp' in json_data['stats']
    assert 'attack' in json_data['stats']
    assert 'defense' in json_data['stats']
    assert isinstance(json_data['stats']['hp'], int)
    assert isinstance(json_data['stats']['attack'], int)
    assert isinstance(json_data['stats']['defense'], int)

def test_get_specific_pokemon_valid(client):
    """Test the /api/pokemon/<id> endpoint with a valid ID."""
    pokemon_id = 1 # Bulbasaur
    response = client.get(f'/api/pokemon/{pokemon_id}')
    assert response.status_code == 200
    
    json_data = response.get_json()
    assert json_data is not None
    
    assert json_data['id'] == pokemon_id
    assert json_data['name'] == 'bulbasaur'
    assert 'stats' in json_data
    assert json_data['stats']['hp'] is not None # Actual stat value might vary

def test_get_specific_pokemon_invalid(client):
    """Test the /api/pokemon/<id> endpoint with an invalid ID."""
    pokemon_id = 99999 # Non-existent Pokemon
    response = client.get(f'/api/pokemon/{pokemon_id}')
    assert response.status_code == 404
    
    json_data = response.get_json()
    assert json_data is not None
    assert 'error' in json_data
    assert f"Pokemon with ID {pokemon_id} not found" in json_data['error']

def test_index_route(client):
    """Test the index route /."""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Pokemon Web Game" in response.data # Check for a known string in index.html
    assert b'<div id="root">' in response.data # Check for React root element
