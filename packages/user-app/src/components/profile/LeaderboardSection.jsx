import { Box, Card, CardContent, Grid, Typography, Divider, Avatar, List, ListItem, CircularProgress } from "@mui/material";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api/apiClient';
import { endpoints } from '../../services/api/endpoints';

const medalColors = {
  0: "#FFD700",  // Gold for 1st
  1: "#B0BEC5",  // Silver for 2nd
  2: "#CD7F32",  // Bronze for 3rd
};

const medalNames = {
  0: "Qızıl",    // Gold
  1: "Gümüş",    // Silver
  2: "Bürünc",   // Bronze
};

// Maps to display in leaderboard
const DISPLAYED_MAPS = ['baku_city_level', 'ghost_city_level', 'island_level_river', 'ghost_city_level_hard'];

// Map names translation
const MAP_NAMES = {
  'baku_city_level': 'Bakı',
  'ghost_city_level': 'Tərk edilmiş şəhər',
  'island_level_river': 'Meşəlik ərazi',
  'ghost_city_level_hard': 'Tərk edilmiş şəhər - 2',
};

const getMapDisplayName = (mapCode) => {
  return MAP_NAMES[mapCode?.toLowerCase?.()] || mapCode;
};

const LeaderboardSection = ({ userRole }) => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userRole === 'trainer') {
      setLoading(false);
      return;
    }
    fetchLeaderboard();
  }, [userRole]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = endpoints.leaderboard();
      const data = await apiClient.get(endpoint);
      setLeaderboardData(data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography color="error">Error loading leaderboard: {error}</Typography>
      </Box>
    );
  }

  const topLeaders = leaderboardData?.topLeaders || [];
  const mapLeaders = (leaderboardData?.mapLeaders || []).filter(
    map => DISPLAYED_MAPS.includes(map.mapCode?.toLowerCase?.())
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <LeaderboardIcon sx={{ mr: 1.5, fontSize: "2rem", color: "#4a6a8a" }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Liderlik cədvəli
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {topLeaders.map((leader, index) => (
          <Grid item xs={12} sm={4} key={leader.id || index}>
            <Card sx={{ borderRadius: 2, height: "100%", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "#757575" }}>
                      {medalNames[index] || "Digər"}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {leader.name}
                    </Typography>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: medalColors[index] || "#9E9E9E", 
                      color: "#000", 
                      width: 56, 
                      height: 56, 
                      fontWeight: 700 
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </Box>

                <Typography variant="body2" sx={{ color: "#616161" }}>
                  Ən yaxşı müddət: <strong>{leader.time}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Xəritə üzrə ən yaxşı vaxtlar
        </Typography>
        <Grid container spacing={3}>
          {mapLeaders.map((mapData) => (
            <Grid item xs={12} md={4} key={mapData.mapId}>
              <Card sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    {getMapDisplayName(mapData.mapCode)}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List disablePadding>
                    {mapData.leaders && mapData.leaders.length > 0 ? (
                      mapData.leaders.map((leader, index) => (
                        <ListItem key={leader.id || index} sx={{ px: 0, py: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#424242" }}>
                              {index + 1}. {leader.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#616161" }}>
                              {leader.time}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: "#999" }}>
                        Hələ lider yoxdur
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default LeaderboardSection;
