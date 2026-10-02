const settings = require('../settings');

async function isOwnerOrSudo(senderId, sock = null, chatId = null) {
    const ownerNumberClean = String(settings.ownerNumber).split(':')[0].split('@')[0].replace(/[^0-9]/g, '');
    const senderIdClean = String(senderId).split(':')[0].split('@')[0].replace(/[^0-9]/g, '');

    console.log(`[DEBUG OWNER] senderId=${senderId} clean=${senderIdClean} owner=${ownerNumberClean}`);

    // 1. Match last 10 digits - handles 234 vs 0, :xx suffix, etc.
    if (senderIdClean.length > 5 && ownerNumberClean.length > 5) {
        if (senderIdClean.slice(-10) === ownerNumberClean.slice(-10)) {
            return true;
        }
    }

    // 2. Direct JID match
    if (senderId === ownerNumberClean + "@s.whatsapp.net") {
        return true;
    }

    // 3. Sudo check - safe require to avoid circular import crash
    try {
        const { isSudo } = require('./index');
        if (await isSudo(senderId)) return true;
    } catch (e) {
        // ignore
    }

    return false;
}

module.exports = isOwnerOrSudo;
