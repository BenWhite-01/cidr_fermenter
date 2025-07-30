// --- Functions --- //

/*
  TEMPORARY - to be completed
  Render the popup window ui given a cidr value
*/
function renderCidr(cidr) {
  // if (!isValidCidrOrIpv4(cidr)) {
  //   throw new Error(`Cannot update page data with invalid cidr address ('${cidr}')`);
  // }

  cidr = cidr.split('/')
  let cidr_bytes = cidr[0].split('.')
  let mask = cidr[1] ? Number(cidr[1]) : 0

  // console.log(cidr)
  // console.log(cidr_bytes)
  // console.log(mask)

  for (let i = 0; i < 4; ++i) {
    // console.log(`cidr-byte-${i} = ${cidr_bytes[i]}`);
    // Render cidr byte value
    document.getElementById(`cidr-byte-${i}`).setAttribute('value', cidr_bytes[i])
    // console.log(Number(cidr_bytes[i]).toString(2).padStart(8, "0"))

    // Render cidr bit values for byte i
    let j = 0;
    for (const bit of Number(cidr_bytes[i]).toString(2).padStart(8, "0")) {
      let element = document.getElementById(`cidr-bit-${i}-${j}`)
      element.innerHTML = bit
      if (i*8+j < mask) {
        // console.log(`  cidr-bit-${i}-${j} = ${bit}`);
        element.style.backgroundColor = null
      }
      else {
        // console.log(` *cidr-bit-${i}-${j} = ${bit}`);
        element.style.backgroundColor = "var(--col-5)"
        element.style.color = "var(--col-4)"
        element.style.fontStyle = "italic"
      }
      ++j;
    }
  }

  // Update cidr-byte-4 with value of mask
  document.getElementById("cidr-byte-4").setAttribute('value', mask)

  // Update detail values
  document.getElementById("base-ip").innerHTML = cidr_bytes.join('-')
  document.getElementById("first-usable-ip").innerHTML = cidr_bytes.join('-')
  document.getElementById("last-usable-ip").innerHTML = cidr_bytes.join('-')
  document.getElementById("broadcast-ip").innerHTML = cidr_bytes.join('-')
  document.getElementById("count-ips").innerHTML = cidr_bytes.join('-')
}

// --- Event Listeners --- //

/*
  Restrict cidr byte inputs to only accept valid bytes (0-255) as 
  input and re-render page when the value is changed
*/
document.querySelectorAll('.cidr-byte').forEach(input => {
  input.addEventListener('input', () => {
    // Restrict to valid inputs only
    input.value = input.value.replace(/[^\d]/g, '');
    if (input.value.length > 3) {
      input.value = input.value.slice(0, 3);
    }

    const val = parseInt(input.value, 10);
    if (!isNaN(val)) {
      if (val > 255) {
        input.value = '255'
        val = 255
      }
      // Code to update rendering goes here <<<<<<<<<
    }
  });

  input.addEventListener('blur', () => {
    let val = parseInt(input.value, 10);
    if (isNaN(val)) {
      val = 0
    } else {
      val = Math.min(Math.max(val, 0), 255);
    }
    input.value = val.toString();

    // Code to update rendering goes here <<<<<<<<<
  });
});

// --- Main --- //

console.debug('running popup.js');

// Retrieve cidr value from storage
chrome.storage.local.get('cidr', ({ cidr }) => {
  if (!cidr) {
    console.log('Failed to retrieve CIDR address from local storage');
    return;
  }
  console.debug(`retreived \'${cidr}\' from storage`);

  // Render popup with cidr values
  renderCidr(cidr)
});
