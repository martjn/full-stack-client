import React from 'react'
import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({date}) => {
  const timeAgo = formatDistanceToNow(new Date(date), {addSuffix: true});
  return (
    <span>{timeAgo}</span>
  )
}

export default TimeAgo