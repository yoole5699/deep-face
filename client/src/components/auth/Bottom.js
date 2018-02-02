import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BottomLink = styled(Link)`
  margin-right: 10px;

  color: #C2B0A7;
`;

const Bottom = styled.div`
  margin-top: 25px;
  
  display: flex;
  justify-content: flex-end;
`;

Bottom.Link = BottomLink;

BottomLink.propTypes = {
  to: PropTypes.string.isRequired
}

export default Bottom;