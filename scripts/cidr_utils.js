export const matcher = /^(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})(?:\/(3[0-2]|[12]?\d))?$/;

export class Cidr {
    // Attributes
    #base = 0;
    #mask;
    bytes;
    prefix;
    bits;

    constructor(input = '0.0.0.0/0') {
        input = input.replace(/\s/g, ''); // Strip whitespace

        const match = input.match(matcher);
        if (!match) {
            throw new Error(`Invalid CIDR format: "${input}"`);
        }

        const [, o1, o2, o3, o4, prefix] = match;
        this.bytes = [o1, o2, o3, o4].map(Number);
        this.prefix = prefix !== undefined ? Number(prefix) : 0;
        this.#mask = ~(-1 >>> this.prefix)
        this.bits = this.bytes.map((byte,i) => {
            this.#base = this.#base | byte << 8*(3-i)
            return byte.toString(2).padStart(8, '0').split('').map(bit => parseInt(bit))
        })

        console.log("Cidr class created")
        Object.freeze(this);
    }

    networkBit(byte, bit) {
        return (byte*8 + bit < this.prefix)
    }

    #binToString(bin) {
        return [24, 16, 8, 0].map(i => {
            return 255 & (bin >>> i)
        }).join('.')
    }
    
    get network_ip() {  // All host bits set to 0
        return this.#binToString(this.#base & this.#mask)
    }

    get first_usable_ip() {
        return this.#binToString((this.#base & this.#mask) + 1)
    }

    get broadcast_ip() {  // All host bits set to 1
        return this.#binToString(this.#base | ~this.#mask)
    }

    get last_usable_ip() {
        return this.#binToString((this.#base | ~this.#mask) - 1)
    }

    get count_ips() {
        if (this.prefix == 32)
            return 1
        return -1 >>> this.prefix
    }

    get mask() {
        return this.#binToString(this.#mask)
    }
}