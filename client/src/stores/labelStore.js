import { extendObservable, action, reaction, toJS } from 'mobx';
import taskStore from './taskStore';
import agent from 'utils/agent';
import { TASK_STATUS } from 'utils/const';
import { getImgPos } from 'utils/index';

const getTaskObj = (store) => {
  const { imgFolderPath, _id  } = store.task;
  const imgPos = getImgPos();
  const imgFullpath = store.imgArray[imgPos].src;
  const imgName = imgFullpath.substr(imgFolderPath.length + 2);

  return {
    imgFolderPath,
    _id,
    imgName,
  }
}

class LabelStore {

  constructor() {
    extendObservable(this, {
      current: 0,
      currentRect: 0,
      rectIsEditing: false,
      draggingPointIndex: -1,
      pointIsDragging: false,
      pointIsDrawing: false,
      labelData: [],

      isLoading: true,
      currentWidth: 500,

      imgArray: [],
      task: undefined,
      error: undefined,
    });

    reaction(
      () => this.imgArray.map(item => item.src),
      imgSrcArray => {
        window.localStorage.setItem('imgArray', JSON.stringify(this.imgArray));
      },
      { delay: 1000 }
    );
  }

  resetLabelData = action(() => {
    this.current = 0;
    this.currentRect = 0;
    this.draggingPointIndex = -1;
    this.currentWidth = 500;
    this.labelData.clear();
    this.error = undefined;
  })

  resetTask = action(() => {
    this.resetLabelData();
    this.isLoading = true;
  })

  resetStore = action(() => {
    this.resetTask();
    this.imgArray.clear();
  })

  undoHandler = action(() => {
    if (this.labelData.length === 0) return ;

    if (this.current === 0 && this.currentRect >= 1) {
      this.labelData.pop();
      this.currentRect--;
    }

    if (this.current === 1) {
      this.labelData[this.currentRect].p.pop();
    }
  })

  zoomInImgScale = action(() => {
    const beforeCurrentWidth = this.currentWidth;
    this.currentWidth -= 50;
    const zoomInRatio = this.currentWidth / beforeCurrentWidth;

    this.labelData.replace(
      this.labelData.map(item => ({
        x: item.x * zoomInRatio,
        y: item.y * zoomInRatio,
        w: item.w * zoomInRatio,
        h: item.h * zoomInRatio,
        p: item.p.map((point) => ({ x: point.x * zoomInRatio, y: point.y * zoomInRatio }))
      }))
    );
  })

  zoomOutImgScale = action(() => {
    const beforeCurrentWidth = this.currentWidth;
    this.currentWidth += 50;
    const zoomOutRatio = this.currentWidth / beforeCurrentWidth;

    this.labelData.replace(
      this.labelData.map(item => ({
        x: item.x * zoomOutRatio,
        y: item.y * zoomOutRatio,
        w: item.w * zoomOutRatio,
        h: item.h * zoomOutRatio,
        p: item.p.map((point) => ({ x: point.x * zoomOutRatio, y: point.y * zoomOutRatio }))
      }))
    );
  })

  mouseDownHandler = action((event) => {
    if (this.current === 0) { this.startDrawRect(event); }
    if (this.current === 1) { this.startDragPoint(event); }
  })

  mouseMoveHandler = action((event) => {
    if (this.current === 0) { this.drawingRect(event); }
    if (this.current === 1) { this.draggingPoint(event); }
  })

  mouseUpHandler = action((event) => {
    if (this.current === 0) { this.endDrawRect(event); }
    if (this.current === 1) { this.endDragPoint(event); }
  })

  startDrawRect = action((event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    this.labelData[this.currentRect] = {
      x: offsetX,
      y: offsetY,
      w: 0,
      h: 0,
      p: [],
    };
    this.rectIsEditing = true;
  })

