import { useState, useEffect } from 'react';

export function useLoadAppData() {
  const [appData, setAppData] = useState({});

  useEffect(() => {
    async function fetchCounts() {
      const response = await fetch(`/api/getCounts`);
      const data = await response.json();
      return data;
    }

    async function fetchData(type) {
      const response = await fetch(`/api/getData?type=${type}`);
      const data = await response.json();
      return data;
    }

    async function loadAppData() {
      const cachedData = JSON.parse(localStorage.getItem('appData') || '{}');
      const cachedCounts = JSON.parse(localStorage.getItem('appCounts') || '{}');
      setAppData(cachedData);

      const currentCounts = await fetchCounts();
      const categories = ['jokes', 'thoughts', 'fitness', 'finance', 'misc'];
      const combinedData = { ...cachedData };

      const dataFetchPromises = categories.map(async (category) => {
        if (cachedCounts[category] !== currentCounts[category] || !cachedData[category]) {
          const data = await fetchData(category);
          combinedData[category] = data;
        }
      });
      await Promise.all(dataFetchPromises);

      localStorage.setItem('appData', JSON.stringify(combinedData));
      localStorage.setItem('appCounts', JSON.stringify(currentCounts));

      const userData = {};
      Object.keys(combinedData).forEach((category) => {
        combinedData[category].forEach(({ user, id, texted }) => {
          if (!userData[user]) userData[user] = { jokes: {}, thoughts: {}, fitness: {}, finance: {}, misc: {} };
          userData[user][category][id] = texted;
        });
      });

      setAppData(userData);
    }

    loadAppData();
  }, []);

  return { appData, setAppData };
}