# Daikibo Industries — IIoT Telemetry Data Unification

> A Python solution for converting industrial IoT (IIoT) telemetry data from two different input formats into a single, unified data model for consistent processing across Daikibo Industries' manufacturing infrastructure.

> Part of the Deloitte Virtual Experience Program · Task 1: Unifying Manufacturing Telemetry Data Models

> https://vallchagas.github.io/Deloitte-VE-AU/

## Table of Contents

- [Background](#background)
- [Business Context](#business-context)
- [Objective](#objective)
- [Install](#install)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Data Formats](#data-formats)
- [Implementation](#implementation)
- [Interactive Demo](#interactive-demo)
- [Tests](#tests)
- [Requirements](#requirements)
- [Implementation Notes](#implementation-notes)
- [Concepts Applied](#concepts-applied)
- [Contributing](#contributing)
- [License](#license)

## Background

This project was developed as part of the **Deloitte Virtual Experience Program**.

The challenge focuses on unifying telemetry data models from industrial IoT devices used across a large manufacturing organization. Although all devices emit equivalent information, they use different JSON structures, making centralized processing difficult.

The solution provides a lightweight Python implementation capable of transforming both source formats into a single, standardized output format suitable for analytics pipelines, monitoring systems, and long-term storage.

**Live Demo:**  
https://vallchagas.github.io/Deloitte-VE-AU/

## Business Context

**Daikibo Industries** (formerly Macaro) is a global heavy machinery manufacturer headquartered in Tokyo, Japan.

As part of its digital transformation strategy, the company has adopted Industrial Internet of Things (IIoT) devices throughout its manufacturing facilities to monitor and analyze production operations.

A challenge emerged because half of the infrastructure transmits telemetry using one data format while the remaining systems use another. Although both models contain the same information, the differing structures prevent uniform downstream processing.

The objective is to convert both formats into one standardized telemetry schema.

## Objective

Implement conversion functions that:

- Accept telemetry messages from either supported input format.
- Normalize timestamps and field structures.
- Produce a single, unified JSON schema.
- Enable consistent processing across the IIoT ecosystem.

## Install

Clone the repository:

```bash
git clone <repo-url>
cd <repo-name>
```

No external dependencies are required.

The project uses only Python's standard library.

## Usage

Run the automated tests:

```bash
python main.py
```

To launch the interactive demo locally:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project Structure

```text
.
├── index.html           # Interactive GitHub Pages demo
├── assets/
│   ├── style.css        # Demo styling
│   └── script.js        # JavaScript version of conversion logic
├── data-1.json          # Sample telemetry (Format 1)
├── data-2.json          # Sample telemetry (Format 2)
├── data-result.json     # Expected unified output
├── main.py              # Official Python implementation
├── README.md
└── .gitignore
```

> `main.py` is the authoritative implementation. The JavaScript files exist only to support the browser-based demonstration.

## Data Formats

The repository contains three JSON files representing the same telemetry event in different schemas.

### Format 1 (`data-1.json`)

Characteristics:

- Flat JSON structure
- `location` stored as a slash-separated string
- `operationStatus` and `temp` at the top level
- Timestamp already stored as milliseconds since Unix epoch

Example location:

```text
japan/tokyo/keiyo-industrial-zone/factory-1/section-1
```

### Format 2 (`data-2.json`)

Characteristics:

- Nested device information
- Location distributed across individual fields
- Telemetry contained in a nested `data` object
- Timestamp represented as an ISO 8601 string

### Unified Format (`data-result.json`)

Characteristics:

- Top-level `deviceID`
- Top-level `deviceType`
- Timestamp always represented in milliseconds since epoch
- Structured `location` object
- Structured `data` object

Example structure:

```json
{
  "deviceID": "...",
  "deviceType": "...",
  "timestamp": 1585055486000,
  "location": {
    "country": "...",
    "city": "...",
    "area": "...",
    "factory": "...",
    "section": "..."
  },
  "data": {
    "status": "...",
    "temperature": ...
  }
}
```

## Implementation

### `convertFromFormat1(jsonObject)`

Converts the flat schema into the unified format.

Responsibilities:

- Split the location string with `split("/")`
- Map values into a location object
- Rename:
  - `operationStatus` → `status`
  - `temp` → `temperature`
- Create a nested `data` object
- Preserve the existing timestamp

### `convertFromFormat2(jsonObject)`

Converts the nested schema into the unified format.

Responsibilities:

- Convert ISO 8601 timestamps to Unix epoch milliseconds
- Flatten:
  - `device.id` → `deviceID`
  - `device.type` → `deviceType`
- Assemble the location object
- Preserve telemetry values

Timestamp conversion:

```python
data = datetime.datetime.strptime(
    ts,
    "%Y-%m-%dT%H:%M:%S.%fZ"
)

timestamp = round(
    (data - datetime.datetime(1970, 1, 1))
    .total_seconds() * 1000
)
```

### `main(jsonObject)`

Automatically routes input based on structure:

- Format 1 → no `device` key
- Format 2 → contains `device`

Example:

```python
if jsonObject.get("device"):
    return convertFromFormat2(jsonObject)

return convertFromFormat1(jsonObject)
```

## Interactive Demo

The repository includes a GitHub Pages demonstration that visualizes the conversion process.

Features:

- Displays all three JSON schemas side by side.
- Loads real repository files.
- Converts telemetry in real time.
- Demonstrates the Python logic in the browser.

The demo uses:

- HTML
- CSS
- Vanilla JavaScript

It exists strictly for visualization and portfolio purposes.

## Tests

The project contains three automated tests built with `unittest`.

| Test | Purpose |
|--------|---------|
| `test_sanity` | Validates the expected output schema |
| `test_dataType1` | Verifies Format 1 conversion |
| `test_dataType2` | Verifies Format 2 conversion and timestamp normalization |

Run:

```bash
python main.py
```

Expected output:

```text
...
----------------------------------------------------------------------
Ran 3 tests in 0.011s

OK
```

## Requirements

### Runtime

- Python 3.7+

### Demo

- Any modern web browser

## Implementation Notes

### Character Encoding

All JSON files are opened using UTF-8 encoding:

```python
open(file, encoding="utf-8")
```

This ensures compatibility with special characters such as:

```text
keiyō-industrial-zone
```

### Timestamp Handling

Format 2 stores timestamps using the ISO 8601 UTC format:

```text
2020-03-25T15:24:46.000Z
```

These values are converted into Unix epoch milliseconds for consistency.

### Rounding

`round()` is used to eliminate floating-point precision artifacts generated during timestamp conversion.

### Safe Routing

The project uses:

```python
jsonObject.get("device")y `main.py` should be considered authoritative.

## Concepts Applied

- JSON parsing and manipulation
- Data normalization
- Schema transformation
- Flat-to-nested object conversion
- ISO 8601 timestamp processing
- Unix epoch conversion
- Automated testing with `unittest`
- UTF-8 encoding management
- Pure function design
- Structure-based routing
- Static site deployment with GitHub Pages

## Contributing

Contributions are welcome.

Potential areas for improvement include:

- Additional telemetry formats
- Extended validation rules
- Enhanced test coverage
- Documentation improvements
- Interactive demo enhancements

Please open an issue before submitting major changes.

## License

MIT © Deloitte Virtual Experience Program contributors.
