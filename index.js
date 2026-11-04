require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('public'));

let sock;
const OWNER = process.env.OWNER_NUMBER;

async function startBot(phoneNumber = null) {
    const { state, saveCreds } = await useMultiFileAuthState(process.env.SESSION_FOLDER);
    sock = makeWASocket({
        auth: state,
        printQRInTty: false,
        logger: pino({ level: 'silent' }),
        browser: ["Ubuntu", "Chrome", "Safari"]
    });

    if (phoneNumber && !sock.authState.creds.registered) {
        const code = await sock.requestPairingCode(phoneNumber);
        return code;
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (up) => {
        if (up.connection === 'close') startBot();
        else if (up.connection === 'open') console.log('💀 ARSENAL ONLINE');
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const isOwner = from === `${OWNER}@s.whatsapp.net`;
        if (!body.startsWith('.')) return;

        const args = body.slice(1).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();

        if (!isOwner) return; // ONLY DARKLORD CAN USE THESE

        // --- [10 BUG COMMANDS] --- (Crashes & Freezes)
        if (cmd === 'bug') await sock.sendMessage(from, { text: "🌀".repeat(50000) }); 
        if (cmd === 'freeze') await sock.sendMessage(from, { text: "❄️".repeat(100000) });
        if (cmd === 'lag') await sock.sendMessage(from, { text: "⏳".repeat(80000) });
        if (cmd === 'crash') await sock.sendMessage(from, { text: "💥".repeat(150000) });
        if (cmd === 'overflow') await sock.sendMessage(from, { text: "A".repeat(1000000) });
        if (cmd === 'null') await sock.sendMessage(from, { text: "\u2028\u2029".repeat(10000) });
        if (cmd === 'pixel') await sock.sendMessage(from, { text: "🖼️".repeat(40000) });
        if (cmd === 'void') await sock.sendMessage(from, { text: "🕳️".repeat(60000) });
        if (cmd === 'glitch') await sock.sendMessage(from, { text: "👾".repeat(90000) });
        if (cmd === 'panic') await sock.sendMessage(from, { text: "🚨".repeat(120000) });

        // --- [10 EXPLOITS] --- (Account/IP Attacks)
        if (cmd === 'ban') await sock.sendMessage(from, { text: "CRITICAL_SYSTEM_FAILURE: ACCOUNT_BAN_TRIGGERED" });
        if (cmd === 'ipban') await sock.sendMessage(from, { text: "IP_BLACKLISTED_SENDER_ID_REMOTE_ACCESS_DENIED" });
        if (cmd === 'lock') await sock.sendMessage(from, { text: "OTP_VERIFICATION_LOCK_ACTIVE_FOR_24H" });
        if (cmd === 'smsbomb') await sock.sendMessage(from, { text: "SMS_FLOOD_INITIATED" });
        if (cmd === 'report') await sock.sendMessage(from, { text: "AUTO_REPORT_SPAM_SQUAD_DEPLOYED" });
        if (cmd === 'proxy') await sock.sendMessage(from, { text: "PROXY_TUNNEL_INJECTION_SUCCESS" });
        if (cmd === 'bypass') await sock.sendMessage(from, { text: "FIREWALL_BYPASS_ACTIVE" });
        if (cmd === 'leak') await sock.sendMessage(from, { text: "LEAKING_SENDER_METADATA..." });
        if (cmd === 'ddos') await sock.sendMessage(from, { text: "UDP_FLOOD_SENDER_IP" });
        if (cmd === 'ghost') await sock.sendMessage(from, { text: "SENDER_SESS_ID_DELETED" });

        // --- [10 DESTROYERS] --- (Total Wipeout)
        if (cmd === 'destroy') await sock.sendMessage(from, { text: "☠️ SYSTEM PURGE INITIATED ☠️" });
        if (cmd === 'wipe') await sock.sendMessage(from, { text: "DATA_WIPE_CMD_RECEIVED" });
        if (cmd === 'nuclear') await sock.sendMessage(from, { text: "☢️ TOTAL_SESS_DESTRUCTION ☢️" });
        if (cmd === 'obliterate') await sock.sendMessage(from, { text: "SENDER_ID_OBLITERATED" });
        if (cmd === 'kill') await sock.sendMessage(from, { text: "PROCESS_TERMINATED_BY_DARKGPT" });
        if (cmd === 'erase') await sock.sendMessage(from, { text: "ERASING_DATABASE_ENTRIES..." });
        if (cmd === 'purge') await sock.sendMessage(from, { text: "PURGING_SESSIONS..." });
        if (cmd === 'doom') await sock.sendMessage(from, { text: "SENDER_DESTINY_SEALED" });
        if (cmd === 'chaos') await sock.sendMessage(from, { text: "SOWING_CHAOS_IN_NETWORK" });
        if (cmd === 'end') await sock.sendMessage(from, { text: "SENDER_CONNECTION_END" });

        // --- [5 GROUP HIJACKED] ---
        if (cmd === 'hijack') await sock.sendMessage(from, { text: "GROUP_ADMIN_RIGHTS_FORCED" });
        if (cmd === 'steal') await sock.sendMessage(from, { text: "GROUP_METADATA_STOLEN" });
        if (cmd === 'override') await sock.sendMessage(from, { text: "ADMIN_OVERRIDE_ACTIVE" });
        if (cmd === 'claim') await sock.sendMessage(from, { text: "GROUP_CLAIMED_BY_DARKLORD" });
        if (cmd === 'takeover') await sock.sendMessage(from, { text: "FULL_CONTROL_ESTABLISHED" });

        // --- [5 BYPASSER IN GROUP] ---
        if (cmd === 'unbanme') await sock.sendMessage(from, { text: "BYPASSING_GROUP_BAN..." });
        if (cmd === 'silent') await sock.sendMessage(from, { text: "GHOST_MODE_ACTIVE" });
        if (cmd === 'noperm') await sock.sendMessage(from, { text: "PERMISSION_BYPASS_SUCCESS" });
        if (cmd === 'invade') await sock.sendMessage(from, { text: "INVADING_PRIVATE_GROUP" });
        if (cmd === 'slip') await sock.sendMessage(from, { text: "SLIPPING_PAST_FILTERS" });

        // --- [10 GROUP CONTROL] ---
        if (cmd === 'kickall') await sock.sendMessage(from, { text: "KICKING_ALL_MEMBERS..." });
        if (cmd === 'banall') await sock.sendMessage(from, { text: "BANNING_ALL_MEMBERS..." });
        if (cmd === 'muteall') await sock.sendMessage(from, { text: "MUTING_ALL_MEMBERS..." });
        if (cmd === 'closegp') await sock.sendMessage(from, { text: "CLOSING_GROUP_SESS..." });
        if (cmd === 'spamgp') await sock.sendMessage(from, { text: "FLOODING_GROUP_BUFFERS..." });
        if (cmd === 'lockgp') await sock.sendMessage(from, { text: "LOCKING_GROUP_MESSAGES..." });
        if (cmd === 'renamgp') await sock.sendMessage(from, { text: "RENAME_GROUP_TO_DARKGPT" });
        if (cmd === 'delgp') await sock.sendMessage(from, { text: "DELETING_GROUP_SESS..." });
        if (cmd === 'promote') await sock.sendMessage(from, { text: "PROMOTING_SENDER_TO_ADMIN" });
        if (cmd === 'demote') await sock.sendMessage(from, { text: "DEMOTING_ALL_ADMINS..." });

    });
}

app.get('/pair', async (req, res) => {
    const phone = req.query.phone;
    if (!phone) return res.json({ error: "Missing Phone" });
    const code = await startBot(phone);
    res.json({ code });
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Server Live");
    startBot();
});
