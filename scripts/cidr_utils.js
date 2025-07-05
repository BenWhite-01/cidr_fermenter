export function isValidIPv4(addr) {
    const ipv4Regex = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;
    return ipv4Regex.test(addr.trim())
}

export function isValidCidr(addr) {
    const cidrRegex = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}\/([0-9]|[12][0-9]|3[0-2])$/;
    return cidrRegex.test(addr.trim())
}