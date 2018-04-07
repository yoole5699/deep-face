import { extendObservable, action, reaction, toJS } from 'mobx';
import taskStore from './taskStore';
import agent from 'utils/agent';
import { TASK_STATUS } from 'utils/const';
import { getImgPos } from 'utils/index';

const getTaskObj = (store) => {
  const { imgFolderPath, _id, labels  } = store.task;
  const imgPos = getImgPos();
  const imgFullpath = store.imgArray[imgPos].src;
  const imgName = imgFullpath.substr(imgFolderPath.length + 2);

  return {
    imgName,
    imgFolderPath,
    labelItem: labels.find(item => item.name === imgName),
    taskId: _id,
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
      contextMenu: undefined,

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

    reaction(
      () => this.contextMenu,
      menu => {
        if (!menu) { document.body.removeEventListener('click', this.destroyContextMenu, false); }
      }
    )
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
    this.task = undefined;
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
        p: item.p.map((point) => ({ x: point.x * zoomInRatio, y: point.y * zoomInRatio, s: point.status }))
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
        p: item.p.map((point) => ({ x: point.x * zoomOutRatio, y: point.y * zoomOutRatio, s: point.status }))
      }))
    );
  })

  contextMenuHandler = action((event) => {
    if (this.current === 1) {
      const { offsetX, offsetY } = event.nativeEvent;
      let pointIndex = -1;
      let rectIndex = -1;
      for (var i = 0; i < this.labelData.length; i++) {
        pointIndex = this.labelData[i].p.findIndex(item => Math.abs(item.x - offsetX) <= 12 && Math.abs(item.y - offsetY) <= 12);
        if (pointIndex >= 0) {
          rectIndex = i;
          break;
        }
      }

      if (pointIndex >= 0 && rectIndex >= 0) {
        this.contextMenu = {
          rectIndex,
          pointIndex,
        };
        document.body.addEventListener('click', this.destroyContextMenu, false);
      }
    }
  })

  setPointStatus = action(({ key, domEvent }) => {
    this.labelData[this.contextMenu.rectIndex].p[this.contextMenu.pointIndex].s = parseInt(key, 10);
  })

  destroyContextMenu = action(() => {
    setTimeout(action(() => {
      this.contextMenu = undefined;
    }), 0);
  })

  mouseDownHandler = action((event) => {
    if (event.button === 0) {
      if (this.current === 0) { this.startDrawRect(event); }
      if (this.current === 1) { this.startDragPoint(event); }
    }
  })

  mouseMoveHandler = action((event) => {
    if (this.current === 0) { this.drawingRect(event); }
    if (this.current === 1) { this.draggingPoint(event); }
  })

  mouseUpHandler = action((event) => {
    if (event.button === 0) {
      if (this.current === 0) { this.endDrawRect(event); }
      if (this.current === 1) { this.endDragPoint(event); }
    }
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
    this.pointIsDrawing = index === -1 && currentLabelPointArray.length < this.task.kind.n;
  })

  draggingPoint = action((event) => {
    if (!this.pointIsDragging) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const currentLabel = this.labelData[this.currentRect];
    currentLabel.p[this.draggingPointIndex].x = offsetX;
    currentLabel.p[this.draggingPointIndex].y = offsetY;
  })

  endDragPoint = action((event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (this.pointIsDrawing) {
      this.labelData[this.currentRect].p.push({ x: offsetX, y: offsetY, s: 1 });
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
          item.p.length < this.task.kind.n && (this.error = `第${index + 1}个框未达到标注要求`);
        });
        break;

      case 2:
        this.saveHandler(TASK_STATUS.WAITING_REVIEW, this);
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

  initLabel = action((label) => {
    this.labelData = label.data.dataSet || [];
    this.currentWidth = label.data.currentWidth;
    this.currentRect = this.labelData.length;
  })

  loadLabel = action((store) => {
    const taskObj = getTaskObj(this);
    const suffix = taskObj.imgName.lastIndexOf('.');
    const labelFilePath = taskObj.imgFolderPath + '/' +  taskObj.imgName.substring(0, suffix) + '.json';
    return this.asyncAction(
      agent.Label.file(labelFilePath, this.task._id)
        .then(action((data) => {
          store.initLabel(taskObj.labelItem);
          // console.log(data, '---data---');
        }))
    )
    // return this.asyncAction(
    //   agent.Label.one(taskObj)
    //     .then(action(({ data }) => {
          // {
          //   imgFolderPath,
          //   _id,
          //   imgName,
          // }
          // const labelData = require()
          // this.labelData = data.dataSet;
          // this.currentWidth = data.currentWidth;
          // this.currentRect = this.labelData.length;
    //     }))
    // )
  })

  saveHandler = action((status, store) => {
    const taskObj = getTaskObj(this);
    console.log(toJS(store), '---toJs(store)---');

    return this.asyncAction(
      agent.Label.update({
        status,
        _id: taskObj.labelItem._id,
        task_id: taskObj.taskId,
        img_name: taskObj.imgName,
        current_width: store.currentWidth,
        data: toJS(store.labelData),
      })
        .then(
          action(() => {
            taskObj.labelItem.status = status;
            // taskObj.labelItem.data.dataSet = store.labelData;
            // taskObj.labelItem.data.currentWidth = store.currentWidth;
          })
        )
        .catch(
          action(({ message }) => {
            store.error = message;
          })
        )
    );
  });

  tempSaveHandler = action((store) => {
    return this.saveHandler(TASK_STATUS.TEMP_SAVE, store);
  })
}

export default new LabelStore();
