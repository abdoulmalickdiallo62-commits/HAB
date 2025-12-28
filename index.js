// index.js - HAB Abdoul
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@adiwajshing/baileys");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");

// Charger le préfixe depuis les variables d'environnement
const PREFIX = process.env.PREFIXE || "😎";
const OWNER = process.env.NOM_OWNER || "Abdoul";

// Variables pour IA
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// Fonction principale
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");

    const { version, isLatest } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        version,
        printQRInTerminal: true,
        auth: state
    });

    // Sauvegarde automatique de la session
    sock.ev.on("creds.update", saveCreds);

    // Gestion des messages entrants
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        // Vérifier le préfixe
        if (!text.startsWith(PREFIX)) return;

        const args = text.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // Commandes simples
        if (command === "ping") {
            await sock.sendMessage(msg.key.remoteJid, { text: "Pong!" });
        } else if (command === "help") {
            await sock.sendMessage(msg.key.remoteJid, { text: `Salut! Commandes disponibles:\n${PREFIX}ping\n${PREFIX}help\n${PREFIX}ask\n${PREFIX}cours` });
        }

        // Commandes IA (placeholder)
        else if (command === "ask") {
            const question = args.join(" ");
            await sock.sendMessage(msg.key.remoteJid, { text: `🤖 IA : Réponse en cours pour : "${question}" (à implémenter)` });
        } else if (command === "cours") {
            const sujet = args.join(" ");
            await sock.sendMessage(msg.key.remoteJid, { text: `📚 Cours L1 : ${sujet} (à implémenter)` });
        }
    });

    console.log(`HAB Abdoul est en ligne!`);
}

// Démarrer le bot
startBot();