  drawingRect = action((event) => {
    if (!this.rectIsEditing) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const currentLabelRect = this.labelData[this.currentRect];

    currentLabelRect.w = Math.abs(offsetX - currentLabelRect.x);
    if (currentLabelRect.x > offsetX) {
      currentLabelRect.x = offsetX;
    }

    currentLabelRect.h = Math.abs(offsetY - currentLabelRect.y);
    if (currentLabelRect.y > offsetY) {
      currentLabelRect.y = offsetY;
    }
  })

  endDrawRect = action((event) => {
    if (!this.rectIsEditing) return;

    this.rectIsEditing = false;
    this.currentRect += 1;
  })

  startDragPoint = action((event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const currentLabelPointArray = this.labelData[this.currentRect].p;
    const index = currentLabelPointArray.findIndex(item => Math.abs(item.x - offsetX) <= 12 && Math.abs(item.y - offsetY) <= 12);

    this.draggingPointIndex = index;
    this.pointIsDragging = index !== -1;
    this.pointIsDrawing = index === -1 && currentLabelPointArray.length < 28;
  })

  draggingPoint = action((event) => {
    if (!this.pointIsDragging) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const currentLabel = this.labelData[this.currentRect];
    currentLabel.p[this.draggingPointIndex] = { x: offsetX, y: offsetY };
  })

  endDragPoint = action((event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (this.pointIsDrawing) {
      this.labelData[this.currentRect].p.push({ x: offsetX, y: offsetY });
      this.pointIsDrawing = false;
    } else {
      this.draggingPointIndex = -1;
      this.pointIsDragging = false;
    }
  })

  nextHandler = action(() => {
    this.error = undefined;
    switch (this.current) {
      case 0:
        if (this.labelData.length > 0) {
          this.currentRect = 0;
        } else {
          this.error = '请至少画出一个框';
        }
        break;

      case 1:
        this.labelData.forEach((item, index) => {
          item.p.length < 28 && (this.error = `第${index + 1}个框未达到标注要求`);
        });
        break;

      case 2:
        this.saveHandler(TASK_STATUS.WAITING_REVIEW);
        break;

      case 3:
        this.resetLabelData();
        return ;

      default:
        break;
    }

    if (!this.error) {
      this.current++;
    }
  })

  changeCurrentRect = action((index) => {
    this.currentRect = index;
  })

  setImgArray = action((array) => {
    this.imgArray.replace(array);
  })

  checkAllImg = action((event) => {
    if (event.target.checked) {
      this.imgArray.replace(event.target.dataSource);
    } else {
      this.imgArray.clear();
    }
  })

  checkImg = action((event) => {
    if (event.target.checked) {
      this.imgArray.push(event.target.src);
    } else {
      this.imgArray.remove(event.target.src);
    }
  })

  asyncAction = action((promise) => {
    this.isLoading = true;
    return promise.finally(action((data) => {
      this.isLoading = false;
    }));
  })

  loadTask = action((_id) => {
    this.resetTask();
    this.task = taskStore.getTask(_id, 'dispatch');
    if (!this.task) {
      taskStore.loadTask(_id, 'dispatch').then(action(() => {
        this.task = taskStore.getTask(_id, 'dispatch');
      }));
    }
  })

  loadLabel = action(() => {
    const taskObj = getTaskObj(this);

    return this.asyncAction(
      agent.Label.one(taskObj)
        .then(action(({ data }) => {
          this.labelData = data.dataSet;
          this.currentWidth = data.currentWidth;
          this.currentRect = this.labelData.length;
        }))
    )
  })

  saveHandler = action(status => {
    const taskObj = getTaskObj(this);

    return this.asyncAction(
      agent.Label.update({
        task_id: taskObj._id,
        img_name: taskObj.imgName,
        current_width: this.currentWidth,
        data: toJS(this.labelData),
        status
      }).catch(
        action(({ message }) => {
          this.error = message;
        })
      )
    );
  });

  tempSaveHandler = action(() => {
    return this.saveHandler(TASK_STATUS.TEMP_SAVE);
  })
}

export default new LabelStore();
