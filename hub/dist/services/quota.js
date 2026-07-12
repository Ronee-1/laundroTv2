"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkQuota = checkQuota;
exports.generateDelayMessage = generateDelayMessage;
exports.getNextBusinessDay = getNextBusinessDay;
const branches_js_1 = require("../config/branches.js");
async function checkQuota(id_cabang) {
    const branch = await (0, branches_js_1.getBranchById)(id_cabang);
    if (!branch)
        return null;
    return {
        available: branch.kuota_terpakai < branch.kuota_harian,
        kuota_harian: branch.kuota_harian,
        kuota_terpakai: branch.kuota_terpakai,
        sisa_kuota: branch.kuota_harian - branch.kuota_terpakai,
    };
}
function generateDelayMessage(branch, rescheduleDate) {
    const tanggal = rescheduleDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return `Halo Kak! 👋

Mohon maaf, saat ini kuota penjemputan di ${branch.nama_cabang} sudah penuh untuk hari ini.

Kami telah menjadwalkan ulang penjemputan laundry Kakak pada:
📅 ${tanggal}

Tim kurir kami akan menghubungi Kakak kembali untuk konfirmasi jadwal.

Terima kasih atas kesabaran Kakak! 🙏

— Laundro Truck`;
}
function getNextBusinessDay() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    return tomorrow;
}
//# sourceMappingURL=quota.js.map