"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viemPublicClient = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
exports.viemPublicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.optimism,
    transport: (0, viem_1.http)(),
});
