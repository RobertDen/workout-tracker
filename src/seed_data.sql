SELECT
	u.name,
	u.email,
	w.date,
	w.duration_minutes,
	w.calories_burnt
FROM workouts w
JOIN users u ON w.user_id = u.id;