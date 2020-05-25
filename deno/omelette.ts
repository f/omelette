import { EventEmitter } from "https://deno.land/std@0.53.0/node/events.ts";
import * as path from "https://deno.land/std@0.53.0/path/mod.ts";
const hasProp = {}.hasOwnProperty;

function depthOf(object: any) {
  let key: any, depth: number, level: number;
  level = 1;
  for (let key in object) {
    if (!hasProp.call(object, key)) continue;
    if (typeof object[key] === "object") {
      depth = depthOf(object[key]) + 1;
      level = Math.max(depth, level);
    }
  }
  return level;
}

class Omelette extends EventEmitter {
  asyncs: number;
  compgen: number;
  install: boolean;
  installFish: boolean;
  isDebug: boolean;
  word: string | undefined;
  mainProgram: Function;
  programs: string[] = [];
  program: string = "";
  shell: string = "";

  fragments: string[] = [];
  fragment: number;
  line: string;

  constructor() {
    super();
    // let isFish: boolean, isZsh: boolean, ref: string;
    let isZsh: boolean, ref: string;
    this.asyncs = 0;
    this.compgen = Deno.args.indexOf("--compgen");
    this.install = Deno.args.indexOf("--completion") > -1;
    this.installFish = Deno.args.indexOf("--completion-fish") > -1;
    isZsh = Deno.args.indexOf("--compzsh") > -1;
    // isFish = Deno.args.indexOf("--compfish") > -1;
    this.isDebug = Deno.args.indexOf("--debug") > -1;
    this.fragment = parseInt(Deno.args[this.compgen + 1]) -
      (isZsh ? 1 : 0);
    this.line = Deno.args.slice(this.compgen + 3).join(" ");
    this.word = (ref = this.line) != null
      ? ref.trim().split(/\s+/).pop()
      : void 0;
    this.mainProgram = function () {};
  }

  setProgram(programs: string) {
    const splittedPrograms: string[] = programs.split("|");
    this.program = splittedPrograms[0];
    return this.programs = splittedPrograms.map(function (program: string) {
      return program.replace(/[^A-Za-z0-9\.\_\-]/g, "");
      // Do not allow except:
      // .. uppercase
      // .. lowercase
      // .. numbers
      // .. dots
      // .. underscores
      // .. dashes
    });
  }

  setFragments(...fragments1: any[]) {
    this.fragments = fragments1;
  }

  generate() {
    let data: Object = {
      before: this.word,
      fragment: this.fragment,
      line: this.line,
      reply: this.reply,
    };
    this.emit("complete", this.fragments[this.fragment - 1], data);
    this.emit(this.fragments[this.fragment - 1], data);
    this.emit(`$${this.fragment}`, data);
    if (this.asyncs === 0) {
      return Deno.exit();
    }
  }

  reply(words: string[] = []) {
    let writer = function (options: any) {
      console.log(
        typeof options.join === "function" ? options.join("\n") : void 0,
      );
      return Deno.exit();
    };
    if (words instanceof Promise) {
      return words.then(writer);
    } else {
      return writer(words);
    }
  }

  next(handler: Function | undefined) {
    if (typeof handler === "function") {
      return this.mainProgram = handler;
    }
  }

  tree(objectTree = {}) {
    let depth, i, level, ref;
    depth = depthOf(objectTree);
    for (
      level = i = 1, ref = depth;
      (1 <= ref ? i <= ref : i >= ref);
      level = 1 <= ref ? ++i : --i
    ) {
      this.on(
        `$${level}`,
        function (
          { fragment, reply, line }: {
            fragment: number;
            reply: Function;
            line: string;
          },
        ) {
          let accessor, lastIndex: number, replies: string[];
          if (!(/\s+/.test(line.slice(-1)))) {
            lastIndex = -1;
          }
          accessor = (t: any) =>
            line.split(/\s+/).slice(1, lastIndex).filter(Boolean).reduce(
              (a: any, v: any) => a[v],
              t,
            );
          replies = fragment === 1
            ? Object.keys(objectTree)
            : accessor(objectTree);
          return reply((function (replies: any) {
            if (replies instanceof Function) {
              return replies();
            }
            if (replies instanceof Array) {
              return replies;
            }
            if (replies instanceof Object) {
              return Object.keys(replies);
            }
          })(replies));
        },
      );
    }
    return this;
  }

