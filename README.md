# Yue

圖像化操作工具

## 安裝 Installation

run below command to install project

執行以下指令以安裝此專案

```
npm install
```

### 前置需求 Prerequisites

Node.js(LTS)、Java、Python(2.7)

### 安裝OpenCV

1.下載並安裝OpenCV(2.4版本) http://opencv.org/releases.html 為接下來的說明，我們將OpenCV安裝(解壓縮)在C:\opencv

Download and install OpenCV (2.4 version) http://opencv.org/releases.html. For these instructions we will assume OpenCV is put at C:\opencv.

2.建立一個環境變數名為**OPENCV_DIR**，設定其值為C:\opencv\build\x64\vc14(需針對實際目錄設定)，並設置一個PATH變數值 **%OPENCV_DIR%\bin**

Create a system variable called **OPENCV_DIR** and set it with C:\opencv\build\x64\vc14(According to real path). Also add the following to your system PATH **%OPENCV_DIR%\bin**

## 執行套件 Running the kit 

引入Yue

Require Yue
```
let Yue = require('yue')
```
執行指令

Excute
```
Yue.Click({img: {img: Buffer, name: string}})
```

## 套件結構 Built With 

* Yue - 圖像位置分析. 放置於/core/yue
* CCTV - 提供顯示器畫面圖像. 放置於/core/cctv
* Action - 依照座標執行的動作. 放置於/core/action

---

* Yue - Image location analysis. Locate in /core/yue
* CCTV - Provide image of monitor. Locate in /core/cctv
* Action - Movement by coordinate. Locate in /core/action

