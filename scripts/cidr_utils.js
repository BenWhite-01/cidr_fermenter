export function isValidCidrOrIpv4(addr) {
    const matcher = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}(\/([0-9]|[12][0-9]|3[0-2]))?$/;
    addr = addr.replace(/\s/g,'') //remove all whitespace
    // console.debug('Whitespace removed: ' + addr)
    // console.debug(`isValidCidrOrIpv4 returning ${addr && true} && ${matcher.test(addr)}`)
    return addr && matcher.test(addr);
}