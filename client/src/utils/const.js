const userNameRegex = /^[0-9A-Za-z\u4e00-\u9fa5]{5,20}$/
const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]).{8,}$/;
const STEPS = [
  { title: '标框', },
  { title: '标点', },
  { title: '完成' }
];
const DRAW_STEPS = [
  { title: '选定大小', },
  { title: '开始涂鸦', },
  { title: '完成' }
];
const TASK_STATUS = {
  UN_START: 0,
  TEMP_SAVE: 1,
  WAITING_REVIEW: 2,
  REJECTED: 3,
  PASS: 4,
};
const TASK_KIND = {
  1: '标点',
  2: '画图'
};
const antithesesPointPos = [
  { t: 50, l: 50 },
  { t: 60, l: 60 },
  { t: 70, l: 70 },
  { t: 80, l: 80 },
  { t: 90, l: 90 },
  { t: 100, l: 100 },
  { t: 50, l: 60 },
  { t: 60, l: 70 },
  { t: 70, l: 80 },
  { t: 80, l: 90 },
  { t: 90, l: 100 },
  { t: 100, l: 110 },
  { t: 110, l: 120 },
  { t: 120, l: 130 },
  { t: 130, l: 140 },
  { t: 140, l: 150 },
  { t: 150, l: 150 },
  { t: 110, l: 110 },
  { t: 120, l: 120 },
  { t: 130, l: 130 },
  { t: 140, l: 140 },
  { t: 160, l: 160 },
  { t: 50, l: 110 },
  { t: 50, l: 120 },
  { t: 50, l: 130 },
  { t: 50, l: 140 },
  { t: 50, l: 150 },
  { t: 60, l: 110 },
]

export {
  userNameRegex,
  passwordRegex,
  STEPS,
  DRAW_STEPS,
  TASK_STATUS,
  TASK_KIND,
  antithesesPointPos,
}
