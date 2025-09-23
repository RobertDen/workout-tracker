import { useEffect, useState } from "react";

//TypeScript type, helps TypeScript know what data we're expecting from the backend
interface Workout {
  id: number;
  user_name: string;
  user_email: string;
  date: string;
  duration_minutes: number;
  calories_burnt: number;
}

function Workouts() {
  //React states
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //useEffect runs code when the component mounts (loads for the first time)
  useEffect(() => {
      //async function to fetch workouts from backend
      const fetchWorkouts = async() => {
        try {
          const res = await fetch("http://localhost:5000/workouts");

          //throw an error if server responds with one
          if (!res.ok) {
            throw new Error("Failed to fetch workouts");
          }

          //Parse the response as JSON
          const data = await res.json();

          //Save the data in state for React to render it
          setWorkouts(data);
        } catch (err: any) {
          //If error happens, save to error state
          setError(err.message || "Unknown error");
        } finally {
          //Regardless of what happens, stop showing loading
          setLoading(false);
        }
      };

      //Call the async function to fetch workouts
      fetchWorkouts();
  }, []); //Empty dependency array means this only runs only once the component mounts

  //Show a loading message while fetching
  if (loading) return <p>Loading workouts...</p>;

  //Show an error message if one occurs
  if (error) return <p>Error: {error}</p>;

  //Render the list of workouts
  return (
    <div>
      <h1>Workouts</h1>
      <ul>
        {/*Map through the workouts array and display each workout */}
        {workouts.map((w) => (
          <li key={w.id}>
            {/* Show user name, email, date, duration, and calories */}
            <strong>{w.user_name}</strong> ({w.user_email}) - {w.date}: {w.duration_minutes} min, {w.calories_burnt} cal
          </li>
        ))}
      </ul>
    </div>
  );
}

//Export the component to be used by React
export default Workouts;