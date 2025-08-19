import { Cidr } from "../scripts/cidr_utils.js"

// --- Functions --- //

// Render the popup window ui given a cidr value
function renderCidr(selection) {
  const cidr = new Cidr(selection)

  // Update cidr-byte-4 with value of mask
  document.getElementById("cidr-byte-4").setAttribute('value', cidr.prefix)
  for (let i = 0; i < 4; ++i) {
    // Render cidr byte value
    document.getElementById(`cidr-byte-${i}`).setAttribute('value', cidr.bytes[i])
    
    // Render cidr bit values for byte i
    for (let j = 0; j < 8; ++j) {
      let element = document.getElementById(`cidr-bit-${i}-${j}`)
      element.innerHTML = cidr.bits[i][j]
      if (cidr.networkBit(i,j)) {
        element.classList.remove("masked")
      }
      else {
        element.classList.add("masked")
      }
    }
  }

  // Update detail values
  document.getElementById("count-ips").innerHTML = cidr.count_ips
  document.getElementById("network-ip").innerHTML = cidr.network_ip
  document.getElementById("first-usable-ip").innerHTML = cidr.first_usable_ip
  document.getElementById("last-usable-ip").innerHTML = cidr.last_usable_ip
  document.getElementById("broadcast-ip").innerHTML = cidr.broadcast_ip
  document.getElementById("network-mask").innerHTML = cidr.mask
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
chrome.storage.session.get('selection', ({ selection }) => {
  if (!selection) {
    console.log('Failed to retrieve CIDR address from local storage');
    return;
  }
  console.debug(`retreived \'${selection}\' from storage`);

  // Render popup with cidr values
  renderCidr(selection)
});
