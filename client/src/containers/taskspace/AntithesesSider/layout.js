import styled from 'styled-components';

const Main = styled.div`
  padding: 40px 30px 50px;
  color: rgb(187, 187, 187);
`;

const Title = styled.div`
  margin-bottom: 20px;
  text-align: center;
  color: rgb(245, 245, 245);
`;

const AvatarArea = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 180px;
  height: 200px;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
`;

const Point = styled.div`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: 5px;
  height: 5px;
  z-index: 10;
  background-color: ${({ isActived, isActiving }) =>
    isActiving
    ? 'red'
    : isActived
      ? '#7A7A7A'
      : '#D8D8D8'
  };
  border-radius: 50%;

  &::after {
    content: ${({ content, isActiving }) => isActiving && `'${content}'` };
    margin-left: 5px;
    display: block;
    line-height: 5px;
    color: red;
  }
`;

export {
  Main,
  Title,
  Avatar,
  AvatarArea,
  Point,
};
