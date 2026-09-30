import { useEffect, useState } from "react";
import "./App.css";

const API = "https://collegesportsmanagement.onrender.com";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [page, setPage] = useState("dashboard");

  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [playerForm, setPlayerForm] = useState({
    name: "",
    studentId: "",
    email: "",
    department: "",
    year: "",
  });

  const [teamForm, setTeamForm] = useState({
    name: "",
    sport: "",
    captain: "",
  });

  const [matchForm, setMatchForm] = useState({
    sport: "",
    team1: "",
    team2: "",
    date: "",
    venue: "",
  });

  const [resultForm, setResultForm] = useState({
    matchId: "",
    winner: "",
  });

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const api = async (url, options = {}) => {
    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        ...authHeaders(),
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  };

  const loadData = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const [playersData, teamsData, matchesData] = await Promise.all([
        api("/api/players"),
        api("/api/teams"),
        api("/api/matches"),
      ]);

      setPlayers(playersData.players || []);
      setTeams(teamsData.teams || []);
      setMatches(matchesData.matches || []);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const login = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      setMessage("Login successful ✅");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    setPlayers([]);
    setTeams([]);
    setMatches([]);
  };

  const createPlayer = async (e) => {
    e.preventDefault();

    try {
      await api("/api/players", {
        method: "POST",
        body: JSON.stringify({
          ...playerForm,
          year: Number(playerForm.year),
        }),
      });

      setMessage("Player created successfully ✅");

      setPlayerForm({
        name: "",
        studentId: "",
        email: "",
        department: "",
        year: "",
      });

      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deletePlayer = async (id) => {
    if (!window.confirm("Delete this player?")) return;

    try {
      await api(`/api/players/${id}`, {
        method: "DELETE",
      });

      setMessage("Player deleted successfully ✅");
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();

    try {
      await api("/api/teams", {
        method: "POST",
        body: JSON.stringify({
          name: teamForm.name,
          sport: teamForm.sport,
          captain: teamForm.captain || undefined,
        }),
      });

      setMessage("Team created successfully ✅");

      setTeamForm({
        name: "",
        sport: "",
        captain: "",
      });

      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const addPlayerToTeam = async (teamId, playerId) => {
    if (!playerId) return;

    try {
      await api(`/api/teams/${teamId}/players`, {
        method: "POST",
        body: JSON.stringify({
          playerId,
        }),
      });

      setMessage("Player added to team successfully ✅");
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const createMatch = async (e) => {
    e.preventDefault();

    try {
      await api("/api/matches", {
        method: "POST",
        body: JSON.stringify(matchForm),
      });

      setMessage("Match created successfully ✅");

      setMatchForm({
        sport: "",
        team1: "",
        team2: "",
        date: "",
        venue: "",
      });

      loadData();
      setPage("matches");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const recordResult = async (e) => {
    e.preventDefault();

    try {
      await api(`/api/matches/${resultForm.matchId}/result`, {
        method: "PATCH",
        body: JSON.stringify({
          winner: resultForm.winner,
        }),
      });

      setMessage("Match result recorded successfully 🏆");

      setResultForm({
        matchId: "",
        winner: "",
      });

      loadData();
      setPage("matches");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteMatch = async (id) => {
    if (!window.confirm("Delete this match?")) return;

    try {
      await api(`/api/matches/${id}`, {
        method: "DELETE",
      });

      setMessage("Match deleted successfully ✅");
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!token) {
    return (
      <div className="app login-page">
        <div className="login-card">
          <div className="logo">🏆</div>

          <h1>College Sports</h1>
          <h2>Management System</h2>

          <p className="login-description">
            Manage your college sports ecosystem from one powerful dashboard.
          </p>

          {message && (
            <div className="message error-message">
              {message}
            </div>
          )}

          <form onSubmit={login}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value,
                })
              }
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
              required
            />

            <button className="primary-btn" type="submit">
              🔐 {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">🏆</div>

          <div>
            <h1>College Sports</h1>
            <h2>Management System</h2>
          </div>
        </div>

        <div className="user-box">
          <h3>
            Welcome, {user?.name || "User"} 👋
          </h3>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>Role:</strong> {user?.role}
          </p>

          {user?.studentId && (
            <p>
              <strong>Student ID:</strong> {user.studentId}
            </p>
          )}
        </div>
      </header>

      <nav className="navbar">
        <button
          className={page === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}
        >
          🏠 Dashboard
        </button>

        <button
          className={page === "players" ? "active" : ""}
          onClick={() => setPage("players")}
        >
          👤 Players
        </button>

        <button
          className={page === "teams" ? "active" : ""}
          onClick={() => setPage("teams")}
        >
          🏟️ Teams
        </button>

        <button
          className={page === "matches" ? "active" : ""}
          onClick={() => setPage("matches")}
        >
          ⚽ Matches
        </button>

        <button
          className={page === "fixtures" ? "active" : ""}
          onClick={() => setPage("fixtures")}
        >
          📅 Fixtures & Results
        </button>

        {user?.role === "coordinator" && (
          <>
            <button
              className={page === "createMatch" ? "active" : ""}
              onClick={() => setPage("createMatch")}
            >
              ➕ Create Match
            </button>

            <button
              className={page === "result" ? "active" : ""}
              onClick={() => setPage("result")}
            >
              🏆 Record Result
            </button>
          </>
        )}

        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </nav>

      {message && (
        <div className="message success-message">
          {message}
        </div>
      )}

      <main className="content">
        {page === "dashboard" && (
          <Dashboard
            players={players}
            teams={teams}
            matches={matches}
            user={user}
          />
        )}

        {page === "players" && (
          <section>
            <SectionTitle
              title="Players"
              subtitle="Manage registered college players"
            />

            {user?.role === "coordinator" && (
              <div className="panel">
                <h2>➕ Add New Player</h2>

                <form className="form-grid" onSubmit={createPlayer}>
                  <input
                    placeholder="Player name"
                    value={playerForm.name}
                    onChange={(e) =>
                      setPlayerForm({
                        ...playerForm,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    placeholder="Student ID"
                    value={playerForm.studentId}
                    onChange={(e) =>
                      setPlayerForm({
                        ...playerForm,
                        studentId: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={playerForm.email}
                    onChange={(e) =>
                      setPlayerForm({
                        ...playerForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    placeholder="Department"
                    value={playerForm.department}
                    onChange={(e) =>
                      setPlayerForm({
                        ...playerForm,
                        department: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Year"
                    min="1"
                    max="6"
                    value={playerForm.year}
                    onChange={(e) =>
                      setPlayerForm({
                        ...playerForm,
                        year: e.target.value,
                      })
                    }
                    required
                  />

                  <button className="primary-btn">
                    Add Player
                  </button>
                </form>
              </div>
            )}

            <div className="card-grid">
              {players.map((player) => (
                <div className="player-card" key={player._id}>
                  <div className="avatar">👤</div>

                  <h3>{player.name}</h3>

                  <p>
                    <strong>Student ID:</strong>{" "}
                    {player.studentId}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {player.email}
                  </p>

                  <p>
                    <strong>Department:</strong>{" "}
                    {player.department}
                  </p>

                  <p>
                    <strong>Year:</strong>{" "}
                    {player.year}
                  </p>

                  {user?.role === "coordinator" && (
                    <button
                      className="danger-btn"
                      onClick={() =>
                        deletePlayer(player._id)
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "teams" && (
          <section>
            <SectionTitle
              title="Teams"
              subtitle="Manage college sports teams"
            />

            {user?.role === "coordinator" && (
              <div className="panel">
                <h2>➕ Create Team</h2>

                <form
                  className="form-grid"
                  onSubmit={createTeam}
                >
                  <input
                    placeholder="Team name"
                    value={teamForm.name}
                    onChange={(e) =>
                      setTeamForm({
                        ...teamForm,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    placeholder="Sport e.g. Cricket"
                    value={teamForm.sport}
                    onChange={(e) =>
                      setTeamForm({
                        ...teamForm,
                        sport: e.target.value,
                      })
                    }
                    required
                  />

                  <select
                    value={teamForm.captain}
                    onChange={(e) =>
                      setTeamForm({
                        ...teamForm,
                        captain: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Select Captain
                    </option>

                    {players.map((player) => (
                      <option
                        key={player._id}
                        value={player._id}
                      >
                        {player.name}
                      </option>
                    ))}
                  </select>

                  <button className="primary-btn">
                    Create Team
                  </button>
                </form>
              </div>
            )}

            <div className="card-grid">
              {teams.map((team) => (
                <TeamCard
                  key={team._id}
                  team={team}
                  players={players}
                  coordinator={user?.role === "coordinator"}
                  addPlayerToTeam={addPlayerToTeam}
                />
              ))}
            </div>
          </section>
        )}

        {page === "matches" && (
          <section>
            <SectionTitle
              title="Matches"
              subtitle="View all scheduled and completed matches"
            />

            <MatchList
              matches={matches}
              coordinator={user?.role === "coordinator"}
              deleteMatch={deleteMatch}
            />
          </section>
        )}

        {page === "fixtures" && (
          <section>
            <SectionTitle
              title="Fixtures & Results"
              subtitle="Upcoming fixtures and completed match results"
            />

            <MatchList
              matches={matches}
              coordinator={false}
              deleteMatch={() => {}}
            />
          </section>
        )}

        {page === "createMatch" &&
          user?.role === "coordinator" && (
            <section>
              <SectionTitle
                title="Create Match"
                subtitle="Schedule a new sports match"
              />

              <div className="panel large-panel">
                <form
                  className="form-grid"
                  onSubmit={createMatch}
                >
                  <input
                    placeholder="Sport"
                    value={matchForm.sport}
                    onChange={(e) =>
                      setMatchForm({
                        ...matchForm,
                        sport: e.target.value,
                      })
                    }
                    required
                  />

                  <select
                    value={matchForm.team1}
                    onChange={(e) =>
                      setMatchForm({
                        ...matchForm,
                        team1: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select Team 1
                    </option>

                    {teams.map((team) => (
                      <option
                        key={team._id}
                        value={team._id}
                      >
                        {team.name} - {team.sport}
                      </option>
                    ))}
                  </select>

                  <select
                    value={matchForm.team2}
                    onChange={(e) =>
                      setMatchForm({
                        ...matchForm,
                        team2: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select Team 2
                    </option>

                    {teams.map((team) => (
                      <option
                        key={team._id}
                        value={team._id}
                      >
                        {team.name} - {team.sport}
                      </option>
                    ))}
                  </select>

                  <input
                    type="datetime-local"
                    value={matchForm.date}
                    onChange={(e) =>
                      setMatchForm({
                        ...matchForm,
                        date: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    placeholder="Venue"
                    value={matchForm.venue}
                    onChange={(e) =>
                      setMatchForm({
                        ...matchForm,
                        venue: e.target.value,
                      })
                    }
                    required
                  />

                  <button className="primary-btn">
                    ⚽ Schedule Match
                  </button>
                </form>
              </div>
            </section>
          )}

        {page === "result" &&
          user?.role === "coordinator" && (
            <section>
              <SectionTitle
                title="Record Match Result"
                subtitle="Complete a match and record the winner"
              />

              <div className="panel large-panel">
                <form
                  className="form-grid"
                  onSubmit={recordResult}
                >
                  <select
                    value={resultForm.matchId}
                    onChange={(e) =>
                      setResultForm({
                        ...resultForm,
                        matchId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select Match
                    </option>

                    {matches
                      .filter(
                        (match) =>
                          match.status !== "completed"
                      )
                      .map((match) => (
                        <option
                          key={match._id}
                          value={match._id}
                        >
                          {match.team1?.name} vs{" "}
                          {match.team2?.name}
                        </option>
                      ))}
                  </select>

                  <select
                    value={resultForm.winner}
                    onChange={(e) =>
                      setResultForm({
                        ...resultForm,
                        winner: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select Winner
                    </option>

                    {(() => {
                      const selectedMatch =
                        matches.find(
                          (m) =>
                            m._id ===
                            resultForm.matchId
                        );

                      if (!selectedMatch) return null;

                      return (
                        <>
                          <option
                            value={
                              selectedMatch.team1?._id
                            }
                          >
                            {selectedMatch.team1?.name}
                          </option>

                          <option
                            value={
                              selectedMatch.team2?._id
                            }
                          >
                            {selectedMatch.team2?.name}
                          </option>
                        </>
                      );
                    })()}
                  </select>

                  <button className="primary-btn">
                    🏆 Record Result
                  </button>
                </form>
              </div>
            </section>
          )}
      </main>

      <footer>
        <p>
          🏆 College Sports Management System
        </p>
        <p>
          Built with React + Node.js + MongoDB
        </p>
      </footer>
    </div>
  );
}

function Dashboard({
  players,
  teams,
  matches,
  user,
}) {
  const completed = matches.filter(
    (match) => match.status === "completed"
  ).length;

  return (
    <section>
      <div className="hero">
        <span>SPORTS MANAGEMENT</span>

        <h1>
          Welcome, {user?.name || "User"} 👋
        </h1>

        <p>
          Manage your college sports ecosystem from one
          powerful dashboard.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="👤"
          title="Players"
          value={players.length}
          subtitle="Registered players"
        />

        <StatCard
          icon="🏟️"
          title="Teams"
          value={teams.length}
          subtitle="Active teams"
        />

        <StatCard
          icon="⚽"
          title="Matches"
          value={matches.length}
          subtitle="Total matches"
        />

        <StatCard
          icon="🏆"
          title="Completed"
          value={completed}
          subtitle="Finished matches"
        />
      </div>

      <div className="welcome-panel">
        <div className="big-trophy">🏆</div>

        <h2>
          Welcome to Sports Management System
        </h2>

        <p>
          Easily manage players, teams, fixtures and
          match results from a single platform.
        </p>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <div className="stat-number">
        {value}
      </div>

      <p>{subtitle}</p>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}) {
  return (
    <div className="section-title">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

function TeamCard({
  team,
  players,
  coordinator,
  addPlayerToTeam,
}) {
  const teamPlayerIds = (team.players || []).map(
    (player) =>
      typeof player === "string"
        ? player
        : player._id
  );

  const availablePlayers = players.filter(
    (player) =>
      !teamPlayerIds.includes(player._id)
  );

  return (
    <div className="team-card">
      <div className="team-icon">
        🏟️
      </div>

      <h2>{team.name}</h2>

      <span className="sport-badge">
        {team.sport}
      </span>

      <div className="captain">
        <strong>Captain:</strong>{" "}
        {team.captain?.name || "Not assigned"}
      </div>

      <h3>
        Players ({team.players?.length || 0})
      </h3>

      <div className="team-players">
        {team.players?.map((player) => (
          <div
            className="mini-player"
            key={
              typeof player === "string"
                ? player
                : player._id
            }
          >
            👤{" "}
            {typeof player === "string"
              ? player
              : player.name}
          </div>
        ))}
      </div>

      {coordinator && (
        <select
          defaultValue=""
          onChange={(e) => {
            addPlayerToTeam(
              team._id,
              e.target.value
            );

            e.target.value = "";
          }}
        >
          <option value="">
            ➕ Add Player
          </option>

          {availablePlayers.map((player) => (
            <option
              key={player._id}
              value={player._id}
            >
              {player.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function MatchList({
  matches,
  coordinator,
  deleteMatch,
}) {
  if (matches.length === 0) {
    return (
      <div className="empty">
        <div>⚽</div>
        <h2>No matches found</h2>
        <p>Create a match to see fixtures here.</p>
      </div>
    );
  }

  return (
    <div className="matches-grid">
      {matches.map((match) => (
        <div
          className="match-card"
          key={match._id}
        >
          <div className="match-top">
            <span className="sport-badge">
              {match.sport}
            </span>

            <span
              className={`status ${
                match.status
              }`}
            >
              {match.status}
            </span>
          </div>

          <div className="teams-vs">
            <div>
              <div className="match-team-icon">
                🏟️
              </div>

              <strong>
                {match.team1?.name ||
                  "Team 1"}
              </strong>
            </div>

            <span>VS</span>

            <div>
              <div className="match-team-icon">
                🏟️
              </div>

              <strong>
                {match.team2?.name ||
                  "Team 2"}
              </strong>
            </div>
          </div>

          <div className="match-info">
            <p>
              📅{" "}
              {new Date(
                match.date
              ).toLocaleString()}
            </p>

            <p>
              📍 {match.venue}
            </p>
          </div>

          {match.status ===
            "completed" &&
            match.winner && (
              <div className="winner">
                🏆 Winner:{" "}
                <strong>
                  {match.winner.name}
                </strong>
              </div>
            )}

          {coordinator && (
            <button
              className="danger-btn"
              onClick={() =>
                deleteMatch(match._id)
              }
            >
              Delete Match
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;