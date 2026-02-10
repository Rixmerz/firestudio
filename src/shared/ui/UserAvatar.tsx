import { useState } from 'react';
import { Avatar } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * Generates a consistent color based on a string (like Telegram's avatar colors)
 * @param {string} str - String to generate color from
 * @returns {string} - HSL color string
 */
const stringToColor = (str: string): string => {
  if (!str) return '#9e9e9e';

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate a hue from 0-360, with good saturation and lightness for visibility
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 45%)`;
};

/**
 * Gets initials from a name or email
 * @param {string} displayName - User's display name
 * @param {string} email - User's email
 * @returns {string} - 1-2 character initials
 */
const getInitials = (displayName?: string, email?: string): string => {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  }

  if (email) {
    const localPart = email.split('@')[0];
    return localPart.substring(0, 2).toUpperCase();
  }

  return '?';
};

/**
 * UserAvatar Component
 * Displays user avatar with photo URL or colored text initials (like Telegram)
 *
 * @param {Object} props
 * @param {string} props.photoURL - User's photo URL
 * @param {string} props.displayName - User's display name
 * @param {string} props.email - User's email (fallback for initials)
 * @param {number} props.size - Avatar size in pixels (default: 40)
 * @param {Object} props.sx - Additional MUI sx styles
 */
interface UserAvatarProps {
  photoURL?: string;
  displayName?: string;
  email?: string;
  size?: number;
  sx?: SxProps<Theme>;
}

const UserAvatar = ({ photoURL, displayName, email, size = 40, sx = {} }: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const initials = getInitials(displayName, email);
  const bgColor = stringToColor(email || displayName || '');

  // Show image avatar if photoURL exists and hasn't errored
  if (photoURL && !imageError) {
    return (
      <Avatar
        src={photoURL}
        alt={displayName || email || 'User'}
        onError={() => setImageError(true)}
        sx={{
          width: size,
          height: size,
          fontSize: size * 0.4,
          ...sx,
        }}
      />
    );
  }

  // Show text avatar with colored background
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: bgColor,
        color: '#fff',
        fontSize: size * 0.4,
        fontWeight: 600,
        ...sx,
      }}
    >
      {initials}
    </Avatar>
  );
};

export default UserAvatar;
