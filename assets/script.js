// ============================================================
// Demo logic — mirrors the Python implementation in main.py
// This is ONLY for the interactive demonstration page.
// The official, tested implementation is in main.py.
// ============================================================

// --- Format 1 -> Unified ---
function convertFromFormat1(obj) {
    const locationParts = obj.location.split('/');

    return {
        deviceID: obj.deviceID,
        deviceType: obj.deviceType,
        timestamp: obj.timestamp, // already in milliseconds
        location: {
            country: locationParts[0],
            city: locationParts[1],
            area: locationParts[2],
            factory: locationParts[3],
            section: locationParts[4]
        },
        data: {
            status: obj.operationStatus,
            temperature: obj.temp
        }
    };
}

// --- Format 2 -> Unified ---
function convertFromFormat2(obj) {
    // Convert ISO 8601 string to milliseconds since epoch
    const ms = new Date(obj.timestamp).getTime();

    return {
        deviceID: obj.device.id,
        deviceType: obj.device.type,
        timestamp: ms,
        location: {
            country: obj.country,
            city: obj.city,
            area: obj.area,
            factory: obj.factory,
            section: obj.section
        },
        data: obj.data // already { status, temperature }
    };
}

// --- Router ---
function main(obj) {
    if (obj.device === undefined) {
        return convertFromFormat1(obj);
    } else {
        return convertFromFormat2(obj);
    }
}

// ============================================================
// Page logic — fetch JSONs and wire up the demo
// ============================================================

const json1El = document.getElementById('json-1');
const json2El = document.getElementById('json-2');
const jsonResultEl = document.getElementById('json-result');
const demoResultEl = document.getElementById('demo-result');
const selectEl = document.getElementById('input-select');
const btnEl = document.getElementById('convert-btn');

let data1, data2;

async function loadData() {
    try {
        const [r1, r2, r3] = await Promise.all([
            fetch('data-1.json'),
            fetch('data-2.json'),
            fetch('data-result.json')
        ]);

        data1 = await r1.json();
        data2 = await r2.json();
        const result = await r3.json();

        json1El.textContent = JSON.stringify(data1, null, 2);
        json2El.textContent = JSON.stringify(data2, null, 2);
        jsonResultEl.textContent = JSON.stringify(result, null, 2);
    } catch (err) {
        json1El.textContent = 'Error loading data-1.json';
        json2El.textContent = 'Error loading data-2.json';
        jsonResultEl.textContent = 'Error loading data-result.json';
        console.error(err);
    }
}

btnEl.addEventListener('click', () => {
    const choice = selectEl.value;
    const input = choice === '1' ? data1 : data2;

    if (!input) {
        demoResultEl.textContent = 'Data not loaded yet. Please wait.';
        return;
    }

    const result = main(input);
    demoResultEl.textContent = JSON.stringify(result, null, 2);
});

loadData();