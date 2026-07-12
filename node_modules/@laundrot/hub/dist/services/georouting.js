"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haversineDistance = haversineDistance;
exports.findNearestBranch = findNearestBranch;
const branches_js_1 = require("../config/branches.js");
function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
function haversineDistance(a, b) {
    const R = 6371;
    const dLat = toRadians(b.latitude - a.latitude);
    const dLon = toRadians(b.longitude - a.longitude);
    const lat1 = toRadians(a.latitude);
    const lat2 = toRadians(b.latitude);
    const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return R * c;
}
async function findNearestBranch(customerCoords) {
    const branches = await (0, branches_js_1.getActiveBranches)();
    if (branches.length === 0)
        return null;
    let nearest = null;
    for (const branch of branches) {
        const distance_km = haversineDistance(customerCoords, {
            latitude: branch.latitude,
            longitude: branch.longitude,
        });
        if (!nearest || distance_km < nearest.distance_km) {
            nearest = { branch, distance_km };
        }
    }
    return nearest;
}
//# sourceMappingURL=georouting.js.map