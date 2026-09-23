import {
  Alert,
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Map as MapIcon, Star as StarIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { apiClient } from '../../services/api/apiClient';
import { endpoints } from '../../services/api/endpoints';
import { DISPLAYED_MAPS, MAP_NAMES } from '../../constants/maps';
import { C, EASE, FONT, labelCaps } from "../../config/tokens";
import Panel from "../military/Panel";
import RadarLoader from "../military/RadarLoader";
import TacticalBackground from "../military/TacticalBackground";

const medalColors = {
  0: "#D4AF37",  // Gold for 1st
  1: "#B8C0C4",  // Silver for 2nd
  2: "#C0814A",  // Bronze for 3rd
};

const medalNames = {
  0: "Qızıl",    // Gold
  1: "Gümüş",    // Silver
  2: "Bürünc",   // Bronze
};

// Podium order on wide screens: 2nd, 1st, 3rd
const PODIUM_ORDER = { 0: 2, 1: 1, 2: 3 };
const PODIUM_HEIGHT = { 0: 150, 1: 112, 2: 88 };

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
      <Box sx={{ py: 6 }}>
        <RadarLoader message="Yüklənir" />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading leaderboard: {error}</Alert>;
  }

  const topLeaders = leaderboardData?.topLeaders || [];
  const mapLeaders = (leaderboardData?.mapLeaders || []).filter(
    map => DISPLAYED_MAPS.includes(map.mapCode?.toLowerCase?.())
  );

  return (
    <Box>
      {/* Podium */}
      <Box
        sx={{
          position: "relative",
          bgcolor: C.field800,
          color: C.textOnDark,
          px: { xs: 2, sm: 4 },
          pt: { xs: 3, sm: 4 },
          overflow: "hidden",
          mb: 4,
        }}
      >
        <TacticalBackground />
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ position: "relative", mb: 3 }}>
          <StarIcon sx={{ color: C.brass }} />
          <Box sx={{ ...labelCaps, fontSize: "0.9rem" }}>Şərəf kürsüsü</Box>
        </Stack>

        {topLeaders.length === 0 ? (
          <Box sx={{ position: "relative", pb: 4, color: C.textOnDarkMuted }}>
            Hələ lider yoxdur
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="flex-end" sx={{ position: "relative" }}>
            {topLeaders.map((leader, index) => {
              const medal = medalColors[index] || C.textOnDarkMuted;
              return (
                <Grid
                  item
                  xs={12}
                  md={4}
                  key={leader.id || index}
                  sx={{ order: { md: PODIUM_ORDER[index] ?? index + 1 } }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      mb: 1.5,
                      animation: `sg-fade-up .6s ${EASE.out} ${400 + index * 120}ms backwards`,
                    }}
                  >
                    <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mb: 1 }}>
                      {Array.from({ length: 3 - Math.min(index, 2) }, (_, i) => (
                        <StarIcon key={i} sx={{ fontSize: 16, color: medal }} />
                      ))}
                    </Stack>
                    <Typography
                      sx={{ fontFamily: FONT.serif, fontWeight: 700, fontSize: "1.3rem", wordBreak: "break-word" }}
                    >
                      {leader.name}
                    </Typography>
                    <Box sx={{ fontFamily: FONT.mono, fontSize: "0.8rem", color: C.textOnDarkMuted, mt: 0.5 }}>
                      Ən yaxşı müddət:{" "}
                      <Box component="strong" sx={{ color: C.textOnDark }}>
                        {leader.time}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      height: { xs: 64, md: PODIUM_HEIGHT[index] || 72 },
                      bgcolor: "rgba(232, 228, 212, 0.06)",
                      borderTop: `4px solid ${medal}`,
                      borderLeft: `1px solid ${C.lineDark}`,
                      borderRight: `1px solid ${C.lineDark}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      transformOrigin: "bottom",
                      animation: `sg-grow-y .8s ${EASE.out} ${index * 120}ms backwards`,
                    }}
                  >
                    <Box sx={{ fontFamily: FONT.serif, fontWeight: 700, fontSize: "2.2rem", lineHeight: 1, color: medal }}>
                      {index + 1}
                    </Box>
                    <Box sx={{ ...labelCaps, fontSize: "0.7rem", color: C.textOnDarkMuted, mt: 0.5 }}>
                      {medalNames[index] || "Digər"}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Per-map leaders */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Typography variant="h6" component="h3">
          Xəritə üzrə ən yaxşı vaxtlar
        </Typography>
      </Stack>
      <Grid container spacing={2.5}>
        {mapLeaders.map((mapData, mapIndex) => (
          <Grid item xs={12} md={6} lg={4} key={mapData.mapId}>
            <Box sx={{ height: "100%", animation: `sg-fade-up .5s ease ${mapIndex * 60}ms backwards` }}>
              <Panel
                title={getMapDisplayName(mapData.mapCode)}
                icon={<MapIcon />}
                noPadding
                sx={{ height: "100%" }}
              >
                {mapData.leaders && mapData.leaders.length > 0 ? (
                  <Table size="small">
                    <TableBody>
                      {mapData.leaders.map((leader, index) => (
                        <TableRow key={leader.id || index} hover>
                          <TableCell sx={{ width: 44, fontFamily: FONT.mono, color: medalColors[index] ? C.brassDark : C.textFaint, fontWeight: 600 }}>
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>{leader.name}</TableCell>
                          <TableCell align="right" sx={{ fontFamily: FONT.mono }}>
                            {leader.time}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ p: 2.5, color: C.textMuted, fontSize: "0.9rem" }}>
                    Hələ lider yoxdur
                  </Box>
                )}
              </Panel>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LeaderboardSection;
