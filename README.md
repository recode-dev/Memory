# Memory

Frida agent for **Nulls Brawl** `v69.252` (iOS)

## Install

```
npm install frida-compile
npx frida-compile src/index.js -o dist/agent.js --bundle-format iife
```

## Launch

```
frida -U -l dist/agent.js -f <bundle-id>
```

## License

**MIT**, see `LICENSE`