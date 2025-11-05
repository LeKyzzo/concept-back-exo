import express from "express";

const swaggerUi = require('swagger-ui-express');
import swaggerSpec from './swagger';

const app = express();

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
 *     summary: Récupère un utilisateur par ID
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
 */
app.get('/users/:id', (req, res) => {
  const id = String(req.params.id || '');
  return res.json({ id });
});

// Expose the raw swagger JSON so we can inspect /hello programmatically
app.get('/docs/swagger.json', (_req, res) => res.json(swaggerSpec));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT ?? 3000;
app.listen(Number(port), () => console.log(`Server listening on http://localhost:${port}/hello and /docs`));