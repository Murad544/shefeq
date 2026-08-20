import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const NAV_ITEMS = [
  { id: 'profile', label: 'Profil', icon: <AccountCircleIcon /> },
  { id: 'training', label: 'Təlim', icon: <SchoolIcon /> },
  { id: 'download', label: 'Oyun yükləmə', icon: <DownloadIcon /> },
  { id: 'stats', label: 'Oyun Statistikası', icon: <BarChartIcon /> },
  { id: 'leaderboard', label: 'Liderlik cədvəli', icon: <LeaderboardIcon /> },
  // { id: 'levels', label: 'Levellər', icon: <VideogameAssetIcon /> },
  
];

const Sidebar = ({ active, onSelect, userRole }) => {
  const isTrainer = userRole === 'trainer';
  const visibleNavItems = isTrainer
    ? NAV_ITEMS.filter((item) => ['profile', 'training'].includes(item.id))
    : NAV_ITEMS;

  return (
    <Box sx={{ width: 240, bgcolor: 'background.paper', height: '100%', borderRight: '1px solid #e0e0e0' }}>
      <List>
        {visibleNavItems.map(item => (
          <ListItemButton
            key={item.id}
            selected={active === item.id}
            onClick={() => onSelect && onSelect(item.id)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;