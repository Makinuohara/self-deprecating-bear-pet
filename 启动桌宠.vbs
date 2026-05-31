Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = scriptDir

Dim nodePath
nodePath = ""

Dim paths(3)
paths(0) = "node"
paths(1) = WshShell.ExpandEnvironmentStrings("%ProgramFiles%") & "\nodejs\node.exe"
paths(2) = WshShell.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\nodejs\node.exe"
paths(3) = WshShell.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Programs\nodejs\node.exe"

For Each p In paths
    If p = "node" Then
        On Error Resume Next
        WshShell.Run "where node", 0, True
        If Err.Number = 0 Then
            nodePath = "node"
            Exit For
        End If
        On Error GoTo 0
    ElseIf fso.FileExists(p) Then
        nodePath = """" & p & """"
        Exit For
    End If
Next

If nodePath = "" Then
    MsgBox "Cannot find Node.js!" & vbNewLine & vbNewLine & _
           "Please install Node.js from https://nodejs.org/" & vbNewLine & _
           "Make sure to check 'Add to PATH' during installation.", 16, "Error"
    WScript.Quit 1
End If

If Not fso.FolderExists(scriptDir & "\node_modules") Then
    MsgBox "First run - installing dependencies...", 64, "Please wait"
    WshShell.Run "cmd /c npm install", 1, True
End If

WshShell.Run "cmd /c npm start", 0, False
