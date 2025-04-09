import http from "http";
import fs from "fs";
import url from "url";
import path from "path";

const PORT = 8000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let jsonData = fs.readFileSync(path.join(__dirname, "todos.json"), "utf-8");
let todos = JSON.parse(jsonData);

const logger = (req, res, next) => {
	console.log(`${req.method} ${req.url}`);

	next();
};

const server = http.createServer(async (req, res) => {
	logger(req, res, () => {
		const headers = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
			"Access-Control-Allow-Headers": "Content-Type",
		};

		// Handling preflight requests
		if (req.method === "OPTUONS") {
			res.writeHead(204, headers, "Preflight approved");
			res.end();
			return;
		}

		// Adds CORS headers
		res.writeHead(200, headers);

		if (req.url === "/api/get-todos" && req.method === "GET") {
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(todos));
		} else if (req.url === "/api/add-todo" && req.method === "POST") {
			let body = "";

			req.on("data", (chunk) => {
				body += chunk.toString();
			});

			req.on("end", () => {
				const newTodo = JSON.parse(body);
				todos.push(newTodo);

				fs.writeFileSync(
					path.join(__dirname, "todos.json"),
					JSON.stringify(todos),
					"utf-8"
				);

				res.statusCode = 201;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(todos));
			});
		}
	});
});

server.listen(PORT, () => {
	console.log("Server listening at port " + PORT);
});
