# Daikibo Industries — IIoT Telemetry Data Unification

A Python solution for converting industrial IoT (IIoT) telemetry data from two different input formats into a single, consistent unified format — enabling seamless processing and storage of device data across Daikibo Industries' manufacturing infrastructure.

> **Part of the Deloitte Virtual Experience Program** — Task 1: Unifying Manufacturing Telemetry Data Models.

🔗 **Live demo:** [https://SEU-USUARIO.github.io/SEU-REPO/](https://SEU-USUARIO.github.io/SEU-REPO/)

## 📋 Business Context

**Daikibo Industries** (formerly Macaro), a global leader in heavy machinery manufacturing headquartered in Tokyo, Japan, is integrating IIoT devices to monitor, measure, and analyze its manufacturing processes.

**The problem:** half of Daikibo's infrastructure streams telemetry data in one format, and the other half in a different format. Both represent the same information but use different structures, preventing unified processing.

**The goal:** unify the two data models so that all device data is stored in a **consistent format**, enabling downstream analytics and operational efficiency.

## 🎯 Objective

Implement two conversion functions that transform each input format into a single **unified output format**, ensuring compatibility across all devices in the IIoT pipeline.

## 📁 Project Structure

```
.
├── index.html           # Interactive demo page (GitHub Pages)
├── assets/
│   ├── style.css        # Page styling
│   └── script.js        # Demo logic (JavaScript mirror of main.py)
├── data-1.json          # Sample telemetry — Format 1 (flat)
├── data-2.json          # Sample telemetry — Format 2 (nested)
├── data-result.json     # Target unified format
├── main.py              # Official implementation + automated tests
├── README.md
└── .gitignore
```

> **Note:** `main.py` is the official, tested implementation. The files in `assets/` exist only to power the interactive demo on GitHub Pages — they are a JavaScript mirror of the Python logic and do not replace it.

## 🔄 The Three Data Formats

The repository includes three JSON files that represent the **same telemetry message** in different formats:

- **`data-1.json`** — Format 1 (flat structure)
- **`data-2.json`** — Format 2 (nested structure)
- **`data-result.json`** — Target unified format

### Format 1 — Flat structure (`data-1.json`)

Key characteristics:
- `location` is a **single slash-separated string** (e.g., `"japan/tokyo/.../section-1"`)
- Status and temperature are **top-level fields** (`operationStatus`, `temp`)
- `timestamp` is already in **milliseconds since epoch** (integer)

### Format 2 — Nested structure (`data-2.json`)

Key characteristics:
- Device ID and type are **nested** inside a `device` object
- `location` is **spread across 5 separate fields** (`country`, `city`, `area`, `factory`, `section`)
- Status and temperature are inside a `data` object
- `timestamp` is in **ISO 8601** format (string, UTC)

### Unified Format — Target (`data-result.json`)

Key characteristics:
- `deviceID` and `deviceType` at the **top level**
- `timestamp` **always in milliseconds since epoch** (integer)
- `location` as a **nested object** with 5 keys (`country`, `city`, `area`, `factory`, `section`)
- `data` as a **nested object** with `status` and `temperature`

## 🛠️ Implementation

### `convertFromFormat1(jsonObject)`

Converts Format 1 → unified:

1. Splits the `location` string using `split("/")`
2. Maps each part to `country`, `city`, `area`, `factory`, `section`
3. Renames `operationStatus` → `status` and `temp` → `temperature`
4. Groups both inside the `data` object
5. Copies `timestamp` directly (already in milliseconds)

### `convertFromFormat2(jsonObject)`

Converts Format 2 → unified:

1. Converts the ISO 8601 timestamp to milliseconds since epoch:
   ```python
   data = datetime.datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S.%fZ")
   timestamp = round((data - datetime.datetime(1970, 1, 1)).total_seconds() * 1000)
   ```
2. Flattens `device.id` → `deviceID` and `device.type` → `deviceType`
3. Groups the 5 location fields inside the `location` object
4. Copies `data` directly (already in the correct shape)

### `main(jsonObject)`

Routes to the correct converter based on the presence of the `device` key:
- No `device` key → Format 1
- Has `device` key → Format 2

## 🖥️ Interactive Demo

The `index.html` page provides a visual walkthrough of the project:

- Displays all three JSON formats side by side (loaded from the real files)
- Lets you pick an input format and convert it to the unified output in real time
- Links back to the official Python implementation

> The demo is powered by JavaScript (`assets/script.js`) and runs entirely in the browser. It exists for visualization and portfolio purposes; the authoritative logic is the one in `main.py`, validated by the automated tests below.

To view it locally:

```bash
# Any static server works, e.g.:
python -m http.server 8000
# then open http://localhost:8000
```

> Opening `index.html` directly via `file://` may block the `fetch()` calls due to browser security policies — use a local server instead.

## 🧪 Tests

The project includes **3 automated tests** using `unittest`:

| Test | What it validates |
|---|---|
| `test_sanity` | Integrity of the expected `data-result.json` |
| `test_dataType1` | Conversion from Format 1 |
| `test_dataType2` | Conversion from Format 2 (including timestamp conversion) |

Run the tests:

```bash
python main.py
```

Expected output:

```
...
----------------------------------------------------------------------
Ran 3 tests in 0.011s

OK
```

## ⚙️ Requirements

- **Python 3.7+** (uses `datetime.strptime` with `%f`)
- Any modern browser (for the demo page)

## 📝 Implementation Notes

- **Encoding:** JSON files are opened with `encoding="utf-8"` to correctly handle special characters such as the `ō` in `keiyō-industrial-zone`. Without this, Python on Windows raises `UnicodeDecodeError` (cp1252 codec).
- **Timestamp:** Format 2 uses ISO 8601 in UTC (suffix `Z`). Since the Unix epoch is also UTC, subtracting `datetime(1970, 1, 1)` directly is correct.
- **Rounding:** `round()` is applied to the timestamp to avoid floating-point artifacts (e.g., `...782.9998`).
- **Safe routing:** `main` uses `.get("device")` instead of `["device"]` to avoid `KeyError` when the input is Format 1.
- **Demo vs. official code:** the JavaScript in `assets/script.js` mirrors the Python logic only for the interactive page. It is not tested and should not be considered a replacement for `main.py`.

## 🚀 How to Run

The repository already includes the three sample JSON files, so you can run the tests directly:

```bash
# Clone the repository
git clone <repo-url>
cd <repo-name>

# Run the tests
python main.py
```

## 📚 Concepts Applied

- JSON manipulation in Python (`json.load`)
- Data format conversion (flat ↔ nested)
- ISO 8601 → Unix epoch timestamp conversion (milliseconds)
- Automated testing with `unittest`
- Character encoding handling (`utf-8`)
- Pure functions and structure-based routing
- Static site deployment with GitHub Pages (HTML/CSS/JS)