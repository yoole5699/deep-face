import PendingCard from './PendingCard' ;
import FulfilledCard from './FulfilledCard';
import OriginCard from './OriginCard';
import DispatchCard from './DispatchCard';

const TaskCard = (type) => {
  switch (type) {
    case 'pending': return PendingCard;
    case 'fulfilled': return FulfilledCard;
    case 'origin': return OriginCard;
    case 'dispatch': return DispatchCard;
    default: return null;
  }
}

export default TaskCard;
