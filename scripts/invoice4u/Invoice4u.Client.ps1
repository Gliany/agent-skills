param(
    [ValidateSet('Test', 'GetCustomer', 'CreateDraft', 'CheckDocument', 'GetDocument', 'IssueDocument', 'SendDocument', 'ValidateRecipients')]
    [string]$Action = 'Test',

    [int]$ClientId,

    [string]$InputFile,

    [string]$ApiIdentifier,

    [string]$DocumentId,

    [string[]]$Recipients,

    [switch]$Approved,

    [string]$CredentialTarget = 'Invoice4u_API'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$baseUrl = 'https://api.invoice4u.co.il/Services/ApiService.svc'

if (-not ('Invoice4uCredentialNative' -as [type])) {
    Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

[StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
public struct Invoice4uNativeCredential
{
    public UInt32 Flags;
    public UInt32 Type;
    public IntPtr TargetName;
    public IntPtr Comment;
    public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
    public UInt32 CredentialBlobSize;
    public IntPtr CredentialBlob;
    public UInt32 Persist;
    public UInt32 AttributeCount;
    public IntPtr Attributes;
    public IntPtr TargetAlias;
    public IntPtr UserName;
}

public static class Invoice4uCredentialNative
{
    [DllImport("advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("advapi32.dll", SetLastError = true)]
    public static extern void CredFree(IntPtr credentialPtr);
}
'@
}

function Get-Invoice4uApiToken {
    $credentialPointer = [IntPtr]::Zero
    $credentialTypeGeneric = 1

    if (-not [Invoice4uCredentialNative]::CredRead($credentialTarget, $credentialTypeGeneric, 0, [ref]$credentialPointer)) {
        $errorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
        throw "לא נמצא אישור Windows בשם $credentialTarget. קוד שגיאה: $errorCode"
    }

    try {
        $credential = [Runtime.InteropServices.Marshal]::PtrToStructure(
            $credentialPointer,
            [type][Invoice4uNativeCredential]
        )

        if ($credential.CredentialBlobSize -eq 0) {
            throw 'אישור Windows נמצא, אך אינו מכיל מפתח API.'
        }

        return [Runtime.InteropServices.Marshal]::PtrToStringUni(
            $credential.CredentialBlob,
            [int]($credential.CredentialBlobSize / 2)
        )
    }
    finally {
        if ($credentialPointer -ne [IntPtr]::Zero) {
            [Invoice4uCredentialNative]::CredFree($credentialPointer)
        }
    }
}

function Invoke-Invoice4uApi {
    param(
        [Parameter(Mandatory)]
        [string]$Operation,

        [Parameter(Mandatory)]
        [hashtable]$Parameters
    )

    $token = Get-Invoice4uApiToken
    $requestBody = @{} + $Parameters
    $requestBody.token = $token

    try {
        $response = Invoke-RestMethod `
            -Method Post `
            -Uri "$baseUrl/$Operation" `
            -ContentType 'application/json; charset=utf-8' `
            -Body ($requestBody | ConvertTo-Json -Depth 30 -Compress)
    }
    finally {
        $token = $null
        $requestBody = $null
    }

    return $response
}

function Test-Invoice4uDocumentExists {
    param(
        [Parameter(Mandatory)]
        [string]$Identifier
    )

    $token = Get-Invoice4uApiToken
    try {
        $uri = "$baseUrl/IsDocumentExistsByApiIdentifier?apiIdentifier=$([uri]::EscapeDataString($Identifier))&token=$([uri]::EscapeDataString($token))"
        $response = Invoke-RestMethod -Method Get -Uri $uri
        return [bool]$response.d
    }
    finally {
        $token = $null
        $uri = $null
    }
}

function Get-Invoice4uDocumentInput {
    param(
        [Parameter(Mandatory)]
        [string]$Path,

        [switch]$ForIssuance
    )

    $resolvedInputFile = (Resolve-Path -LiteralPath $Path).Path
    $doc = Get-Content -LiteralPath $resolvedInputFile -Raw | ConvertFrom-Json -AsHashtable

    if ($doc.ContainsKey('IssueDateLocal')) {
        $doc.IssueDate = ConvertTo-Invoice4uWcfDate -Date ([string]$doc.IssueDateLocal)
        $doc.Remove('IssueDateLocal')
    }
    if ($doc.ContainsKey('PaymentDueDateLocal')) {
        $doc.PaymentDueDate = ConvertTo-Invoice4uWcfDate -Date ([string]$doc.PaymentDueDateLocal)
        $doc.Remove('PaymentDueDateLocal')
    }
    if ($ForIssuance -and $doc.ContainsKey('ID')) {
        $doc.Remove('ID')
    }

    return $doc
}

function ConvertTo-Invoice4uWcfDate {
    param(
        [Parameter(Mandatory)]
        [string]$Date
    )

    $localDate = [datetime]::ParseExact(
        $Date,
        'yyyy-MM-dd',
        [Globalization.CultureInfo]::InvariantCulture,
        [Globalization.DateTimeStyles]::None
    )
    $israelTimeZone = [TimeZoneInfo]::FindSystemTimeZoneById('Israel Standard Time')
    $offset = $israelTimeZone.GetUtcOffset($localDate)
    $dateWithOffset = [DateTimeOffset]::new($localDate, $offset)
    $offsetText = '{0}{1:00}{2:00}' -f $(if ($offset.Ticks -ge 0) { '+' } else { '-' }), [math]::Abs($offset.Hours), [math]::Abs($offset.Minutes)
    return "/Date($($dateWithOffset.ToUnixTimeMilliseconds())$offsetText)/"
}

switch ($Action) {
    'Test' {
        $result = Invoke-Invoice4uApi -Operation 'GetExpDateByApiKey' -Parameters @{}
        if (-not $result.PSObject.Properties['d'] -or $result.d -eq 'UnauthorizedUser') {
            throw 'Invoice4u דחה את מפתח ה-API.'
        }

        [pscustomobject]@{
            Connected      = $true
            AccountExpires = [string]$result.d
            Credential     = $credentialTarget
            Environment    = 'Production'
        }
    }
    'GetCustomer' {
        if ($ClientId -le 0) {
            throw 'יש לספק ClientId חיובי.'
        }

        $result = Invoke-Invoice4uApi -Operation 'GetCustomerById' -Parameters @{ custId = $ClientId }
        if (-not $result.PSObject.Properties['d'] -or $null -eq $result.d) {
            throw "לא נמצא לקוח עם מזהה $ClientId."
        }
        if ($result.d.Errors -and $result.d.Errors.Count -gt 0) {
            throw "Invoice4u החזיר שגיאה באימות הלקוח: $($result.d.Errors | ConvertTo-Json -Compress)"
        }

        [pscustomobject]@{
            ID       = $result.d.ID
            Name     = $result.d.Name
            UniqueID = $result.d.UniqueID
            Email    = $result.d.Email
            Active   = $result.d.Active
        }
    }
    'CreateDraft' {
        if ([string]::IsNullOrWhiteSpace($InputFile)) {
            throw 'יש לספק נתיב לקובץ קלט באמצעות InputFile.'
        }
        $doc = Get-Invoice4uDocumentInput -Path $InputFile

        $result = Invoke-Invoice4uApi -Operation 'CreateOrUpdateDraftDocument' -Parameters @{ doc = $doc }
        if (-not $result.PSObject.Properties['d'] -or $null -eq $result.d) {
            throw 'Invoice4u לא החזיר טיוטה.'
        }
        if ($result.d.Errors -and $result.d.Errors.Count -gt 0) {
            throw "Invoice4u החזיר שגיאה ביצירת הטיוטה: $($result.d.Errors | ConvertTo-Json -Compress)"
        }

        [pscustomobject]@{
            DraftID       = $result.d.ID
            DocumentType  = $result.d.DocumentType
            Subject       = $result.d.Subject
            ClientID      = $result.d.ClientID
            BeforeVAT     = $result.d.TotalWithoutTax
            VAT           = $result.d.TotalTaxAmount
            Total         = $result.d.Total
            PaymentDueDate = $result.d.PaymentDueDate
            IsLegalDocument = $false
        }
    }
    'CheckDocument' {
        if ([string]::IsNullOrWhiteSpace($ApiIdentifier)) {
            throw 'יש לספק ApiIdentifier לבדיקת כפילות.'
        }

        [pscustomobject]@{
            ApiIdentifier = $ApiIdentifier
            Exists        = Test-Invoice4uDocumentExists -Identifier $ApiIdentifier
        }
    }
    'GetDocument' {
        if ([string]::IsNullOrWhiteSpace($DocumentId)) {
            throw 'יש לספק DocumentId.'
        }

        $result = Invoke-Invoice4uApi -Operation 'GetDocument' -Parameters @{ docId = $DocumentId }
        if (-not $result.PSObject.Properties['d'] -or $null -eq $result.d) {
            throw 'Invoice4u לא החזיר מסמך.'
        }
        if ($result.d.Errors -and $result.d.Errors.Count -gt 0) {
            throw "Invoice4u החזיר שגיאה בקריאת המסמך: $($result.d.Errors | ConvertTo-Json -Compress)"
        }

        [pscustomobject]@{
            DocumentID     = $result.d.ID
            DocumentNumber = $result.d.DocumentNumber
            DocumentType   = $result.d.DocumentType
            Subject        = $result.d.Subject
            ClientID       = $result.d.ClientID
            BeforeVAT      = $result.d.TotalWithoutTax
            VAT            = $result.d.TotalTaxAmount
            Total          = $result.d.Total
            AssociatedEmails = ($result.d.AssociatedEmails | ConvertTo-Json -Depth 10 -Compress)
            PdfCipher      = $result.d.CipherTextOriginal
        }
    }
    'IssueDocument' {
        if (-not $Approved) {
            throw 'הנפקת מסמך סופי דורשת Approved לאחר אישור מפורש של בעל העסק.'
        }
        if ([string]::IsNullOrWhiteSpace($InputFile)) {
            throw 'יש לספק נתיב לקובץ קלט באמצעות InputFile.'
        }

        $doc = Get-Invoice4uDocumentInput -Path $InputFile -ForIssuance
        if (-not $doc.ContainsKey('ApiIdentifier') -or [string]::IsNullOrWhiteSpace([string]$doc.ApiIdentifier)) {
            throw 'חסר ApiIdentifier; ההנפקה נעצרה כדי למנוע כפילות.'
        }
        if (Test-Invoice4uDocumentExists -Identifier ([string]$doc.ApiIdentifier)) {
            throw "כבר קיים מסמך סופי עם ApiIdentifier $($doc.ApiIdentifier)."
        }

        $result = Invoke-Invoice4uApi -Operation 'CreateDocumentWithIdentifierValidation' -Parameters @{ doc = $doc }
        if (-not $result.PSObject.Properties['d'] -or $null -eq $result.d) {
            throw 'Invoice4u לא החזיר מסמך לאחר ההנפקה.'
        }
        if ($result.d.Errors -and $result.d.Errors.Count -gt 0) {
            throw "Invoice4u החזיר שגיאה בהנפקה: $($result.d.Errors | ConvertTo-Json -Compress)"
        }

        [pscustomobject]@{
            DocumentID     = $result.d.ID
            DocumentNumber = $result.d.DocumentNumber
            DocumentType   = $result.d.DocumentType
            Subject        = $result.d.Subject
            ClientID       = $result.d.ClientID
            BeforeVAT      = $result.d.TotalWithoutTax
            VAT            = $result.d.TotalTaxAmount
            Total          = $result.d.Total
            PaymentDueDate = $result.d.PaymentDueDate
            PdfLink        = $result.d.PrintOriginalPDFLink
            Issued         = $true
        }
    }
    'SendDocument' {
        if (-not $Approved) {
            throw 'שליחת מסמך דורשת Approved לאחר אישור מפורש של בעל העסק.'
        }
        if ([string]::IsNullOrWhiteSpace($DocumentId)) {
            throw 'יש לספק DocumentId.'
        }
        if (-not $Recipients -or $Recipients.Count -eq 0) {
            throw 'יש לספק לפחות כתובת נמען אחת.'
        }

        $emailList = @($Recipients | ForEach-Object { @{ Mail = $_ } })
        $result = Invoke-Invoice4uApi -Operation 'SendDocumentByMail' -Parameters @{
            doc = @{
                ID               = $DocumentId
                AssociatedEmails = $emailList
            }
        }
        if (-not $result.PSObject.Properties['d'] -or $null -eq $result.d) {
            throw 'Invoice4u לא החזיר תוצאת שליחה.'
        }
        if ($result.d.Errors -and $result.d.Errors.Count -gt 0) {
            throw "Invoice4u החזיר שגיאת שליחה: $($result.d.Errors | ConvertTo-Json -Compress)"
        }

        [pscustomobject]@{
            DocumentID = $DocumentId
            Recipients = ($Recipients -join '; ')
            Info       = ($result.d.Info | ConvertTo-Json -Compress)
            Sent       = $true
        }
    }
    'ValidateRecipients' {
        [pscustomobject]@{
            Count      = @($Recipients).Count
            Recipients = @($Recipients)
            FirstBase64 = if ($Recipients.Count -gt 0) {
                [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes([string]$Recipients[0]))
            } else { $null }
        }
    }
}
