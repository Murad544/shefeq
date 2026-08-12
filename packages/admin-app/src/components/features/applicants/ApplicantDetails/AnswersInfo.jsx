import { Stack, Alert, Typography, Skeleton, Paper } from "@mui/material";
import { MdQuestionAnswer } from "react-icons/md";
import InfoCard from "../../../ui/Display/InfoCard";

function AnswerItem({ answer, qmap }) {
  const qid = answer?.question_id ?? answer.questionId ?? answer.qid;
  const qtext = qmap.get(Number(qid)) || `Sual #${qid}`;
  const answerText = answer?.answer ?? answer.value ?? answer.text ?? "";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "grey.50",
        borderColor: "grey.200",
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          mb: 1,
          fontSize: { xs: "0.9rem", md: "1rem" },
          color: "primary.main",
        }}
      >
        {qtext}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: "pre-wrap",
          color: "text.primary",
          lineHeight: 1.6,
          fontSize: { xs: "0.85rem", md: "0.9rem" },
        }}
      >
        {String(answerText)}
      </Typography>
    </Paper>
  );
}

export default function AnswersInfo({ loading, error, answers, qmap }) {
  return (
    <InfoCard title="Cavablar" icon={<MdQuestionAnswer size={20} />}>
      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={80}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      ) : error ? (
        <Alert
          severity="warning"
          sx={{
            borderRadius: 2,
            bgcolor: "warning.light",
            color: "warning.dark",
          }}
        >
          {error}
        </Alert>
      ) : answers.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          Cavab yoxdur.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {answers.map((answer, i) => (
            <AnswerItem key={i} answer={answer} qmap={qmap} />
          ))}
        </Stack>
      )}
    </InfoCard>
  );
}
