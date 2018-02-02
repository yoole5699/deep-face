import styled from 'styled-components';

const Avatar = styled.img`
  border-radius: 50%;
`

const MdAvatar = Avatar.extend`
  width: 60px;
  height: 60px;
`

const LgAvatar = Avatar.extend`
  width: 130px;
  height: 130px;
`

export {
  MdAvatar,
  LgAvatar,
};
