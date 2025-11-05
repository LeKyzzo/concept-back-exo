import express from "express";

const swaggerUi = require('swagger-ui-express');
import swaggerSpec from './swagger';

const app = express();
// Support JSON request bodies
app.use(express.json());

/**
 * @openapi
 * /hello:
 *   get:
 *     summary: Retourne un message de salutation
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Nom optionnel pour personnaliser le message
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bonjour, Alice !"
 */
app.get("/hello", (req, res) => {
	const rawName = (req.query && (req.query as any).name) || null;
	const name = rawName ? String(rawName) : null;
	if (name) {
		return res.json({ message: `Bonjour, ${name} !` });
	}
	return res.json({ message: "Bonjour, monde !" });
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Récupère les informations d'un utilisateur donné son identifiant. Nécessite un token Bearer.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Identifiant de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Objet utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "123"
 *               name: "Alice"
 *               email: "alice@example.com"
 *       '401':
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               code: 401
 *               message: Unauthorized
 *               details: Missing or invalid Authorization header
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               code: 404
 *               message: User not found
 *               details: No user with id 0
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/users/:id', (req, res) => {
	const id = String(req.params.id || '');
	// Simple Authorization check: require header 'Authorization: Bearer <token>' (no validation of token)
	const auth = req.header('authorization') || req.header('Authorization');
	if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
		return res.status(401).json({ code: 401, message: 'Unauthorized', details: 'Missing or invalid Authorization header' });
	}
	// Demo: return 404 for id === '0' to illustrate error responses
	if (id === '0') {
		return res.status(404).json({ code: 404, message: 'User not found', details: `No user with id ${id}` });
	}
	return res.json({ id });
});

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create user
 *     description: Crée un nouvel utilisateur à partir d'un nom et d'un email. Retourne l'utilisateur créé avec son identifiant.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *           example:
 *             name: "Bob"
 *             email: "bob@example.com"
 *     responses:
 *       '201':
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "1762336349302"
 *               name: "Bob"
 *               email: "bob@example.com"
 */
app.post('/users', (req, res) => {
	const body = req.body as Partial<{ name: string; email: string }> | undefined;
	const name = body?.name ?? '';
	const email = body?.email ?? '';
	// Simple creation: generate an id
	const id = String(Date.now());
	const user = { id, name, email };
	return res.status(201).json(user);
});

// Expose the raw swagger JSON so we can inspect /hello programmatically
app.get('/docs/swagger.json', (_req, res) => res.json(swaggerSpec));

// Also expose the OpenAPI JSON at /openapi.json (useful for ReDoc and external tools)
app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));

// Serve a simple ReDoc-based read-only documentation page
app.get('/redoc', (_req, res) => {
	res.sendFile(require('path').resolve(__dirname, 'redoc.html'));
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT ?? 3000;
app.listen(Number(port), () => console.log(`Server listening on http://localhost:${port}/hello and /docs`));