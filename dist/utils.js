"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApprovedSigner = void 0;
const nodejs_sdk_1 = require("@neynar/nodejs-sdk");
const v2_1 = require("@neynar/nodejs-sdk/build/neynar-api/v2");
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const config_1 = require("./config");
const SignedKeyRequestMetadata_1 = require("./abi/SignedKeyRequestMetadata");
const viemClient_1 = require("./viemClient");
const keyGateway_1 = require("./abi/keyGateway");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const getApprovedSigner = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Creating a new signer and obtaining its public key and UUID.
        const { public_key: signerPublicKey, signer_uuid } = {
            signer_uuid: "e856ffe4-d2a3-446f-b13a-fee18dcd11da",
            public_key: "0xa2b632184b5ad406d700da7cac61b203647d3964f923ab8afdf39cf816873680",
        };
        // Constants for the EIP-712 domain and request type, required for signing data.
        // DO NOT CHANGE ANY VALUES IN THESE CONSTANTS
        const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
            name: "Farcaster SignedKeyRequestValidator", // EIP-712 domain data for the SignedKeyRequestValidator.
            version: "1",
            chainId: 10,
            verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
        };
        // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
        const SIGNED_KEY_REQUEST_TYPE = [
            { name: "requestFid", type: "uint256" },
            { name: "key", type: "bytes" },
            { name: "deadline", type: "uint256" },
        ];
        // Convert mnemonic to an account object.
        const account = (0, accounts_1.mnemonicToAccount)(config_1.FARCASTER_BOT_MNEMONIC);
        // Lookup user details using the custody address.
        const { user: farcasterDeveloper } = yield config_1.neynarClient.lookupUserByCustodyAddress(account.address);
        console.log(`✅ Detected user with fid ${farcasterDeveloper.fid} and custody address: ${farcasterDeveloper.custody_address}`);
        // Generates an expiration date for the signature
        // e.g. 1693927665
        const deadline = Math.floor(Date.now() / 1000) + 864000; // signature is valid for 10 day from now
        // Signing the key request data.
        let signature = yield account.signTypedData({
            domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
            types: {
                SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
            },
            primaryType: "SignedKeyRequest",
            message: {
                requestFid: BigInt(farcasterDeveloper.fid),
                key: signerPublicKey,
                deadline: BigInt(deadline),
            },
        });
        // Encoding ABI parameters for the metadata.
        const metadata = (0, viem_1.encodeAbiParameters)(SignedKeyRequestMetadata_1.SignedKeyRequestMetadataABI.inputs, [
            {
                requestFid: BigInt(farcasterDeveloper.fid),
                requestSigner: account.address,
                signature: signature,
                deadline: BigInt(deadline),
            },
        ]);
        // Interacting with a blockchain contract to get a nonce value.
        const developerKeyGatewayNonce = yield viemClient_1.viemPublicClient.readContract({
            address: "0x00000000fc56947c7e7183f8ca4b62398caadf0b", // gateway address
            abi: keyGateway_1.keyGatewayAbi,
            functionName: "nonces",
            args: [farcasterDeveloper.custody_address],
        });
        // Additional EIP-712 domain and type definitions for the key gateway.
        const KEY_GATEWAY_EIP_712_DOMAIN = {
            name: "Farcaster KeyGateway",
            version: "1",
            chainId: 10,
            verifyingContract: "0x00000000fc56947c7e7183f8ca4b62398caadf0b",
        };
        // Signing data for the Add operation.
        const ADD_TYPE = [
            { name: "owner", type: "address" },
            { name: "keyType", type: "uint32" },
            { name: "key", type: "bytes" },
            { name: "metadataType", type: "uint8" },
            { name: "metadata", type: "bytes" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
        ];
        signature = yield account.signTypedData({
            domain: KEY_GATEWAY_EIP_712_DOMAIN,
            types: {
                Add: ADD_TYPE,
            },
            primaryType: "Add",
            message: {
                owner: account.address,
                keyType: 1,
                key: signerPublicKey,
                metadataType: 1,
                metadata: metadata,
                nonce: BigInt(developerKeyGatewayNonce),
                deadline: BigInt(deadline),
            },
        });
        // Logging instructions and values for the user to perform on-chain transactions.
        console.log("✅ Generated signer", "\n");
        console.log("In order to get an approved signer you need to do an on-chain transaction on OP mainnet. \nGo to Farcaster KeyGateway optimism explorer\nhttps://optimistic.etherscan.io/address/0x00000000fc56947c7e7183f8ca4b62398caadf0b#writeContract \n");
        console.log("Connect to Web3.\n\nNavigate to `addFor` function and add following values inside the respective placeholders.\n");
        console.log("fidOwner (address) :=> ", farcasterDeveloper.custody_address, "\n -");
        console.log("keyType (uint32) :=> ", 1, "\n -");
        console.log("key (bytes) :=> ", signerPublicKey, "\n -");
        console.log("metadataType (uint8) :=> ", 1, "\n -");
        console.log("metadata (bytes) :=> ", metadata, "\n -");
        console.log("deadline (uint256) :=> ", deadline, "\n -");
        console.log("sig (bytes) :=> ", signature, "\n -\n");
        console.log("We are polling for the signer to be approved. It will be approved once the onchain transaction is confirmed.");
        console.log("Checking for the status of signer...");
        // Polling for the signer status until it is approved.
        while (true) {
            const res = yield config_1.neynarClient.lookupSigner(signer_uuid);
            if (res && res.status === v2_1.SignerStatusEnum.Approved) {
                console.log("✅ Approved signer", signer_uuid);
                break;
            }
            console.log("Waiting for signer to be approved...");
            yield new Promise((r) => setTimeout(r, 5000));
        }
        console.log("✅ Transaction confirmed\n");
        console.log("✅ Approved signer", signer_uuid, "\n");
        // Once approved, appending the signer UUID to the .env file.
        appendSignerUuidAndUsernameToEnv(signer_uuid);
    }
    catch (err) {
        // Error handling, checking if it's an API response error.
        if ((0, nodejs_sdk_1.isApiErrorResponse)(err)) {
            console.log(err.response.data);
        }
        else
            console.log(err);
    }
});
exports.getApprovedSigner = getApprovedSigner;
const appendSignerUuidAndUsernameToEnv = (signer_uuid) => {
    // Resolving the path to the .env file.
    const envPath = path.resolve(__dirname, "../../.env");
    // Reading the .env file.
    fs.readFile(envPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading .env file:", err);
            return;
        }
        // Appending the SIGNER_UUID to the file content.
        const newContent = data + `\nSIGNER_UUID=${signer_uuid}`;
        // Writing the updated content back to the .env file.
        fs.writeFile(envPath, newContent, "utf8", (err) => {
            if (err) {
                console.error("Error writing to .env file:", err);
                return;
            }
            console.log("SIGNER_UUID appended to .env file.\nPlease run `yarn start` to continue.\n");
        });
    });
};
