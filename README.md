```
$ attach --process pablo.exe
scanning... found.
```

## pablo

owner and cheat creator at [Dusk Cheats](https://fakecrime.bio/CrPablo). i take games apart to see what's underneath, then I build tools out of the pieces.

trainers, memory editors, aimbots, triggerbots, injectors — if a process is running, there's a way in. i find it, then I write something clean enough to ship.

### how i work

most of what I do starts the same way: figure out what the game actually is before touching it.

```
identify runtime  →  map memory  →  hook  →  build feature  →  ship
```

**unity** games get BepInEx or MelonLoader, Harmony for the patches, dnSpy when I need to read the IL directly. **unreal** means dumping the SDK and walking GObjects by hand. **source** games are netvars and signature scanning. **minecraft** is Fabric or Forge mixins, sometimes raw ASM when the loader gets in the way.

underneath all of that it's the same handful of moves — AOB scanning, pointer chains, VMT swaps, manual mapping when LoadLibrary won't do. the game changes, the technique mostly doesn't.

on macOS (what I actually run) none of the Windows playbook applies — it's LLDB and `mach_vm_read`/`mach_vm_write`, Frida when I need something more dynamic. Windows-only titles get a VM or CrossOver and I say so before I promise something that won't run.

### tools i reach for

Cheat Engine, x64dbg, Ghidra, Frida, ReClass.NET, HxD, Wireshark when the cheat has to talk to a server too.

### elsewhere

[fakecrime.bio/CrPablo](https://fakecrime.bio/CrPablo)
