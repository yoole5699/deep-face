import { extendObservable, action, reaction, toJS } from 'mobx';
import taskStore from './taskStore';
import agent from 'utils/agent';
import { getImgPos } from 'utils/index';

const getTaskObj = (store) => {
  const { imgFolderPath, _id, title, initialtorName, specifiedExecutor, labels } = store.task;
  const imgPos = getImgPos();
  const imgFullpath = store.imgArray[imgPos].src;
  const imgName = imgFullpath.substr(imgFolderPath.length + 2);

  return {
    title,
    _id,
    imgName,
    imgFolderPath,
    initialtorName,
    specifiedExecutor,
    labelItem: labels.find(item => item.name === imgName),
  }
}

class ReviewStore {

  constructor() {
    extendObservable(this, {
      labelData: [],

      isLoading: true,
      currentWidth: 500,
      currentRect: 0,

      comment: '',
      imgArray: [],
      task: undefined,
      error: undefined,
    });

    reaction(
      () => this.imgArray.map(item => item.src),
      imgSrcArray => {
        window.localStorage.setItem('reviewImgArray', JSON.stringify(this.imgArray));
      },
      { delay: 1000 }
    );
  }

  resetLabelData = action(() => {
    this.currentWidth = 500;
    this.currentRect = 0;
    this.labelData = [];
    this.error = undefined;
  })

  resetTask = action(() => {
    this.resetLabelData();
    this.isLoading = true;
    this.comment = '';
  })

  resetStore = action(() => {
    this.resetTask();
    this.imgArray.clear();
  })

  zoomInImgScale = action(() => {
    const beforeCurrentWidth = this.currentWidth;
    this.currentWidth -= 50;

    if (this.task.kind.t === "1") {
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
    }
  })

  zoomOutImgScale = action(() => {
    const beforeCurrentWidth = this.currentWidth;
    this.currentWidth += 50;

    if (this.task.kind.t === "1") {
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
    }
  })

  changeCurrentRect = action((index) => {
    this.currentRect = index;
  })

  setImgArray = action((array) => {
    this.imgArray.replace(array);
  })

  setComment = action((event) => {
    this.comment = event.target.value;
  })

  setContext = action((ctx) => {
    this.ctx = ctx;
  })

  renderCanvas = action(() => {
    this.ctx.canvas.height = this.labelData.h;
    this.ctx.canvas.width = this.labelData.w;
    if (this.labelData.array) {
      const imageData = new ImageData(new Uint8ClampedArray(this.labelData.array), this.labelData.w, this.labelData.h);
      this.ctx.putImageData(imageData, 0, 0);
    }
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
    this.error = undefined;
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
    const suffix = taskObj.imgName.lastIndexOf('.');
    const labelFilePath = taskObj.imgFolderPath + '/' +  taskObj.imgName.substring(0, suffix) + '.json';

    return this.asyncAction(
      agent.Label.file(labelFilePath, this.task._id)
        .then(action((data) => {
          this.labelData = toJS(taskObj.labelItem.data.dataSet || []);
          this.currentWidth = taskObj.labelItem.data.currentWidth;
          if (this.ctx) { this.renderCanvas(); }
        }))
    );
  })

  updateHandler = action(status => {
    const taskObj = getTaskObj(this);

    return this.asyncAction(
      agent.Label.updateStatus({
        status,
        _id: taskObj.labelItem._id,
        task_id: taskObj._id,
        title: taskObj.title,
        specified_executor: taskObj.specifiedExecutor,
        initialtor_name: taskObj.initialtorName,
        img_name: taskObj.imgName,
        comment: this.comment,
      }).catch(
        action(({ message }) => {
          this.error = message;
        })
      )
    );
  })
}

export default new ReviewStore();
