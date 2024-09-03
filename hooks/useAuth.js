import { useState } from 'react';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authDetails, setAuthDetails] = useState({ name: '', phone: '', password: '', confirmPassword: '' });

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthDetails({ ...authDetails, [name]: value });
  };

  const handleAuthSubmit = async () => {
    if (isRegisterMode) {
      if (authDetails.password !== authDetails.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: authDetails.name,
          phone: authDetails.phone,
          password: authDetails.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentUser({ name: result.data.name });
        setIsAuthDialogOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error}`);
      }
    } else {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: authDetails.phone,
          password: authDetails.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser({ name: data.user.name });
        setIsAuthDialogOpen(false);
      } else {
        alert('Login failed');
      }
    }
  };

  return {
    currentUser,
    isAuthDialogOpen,
    isRegisterMode,
    authDetails,
    setIsAuthDialogOpen,
    setIsRegisterMode,
    handleAuthChange,
    handleAuthSubmit,
  };
}