  generateCompletionCode() {
    let completions = this.programs.map((program: string) => {
      let completion;
      completion = `_${program}_completion`;
      return `### ${program} completion - begin. generated by omelette.js ###\nif type compdef &>/dev/null; then\n  ${completion}() {\n    compadd -- \`${this.program} --compzsh --compgen "\${CURRENT}" "\${words[CURRENT-1]}" "\${BUFFER}"\`\n  }\n  compdef ${completion} ${program}\nelif type complete &>/dev/null; then\n  ${completion}() {\n    local cur prev nb_colon\n    _get_comp_words_by_ref -n : cur prev\n    nb_colon=$(grep -o ":" <<< "$COMP_LINE" | wc -l)\n\n    COMPREPLY=( $(compgen -W '$(${this.program} --compbash --compgen "$((COMP_CWORD - (nb_colon * 2)))" "$prev" "\${COMP_LINE}")' -- "$cur") )\n\n    __ltrim_colon_completions "$cur"\n  }\n  complete -F ${completion} ${program}\nfi\n### ${program} completion - end ###`;
    });
    if (this.isDebug) {
      // Adding aliases for testing purposes
      completions.push(this.generateTestAliases());
    }
    return completions.join("\n");
  }

  generateCompletionCodeFish() {
    let completions = this.programs.map((program: string) => {
      let completion;
      completion = `_${program}_completion`;
      return `### ${program} completion - begin. generated by omelette.js ###\nfunction ${completion}\n  ${this.program} --compfish --compgen (count (commandline -poc)) (commandline -pt) (commandline -pb)\nend\ncomplete -f -c ${program} -a '(${completion})'\n### ${program} completion - end ###`;
    });
    if (this.isDebug) {
      // Adding aliases for testing purposes
      completions.push(this.generateTestAliases());
    }
    return completions.join("\n");
  }

  generateTestAliases() {
    let debugAliases: string, debugUnaliases: string, fullPath: string;
    fullPath = path.join(Deno.cwd(), this.program);
    debugAliases = this.programs.map(function (program: string) {
      return `  alias ${program}=${fullPath}`;
    }).join("\n");
    debugUnaliases = this.programs.map(function (program: string) {
      return `  unalias ${program}`;
    }).join("\n");
    return `### test method ###\nomelette-debug-${this.program}() {\n${debugAliases}\n}\nomelette-nodebug-${this.program}() {\n${debugUnaliases}\n}\n### tests ###`;
  }

  checkInstall() {
    if (this.install) {
      console.log(this.generateCompletionCode());
      Deno.exit();
    }
    if (this.installFish) {
      console.log(this.generateCompletionCodeFish());
      return Deno.exit();
    }
  }

  init() {
    if (this.compgen > -1) {
      return this.generate();
    } else {
      return this.mainProgram();
    }
  }

  onAsync(event: string, handler: Function) {
    super.on(event, handler);
    return this.asyncs += 1;
  }
}

function omelette(template: any, ...args: any[]) {
  let program: string, callbacks: any[], fragments: string[];
  if (template instanceof Array && args.length > 0) {
    [program, callbacks] = [template[0].trim(), args];
    fragments = callbacks.map(function (callback, index) {
      return `arg${index}`;
    });
  } else {
    [program, ...fragments] = template.split(/\s+/);
    callbacks = [];
  }
  fragments = fragments.map(function (fragment) {
    return fragment.replace(/^\<+|\>+$/g, "");
  });
  const om = new Omelette();
  om.setProgram(program);
  om.setFragments(...fragments);
  om.checkInstall();
  let callback: any;
  let fragment: string;
  for (let i, index = i = 0, len = callbacks.length; i < len; index = ++i) {
    callback = callbacks[index];
    fragment = `arg${index}`;
    (function (callback) {
      return om.on(fragment, function (...args: any) {
        return om.reply(
          callback instanceof Array ? callback : callback(...args),
        );
      });
    })(callback);
  }
  return om;
}

export default omelette;
