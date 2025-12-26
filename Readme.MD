# Hand-Cricket

A room-based real-time multiplayer game built using a client–server architecture. The server maintains authoritative game state and synchronizes player actions across connected clients with low latency.

## 🚀 Features
- **Real-time Multiplayer**: Play against friends in real-time using Socket.io.
- **Room System**: Create private rooms and invite friends via room codes.
- **Authentication**: Secure user accounts with password hashing (bcrypt) and session management.
- **Responsive Design**: Built with React and SCSS for a modern look.
- **Persistance**: SQLite database to store user credentials.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, SCSS
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.io
- **Database**: SQLite3
- **Authentication**: Cookies & Session Tokens

## ⚙️ Installation & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/nithinsadam/Hand-Cricket.git
   cd Hand-Cricket
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   REACT_URL=http://localhost:5173
   ```
   *(This ensures the backend allows CORS requests from your frontend)*

4. **Start the Backend Server**
   ```bash
   node server.js
   ```
   *Server runs on http://localhost:4000*

5. **Start the Frontend**
   Open a new terminal and run:
   ```bash
   npm run dev
   ```
   *Frontend runs on http://localhost:5173*

## 🔮 Future Improvements
- [ ] User Profiles & Stats
- [ ] Global Leaderboards
- [ ] Chat functionality within rooms
- [ ] Tournament mode
