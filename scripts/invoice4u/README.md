# Invoice4u PowerShell client

A standalone client for Windows Credential Manager and Invoice4u's API. Its public copy uses a configurable credential target and generic approval messages. The original account-specific source is preserved in the encrypted source archive.

## Requirements and configuration

- Windows and PowerShell 7.
- An authorized Invoice4u account with API access.
- A generic Windows Credential Manager entry named `Invoice4u_API`, with the API key stored as its password. Create this entry using the Windows Credential Manager interface. A different target can be supplied with `-CredentialTarget`.

Credentials are read at runtime. Configuration and document JSON files should be stored outside the checkout.

## Read-only examples

```powershell
pwsh -File scripts/invoice4u/Invoice4u.Client.ps1 -Action Test
pwsh -File scripts/invoice4u/Invoice4u.Client.ps1 -Action GetCustomer -ClientId <customer-id>
pwsh -File scripts/invoice4u/Invoice4u.Client.ps1 -Action GetDocument -DocumentId <document-id>
```

Other supported actions are `CreateDraft`, `CheckDocument`, `IssueDocument`, `SendDocument`, and `ValidateRecipients`. Drafting uses `-InputFile` with a document object matching the official API. Issuance checks `ApiIdentifier` and requires `-Approved`. Sending requires `-DocumentId`, `-Recipients` and `-Approved`. These actions operate on the production account connected by the selected credential.

The example below illustrates helper date fields only. Fill in the actual document structure from the API documentation and account data.

```json
{
  "ClientID": 0,
  "Subject": "Replace with the service description",
  "IssueDateLocal": "2030-01-01",
  "PaymentDueDateLocal": "2030-02-28",
  "ApiIdentifier": "replace-with-a-unique-operation-identifier"
}
```

`GetDocument` can return a document-access cipher. Keep its output private. The public copy was syntax-checked locally, and its action guards were checked without using a live account. Provider behavior can change and requires verification before operational use.

## Attribution

The client was developed for the repository owner during Codex-assisted accounting work. It uses the Windows credential APIs and the Invoice4u HTTP service. The provider's documentation is available at https://invoice4u.gitbook.io/invoice4u-docs.
