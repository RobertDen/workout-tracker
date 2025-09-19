CREATE TABLE workouts (
	id SERIAL PRIMARY key,
	user_id INT REFERENCES users(id) ON DELETE CASCADE,
	date DATE NOT NULL,
	duration_minutes INT,
	calories_burnt INT,
	created_at TIMESTAMP DEFAULT NOW()
);