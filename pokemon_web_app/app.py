from flask import Flask, render_template, jsonify
from pokemon_logic import Pokemon # Import the Pokemon class

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/pokemon/<int:pokemon_id>')
def get_pokemon(pokemon_id):
    try:
        pokemon = Pokemon(id=pokemon_id)
        return jsonify(pokemon.to_dict())
    except ValueError as e: # Catches the Pokemon not found error
        return jsonify({'error': str(e)}), 404

@app.route('/api/random_pokemon')
def get_random_pokemon():
    pokemon = Pokemon() # Gets a random Pokemon
    return jsonify(pokemon.to_dict())

if __name__ == '__main__':
    app.run(debug=True)
