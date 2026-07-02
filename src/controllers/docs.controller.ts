import { Request, Response } from "express";

import { swaggerDocument } from "../swagger/openapi";

/**
 * Serve the Swagger UI page and the OpenAPI JSON document for the API.
 * This keeps the documentation interactive and easy to browse in the browser.
 */
export class DocsController {
  /**
   * Return the Swagger UI HTML page that loads the OpenAPI spec.
   */
  getDocs = (_req: Request, res: Response) => {
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Inventory API Swagger</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #fafafa; }
      #swagger-ui { max-width: 1200px; margin: 0 auto; padding: 20px; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/api/docs/swagger.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis],
        });
      };
    </script>
  </body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  };

  /**
   * Expose the OpenAPI document as JSON for Swagger UI to load.
   */
  getSpec = (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(swaggerDocument);
  };
}
