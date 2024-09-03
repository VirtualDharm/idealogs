import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import DisplaySection from '../components/DisplaySection';
import PreCallSetup from '../components/PreCallSetup';
import VideoCall from '../components/VideoCall';
import { useLoadAppData } from '../hooks/useLoadAppData';
import { useCenterDialog } from '../hooks/useCenterDialog';
import { categorizedUsers } from '../utils/categorizedUsers';
import { filterItems } from '../utils/filterItems';
import { useAuth } from '../hooks/useAuth';

const GlobeComponent = dynamic(() => import('../components/GlobeComponent'), {
  ssr: false,
});

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMeetDialogOpen, setIsMeetDialogOpen] = useState(false);
  const [selectedJokesUser, setSelectedJokesUser] = useState('all');
  const [selectedThoughtsUser, setSelectedThoughtsUser] = useState('all');
  const [selectedFitnessUser, setSelectedFitnessUser] = useState('all');
  const [selectedFinanceUser, setSelectedFinanceUser] = useState('all');
  const [selectedMiscUser, setSelectedMiscUser] = useState('all');
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [newEntry, setNewEntry] = useState({ type: '', user: '', texted: '', otherUser: '' });
  const [isJoining, setIsJoining] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [inMeeting, setInMeeting] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupOptions, setSetupOptions] = useState({});
  const [isHovering, setIsHovering] = useState(false);

  const appData = useLoadAppData();

  const {
    currentUser,
    isAuthDialogOpen,
    isRegisterMode,
    authDetails,
    setIsAuthDialogOpen,
    setIsRegisterMode,
    handleAuthChange,
    handleAuthSubmit,
  } = useAuth();

  useCenterDialog(isDialogOpen);      // For the Add New Entry dialog
  useCenterDialog(isAuthDialogOpen);  // For the Login/Register dialog
  useCenterDialog(isMeetDialogOpen);  // For the Join Meet dialog

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setNewEntry({ type: '', user: '', texted: '', otherUser: '' });
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
      setIsJoining(true);
      setSetupComplete(false);
    }
  };

  const handleSetupComplete = (options) => {
    setSetupOptions(options);
    setSetupComplete(true);
    setInMeeting(true);
    setIsMeetDialogOpen(false);
  };

  const handleHomeClick = () => {
    setInMeeting(false);
  };

  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    if (name === 'user' && value !== 'other') {
      setNewEntry({ ...newEntry, user: value, otherUser: '' });
    } else if (name === 'user' && value === 'other') {
      setNewEntry({ ...newEntry, user: 'other', otherUser: '' });
    } else if (name === 'otherUser') {
      setNewEntry({ ...newEntry, otherUser: value });
    } else {
      setNewEntry({ ...newEntry, [name]: value });
    }
  };

  const handleAddEntry = async () => {
    let userToSave = newEntry.user;
    if (newEntry.user === 'other') {
      userToSave = `other_${newEntry.otherUser.toLowerCase()}`;
    }

    if (newEntry.texted && newEntry.type && userToSave) {
      try {
        const response = await fetch('/api/addData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newEntry, user: userToSave }),
        });
        const data = await response.json();

        const updatedData = { ...appData };
        if (!updatedData[userToSave]) {
          updatedData[userToSave] = { jokes: {}, thoughts: {}, fitness: {}, finance: {}, misc: {} };
        }
        updatedData[userToSave][newEntry.type][data.id] = newEntry.texted;
        setAppData(updatedData);
        handleDialogClose();
      } catch (error) {
        console.error('Error adding data:', error);
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  const handleItemClick = (id) => {
    setHighlightedItem(id);
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <div className="title-section">
          <h1 className="app-title">📚✒️ Idea Logs</h1>
        </div>
        <div
          className="globe-interaction"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <GlobeComponent size={150} onClick={handleMeetDialogOpen} isHovering={isHovering} />
          {isHovering && (
            <span className="globe-text">
              {inMeeting ? 'RETURN TO HOME' : 'JOIN MEET'}
            </span>
          )}
        </div>
        <div className="rightmost-section">
          <div className="icon-with-text">
            <button className="icon-button" onClick={() => setIsAuthDialogOpen(true)}>
              👤
            </button>
            <span className="login-status">
              {currentUser ? currentUser.name : 'Not logged in'}
            </span>
          </div>
        </div>
      </div>

      {isAuthDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <span className="dialog-title">{isRegisterMode ? 'Register' : 'Login'}</span>
            {isRegisterMode && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={authDetails.name}
                onChange={handleAuthChange}
              />
            )}
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={authDetails.phone}
              onChange={handleAuthChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={authDetails.password}
              onChange={handleAuthChange}
            />
            {isRegisterMode && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={authDetails.confirmPassword}
                onChange={handleAuthChange}
              />
            )}
            <div className="dialog-buttons">
              <button onClick={handleAuthSubmit}>{isRegisterMode ? 'Register' : 'Login'}</button>
              <button onClick={() => setIsAuthDialogOpen(false)}>Cancel</button>
            </div>
            <div>
              <button onClick={() => setIsRegisterMode(!isRegisterMode)}>
                {isRegisterMode ? 'Switch to Login' : 'Switch to Register'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          {/* Jokes Section */}
          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Jokes</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              {categorizedUsers(appData, 'jokes').map(({ user, label }) => (
                <span
                  key={user}
                  className={`filter-item ${user} ${selectedJokesUser === user ? 'selected' : ''}`}
                  onClick={() => setSelectedJokesUser(user)}
                >
                  {label} ({Object.keys(filterItems(appData, 'jokes', user)).length})
                </span>
              ))}
            </div>
            <DisplaySection
              items={filterItems(appData, 'jokes', selectedJokesUser)}
              highlightedItem={highlightedItem}
              onItemClick={handleItemClick}
              selectedUser={selectedJokesUser}
            />
          </div>

          {/* Thoughts Section */}
          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Thoughts</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              {categorizedUsers(appData, 'thoughts').map(({ user, label }) => (
                <span
                  key={user}
                  className={`filter-item ${user} ${selectedThoughtsUser === user ? 'selected' : ''}`}
                  onClick={() => setSelectedThoughtsUser(user)}
                >
                  {label} ({Object.keys(filterItems(appData, 'thoughts', user)).length})
                </span>
              ))}
            </div>
            <DisplaySection
              items={filterItems(appData, 'thoughts', selectedThoughtsUser)}
              highlightedItem={highlightedItem}
              onItemClick={handleItemClick}
              selectedUser={selectedThoughtsUser}
            />
          </div>

          {/* Fitness Section */}
          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Fitness</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              {categorizedUsers(appData, 'fitness').map(({ user, label }) => (
                <span
                  key={user}
                  className={`filter-item ${user} ${selectedFitnessUser === user ? 'selected' : ''}`}
                  onClick={() => setSelectedFitnessUser(user)}
                >
                  {label} ({Object.keys(filterItems(appData, 'fitness', user)).length})
                </span>
              ))}
            </div>
            <DisplaySection
              items={filterItems(appData, 'fitness', selectedFitnessUser)}
              highlightedItem={highlightedItem}
              onItemClick={handleItemClick}
              selectedUser={selectedFitnessUser}
            />
          </div>

          {/* Finance Section */}
          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Finance</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              {categorizedUsers(appData, 'finance').map(({ user, label }) => (
                <span
                  key={user}
                  className={`filter-item ${user} ${selectedFinanceUser === user ? 'selected' : ''}`}
                  onClick={() => setSelectedFinanceUser(user)}
                >
                  {label} ({Object.keys(filterItems(appData, 'finance', user)).length})
                </span>
              ))}
            </div>
            <DisplaySection
              items={filterItems(appData, 'finance', selectedFinanceUser)}
              highlightedItem={highlightedItem}
              onItemClick={handleItemClick}
              selectedUser={selectedFinanceUser}
            />
          </div>

          {/* Miscellaneous Section */}
          <div className="section-container">
            <div className="header-with-button">
              <span className="section-header">Miscellaneous</span>
              <button className="add-button" onClick={handleDialogOpen}>
                Add
              </button>
            </div>
            <div className="user-filter">
              {categorizedUsers(appData, 'misc').map(({ user, label }) => (
                <span
                  key={user}
                  className={`filter-item ${user} ${selectedMiscUser === user ? 'selected' : ''}`}
                  onClick={() => setSelectedMiscUser(user)}
                >
                  {label} ({Object.keys(filterItems(appData, 'misc', user)).length})
                </span>
              ))}
            </div>
            <DisplaySection
              items={filterItems(appData, 'misc', selectedMiscUser)}
              highlightedItem={highlightedItem}
              onItemClick={handleItemClick}
              selectedUser={selectedMiscUser}
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
              placeholder="Enter your text..."
              value={newEntry.texted}
              onChange={handleEntryChange}
            />
            <select name="type" value={newEntry.type} onChange={handleEntryChange}>
              <option value="">Select category</option>
              <option value="jokes">Joke</option>
              <option value="thoughts">Thought</option>
              <option value="fitness">Fitness</option>
              <option value="finance">Finance</option>
              <option value="misc">Miscellaneous</option>
            </select>
            <select name="user" value={newEntry.user === `other_${newEntry.otherUser?.toLowerCase()}` ? 'other' : newEntry.user} onChange={handleEntryChange}>
              <option value="">Select user</option>
              <option value="ashok">Ashok</option>
              <option value="dharm">Dharm</option>
              <option value="swapnil">Swapnil</option>
              <option value="other">Other</option>
            </select>
            {newEntry.user === 'other' && (
              <input
                type="text"
                name="otherUser"
                placeholder="Enter user name"
                value={newEntry.otherUser || ''}
                onChange={handleEntryChange}
              />
            )}
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
            {!setupComplete && !isJoining ? (
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
