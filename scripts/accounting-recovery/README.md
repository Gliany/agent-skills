# Accounting source recovery

This directory stores a complete source snapshot from the owner's accounting workspace as an AES-256-GCM encrypted archive. Some historical scripts contain customer details and transaction-specific inputs, so the original sources are encrypted together. The standalone Invoice4u client is available as readable source in `../invoice4u/`.

The archive includes first-party scripts, application source, tests, styles, HTML assets, configuration templates, dependency manifests and lockfiles found in the workspace snapshot. The internal manifest records relative paths and exact SHA-256 hashes. Private documents, transcripts, credentials, installed third-party runtime packages and session databases remain in the owner's private recovery package.

## Restore

Requires Python 3.10 or later and the package pinned in `requirements.txt`.

```sh
python -m venv .venv
# Activate the virtual environment for your operating system.
python -m pip install -r scripts/accounting-recovery/requirements.txt
python scripts/accounting-recovery/restore_source.py \
  --archive scripts/accounting-recovery/workspace-source.aesgcm.json \
  --key-file /private/location/source-code-recovery.key \
  --destination /private/location/restored-source
```

The archive's decryption key is held separately by the owner. Transfer it through a private channel and keep it outside a Git checkout. The command verifies authentication and every source hash before writing. It skips identical files and stops on a conflicting existing file.

The historical scripts refer to financial inputs and Windows paths. Use the owner's private workspace backup for the documents, workbooks, input data and original handoff. Review those scripts and adapt paths before execution, especially scripts that issue, cancel or send accounting documents.

The public snapshot manifest records the encrypted file hash and coverage counts. Code restoration has been exercised locally, including the wrong-key rejection and a second identical restore.

## Attribution

The workspace source and recovery utility were created for the repository owner during Codex-assisted project work. Existing notices embedded in individual source files continue to apply. No new collection-wide license is granted by this snapshot. Runtime packages and their upstream licenses are described in the private backup's dependency lockfile.
