# Bubble Shooter

A browser-based **Bubble Shooter game built with React and MobX**. The project implements the core mechanics of a traditional bubble shooter game, including aiming, wall bounces, collision detection, color matching, scoring, and dynamic board progression.

## Features

- Interactive bubble shooting gameplay
- Physics-based shot trajectories
- Side-wall bounce calculations
- Grid-based bubble placement
- Color matching and cluster detection
- Removes clusters of three or more matching bubbles
- Drops disconnected bubbles after matches
- Score tracking
- Dynamic game progression
- Reactive game state powered by MobX
- Animated bubble movement with Framer Motion

## Tech Stack

- **React**
- **JavaScript**
- **MobX**
- **MobX React Lite**
- **Framer Motion**
- **Create React App**
- **CSS**

## How It Works

The game board is represented as a grid of bubble cells managed through a centralized MobX store.

When the player fires a bubble:

1. The game calculates the trajectory from the shooter toward the selected position.
2. The bubble can bounce off the left or right walls.
3. Collision detection determines when the bubble reaches another bubble or the top of the board.
4. The bubble is snapped into the nearest available grid position.
5. The game searches neighboring cells for bubbles of the same color.
6. Matching clusters of three or more bubbles are removed.
7. Bubbles that are no longer connected to the top of the board are dropped.
8. The player's score is updated based on popped and dropped bubbles.

## State Management

Game state is managed with **MobX** through a central `GameStore`.

The store manages:

- Bubble grid state
- Current score
- Active shot
- Next bubble color
- Shot trajectory calculations
- Collision detection
- Bubble placement
- Cluster detection
- Floating bubble removal
- Game progression
- Game reset

React components observe the MobX store and automatically update when game state changes.

## Project Structure

    src/
    ├── components/        # React game UI components
    ├── App.js             # Main application component
    ├── App.css            # Application styling
    ├── CellModel.js       # Model representing an individual grid cell
    ├── bubbleShooterApp.js
    ├── config.js          # Game configuration and constants
    ├── gameStore.js       # MobX game state and core game logic
    ├── utils.js           # Grid and geometry utility functions
    └── index.js           # React application entry point

## Getting Started

### Prerequisites

Make sure you have **Node.js** and **npm** installed.

### Installation

Clone the repository:

    git clone https://github.com/germain1909/bubble_shooter_mobx.git

Navigate into the project:

    cd bubble_shooter_mobx

Install dependencies:

    npm install

Start the development server:

    npm start

Open [http://localhost:3000](http://localhost:3000) to view the game in your browser.

## Available Scripts

### `npm start`

Runs the application in development mode.

### `npm test`

Runs the test suite in interactive watch mode.

### `npm run build`

Creates an optimized production build in the `build` directory.

## Game Architecture

The project separates **game logic and application state from the React UI**.

MobX manages the game state and gameplay rules while React is responsible for rendering the user interface. This allows the UI to react automatically to changes in game state while keeping collision detection, scoring, grid management, and shooting mechanics centralized within the game store.

## Future Improvements

- Game-over detection and dedicated game-over screen
- Difficulty levels
- Additional scoring mechanics
- Sound effects
- Mobile and touch controls
- High-score persistence
- Improved animations and visual effects
- Automated testing for game mechanics

## Author

**Germain Burchfield**

GitHub: [germain1909](https://github.com/germain1909)
