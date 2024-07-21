import React from 'react'

export default ({ onClick }) => <i 
    className="fa fa-plus-square fa-2x" 
    style={{ color: '#1e90ff', cursor: 'pointer' }}
    onMouseEnter={e => e.target.style.color = '#0a82f7'} 
    onMouseLeave={e => e.target.style.color = '#1e90ff'}
    onClick={onClick}
/>