import { bold, yellow } from "std/fmt/colors";
import { oakCors } from "cors";
import { Application, Router } from "oak";

import { ulid } from "ulid";
import { nanoid } from "nanoid";

const app = new Application();
const router = new Router();
router.get("/docs/:id", async (context) => {
  const pageId = context.params["id"];

  context.response.body = {
    pageId: pageId,
    latestCommitId: ulid(),
    lines: [
      { lineId: nanoid(16), text: "こんにちは" },
      { lineId: nanoid(16), text: "さようなら" },
    ],
  };
});

router.get("/page/:id/edit", async (context) => {
  const ws = await context.upgrade();
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.addEventListener("listen", ({ hostname, port, serverType }) => {
  console.log(bold(`Start listening on: ${yellow(`${hostname}:${port}`)}`));
  console.log(bold(`using HTTP server: ${yellow(serverType)}`));
});

await app.listen({
  port: parseInt(Deno.env.get("PORT") || "8000", 10),
});
console.log(bold("Finished."));
