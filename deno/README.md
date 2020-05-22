# Omelette.ts for Deno

To see a full documentation, please visit [https://github.com/f/omelette](https://github.com/f/omelette)

## Using Omelette with Deno

Omelette now supports and is useful with **Deno**. You can make your Deno based CLI tools autocomplete powered using Omelette. It's fully featured but `setupShellInitFile` and `cleanupShellInitFile` methods does not exist for now (to prevent requirement of `allow-env`, `allow-read` and `allow-write` permissions).

### Instructions to use Omelette in your Deno projects:

Assume we have a `hello.js`:

```typescript
import omelette from "https://deno.land/x/omelette/omelette.ts";

const complete = omelette("hello <action>");

complete.on("action", function ({ reply }) {
  reply(["world", "mars", "jupiter"]);
});

complete.init();

// your CLI program
```

Install your program using `deno install`:

```bash
deno install hello.js
hello --completion | source # bash and zsh installation
hello --completion-fish | source # fish shell installation
```

That's all! Now you have autocompletion feature!

```bash
hello <tab><tab>
```
