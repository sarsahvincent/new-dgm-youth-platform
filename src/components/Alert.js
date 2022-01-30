import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";

/* export default function BasicAlerts({ severity, message }) {
  return (
    <Stack sx={{ width: "30%" }} spacing={2}>
      <Alert severity={severity}>{message}</Alert>
    </Stack>
  );
} */

export const SuccesAlert = ({ alertTitle, alertDescription }) => {
  return (
    <Alert
      status="success"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {alertTitle}
      </AlertTitle>
      <AlertDescription maxWidth="sm">{alertDescription}</AlertDescription>
    </Alert>
  );
};

export const ErrorAlert = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle mr={2}>Your browser is outdated!</AlertTitle>
      <AlertDescription>
        Your Chakra experience may be degraded.
      </AlertDescription>
      <CloseButton position="absolute" right="8px" top="8px" />
    </Alert>
  );
};
