// utils/categorizedUsers.js

export function categorizedUsers(appData, type) {
    const counts = Object.keys(appData).reduce((counts, user) => {
      if (appData[user] && appData[user][type]) {
        counts[user] = Object.keys(appData[user][type]).length;
      } else {
        counts[user] = 0;
      }
      return counts;
    }, {});
  
    const sortedUsers = Object.keys(counts)
      .filter((user) => !user.startsWith('other_'))
      .sort((a, b) => counts[b] - counts[a]);
  
    const othersExist = Object.keys(counts).some((user) => user.startsWith('other_'));
  
    return [
      { user: 'all', label: 'All' },
      ...sortedUsers.map((user) => ({ user, label: user.charAt(0).toUpperCase() + user.slice(1) })),
      ...(othersExist ? [{ user: 'others', label: 'Others' }] : []),
    ];
  }
  