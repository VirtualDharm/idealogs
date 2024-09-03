export function filterItems(appData, category, selectedUser) {
    if (!appData || Object.keys(appData).length === 0) return {};
  
    if (selectedUser === 'all') {
      const combinedItems = {};
      Object.keys(appData).forEach((user) => {
        if (appData[user][category]) {
          Object.entries(appData[user][category])
            .sort((a, b) => b[0] - a[0])
            .forEach(([key, item]) => {
              combinedItems[`${user}_${key}`] = { texted: item, user };
            });
        }
      });
      return combinedItems;
    }
  
    if (selectedUser === 'others') {
      const otherItems = {};
      Object.keys(appData).forEach((user) => {
        if (user.startsWith('other_') && appData[user][category]) {
          Object.entries(appData[user][category])
            .sort((a, b) => b[0] - a[0])
            .forEach(([key, item]) => {
              otherItems[`${user}_${key}`] = { texted: item, user: user.split('_')[1] };
            });
        }
      });
      return otherItems;
    }
  
    return Object.entries(appData[selectedUser]?.[category] || {})
      .sort((a, b) => b[0] - a[0])
      .reduce(
        (acc, [key, item]) => ({
          ...acc,
          [`${selectedUser}_${key}`]: { texted: item, user: selectedUser },
        }),
        {}
      );
  }
  