# Memory

Frida agent for **Nulls Brawl** `v69.252` (iOS)

## Build

Compile JavaScript source into QuickJS bytecode:

```bash
npm install
npm run build 2
```

Outputs:
- `dist/agent_2.qbc` (QuickJS raw bytecode)
- `dist/agent_2.bin` (QuickJS binary bytecode)
- `dist/agent_2.js` (minified bundle)

## Launch

```bash
frida -U -l dist/agent_2.qbc -f <bundle-id>
```

## License

**MIT**, see `LICENSE`
