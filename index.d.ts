/**
 * 預設間隔時間，初始值: 200
 */
export var interval: number;
/**
 * 設置是否log，初始值: true
 */
export var log: boolean;
/**
 * 預設分析回傳最多組數，初始值: 5
 */
export var maxAmount: number;
/**
 * 圖片分析方法，初始值: 6
 */
export var method: number;
/**
 * 預設監視範圍，初始值: {}
 */
export var region: {
  /**
   * x偏移
   */
  x: number,
  /**
   * y偏移
   */
  y: number,
  /**
   * 寬度
   */
  width: number,
  /**
   * 高度
   */
  height: number
};
/**
 * 預設相似度，初始值: 0.8
 */
export var similar: number;
/**
 * 預設逾時時間(ms)，初始值: 5000
 */
export var timeout: number;
/**
 * Action類別，可對座標直接操作
 */
export var Action: Action;
/**
 * CCTV類別，可對監視的畫面調整
 */
export var CCTV: CCTV;
/**
 * 分析該圖像位置
 * @param imageItem 圖片資訊{img:Img, similar:0.01~0.99, region:{x:number, y:number, width:number, height:number}}
 * @param maxAmount 一次回傳最多組數，預設與config設定的值相同
 * @returns 位置物件陣列
 */
export function Analysis(imageItem: ImageItem, maxAmount: number): Position[];
/**
 * 點擊圖像的位置
 * @param imageItem 圖片資訊{img:Img, similar:0.01~0.99, region:{x:number, y:number, width:number, height:number}}
 * @param returnBoolean 回傳boolean取代錯誤中斷，預設為false
 * @param isSmooth 是否滑順移動，預設為false
 */
export function Click(imageItem: ImageItem, returnBoolean: boolean, isSmooth: boolean): boolean;
/**
 * 物件內部使用
 * @param msg 
 */
// export function ConsoleLog(msg: string): void;
/**
 * 雙點擊圖像的位置
 * @param imageItem 圖片資訊{img:Img, similar:0.01~0.99, region:{x:number, y:number, width:number, height:number}}
 * @param returnBoolean 回傳boolean取代錯誤中斷，預設為false
 * @param isSmooth 是否滑順移動，預設為false
 */
export function DoubleClick(imageItem: ImageItem, returnBoolean: boolean, isSmooth: boolean): boolean;
/**
 * 從一處拖拉至指定地點
 * @param source 開始點圖片資訊{img:Img, similar:0.01~0.99, region:{x:number, y:number, width:number, height:number}}
 * @param target 目的地圖片資訊{img:Img, similar:0.01~0.99, region:{x:number, y:number, width:number, height:number}}
 * @param returnBoolean 回傳boolean取代錯誤中斷，預設為false
 * @param isSmooth 是否滑順移動，預設為false
 */
export function Drag(source: ImageItem, target: ImageItem, returnBoolean: boolean, isSmooth: boolean): boolean;
/**
 * 回傳圖像單個位置
 * @param imageItem 圖片資訊{img:Img, similar:0.01~0.99, region:{x:number, y:number, width:number, height:number}}
 * @param returnBoolean 回傳boolean取代錯誤中斷，預設為false
 * @returns Position物件
 */
export function Find(imageItem: ImageItem, returnBoolean: boolean): Position;
/**
 * 回傳圖像多個位置
 * @param imageItem 圖片資訊{img:Img, similar:0.01~0.99, region:{x:number, y:number, width:number, height:number}}
 * @param returnBoolean 回傳boolean取代錯誤中斷，預設為false
 * @param maxAmount 回傳最高組數
 * @returns Position物件陣列
 */
export function FindMulti(imageItem: ImageItem, returnBoolean: boolean, maxAmount: number): Position[];
/**
 * 處理錯誤流程
 * @param returnBoolean 
 * @param msg 
 */
// export function HandleError(returnBoolean: boolean, msg: string): void;
/**
 * Hover圖像的位置
 * @param imageItem 圖片資訊{img:Img, similar:0.01~0.99, region:{x:number, y:number, width:number, height:number}}
 * @param returnBoolean 回傳boolean取代錯誤中斷，預設為false
 * @param isSmooth 是否滑順移動，預設為false
 */
