Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

desktopPath = WshShell.SpecialFolders("Desktop")
Set shortcut = WshShell.CreateShortcut(desktopPath & "\BearPet.lnk")
shortcut.TargetPath = scriptDir & "\启动桌宠.vbs"
shortcut.WorkingDirectory = scriptDir
shortcut.Description = "Self-Deprecating Bear Pet"
shortcut.Save

MsgBox "Desktop shortcut created!" & vbNewLine & vbNewLine & _
       "Double-click 'BearPet' on desktop to start.", 64, "Done"
