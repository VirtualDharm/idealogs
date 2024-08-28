import React, { useState, useEffect } from 'react';
import DisplaySection from '../components/DisplaySection';
import PreCallSetup from '../components/PreCallSetup';
import VideoCall from '../components/VideoCall';

export default function Home() {
  const [appData, setAppData] = useState({});
  const [selectedJokesUser, setSelectedJokesUser] = useState('all');
  const [selectedThoughtsUser, setSelectedThoughtsUser] = useState('all');
  const [selectedFitnessUser, setSelectedFitnessUser] = useState('all');
  const [selectedFinanceUser, setSelectedFinanceUser] = useState('all');
  const [highlightedJoke, setHighlightedJoke] = useState(null);
  const [highlightedThought, setHighlightedThought] = useState(null);
  const [highlightedFitness, setHighlightedFitness] = useState(null);
  const [highlightedFinance, setHighlightedFinance] = useState(null);
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
      const fitness = await fetchData('fitness');
      const finance = await fetchData('finance');

      const combinedData = {};
      const categories = { jokes, thoughts, fitness, finance };

      Object.keys(categories).forEach((category) => {
        categories[category].forEach(({ user, id, texted }) => {
          if (!combinedData[user]) combinedData[user] = { jokes: {}, thoughts: {}, fitness: {}, finance: {} };
          combinedData[user][category][id] = texted;
        });
      });

      setAppData(combinedData);
    }

    loadAppData();
  }, []);

  const getItems = (category, selectedUser) => {
    if (selectedUser === 'all') {
      const combinedItems = {};
      Object.keys(appData).forEach((user) => {
        Object.entries(appData[user][category])
          .sort((a, b) => b[0] - a[0])
          .forEach(([key, item]) => {
            combinedItems[`${user}_${key}`] = { texted: item, user };
          });
      });
      return combinedItems;
    }
    return Object.entries(appData[selectedUser][category])
      .sort((a, b) => b[0] - a[0])
      .reduce(
        (acc, [key, item]) => ({
          ...acc,
          [`${selectedUser}_${key}`]: { texted: item, user: selectedUser },
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
  const fitnessCount = getCounts('fitness');
  const financeCount = getCounts('finance');

  const sortUsersByCount = (counts) => {
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  };

  const sortedJokesUsers = sortUsersByCount(jokesCount);
  const sortedThoughtsUsers = sortUsersByCount(thoughtsCount);
  const sortedFitnessUsers = sortUsersByCount(fitnessCount);
  const sortedFinanceUsers = sortUsersByCount(financeCount);

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
    if (roomName.trim()) {
      setSetupComplete(false); // Ensure the pre-call setup shows up after room name input
    }
  };

  const handleSetupComplete = (options) => {
    setSetupOptions(options);
    setSetupComplete(true);
    setInMeeting(true); // Start the meeting
    setIsMeetDialogOpen(false); // Close the dialog after setup
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

        const updatedData = { ...appData };
        if (!updatedData[newEntry.user]) updatedData[newEntry.user] = { jokes: {}, thoughts: {}, fitness: {}, finance: {} };
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
    setHighlightedFitness(null);
    setHighlightedFinance(null);
  };

  const handleThoughtClick = (id) => {
    setHighlightedThought(id);
    setHighlightedJoke(null);
    setHighlightedFitness(null);
    setHighlightedFinance(null);
  };

  const handleFitnessClick = (id) => {
    setHighlightedFitness(id);
    setHighlightedJoke(null);
    setHighlightedThought(null);
    setHighlightedFinance(null);
  };

  const handleFinanceClick = (id) => {
    setHighlightedFinance(id);
    setHighlightedJoke(null);
    setHighlightedThought(null);
    setHighlightedFitness(null);
  };

  const handleHomeClick = () => {
    window.location.reload(); // Refresh the page to reset the state
  };

  return (
    <div className="app-container">
      <span className="app-title">📚✒️ Idea Logs 🌍
        {!inMeeting && (
          <button className="header-button" onClick={handleMeetDialogOpen}>
            Meet
          </button>
        )}
        {inMeeting && (
          <button className="header-button" onClick={handleHomeClick}>
            Home
          </button>
        )}
      </span>

      {inMeeting ? (
        <div className="meeting-container">
          {setupComplete ? (
            <VideoCall roomName={roomName} user={{ name: 'User Name' }} />
          ) : (
            <PreCallSetup onSetupComplete={handleSetupComplete} />
          )}
        </div>
      ) : (
        <div className="content-container">
          {/* Sections for Jokes, Thoughts, Fitness, Finance */}
          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Jokes</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              <span
                className={`filter-item ${selectedJokesUser === 'all' ? 'selected' : ''}`}
                onClick={() => setSelectedJokesUser('all')}
              >
                All ({Object.keys(getItems('jokes', selectedJokesUser)).length})
              </span>
              {sortedJokesUsers.map((user) => (
                <span
                  key={user}
                  className={`filter-item ${selectedJokesUser === user ? 'selected' : ''} ${user}`}
                  onClick={() => setSelectedJokesUser(user)}
                >
                  {user.charAt(0).toUpperCase() + user.slice(1)} ({jokesCount[user]})
                </span>
              ))}
            </div>
            <DisplaySection
              items={getItems('jokes', selectedJokesUser)}
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
              <span
                className={`filter-item ${selectedThoughtsUser === 'all' ? 'selected' : ''}`}
                onClick={() => setSelectedThoughtsUser('all')}
              >
                All ({Object.keys(getItems('thoughts', selectedThoughtsUser)).length})
              </span>
              {sortedThoughtsUsers.map((user) => (
                <span
                  key={user}
                  className={`filter-item ${selectedThoughtsUser === user ? 'selected' : ''} ${user}`}
                  onClick={() => setSelectedThoughtsUser(user)}
                >
                  {user.charAt(0).toUpperCase() + user.slice(1)} ({thoughtsCount[user]})
                </span>
              ))}
            </div>
            <DisplaySection
              items={getItems('thoughts', selectedThoughtsUser)}
              highlightedItem={highlightedThought}
              onItemClick={handleThoughtClick}
              selectedUser={selectedThoughtsUser}
            />
          </div>

          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Fitness</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              <span
                className={`filter-item ${selectedFitnessUser === 'all' ? 'selected' : ''}`}
                onClick={() => setSelectedFitnessUser('all')}
              >
                All ({Object.keys(getItems('fitness', selectedFitnessUser)).length})
              </span>
              {sortedFitnessUsers.map((user) => (
                <span
                  key={user}
                  className={`filter-item ${selectedFitnessUser === user ? 'selected' : ''} ${user}`}
                  onClick={() => setSelectedFitnessUser(user)}
                >
                  {user.charAt(0).toUpperCase() + user.slice(1)} ({fitnessCount[user]})
                </span>
              ))}
            </div>
            <DisplaySection
              items={getItems('fitness', selectedFitnessUser)}
              highlightedItem={highlightedFitness}
              onItemClick={handleFitnessClick}
              selectedUser={selectedFitnessUser}
            />
          </div>

          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Finance</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              <span
                className={`filter-item ${selectedFinanceUser === 'all' ? 'selected' : ''}`}
                onClick={() => setSelectedFinanceUser('all')}
              >
                All ({Object.keys(getItems('finance', selectedFinanceUser)).length})
              </span>
              {sortedFinanceUsers.map((user) => (
                <span
                  key={user}
                  className={`filter-item ${selectedFinanceUser === user ? 'selected' : ''} ${user}`}
                  onClick={() => setSelectedFinanceUser(user)}
                >
                  {user.charAt(0).toUpperCase() + user.slice(1)} ({financeCount[user]})
                </span>
              ))}
            </div>
            <DisplaySection
              items={getItems('finance', selectedFinanceUser)}
              highlightedItem={highlightedFinance}
              onItemClick={handleFinanceClick}
              selectedUser={selectedFinanceUser}
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
              placeholder="Enter joke, thought, fitness tip, or finance advice..."
              value={newEntry.texted}
              onChange={handleEntryChange}
            />
            <select name="type" value={newEntry.type} onChange={handleEntryChange}>
              <option value="">Select type</option>
              <option value="jokes">Joke</option>
              <option value="thoughts">Thought</option>
              <option value="fitness">Fitness</option>
              <option value="finance">Finance</option>
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

      {isMeetDialogOpen && !setupComplete && (
        <div className="dialog-overlay">
          <div className="dialog">
            {!setupComplete && roomName === '' ? (
              <>
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
              </>
            ) : (
              <PreCallSetup onSetupComplete={handleSetupComplete} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
