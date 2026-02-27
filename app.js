/** @jsx React.createElement */

const {
  BrowserRouter,
  Routes,
  Route,
  Link,
} = ReactRouterDOM;

const root = ReactDOM.createRoot(document.getElementById("root"));

/* ======================
   STORAGE
====================== */

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k) => JSON.parse(localStorage.getItem(k));

/* ======================
   RM ENGINE
====================== */

function calc1RM(weight, reps) {
  return weight * (1 + reps / 30);
}

function rmTable(weight, reps) {
  const oneRM = calc1RM(weight, reps);

  return {
    "1RM": oneRM.toFixed(1),
    "2RM": (oneRM / (1 + 2 / 30)).toFixed(1),
    "3RM": (oneRM / (1 + 3 / 30)).toFixed(1),
    "5RM": (oneRM / (1 + 5 / 30)).toFixed(1),
    "10RM": (oneRM / (1 + 10 / 30)).toFixed(1),
  };
}

function intensity(weight, oneRM) {
  return ((weight / oneRM) * 100).toFixed(1);
}

/* ======================
   PROFILE
====================== */

function Profile() {
  const data = load("athlete") || {};

  const [name, setName] = React.useState(data.name || "");
  const [gender, setGender] = React.useState(data.gender || "m");

  function saveProfile() {
    save("athlete", { name, gender });
    alert("Profil gespeichert");
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Athletenprofil</h2>

      <input
        className="p-2 mr-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="p-2 mr-2"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="m">Männlich</option>
        <option value="w">Weiblich</option>
      </select>

      <button
        onClick={saveProfile}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Speichern
      </button>
    </div>
  );
}

/* ======================
   STRENGTH
====================== */

const exercises = [
  "Back Squat",
  "Front Squat",
  "Deadlift",
  "Bench Press",
  "Strict Press",
  "Snatch",
  "Clean & Jerk",
];

function Strength() {
  const [exercise, setExercise] = React.useState(exercises[0]);
  const [weight, setWeight] = React.useState(100);
  const [reps, setReps] = React.useState(5);

  const table = rmTable(weight, reps);
  const inten = intensity(weight, table["1RM"]);

  function saveLift() {
    const logs = load("lifts") || [];
    logs.push({ exercise, weight, reps });
    save("lifts", logs);
    alert("Lift gespeichert");
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Strength Entry</h2>

      <select
        className="p-2 mr-2"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      >
        {exercises.map(e => <option key={e}>{e}</option>)}
      </select>

      <input
        type="number"
        className="p-2 mr-2"
        value={weight}
        onChange={(e)=>setWeight(Number(e.target.value))}
      />

      <input
        type="number"
        className="p-2"
        value={reps}
        onChange={(e)=>setReps(Number(e.target.value))}
      />

      <div className="mt-6 bg-zinc-900 p-4 rounded">
        <h3>RM Tabelle</h3>

        {Object.entries(table).map(([k,v])=>(
          <div key={k}>{k}: {v} kg</div>
        ))}

        <div className="text-green-400 mt-2">
          Intensität: {inten} %
        </div>
      </div>

      <button
        onClick={saveLift}
        className="mt-4 bg-green-600 px-4 py-2 rounded"
      >
        Speichern
      </button>
    </div>
  );
}

/* ======================
   LEADERBOARD
====================== */

function Leaderboard() {
  const lifts = load("lifts") || {};
  const best = {};

  (lifts || []).forEach(l=>{
    if(!best[l.exercise] || l.weight>best[l.exercise])
      best[l.exercise]=l.weight;
  });

  return (
    <div>
      <h2 className="text-2xl mb-4">Leaderboard</h2>

      {Object.entries(best).map(([ex,w])=>(
        <div key={ex} className="bg-zinc-900 p-3 mb-2 rounded">
          {ex}: {w} kg
        </div>
      ))}
    </div>
  );
}

/* ======================
   DASHBOARD
====================== */

function Dashboard() {
  const athlete = load("athlete");

  return (
    <div>
      <h1 className="text-3xl">
        Willkommen {athlete?.name || "Athlet"}
      </h1>

      <p className="text-zinc-400 mt-2">
        Training Analytics Dashboard
      </p>
    </div>
  );
}

/* ======================
   LAYOUT
====================== */

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">

        <nav className="w-64 bg-zinc-900 p-5 space-y-4">
          <h1 className="text-xl font-bold">HOB Training</h1>

          <Link to="/">Dashboard</Link><br/>
          <Link to="/strength">Strength</Link><br/>
          <Link to="/leaderboard">Leaderboard</Link><br/>
          <Link to="/profile">Profile</Link>
        </nav>

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/strength" element={<Strength/>}/>
            <Route path="/leaderboard" element={<Leaderboard/>}/>
            <Route path="/profile" element={<Profile/>}/>
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

root.render(<App />);
