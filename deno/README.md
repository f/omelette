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
hello --completion-fish | source # i'm using fish
```

### Instructions for your README files:

*(You should add these instructions to your project's README, don't forget to replace `hello` string with your own executable name)*

In **zsh**, you should write these:

```bash
echo '. <(hello --completion)' >> ~/.zshrc
```

In **bash**:

```bash
hello --completion >> ~/.config/hello.completion.sh
echo 'source ~/.config/hello.completion.sh' >> ~/.bash_profile
```

In **fish**:

```bash
echo 'hello --completion-fish | source' >> ~/.config/fish/config.fish
```

---

That's all! Now you have autocompletion feature!

```bash
hello <tab><tab>
```
