const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let tray;
let studyTimer = null;
let studyStartTime = null;
let bilibiliCheckInterval = null;
let bilibiliWarningActive = false;
let bilibiliStartTime = null; // 记录哔哩哔哩开始时间

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 200,
    height: 280,
    x: screenWidth - 250,
    y: screenHeight - 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('src/index.html');
  mainWindow.setIgnoreMouseEvents(false);

  // 允许窗口穿透点击（仅在非交互区域）
  mainWindow.on('blur', () => {
    mainWindow.setAlwaysOnTop(true);
  });
}

function createTray() {
  // 创建系统托盘
  const iconPath = path.join(__dirname, '..', 'assets', 'icons', 'tray.png');
  try {
    const icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      console.error('图标文件为空或格式不支持');
      tray = new Tray(nativeImage.createEmpty());
    } else {
      tray = new Tray(icon);
    }
  } catch (e) {
    // 如果图标不存在，创建一个简单的图标
    console.error('托盘图标加载失败:', e);
    tray = new Tray(nativeImage.createEmpty());
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示/隐藏小熊',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      }
    },
    {
      label: '熊认真学习形态',
      click: () => startStudyCompanion()
    },
    {
      label: '熊不学了',
      click: () => stopStudyCompanion()
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('自嘲熊桌宠');
  tray.setContextMenu(contextMenu);
}

// 开始学习陪伴
function startStudyCompanion() {
  if (studyTimer) return;

  studyStartTime = Date.now();
  const STUDY_DURATION = 45 * 60 * 1000; // 45分钟

  // 调整窗口大小为更小的尺寸
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow.setBounds({
    width: 150,
    height: 210,
    x: screenWidth - 200,
    y: screenHeight - 230
  });

  mainWindow.webContents.send('study-started');

  studyTimer = setTimeout(() => {
    mainWindow.webContents.send('study-reminder', {
      message: '已经学习45分钟啦！休息一下吧~ (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧',
      duration: STUDY_DURATION
    });
    studyTimer = null;
  }, STUDY_DURATION);
}

// 结束学习陪伴
function stopStudyCompanion() {
  if (studyTimer) {
    clearTimeout(studyTimer);
    studyTimer = null;
  }

  // 恢复窗口大小
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow.setBounds({
    width: 200,
    height: 280,
    x: screenWidth - 250,
    y: screenHeight - 300
  });

  mainWindow.webContents.send('study-stopped');
}

// 检测哔哩哔哩进程
function checkBilibiliProcess() {
  exec('tasklist /FI "IMAGENAME eq bilibili.exe" /FO CSV', (error, stdout) => {
    if (error) return;

    const isBilibiliRunning = stdout.includes('bilibili.exe');
    const BILIBILI_THRESHOLD = 10 * 60 * 1000; // 10分钟阈值

    if (isBilibiliRunning) {
      // 记录首次检测到哔哩哔哩的时间
      if (!bilibiliStartTime) {
        bilibiliStartTime = Date.now();
      }

      const elapsed = Date.now() - bilibiliStartTime;

      // 超过10分钟且还未触发警告
      if (elapsed >= BILIBILI_THRESHOLD && !bilibiliWarningActive) {
        bilibiliWarningActive = true;
        mainWindow.webContents.send('bilibili-detected', {
          message: '检测到你在看B站！已经待了10分钟啦！(╬▔皿▔)╯',
          angry: true
        });
      }
    } else {
      // 哔哩哔哩关闭，重置状态
      bilibiliStartTime = null;
      if (bilibiliWarningActive) {
        bilibiliWarningActive = false;
        mainWindow.webContents.send('bilibili-left', {
          message: '好的，继续加油！(๑•̀ㅂ•́)و✧',
          angry: false
        });
      }
    }
  });
}

// 启动哔哩哔哩检测
function startBilibiliDetection() {
  bilibiliCheckInterval = setInterval(checkBilibiliProcess, 5 * 1000); // 每5秒检测一次
}

// IPC 通信处理
ipcMain.on('start-study', () => {
  startStudyCompanion();
});

ipcMain.on('stop-study', () => {
  stopStudyCompanion();
});

ipcMain.on('get-study-status', (event) => {
  event.reply('study-status', {
    isStudying: !!studyTimer,
    startTime: studyStartTime
  });
});

ipcMain.on('hide-pet', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});

ipcMain.on('move-window', (event, { deltaX, deltaY }) => {
  if (mainWindow) {
    const [currentX, currentY] = mainWindow.getPosition();
    mainWindow.setPosition(currentX + deltaX, currentY + deltaY);
  }
});

ipcMain.handle('get-window-position', () => {
  if (mainWindow) {
    const [x, y] = mainWindow.getPosition();
    return { x, y };
  }
  return { x: 0, y: 0 };
});

app.whenReady().then(() => {
  createWindow();
  createTray();
  startBilibiliDetection();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (studyTimer) clearTimeout(studyTimer);
  if (bilibiliCheckInterval) clearInterval(bilibiliCheckInterval);
});
