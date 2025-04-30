import http from "http";
import fs from "fs";
import url from "url";
import path from "path";
import { styleText } from "util";

const PORT = 8000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const methodColors = {
	GET: "green",
	POST: "blue",
	PUT: "yellow",
	DELETE: "red",
	OPTIONS: "magenta",
};

let jsonData = fs.readFileSync(path.join(__dirname, "todos.json"), "utf-8");
let todos = JSON.parse(jsonData);

const logger = (req, res, next) => {
	console.log(
		styleText(methodColors[req.method], `${req.method} ${req.url}`)
	);

	next();
};

const server = http.createServer(async (req, res) => {
	logger(req, res, () => {
		const headers = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
			"Access-Control-Allow-Headers": "Content-Type",
			"Content-Type": "application/json",
		};

		// Handling preflight requests
		if (req.method === "OPTIONS") {
			res.writeHead(204, headers);
			res.end();
			return;
		}

		if (req.url === "/api/get-todos" && req.method === "GET") {
			res.writeHead(200, headers);
			res.end(JSON.stringify(todos));
		} else if (req.url === "/api/add-todo" && req.method === "POST") {
			let body = "";

			req.on("data", (chunk) => {
				body += chunk.toString();
			});

			req.on("end", () => {
				try {
					const newTodo = JSON.parse(body);
					todos.push(newTodo);

					fs.writeFileSync(
						path.join(__dirname, "todos.json"),
						JSON.stringify(todos),
						"utf-8"
					);

					res.writeHead(201, headers);
					res.end(JSON.stringify(todos));
				} catch (error) {
					res.writeHead(400, headers);
					res.end(JSON.stringify({ error: "Invalid JSON data" }));
				}
			});
		} else {
			// Handle 404
			res.writeHead(404, headers);
			res.end(JSON.stringify({ error: "Route not found" }));
		}
	});
});

server.listen(PORT, () => {
	console.log("Server listening at port " + PORT);
});
