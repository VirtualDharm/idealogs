import React, { useState, useEffect } from 'react';
import DisplaySection from '../components/DisplaySection';
import PreCallSetup from '../components/PreCallSetup';
import VideoCall from '../components/VideoCall';

export default function Home() {
  const [appData, setAppData] = useState({});
  const [selectedJokesUser, setSelectedJokesUser] = useState('all');
  const [selectedThoughtsUser, setSelectedThoughtsUser] = useState('all');
  const [highlightedJoke, setHighlightedJoke] = useState(null);
  const [highlightedThought, setHighlightedThought] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ type: '', user: '', texted: '' });
  const [isMeetDialogOpen, setIsMeetDialogOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [inMeeting, setInMeeting] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupOptions, setSetupOptions] = useState({});

  useEffect(() => {
    async function fetchData(type) {
      const response = await fetch(`/api/getData?type=${type}`);
      const data = await response.json();
      return data;
    }

    async function loadAppData() {
      const jokes = await fetchData('jokes');
      const thoughts = await fetchData('thoughts');

      const combinedData = {};
      jokes.forEach(({ user, id, texted }) => {
        if (!combinedData[user]) combinedData[user] = { jokes: {}, thoughts: {} };
        combinedData[user].jokes[id] = texted;
      });
      thoughts.forEach(({ user, id, texted }) => {
        if (!combinedData[user]) combinedData[user] = { jokes: {}, thoughts: {} };
        combinedData[user].thoughts[id] = texted;
      });

      setAppData(combinedData);
    }

    loadAppData();
  }, []);

  const getJokes = () => {
    if (selectedJokesUser === 'all') {
      const combinedJokes = {};
      Object.keys(appData).forEach((user) => {
        Object.entries(appData[user].jokes)
          .sort((a, b) => b[0] - a[0])
          .forEach(([key, joke]) => {
            combinedJokes[`${user}_${key}`] = { texted: joke, user };
          });
      });
      return combinedJokes;
    }
    return Object.entries(appData[selectedJokesUser].jokes)
      .sort((a, b) => b[0] - a[0])
      .reduce(
        (acc, [key, joke]) => ({
          ...acc,
          [`${selectedJokesUser}_${key}`]: { texted: joke, user: selectedJokesUser },
        }),
        {}
      );
  };

  const getThoughts = () => {
    if (selectedThoughtsUser === 'all') {
      const combinedThoughts = {};
      Object.keys(appData).forEach((user) => {
        Object.entries(appData[user].thoughts)
          .sort((a, b) => b[0] - a[0])
          .forEach(([key, thought]) => {
            combinedThoughts[`${user}_${key}`] = { texted: thought, user };
          });
      });
      return combinedThoughts;
    }
    return Object.entries(appData[selectedThoughtsUser].thoughts)
      .sort((a, b) => b[0] - a[0])
      .reduce(
        (acc, [key, thought]) => ({
          ...acc,
          [`${selectedThoughtsUser}_${key}`]: { texted: thought, user: selectedThoughtsUser },
        }),
        {}
      );
  };

  const getCounts = (type) => {
    return Object.keys(appData).reduce((counts, user) => {
      counts[user] = Object.keys(appData[user][type]).length;
      return counts;
    }, {});
  };

  const jokesCount = getCounts('jokes');
  const thoughtsCount = getCounts('thoughts');

  const sortUsersByCount = (counts) => {
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  };

  const sortedJokesUsers = sortUsersByCount(jokesCount);
  const sortedThoughtsUsers = sortUsersByCount(thoughtsCount);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setNewEntry({ type: '', user: '', texted: '' });
  };

  const handleMeetDialogOpen = () => {
    setIsMeetDialogOpen(true);
  };

  const handleMeetDialogClose = () => {
    setIsMeetDialogOpen(false);
    setRoomName('');
  };

  const handleJoinCall = () => {
    console.log(`1`)
    if (roomName.trim()) {
      setInMeeting(true);
      setIsMeetDialogOpen(false);
    }
  };

  const handleSetupComplete = (options) => {
    setSetupOptions(options);
    setSetupComplete(true);
  };

  const handleEntryChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleAddEntry = async () => {
    if (newEntry.texted && newEntry.type && newEntry.user) {
      try {
        const response = await fetch('/api/addData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEntry),
        });
        const data = await response.json();
        console.log('Data added successfully:', data);

        const updatedData = { ...appData };
        if (!updatedData[newEntry.user]) updatedData[newEntry.user] = { jokes: {}, thoughts: {} };
        updatedData[newEntry.user][newEntry.type][data.id] = newEntry.texted;
        setAppData(updatedData);
        setNewEntry({ type: '', user: '', texted: '' });
        handleDialogClose();
      } catch (error) {
        console.error('Error adding data:', error);
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  const handleJokeClick = (id) => {
    setHighlightedJoke(id);
    setHighlightedThought(null);
  };

  const handleThoughtClick = (id) => {
    setHighlightedThought(id);
    setHighlightedJoke(null);
  };

  return (
    <div className="app-container">
      <span className="app-title">📚✒️ Idea Logs 🌍
        {!inMeeting && (
          <button className="meet-button" onClick={handleMeetDialogOpen}>
            Meet
          </button>
        )}
      </span>

      {inMeeting ? (
        <div className="meeting-container">
          {!setupComplete ? (
            <PreCallSetup onSetupComplete={handleSetupComplete} />
          ) : (
            <VideoCall roomName={roomName} user={{ name: 'User Name' }} />
          )}
        </div>
      ) : (
        <div className="content-container">
          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Jokes</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              {sortedJokesUsers.map((user) => (
                <span
                  key={user}
                  className={`filter-item ${selectedJokesUser === user ? 'selected' : ''} ${user}`}
                  onClick={() => setSelectedJokesUser(user)}
                >
                  {user.charAt(0).toUpperCase() + user.slice(1)} ({jokesCount[user]})
                </span>
              ))}
              <span
                className={`filter-item ${selectedJokesUser === 'all' ? 'selected' : ''}`}
                onClick={() => setSelectedJokesUser('all')}
              >
                All ({Object.keys(getJokes()).length})
              </span>
            </div>
            <DisplaySection
              items={getJokes()}
              highlightedItem={highlightedJoke}
              onItemClick={handleJokeClick}
              selectedUser={selectedJokesUser}
            />
          </div>
          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Thoughts</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              {sortedThoughtsUsers.map((user) => (
                <span
                  key={user}
                  className={`filter-item ${selectedThoughtsUser === user ? 'selected' : ''} ${user}`}
                  onClick={() => setSelectedThoughtsUser(user)}
                >
                  {user.charAt(0).toUpperCase() + user.slice(1)} ({thoughtsCount[user]})
                </span>
              ))}
              <span
                className={`filter-item ${selectedThoughtsUser === 'all' ? 'selected' : ''}`}
                onClick={() => setSelectedThoughtsUser('all')}
              >
                All ({Object.keys(getThoughts()).length})
              </span>
            </div>
            <DisplaySection
              items={getThoughts()}
              highlightedItem={highlightedThought}
              onItemClick={handleThoughtClick}
              selectedUser={selectedThoughtsUser}
            />
          </div>
        </div>
      )}

      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <span className="dialog-title">Add New Entry</span>
            <input
              type="text"
              name="texted"
              placeholder="Enter joke or thought..."
              value={newEntry.texted}
              onChange={handleEntryChange}
            />
            <select name="type" value={newEntry.type} onChange={handleEntryChange}>
              <option value="">Select type</option>
              <option value="jokes">Joke</option>
              <option value="thoughts">Thought</option>
            </select>
            <select name="user" value={newEntry.user} onChange={handleEntryChange}>
              <option value="">Select user</option>
              {Object.keys(appData).map((user) => (
                <option key={user} value={user}>
                  {user.charAt(0).toUpperCase() + user.slice(1)}
                </option>
              ))}
            </select>
            <div className="dialog-buttons">
              <button onClick={handleAddEntry}>Add</button>
              <button onClick={handleDialogClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isMeetDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <span className="dialog-title">Join a Meeting</span>
            <input
              type="text"
              name="roomName"
              placeholder="Enter Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <div className="dialog-buttons">
              <button onClick={handleJoinCall}>Join</button>
              <button onClick={handleMeetDialogClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
