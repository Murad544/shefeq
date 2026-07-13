import { Box, Typography, TextField, Paper } from "@mui/material";

const QuestionsStep = ({ questions, answers, onAnswerChange, errors = {} }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Açıq suallar
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Aşağıdakı sualları diqqətlə oxuyun və ətraflı cavablar verin.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {questions.map((q, idx) => (
          <Paper
            key={q.id || idx}
            variant="outlined"
            sx={{
              p: 3,
              borderColor:
                errors.answers && errors.answers[idx]
                  ? "error.main"
                  : "grey.200",
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "text.primary",
              }}
            >
              {q.text}
            </Typography>

            <TextField
              value={answers[idx]?.answer || ""}
              onChange={(e) => onAnswerChange(idx, e.target.value)}
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              placeholder="Cavabınızı buraya yazın..."
              error={!!(errors.answers && errors.answers[idx])}
              helperText={errors.answers && errors.answers[idx]}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "background.default",
                },
              }}
            />
          </Paper>
        ))}
      </Box>

      {questions.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderColor: "grey.200",
            bgcolor: "grey.25",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Suallar yüklənir...
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default QuestionsStep;
