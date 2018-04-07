import { extendObservable, action, toJS } from 'mobx';
import labelStore from './labelStore';
import { TASK_STATUS } from 'utils/const';

class DrawStore {

  constructor() {
    extendObservable(this, {
      drawType: 'pencil',
      ctx: undefined,
      from: 0,
      to: 0,
      hasLabeled: false,
      labelData: undefined,

      isLoading: true,
      currentWidth: 500,

      error: undefined,
    });
  }

  resetLabelData = action(() => {
    this.hasLabeled = false;
    this.labelData = undefined;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.currentWidth = 500;
    this.error = undefined;
  })

  resetStore = action(() => {
    this.resetLabelData();
    this.drawType = 'pencil';
    this.from = 0;
    this.to = 0;
    this.ctx = undefined;
  })

  setContext = action((ctx) => {
    this.ctx = ctx;
    if (this.labelData.w) {
      const imageData = new ImageData(new Uint8ClampedArray(this.labelData.array), this.labelData.w, this.labelData.h);
      ctx.putImageData(imageData, 0, 0);
    }
    this.ctx.strokeStyle = '#fff';
    this.ctx.fillStyle = "rgba(0,0,0,1)";
    this.ctx.lineWidth = 2;
  })

  initLabel = action((label) => {
    console.log(toJS(label), '---toJS(label)---');
    this.currentWidth = label.data.currentWidth;
    this.labelData = label.data.dataSet || {};
  })

  changeStorkeStyle = action((colorObj) => {
    this.ctx.strokeStyle = colorObj.hex;
    this.drawType = 'pencil';
  })

  changeLineWidth = action((number) => {
    this.ctx.lineWidth = number;
  })

  changeDrawType = action((event) => {
    this.drawType = event.target.value;
  })

  zoomInImgScale = action(() => {
    this.currentWidth -= 50;
  })

  zoomOutImgScale = action(() => {
    this.currentWidth += 50;
  })

  mouseDownHandler = action((event) => {
    if (labelStore.current === 1) {
      this.isDrawing = true;
      const { offsetX, offsetY } = event.nativeEvent;
      this.from = offsetX;
      this.to = offsetY;
      this.ctx.beginPath();
    }
  })

  mouseMoveHandler = action((event) => {
    if (this.isDrawing) {
      const { offsetX, offsetY } = event.nativeEvent;
      if (this.drawType === 'pencil') {
        this.ctx.globalCompositeOperation="source-over";
        this.ctx.moveTo(this.from, this.to);
        this.ctx.lineTo(offsetX, offsetY);
        this.ctx.stroke();
      } else {
        this.ctx.globalCompositeOperation="destination-out";
        this.ctx.moveTo(this.from, this.to);
        this.ctx.arc(this.from, this.to, this.ctx.lineWidth, 0, Math.PI*2, false);
        this.ctx.fill();
      }
      this.from = offsetX;
      this.to = offsetY;
    }
  })

  finishDrawHandler = action((event) => {
    if (this.isDrawing) {
      this.hasLabeled = true;
    }
    this.isDrawing = false;
  })

  nextHandler = action(() => {
    this.error = undefined;
    switch (labelStore.current) {
      case 1:
        if (this.hasLabeled === false) {
          this.error = '请至少涂鸦一个位置';
        }
        break;

      case 2:
        this.getContextData();
        labelStore.saveHandler(TASK_STATUS.WAITING_REVIEW, this);
        break;

      case 3:
        this.resetLabelData();
        return ;

      default:
        break;
    }

    if (!this.error) {
      labelStore.current++;
    }
  })

  asyncAction = action((promise) => {
    this.isLoading = true;
    return promise.finally(action((data) => {
      this.isLoading = false;
    }));
  })

  getContextData = action(() => {
    const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.labelData = {
      array: Array.from(imageData.data),
      h: imageData.height,
      w: imageData.width,
    };
  })

  tempSaveHandler = action(() => {
    this.getContextData();
    return labelStore.tempSaveHandler(this);
  })
}

export default new DrawStore();