export function Hover(imageItem: ImageItem, returnBoolean: boolean, isSmooth: boolean): boolean;
/**
 * 
 * @param imageItem 圖片資訊{img:Img, similar:0.01~0.99, region:{x:number, y:number, width:number, height:number}}
 * @param timeout 等待時間(ms)
 * @param returnBoolean 回傳boolean取代錯誤中斷，預設為false
 * @param interval 間隔時間(ms)
 */
export function Wait(imageItem: ImageItem, timeout: number, returnBoolean: boolean, interval: number): void;
/**
 * 暫停
 * @param waittime 暫停時間(ms)
 */
export function Pause(waittime: number)

interface Img {
  img: Buffer;
  name: string;
}

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageItem {
  img: Img;
  similar: number;
  region: Region;
}

interface Action {
  /**
   * 點擊座標
   * @param coordinate 座標
   * @param button 按鈕，預設為left
   * @param isSmooth 是否滑順移動，預設為false
   */
  Click(coordinate: {x: number, y: number}, button: 'left' | 'right' | 'middle', isSmooth: boolean): boolean;
  /**
   * 雙點擊座標
   * @param coordinate 座標
   * @param button 按鈕，預設為left
   * @param isSmooth 是否滑順移動，預設為false
   */
  DoubleClick(coordinate: {x: number, y: number}, button: 'left' | 'right' | 'middle', isSmooth: boolean): boolean;
  /**
   * 拖拉座標
   * @param source 起始點座標
   * @param target 目的地座標
   * @param isSmooth 是否滑順移動，預設為false
   */
  Drag(source: {x: number, y: number}, target: {x: number, y: number}, isSmooth: boolean): boolean;
  /**
   * 移到座標
   * @param coordinate 座標
   * @param isSmooth 是否滑順移動，預設為false
   */
  Hover(coordinate: {x: number, y: number}, isSmooth: boolean): boolean;
}

interface CCTV {
  /**
   * 最大高度(顯示器高度)
   */
  maxHeight: number;
  /**
   * 最高寬度(顯示器寬度)
   */
  maxWidth: number;
  /**
   * x偏移，預設為0
   */
  offsetX: number;
  /**
   * y偏移，預設為0
   */
  offsetY: number;
  /**
   * 監視寬度，預設為顯示器寬度
   */
  sizeX: number;
  /**
   * 監視高度，預設為顯示器高度
   */
  sizeY: number;
  /**
   * 取得當前監視畫面
   * @param offsetX x偏移
   * @param offsetY y偏移
   * @param sizeX 寬度
   * @param sizeY 高度
   */
  getFrame(offsetX: number, offsetY: number, sizeX: number, sizeY: number): Buffer;
}

interface Position {
  /**
   * 名稱
   */
  name: string;
  /**
   * 圖像資料
   */
  image: Buffer;
  /**
   * 座標
   */
  coordinate: {x: number, y: number};
  /**
   * 相似度
   */
  probability: number;
  /**
   * Action物件
   */
  action: Action;
  /**
   * 點擊自己
   * @param button 按鈕，預設為left
   * @param isSmooth 是否滑順移動，預設為false
   */
  Click(button: 'left' | 'right' | 'middle', isSmooth: boolean): boolean
  /**
   * 雙點擊自己
   * @param button 按鈕，預設為left
   * @param isSmooth 是否滑順移動，預設為false
   */
  DoubleClick(button: 'left' | 'right' | 'middle', isSmooth: boolean): boolean
  /**
   * 移到自己
   * @param isSmooth 是否滑順移動，預設為false
   */
  Hover(isSmooth: boolean): boolean
}
/**
 * 官方的robotjs物件，可至官網查詢詳細用法
 */
export namespace robotjs {
  function captureScreen(): any;
  function dragMouse(): any;
  function getColor(): any;
  function getMousePos(): any;
  function getPixelColor(): any;
  function getScreenSize(): any;
  function getXDisplayName(): any;
  function keyTap(): any;
  function keyToggle(): any;
  function mouseClick(): any;
  function mouseToggle(): any;
  function moveMouse(): any;
  function moveMouseSmooth(): any;
  function scrollMouse(): any;
  function setKeyboardDelay(): any;
  function setMouseDelay(): any;
  function setXDisplayName(): any;
  function typeString(): any;
  function typeStringDelayed(): any;
  namespace screen {
    function capture(x: any, y: any, width: any, height: any): any;
  }
}
