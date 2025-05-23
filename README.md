# Pokemon Web Game

This is a web-based Pokemon-like game where you can explore, find Pokeballs, and catch Pokemon. The application is built with a Flask (Python) backend and a React (JavaScript/JSX) frontend.

## Prerequisites

- **Python 3:** Ensure Python 3 is installed on your system. You can download it from [python.org](https://www.python.org/).
- **Node.js and npm:** Node.js (which includes npm) is required for managing frontend dependencies (primarily for testing at this stage). You can download it from [nodejs.org](https://nodejs.org/).
- **Git (Optional but Recommended):** For cloning the repository and managing versions.

## Setup and Running the Game

1.  **Clone the Repository (if applicable):**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
    If you have the code directly, navigate to the project's root directory (the one containing the `pokemon_web_app` folder).

2.  **Create and Activate Python Virtual Environment:**
    It's highly recommended to use a virtual environment to manage Python dependencies.
    ```bash
    python -m venv venv
    ```
    Activate it:
    -   Windows:
        ```bash
        venv\Scripts\activate
        ```
    -   macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

3.  **Install Python Dependencies:**
    Navigate into the application directory and install the required packages.
    ```bash
    cd pokemon_web_app
    pip install -r requirements.txt
    ```

4.  **Install Frontend Node Modules (for tests):**
    While still in the `pokemon_web_app` directory (where `package.json` is located):
    ```bash
    npm install
    ```
    *This step is primarily for running Jest tests. The application's React components are loaded via CDN in the browser.*

5.  **Run the Flask Application:**
    Ensure your Python virtual environment is active and you are in the `pokemon_web_app` directory.
    ```bash
    flask run
    ```
    Alternatively, if your `app.py` is configured to run with `python app.py` (e.g., it contains `if __name__ == '__main__': app.run(debug=True)`), you can use that.

    You should see output similar to:
    ```
     * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
    ```

6.  **Open in Browser:**
    Open your web browser and navigate to the address shown (e.g., `http://127.0.0.1:5000/`).

You should now see the game running!

## Running Tests (Optional)

### Backend Tests (Pytest)

Ensure your virtual environment is active and you are in the `pokemon_web_app` directory:
```bash
python -m pytest
```

### Frontend Tests (Jest)

Ensure you are in the `pokemon_web_app` directory (where `package.json` is located):
```bash
npm test
```
