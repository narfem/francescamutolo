# 🖥️ Guida all'uso di Tauri per l'App Desktop

Questo progetto è stato preparato ed equipaggiato con tutta la struttura di cartelle e file necessari per essere compilato come applicazione desktop nativa (Windows, macOS, Linux) utilizzando **Tauri**.

---

## 🏗️ Struttura dei File Generati

La configurazione Tauri si trova all'interno della cartella `/src-tauri` (mantenendo la struttura standard del progetto):
1. **`src-tauri/tauri.conf.json`**: Configurazione delle finestre desktop, del bundle e dei percorsi di build.
2. **`src-tauri/Cargo.toml`**: Gestione dei metadati e delle dipendenze Rust.
3. **`src-tauri/build.rs`**: Script di build pre-compilazione di Tauri.
4. **`src-tauri/src/main.rs`**: Entry-point del backend nativo scritto in Rust.
5. **`src-tauri/icons/icon.png`**: Icona nativa ad alta definizione estratta direttamente dal logo aziendale.

Inoltre, il file `package.json` è stato aggiornato con il comando `"tauri": "tauri"` e la dipendenza di sviluppo `@tauri-apps/cli`.

---

## 🛠️ Prerequisiti di Sistema

Per compilare ed eseguire l'applicazione nativa sul tuo computer locale, devi assicurarti che sul tuo sistema sia installato l'ambiente Rust:

1. **Installa Rust**:
   - Esegui nel terminale (macOS/Linux):
     ```bash
     curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
     ```
   - Su Windows, scarica ed esegui l'installer ufficiale da [rustup.rs](https://rustup.rs/).

2. **Dipendenze di Sistema**:
   - **macOS**: Installa Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```
   - **Linux (Ubuntu/Debian)**: Installa le librerie per WebKit2GTK:
     ```bash
     sudo apt update
     sudo apt install -y libsoup-3.0-dev pkg-config build-essential libwebkit2gtk-4.1-dev libglib2.0-dev libgtk-3-dev libappindicator3-dev lsof clang libssl-dev
     ```
   - **Windows**: Installa [C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) tramite l'installer di Visual Studio.

---

## 🚀 Come Eseguire e Compilare l'Applicazione

Una volta installato Rust e clonato questo progetto sul tuo computer locale, puoi utilizzare i seguenti comandi npm:

### 1. Avviare l'App Desktop in Sviluppo
Avvia il server di sviluppo Express+Vite e apre l'applicazione desktop nativa con Hot Module Replacement (HMR):
```bash
npm run tauri dev
```

### 2. Creare il Pacchetto di Produzione (Build Desktop)
Compila l'interfaccia frontend statica in `/dist` e produce l'eseguibile nativo (es. `.msi`/`.exe` su Windows, `.app`/`.dmg` su macOS, o `.deb` su Linux):
```bash
npm run tauri build
```
I file compilati di installazione verranno generati e salvati automaticamente nella cartella:
`src-tauri/target/release/bundle/`

---

## 🌐 Gestione del Backend Express (`/api/contact`)

Questo portfolio include un server backend Express (`server.ts`) per gestire i moduli di contatto (`/api/contact`). All'interno di un'app desktop nativa (Tauri), il frontend viene caricato come app client-side statica (SPA) in locale.

Per far funzionare correttamente l'invio dei contatti dall'app desktop, hai due approcci principali:

### Opzione A: Backend Remoto (Raccomandato per Produzione)
Se hai distribuito il backend Express su una piattaforma cloud (come Google Cloud Run, Heroku, VPS o Vercel), puoi far puntare il client a tale API remota:
1. Imposta la variabile d'ambiente `VITE_API_URL` nella configurazione o modifica l'URL di fetch in `ContactSection.tsx` inserendo l'indirizzo assoluto del tuo server cloud (es: `https://tuo-dominio.com/api/contact`).
2. Assicurati che CORS sia configurato per accettare richieste provenienti dallo schema nativo di Tauri (`tauri://localhost` su Windows/macOS o `http://tauri.localhost` su Linux).

### Opzione B: Backend Locale (Per Sviluppo o Solo Uso Locale)
In fase di sviluppo, `npm run tauri dev` avvia automaticamente il server Express locale sulla porta `3000`. Tauri visualizza la pagina agganciandosi a `http://localhost:3000`, quindi le chiamate relative `/api/contact` continueranno a funzionare localmente sul tuo computer senza modifiche.
