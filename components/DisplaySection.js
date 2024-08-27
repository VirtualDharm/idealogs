import React from 'react';

const DisplaySection = ({ items, highlightedItem, onItemClick, selectedUser }) => {
  return (
    <div className="display-section">
      <div className="items-container">
        {Object.entries(items).map(([id, { texted, user }]) => {
          const isHighlighted = highlightedItem === id;
          // Only apply user-specific color if the "All" filter is selected
          const shouldHighlight = selectedUser === 'all';

          return (
            <div
              key={id}
              className={`item-text ${isHighlighted ? 'highlighted' : ''}`}
              onClick={() => onItemClick(id)}
              style={{
                borderColor: isHighlighted && shouldHighlight ? `var(--${user}-color)` : '#ccc',
                color: isHighlighted && shouldHighlight ? `var(--${user}-color)` : '#333',
              }}
            >
              {texted}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DisplaySection;
