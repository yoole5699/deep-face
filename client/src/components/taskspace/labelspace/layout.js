import styled from 'styled-components';

const LabelImg = styled.div`
  position: relative;
  display: inline-block;
  margin: 450px;
  height: 2000px;

  transition: all .3s linear;
`;

const Main = styled.div`
  position: relative;
  height: 450px;

  background-color: rgb(190, 194, 201);
  overflow: scroll;
`;

const OperationLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 1;
`;

const Point = styled.div`
  position: absolute;
  transition: all .3s ease-out;
  width: 12px;
  height: 12px;
  border-radius: 50%;
`;

const PointWithNum = Point.extend`
  &::after {
    content: ${({ content }) => `'${content}'`};
    margin-left: 12px;
    display: block;
    line-height: 12px;
    color: red;
  }
`;

export {
  LabelImg,
  Main,
  OperationLayer,
  Point,
  PointWithNum
};
