import { useEffect, useState } from "react";
import { apiClient } from "../services/api/apiClient";
import { endpoints } from "../services/api/endpoints";
import { formatDate, formatPhoneNumberForDisplay } from "../utils/formatters";

export const useProfileData = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const R2_BASE_URL = process.env.REACT_APP_R2_BASE_URL;
  const screenshot1 = `${R2_BASE_URL}/photos/screenshot_1.png`;
  const screenshot2 = `${R2_BASE_URL}/photos/screenshot_2.png`;
  const screenshot3 = `${R2_BASE_URL}/photos/screenshot_3.png`;

  useEffect(() => {
    let mounted = true;
    let eventSource = null;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get(endpoints.profile());

        const user = data?.user || {};
        const application = data?.application || {};

        const fullName = `${application.name || ""} ${
          application.surname || ""
        }`.trim();

        // Helper function to format sessions and calculate play time
        const formatSessionsData = (sessions) => {
          const totalSeconds = sessions.reduce((acc, session) => {
            return acc + (session.duration_seconds || 0);
          }, 0);

          const totalHours = Math.floor(totalSeconds / 3600);
          const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

          const formattedSessions = sessions
            .filter((session) => session.session_ended_at)
            .sort(
              (a, b) =>
                new Date(b.session_started_at) - new Date(a.session_started_at),
            )
            .map((session) => {
              const durationSeconds = session.duration_seconds || 0;
              const durationHours = Math.floor(durationSeconds / 3600);
              const durationMinutes = Math.floor((durationSeconds % 3600) / 60);

              let durationText = "";
              if (durationHours > 0) {
                durationText = `${durationHours} s ${durationMinutes} dəq`;
              } else {
                durationText = `${durationMinutes} dəq`;
              }

              return {
                id: session.id,
                date: formatDate(session.session_started_at, "DD MMMM, YYYY"),
                login: formatDate(session.session_started_at, "HH:mm"),
                logout: session.session_ended_at
                  ? formatDate(session.session_ended_at, "HH:mm")
                  : "-",
                duration: durationText,
              };
            });

          return { totalHours, totalMinutes, formattedSessions };
        };

        const userRole = user.role || application.role || "trainee";
        const isTrainer = userRole === "trainer";

        // Fetch initial game sessions ONLY if user is NOT a trainer
        let initialSessions = [];
        if (!isTrainer) {
          try {
            const gameSessionsResponse = await apiClient.get(
              endpoints.gameSessions(),
            );
            initialSessions = gameSessionsResponse?.sessions || [];
          } catch (err) {
            console.error("Failed to fetch game sessions:", err);
          }
        }

        const {
          totalHours: initHours,
          totalMinutes: initMinutes,
          formattedSessions: initFormatted,
        } = formatSessionsData(initialSessions);

        const mapped = {
          fullName: fullName || user.email || "-",
          role: isTrainer ? "Təlimçi" : "Təlim alan",
          userRole: userRole,
          institution: "PUA Mütəxəssisi Namizədi",
          avatar: null,
          personalInfo: {
            name: fullName || "",
            dateOfBirth: application.date_of_birth
              ? formatDate(application.date_of_birth, "DD-MM-YYYY")
              : "",
            birthPlace: application.place_of_birth || "",
            gender: application.gender || "",
            fin: application.national_id_num || "",
            idSeries: application.id_series || "",
            educationLevel: application.education_level || "",
            profession: application.profession || "",
            university: application.university || "",
            skills: application.skills || "",
          },
          contactInfo: {
            email: application.email || user.email || "",
            emailVerified: !!user.activated_at,
            phone: formatPhoneNumberForDisplay(application.phone_number || ""),
          },
          applicationStatus: {
            current: user.is_active ? "Təsdiqlənib" : "Gözləyir",
            applicationDate: application.created_at
              ? formatDate(application.created_at, "DD-MM-YYYY")
              : "",
            confirmationDate: user.created_at
              ? formatDate(user.created_at, "DD-MM-YYYY")
              : "",
            compliance: user.is_active ? "Təsdiqlənib" : "Yoxlanılır",
          },
          gameAccount: {
            status: initialSessions.length > 0 ? "AKTİV" : "PASSIV",
            userId: user.id || "N/A",
            totalPlayTime: {
              hours: initHours,
              minutes: initMinutes,
            },
            sessions: initFormatted,
          },
          gameInstallation: {
            downloadLink: "/downloads/PUA_Simulator.exe",
            instructions: [
              "Simulyatorun son versiyasını aşağıdakı düymədan yükləyin.",
              "Yüklənmiş .zip arxivini istənilən qovluğa çıxarın.",
              "'PUA_Sim.exe' faylını admin hüquqları ilə başladın.",
              "Oyuna giriş məlumatlarınızı daxil edin və 'Daxil ol' düyməsini basın. Giriş məlumatlarınız web saytındakı hesab məlumatlarınızla eynidir.",
              "Oyun içi təlimatlara əməl edərək simulyasiyaya başlayın.",
            ],
            screenshots: [
              {
                id: 1,
                url: screenshot1,
                alt: "Oyun ekran görüntüsü 1",
              },
              {
                id: 2,
                url: screenshot2,
                alt: "Oyun ekran görüntüsü 2",
              },
              {
                id: 3,
                url: screenshot3,
                alt: "Oyun ekran görüntüsü 3",
              },
            ],
          },
          documents: Array.isArray(data?.files) && data.files.length > 0
            ? data.files.map((file) => ({
                id: file.id,
                name: file.name,
                storedName: file.storedName,
                type: file.type,
                size: file.size,
                uploadedAt: file.uploadedAt,
                url: file.storedName ? `${R2_BASE_URL}/${file.storedName}` : null,
              }))
            : [],
        };

        if (mounted) {
          setProfile(mapped);
        }

        // Establish SSE connection for real-time game sessions updates ONLY for non-trainers
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const token = localStorage.getItem("auth_token");
        if (token && !isTrainer) {
          const sseUrl = `${API_URL}${endpoints.gameSessions()}?token=${token}`;
          console.log("[SSE] Connecting to real-time game sessions at:", sseUrl);
          eventSource = new EventSource(sseUrl);

          eventSource.onopen = () => {
            console.log("[SSE] Connection established successfully to game sessions stream");
          };

          eventSource.onmessage = (event) => {
            console.log("[SSE] Received real-time sessions data event:", event);
            try {
              const dataParsed = JSON.parse(event.data);
              const sessionsParsed = dataParsed.sessions || [];
              const {
                totalHours: updatedHours,
                totalMinutes: updatedMinutes,
                formattedSessions: updatedFormatted,
              } = formatSessionsData(sessionsParsed);

              if (mounted) {
                setProfile((prevProfile) => {
                  if (!prevProfile) return prevProfile;
                  console.log("[SSE] Updating profile state with", sessionsParsed.length, "sessions");
                  return {
                    ...prevProfile,
                    gameAccount: {
                      ...prevProfile.gameAccount,
                      status: sessionsParsed.length > 0 ? "AKTİV" : "PASSIV",
                      totalPlayTime: {
                        hours: updatedHours,
                        minutes: updatedMinutes,
                      },
                      sessions: updatedFormatted,
                    },
                  };
                });
              }
            } catch (sseError) {
              console.error("[SSE] Failed to parse real-time game sessions:", sseError);
            }
          };

          eventSource.onerror = (err) => {
            console.error("[SSE] Real-time game sessions SSE connection error:", err);
          };
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return { profile, loading };
};
