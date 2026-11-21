"""Decrypt and verify the owner's source archive using a separately stored key."""
from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import zipfile
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ASSOCIATED_DATA = b'accounting-source-recovery-v1'


def restore(archive_path: Path, key_path: Path, destination: Path) -> int:
    envelope = json.loads(archive_path.read_text(encoding='utf-8'))
    if envelope['format'] != 'AES-256-GCM-v1':
        raise ValueError('Unsupported archive format')
    key = base64.b64decode(key_path.read_text(encoding='ascii').strip(), validate=True)
    nonce = base64.b64decode(envelope['nonce'], validate=True)
    encrypted = base64.b64decode(envelope['ciphertext'], validate=True)
    plaintext = AESGCM(key).decrypt(nonce, encrypted, ASSOCIATED_DATA)
    destination = destination.resolve()
    with zipfile.ZipFile(io.BytesIO(plaintext)) as archive:
        manifest = json.loads(archive.read('source-manifest.json'))
        expected = {entry['path']: entry for entry in manifest['files']}
        if set(archive.namelist()) != set(expected) | {'source-manifest.json'}:
            raise ValueError('Archive file list does not match its manifest')
        staged = []
        for name, entry in expected.items():
            target = (destination / name).resolve()
            if not target.is_relative_to(destination):
                raise ValueError('Unsafe archive path')
            data = archive.read(name)
            if hashlib.sha256(data).hexdigest() != entry['sha256']:
                raise ValueError('Source hash mismatch')
            if target.exists() and target.read_bytes() != data:
                raise FileExistsError('Existing source differs: '+str(target))
            staged.append((target, data))
        for target, data in staged:
            target.parent.mkdir(parents=True, exist_ok=True)
            if not target.exists():
                with target.open('xb') as output:
                    output.write(data)
        for target, data in staged:
            if target.read_bytes() != data:
                raise ValueError('Restored file verification failed')
    return len(staged)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--archive', type=Path, required=True)
    parser.add_argument('--key-file', type=Path, required=True)
    parser.add_argument('--destination', type=Path, required=True)
    arguments = parser.parse_args()
    count = restore(arguments.archive, arguments.key_file, arguments.destination)
    print(f'Restored and verified {count} source files.')


if __name__ == '__main__':
    main()
