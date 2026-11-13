# Memory

Frida agent for **Nulls Brawl** `v69.252` (iOS)

## Install

```bash
npm install frida-compile
npx frida-compile src/index.js -o dist/agent_1.js -c -S
```

## Launch

```bash
frida -U -l dist/agent_1.js -f <bundle-id>
```

## License

**MIT**, see `LICENSE`
