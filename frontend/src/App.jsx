import { use, useEffect } from "react";
import { useState } from "react";

function App() {
	const [todoTitle, setTodoTitle] = useState("");
	const [todoDesc, setTodoDesc] = useState("");
	const [todos, setTodos] = useState([]);

	const getTodos = async () => {
		try {
			const data = await fetch("http://localhost:8000/api/get-todos");
			const todos = await data.json();

			return todos;
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const todos = await getTodos();
				setTodos(todos);
			} catch (error) {
				console.error(error);
			}
		};

		fetchTodos();
	}, []);

	// Analyse the handleSubmit function below
	const handleSubmit = async (e) => {
		e.preventDefault();

		let newTodo = {
			title: todoTitle,
			description: todoDesc,
		};

		try {
			const data = await fetch("http://localhost:8000/api/add-todo", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newTodo),
			});

			const todos = await data.json();

			setTodos(todos);
		} catch (error) {
			console.error(error);
		}

		console.log("Clicked");
	};

	return (
		<div className="flex flex-row gap-5 mt-20 ml-32">
			<form
				className="border border-black p-5 rounded"
				onSubmit={handleSubmit}
			>
				<h1 className="text-xl font-semibold">Todo Form</h1>

				<div className="flex flex-col mt-2">
					<label htmlFor="item">Item</label>
					<input
						type="text"
						name="item"
						id="item"
						value={todoTitle}
						onChange={(e) => setTodoTitle(e.target.value)}
						className="border border-black focus:outline-none"
					/>
				</div>
				<div className="flex flex-col mt-2">
					<label htmlFor="description">Description</label>
					<input
						type="text"
						name="description"
						id="description"
						value={todoDesc}
						onChange={(e) => setTodoDesc(e.target.value)}
						className="border border-black focus:outline-none"
					/>
				</div>

				<button
					type="submit"
					className="bg-black text-white p-2 rounded mt-5 focus:bg-gray-800"
				>
					Submit
				</button>
			</form>

			<ul className="border border-black p-5 list-disc">
				<h2 className="text-xl font-semibold">Todos</h2>

				{todos?.map((todo) => (
					<li>
						<h1>{todo.title}</h1>
						<p>{todo.description}</p>
					</li>
				))}
				{/* <li>
					<h1>Task 1</h1>
					<p>Take out the trash</p>
				</li>
				<li>
					<h1>Task 2</h1>
					<p>Take out the trash</p>
				</li>
				<li>
					<h1>Task 3</h1>
					<p>Take out the trash</p>
				</li>
				<li>
					<h1>Task 4</h1>
					<p>Take out the trash</p>
				</li>
				<li>
					<h1>Task 5</h1>
					<p>Take out the trash</p>
				</li> */}
			</ul>
		</div>
	);
}

export default App;
