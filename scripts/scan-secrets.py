#!/usr/bin/env python3
import math
import os
import re
import subprocess
import sys

MAX_FILE_BYTES = 1024 * 1024
SKIP_PARTS = {".git", "node_modules", ".next", "dist", "build", "coverage", ".vite", "__pycache__"}
SKIP_SUFFIXES = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip", ".gz", ".woff", ".woff2", ".ttf",
}

PLACEHOLDER_RE = re.compile(
    r"(?i)^(|your[-_].*|example.*|changeme|placeholder|dummy|test|localhost|"
    r"https?://localhost.*|https?://your[-_].*|.*example\.com.*|"
    r"process\.env\..*|import\.meta\.env\..*|os\.environ.*|\$\{.*\}|<.*>)$"
)

PATTERNS = [
    ("OpenAI API key", re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b")),
    ("GitHub token", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{30,}\b")),
    ("AWS access key id", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b")),
    ("Stripe secret key", re.compile(r"\b(?:sk|rk)_(?:live|test)_[0-9A-Za-z]{20,}\b")),
    ("Resend API key", re.compile(r"\bre_[A-Za-z0-9_-]{20,}\b")),
    ("Slack token", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{20,}\b")),
    ("Slack webhook", re.compile(r"https://hooks\.slack\.com/services/[A-Za-z0-9_/+-]{20,}")),
    ("Twilio API key", re.compile(r"\bSK[0-9a-fA-F]{32}\b")),
    ("Private key block", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA |)?PRIVATE KEY-----")),
    ("JWT", re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b")),
]

GENERIC_ASSIGNMENT_RE = re.compile(
    r"(?i)\b(api[_-]?key|secret|token|password|passwd|pwd|client[_-]?secret|"
    r"service[_-]?role|private[_-]?key|database_url|db_password|access[_-]?key|jwt[_-]?secret)"
    r"\b\s*[:=]\s*[\"']?([^\"'\s`]{12,})"
)


def git_files():
    try:
        output = subprocess.check_output(["git", "ls-files", "-z"], stderr=subprocess.DEVNULL)
    except (OSError, subprocess.CalledProcessError):
        return []
    return [name.decode("utf-8", "ignore") for name in output.split(b"\0") if name]


def entropy(value):
    if not value:
        return 0.0
    counts = {char: value.count(char) for char in set(value)}
    return -sum((count / len(value)) * math.log2(count / len(value)) for count in counts.values())


def is_placeholder(value):
    value = value.strip().strip("\"'")
    code_prefixes = ("String(", "Boolean(", "Number(", "new ", "await ", "requireEnv(", "process.", "import.")
    return (
        bool(PLACEHOLDER_RE.match(value))
        or value.startswith(code_prefixes)
        or "your-" in value.lower()
        or "example" in value.lower()
    )


def redact(value):
    value = value.strip().strip("\"'")
    if len(value) <= 8:
        return "<redacted>"
    return f"{value[:4]}...{value[-4:]}"


def should_skip(path):
    parts = set(path.replace("\\", "/").split("/"))
    if parts & SKIP_PARTS:
        return True
    return os.path.splitext(path)[1].lower() in SKIP_SUFFIXES


def scan_file(path):
    if should_skip(path) or not os.path.isfile(path) or os.path.getsize(path) > MAX_FILE_BYTES:
        return []
    try:
        raw = open(path, "rb").read()
    except OSError:
        return []
    if b"\0" in raw:
        return []
    text = raw.decode("utf-8", "ignore")
    hits = []
    for number, line in enumerate(text.splitlines(), 1):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        for label, pattern in PATTERNS:
            match = pattern.search(line)
            if match and not is_placeholder(match.group(0)):
                hits.append((path, number, label, redact(match.group(0))))
        assignment = GENERIC_ASSIGNMENT_RE.search(line)
        if assignment:
            value = assignment.group(2)
            if not is_placeholder(value) and (len(value) >= 20 or entropy(value) >= 3.5):
                hits.append((path, number, "sensitive assignment", redact(value)))
    return hits


def main():
    hits = []
    for path in git_files():
        hits.extend(scan_file(path))
    if hits:
        print("Potential secrets found. Remove them from tracked files and rotate exposed credentials.")
        for path, line, label, preview in hits:
            print(f"{path}:{line}: {label}: {preview}")
        return 1
    print("No tracked secrets detected.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
