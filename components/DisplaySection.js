import React, { useEffect } from 'react';

const DisplaySection = ({ items, highlightedItem, onItemClick, selectedUser }) => {

  return (
    <div className="display-section">
      <div className="items-container">
        {Object.entries(items).map(([id, { texted, user }]) => {
          const isHighlighted = highlightedItem === id;
          const shouldHighlight = selectedUser === 'all' || selectedUser === 'others';

          return (
            <div
              key={id}
              className={`item-text ${isHighlighted ? 'highlighted' : ''}`}
              onClick={() => {
                onItemClick(id);
              }}
              style={{
                borderColor: isHighlighted && shouldHighlight ? `var(--${user}-color)` : '#ccc',
                color: isHighlighted && shouldHighlight ? `var(--${user}-color)` : '#333',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{texted}</span>
              {selectedUser === 'others' && (
                <span className="item-user">
                  - {user.replace('other_', '')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DisplaySection;
