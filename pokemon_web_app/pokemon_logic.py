import requests
import random

class Pokemon:
    def __init__(self, id=None):
        if id is None:
            id = random.randint(1, 151)  # Fetch a random Pokemon from Gen 1
        
        response = requests.get(f"https://pokeapi.co/api/v2/pokemon/{id}")
        
        if response.status_code == 404:
            raise ValueError(f"Pokemon with ID {id} not found.")
        
        data = response.json()
        
        self.name = data['name']
        self.id = data['id']
        self.stats = {stat['stat']['name']: stat['base_stat'] for stat in data['stats']}
        self.sprite_url = data['sprites']['front_default']

    def to_dict(self):
        return {
            'name': self.name,
            'id': self.id,
            'stats': self.stats,
            'sprite_url': self.sprite_url
        }
