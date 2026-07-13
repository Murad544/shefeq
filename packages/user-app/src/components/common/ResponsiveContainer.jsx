import { Container, Box } from "@mui/material";

const ResponsiveContainer = ({
  children,
  maxWidth = "lg",
  centerContent = false,
  fullHeight = false,
  padding = 3,
  ...props
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        ...(fullHeight && { minHeight: "100vh" }),
        ...(centerContent && {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }),
        py: padding,
        ...props.sx,
      }}
      {...props}
    >
      {centerContent ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {children}
        </Box>
      ) : (
        children
      )}
    </Container>
  );
};

export default ResponsiveContainer;
